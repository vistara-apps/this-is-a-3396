// Workflow automation service for AdGenius AI
import { generateAdVariations } from './openai'
import { postToFarcaster, getFarcasterMetrics } from './farcaster'
import { projectService, adVariationService } from './database'
import { aiGrowthAgent } from './aiAgent'
import { sleep, retryWithBackoff } from './utils'
import toast from 'react-hot-toast'

/**
 * Workflow automation class for managing the complete ad generation and posting pipeline
 */
export class WorkflowAutomation {
  constructor() {
    this.activeWorkflows = new Map()
    this.workflowHistory = []
  }

  /**
   * Execute the complete ad generation workflow
   * @param {Object} params - Workflow parameters
   * @returns {Promise<Object>} Workflow results
   */
  async executeAdGenerationWorkflow(params) {
    const {
      userId,
      productName,
      productImageURL,
      platforms = ['farcaster'],
      autoPost = false,
      projectId = null
    } = params

    const workflowId = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // Initialize workflow tracking
      this.activeWorkflows.set(workflowId, {
        id: workflowId,
        userId,
        status: 'running',
        progress: 0,
        steps: [],
        startTime: new Date(),
        currentStep: 'initializing'
      })

      const workflow = this.activeWorkflows.get(workflowId)
      
      // Step 1: Create or get project
      workflow.currentStep = 'creating_project'
      workflow.progress = 10
      
      let project
      if (projectId) {
        project = await projectService.getProject(projectId)
      } else {
        project = await projectService.createProject({
          userId,
          productName,
          productImageURL
        })
      }

      workflow.steps.push({
        step: 'project_created',
        timestamp: new Date(),
        data: { projectId: project.projectId }
      })

      // Step 2: Generate ad variations for each platform
      workflow.currentStep = 'generating_ads'
      workflow.progress = 30

      const allVariations = []
      
      for (const platform of platforms) {
        try {
          const variations = await generateAdVariations(
            productImageURL,
            productName,
            platform
          )
          
          // Add platform-specific metadata
          const platformVariations = variations.map(variation => ({
            ...variation,
            platformTarget: platform,
            projectId: project.projectId
          }))
          
          allVariations.push(...platformVariations)
          
          workflow.steps.push({
            step: 'variations_generated',
            timestamp: new Date(),
            data: { platform, count: variations.length }
          })
        } catch (error) {
          console.error(`Error generating variations for ${platform}:`, error)
          workflow.steps.push({
            step: 'variation_generation_failed',
            timestamp: new Date(),
            data: { platform, error: error.message }
          })
        }
      }

      // Step 3: Save variations to database
      workflow.currentStep = 'saving_variations'
      workflow.progress = 50

      const savedVariations = await adVariationService.createAdVariations(
        project.projectId,
        allVariations
      )

      workflow.steps.push({
        step: 'variations_saved',
        timestamp: new Date(),
        data: { count: savedVariations.length }
      })

      // Step 4: Auto-post if enabled
      if (autoPost) {
        workflow.currentStep = 'posting_ads'
        workflow.progress = 70

        const postingResults = await this.executeAutoPosting(savedVariations, userId)
        
        workflow.steps.push({
          step: 'auto_posting_completed',
          timestamp: new Date(),
          data: postingResults
        })
      }

      // Step 5: Generate initial insights
      workflow.currentStep = 'generating_insights'
      workflow.progress = 90

      const insights = await aiGrowthAgent.analyzePerformance(savedVariations, project)
      
      workflow.steps.push({
        step: 'insights_generated',
        timestamp: new Date(),
        data: { insightCount: insights.insights.length }
      })

      // Complete workflow
      workflow.status = 'completed'
      workflow.progress = 100
      workflow.currentStep = 'completed'
      workflow.endTime = new Date()
      workflow.results = {
        project,
        variations: savedVariations,
        insights,
        postingResults: autoPost ? workflow.steps.find(s => s.step === 'auto_posting_completed')?.data : null
      }

      // Move to history
      this.workflowHistory.push({ ...workflow })
      this.activeWorkflows.delete(workflowId)

      return {
        success: true,
        workflowId,
        results: workflow.results
      }

    } catch (error) {
      console.error('Workflow execution failed:', error)
      
      const workflow = this.activeWorkflows.get(workflowId)
      if (workflow) {
        workflow.status = 'failed'
        workflow.error = error.message
        workflow.endTime = new Date()
        
        this.workflowHistory.push({ ...workflow })
        this.activeWorkflows.delete(workflowId)
      }

      return {
        success: false,
        workflowId,
        error: error.message
      }
    }
  }

  /**
   * Execute automated posting workflow
   * @param {Array} variations - Ad variations to post
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Posting results
   */
  async executeAutoPosting(variations, userId) {
    const results = {
      successful: 0,
      failed: 0,
      posts: []
    }

    // Get user's connected social media accounts
    // This would typically come from the user's profile
    const socialAccounts = {
      farcaster: {
        connected: true,
        signerUuid: `mock-signer-${userId}`
      }
    }

    for (const variation of variations) {
      try {
        const platform = variation.platformTarget
        
        if (platform === 'farcaster' && socialAccounts.farcaster?.connected) {
          const postResult = await retryWithBackoff(
            () => postToFarcaster(variation, socialAccounts.farcaster.signerUuid),
            3,
            1000
          )

          if (postResult.success) {
            // Update variation with post information
            await adVariationService.updateAdVariation(variation.adVariationId, {
              postStatus: 'posted',
              castHash: postResult.castHash,
              postUrl: postResult.url
            })

            results.successful++
            results.posts.push({
              variationId: variation.adVariationId,
              platform,
              status: 'success',
              url: postResult.url
            })

            // Schedule metrics collection
            this.scheduleMetricsCollection(variation.adVariationId, postResult.castHash, platform)
          } else {
            throw new Error(postResult.error || 'Failed to post')
          }
        } else {
          // Platform not connected or supported
          results.posts.push({
            variationId: variation.adVariationId,
            platform,
            status: 'skipped',
            reason: 'Platform not connected'
          })
        }

        // Add delay between posts to avoid rate limiting
        await sleep(2000)

      } catch (error) {
        console.error(`Failed to post variation ${variation.adVariationId}:`, error)
        
        // Update variation status
        await adVariationService.updateAdVariation(variation.adVariationId, {
          postStatus: 'failed'
        })

        results.failed++
        results.posts.push({
          variationId: variation.adVariationId,
          platform: variation.platformTarget,
          status: 'failed',
          error: error.message
        })
      }
    }

    return results
  }

  /**
   * Schedule metrics collection for posted content
   * @param {string} variationId - Ad variation ID
   * @param {string} castHash - Cast hash for tracking
   * @param {string} platform - Platform name
   */
  scheduleMetricsCollection(variationId, castHash, platform) {
    // Collect metrics after 1 hour, 6 hours, 24 hours, and 7 days
    const intervals = [
      { delay: 60 * 60 * 1000, label: '1 hour' },      // 1 hour
      { delay: 6 * 60 * 60 * 1000, label: '6 hours' }, // 6 hours
      { delay: 24 * 60 * 60 * 1000, label: '24 hours' }, // 24 hours
      { delay: 7 * 24 * 60 * 60 * 1000, label: '7 days' } // 7 days
    ]

    intervals.forEach(({ delay, label }) => {
      setTimeout(async () => {
        try {
          await this.collectMetrics(variationId, castHash, platform)
          console.log(`Metrics collected for ${variationId} after ${label}`)
        } catch (error) {
          console.error(`Failed to collect metrics for ${variationId} after ${label}:`, error)
        }
      }, delay)
    })
  }

  /**
   * Collect performance metrics for a posted ad
   * @param {string} variationId - Ad variation ID
   * @param {string} castHash - Cast hash for tracking
   * @param {string} platform - Platform name
   */
  async collectMetrics(variationId, castHash, platform) {
    try {
      let metrics = {}

      if (platform === 'farcaster') {
        metrics = await getFarcasterMetrics(castHash)
      }
      // Add other platforms as needed

      // Update the variation with new metrics
      await adVariationService.updatePerformanceMetrics(variationId, metrics)

      return metrics
    } catch (error) {
      console.error('Error collecting metrics:', error)
      throw error
    }
  }

  /**
   * Execute performance analysis workflow
   * @param {string} userId - User ID
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis results
   */
  async executePerformanceAnalysis(userId, options = {}) {
    try {
      // Get user's ad variations
      const variations = await adVariationService.getUserVariations(userId, options)
      
      if (variations.length === 0) {
        return {
          success: false,
          message: 'No ad variations found for analysis'
        }
      }

      // Update metrics for recent posts
      await this.updateRecentMetrics(variations)

      // Generate AI analysis
      const analysis = await aiGrowthAgent.analyzePerformance(variations, {
        userId,
        analysisType: 'comprehensive'
      })

      return {
        success: true,
        analysis,
        variationCount: variations.length
      }
    } catch (error) {
      console.error('Performance analysis failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Update metrics for recent posts
   * @param {Array} variations - Ad variations
   */
  async updateRecentMetrics(variations) {
    const recentPosts = variations.filter(v => {
      const postDate = new Date(v.createdAt)
      const daysSincePost = (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysSincePost <= 7 && v.postStatus === 'posted' && v.castHash
    })

    for (const variation of recentPosts) {
      try {
        await this.collectMetrics(
          variation.adVariationId,
          variation.castHash,
          variation.platformTarget
        )
        
        // Small delay to avoid rate limiting
        await sleep(500)
      } catch (error) {
        console.error(`Failed to update metrics for ${variation.adVariationId}:`, error)
      }
    }
  }

  /**
   * Get workflow status
   * @param {string} workflowId - Workflow ID
   * @returns {Object} Workflow status
   */
  getWorkflowStatus(workflowId) {
    const activeWorkflow = this.activeWorkflows.get(workflowId)
    if (activeWorkflow) {
      return activeWorkflow
    }

    const historicalWorkflow = this.workflowHistory.find(w => w.id === workflowId)
    return historicalWorkflow || null
  }

  /**
   * Get all active workflows for a user
   * @param {string} userId - User ID
   * @returns {Array} Active workflows
   */
  getUserActiveWorkflows(userId) {
    return Array.from(this.activeWorkflows.values())
      .filter(workflow => workflow.userId === userId)
  }

  /**
   * Get workflow history for a user
   * @param {string} userId - User ID
   * @param {number} limit - Number of workflows to return
   * @returns {Array} Workflow history
   */
  getUserWorkflowHistory(userId, limit = 10) {
    return this.workflowHistory
      .filter(workflow => workflow.userId === userId)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, limit)
  }

  /**
   * Cancel an active workflow
   * @param {string} workflowId - Workflow ID
   * @returns {boolean} Success status
   */
  cancelWorkflow(workflowId) {
    const workflow = this.activeWorkflows.get(workflowId)
    if (workflow) {
      workflow.status = 'cancelled'
      workflow.endTime = new Date()
      
      this.workflowHistory.push({ ...workflow })
      this.activeWorkflows.delete(workflowId)
      
      return true
    }
    return false
  }

  /**
   * Execute batch optimization workflow
   * @param {string} userId - User ID
   * @param {Array} projectIds - Project IDs to optimize
   * @returns {Promise<Object>} Optimization results
   */
  async executeBatchOptimization(userId, projectIds) {
    const results = {
      optimized: 0,
      failed: 0,
      recommendations: []
    }

    for (const projectId of projectIds) {
      try {
        const variations = await adVariationService.getProjectVariations(projectId)
        const project = await projectService.getProject(projectId)
        
        const analysis = await aiGrowthAgent.analyzePerformance(variations, project)
        
        // Generate new optimized variations based on insights
        if (analysis.topPerformers.length > 0) {
          const topPerformer = analysis.topPerformers[0]
          
          // Create new variations based on top performer
          const optimizedVariations = await generateAdVariations(
            project.productImageURL,
            project.productName,
            topPerformer.platformTarget
          )

          // Save optimized variations
          await adVariationService.createAdVariations(projectId, optimizedVariations)
          
          results.optimized++
          results.recommendations.push({
            projectId,
            projectName: project.productName,
            optimization: 'Generated new variations based on top performer',
            newVariations: optimizedVariations.length
          })
        }

        await sleep(1000) // Rate limiting
      } catch (error) {
        console.error(`Failed to optimize project ${projectId}:`, error)
        results.failed++
      }
    }

    return results
  }
}

// Export singleton instance
export const workflowAutomation = new WorkflowAutomation()

// Utility functions for workflow management
export const workflowUtils = {
  /**
   * Create a workflow progress tracker
   * @param {Function} onProgress - Progress callback
   * @returns {Object} Progress tracker
   */
  createProgressTracker(onProgress) {
    return {
      updateProgress: (step, progress, data = {}) => {
        onProgress({
          step,
          progress,
          timestamp: new Date(),
          data
        })
      }
    }
  },

  /**
   * Format workflow duration
   * @param {Date} startTime - Start time
   * @param {Date} endTime - End time
   * @returns {string} Formatted duration
   */
  formatDuration(startTime, endTime = new Date()) {
    const durationMs = endTime - startTime
    const seconds = Math.floor(durationMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  },

  /**
   * Get workflow status color
   * @param {string} status - Workflow status
   * @returns {string} Color class
   */
  getStatusColor(status) {
    const colors = {
      running: 'text-blue-600',
      completed: 'text-green-600',
      failed: 'text-red-600',
      cancelled: 'text-gray-600'
    }
    return colors[status] || 'text-gray-600'
  }
}
