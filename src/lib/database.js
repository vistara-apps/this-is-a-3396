// Database service for managing projects and ad variations
import { supabase } from './supabase'

/**
 * Project management functions
 */
export const projectService = {
  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} Created project
   */
  async createProject(projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating project:', error)
      // Return mock project for development
      return {
        projectId: `mock-project-${Date.now()}`,
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  },

  /**
   * Get projects for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} User's projects
   */
  async getUserProjects(userId, options = {}) {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })

      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching user projects:', error)
      // Return mock projects for development
      return [
        {
          projectId: 'mock-project-1',
          userId,
          productName: 'Wireless Headphones',
          productImageURL: 'https://picsum.photos/400/400?random=1',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          projectId: 'mock-project-2',
          userId,
          productName: 'Smart Watch',
          productImageURL: 'https://picsum.photos/400/400?random=2',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString()
        }
      ]
    }
  },

  /**
   * Get a single project by ID
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Project data
   */
  async getProject(projectId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('projectId', projectId)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching project:', error)
      // Return mock project for development
      return {
        projectId,
        userId: '1',
        productName: 'Sample Product',
        productImageURL: 'https://picsum.photos/400/400?random=1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  },

  /**
   * Update a project
   * @param {string} projectId - Project ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated project
   */
  async updateProject(projectId, updates) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('projectId', projectId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  },

  /**
   * Delete a project
   * @param {string} projectId - Project ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProject(projectId) {
    try {
      // First delete all ad variations for this project
      await adVariationService.deleteProjectVariations(projectId)

      // Then delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('projectId', projectId)

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      return false
    }
  }
}

/**
 * Ad variation management functions
 */
export const adVariationService = {
  /**
   * Create ad variations for a project
   * @param {string} projectId - Project ID
   * @param {Array} variations - Array of ad variations
   * @returns {Promise<Array>} Created variations
   */
  async createAdVariations(projectId, variations) {
    try {
      const variationsWithMetadata = variations.map(variation => ({
        ...variation,
        projectId,
        adVariationId: variation.id || `variation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))

      const { data, error } = await supabase
        .from('adVariations')
        .insert(variationsWithMetadata)
        .select()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating ad variations:', error)
      // Return mock variations for development
      return variations.map(variation => ({
        ...variation,
        projectId,
        adVariationId: variation.id || `mock-variation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
    }
  },

  /**
   * Get ad variations for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} Project's ad variations
   */
  async getProjectVariations(projectId) {
    try {
      const { data, error } = await supabase
        .from('adVariations')
        .select('*')
        .eq('projectId', projectId)
        .order('createdAt', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching project variations:', error)
      // Return mock variations for development
      return [
        {
          adVariationId: 'mock-variation-1',
          projectId,
          generatedImageURL: 'https://picsum.photos/400/400?random=1',
          generatedCaption: '🔥 Just discovered this amazing product and I\'m obsessed! Who else needs this in their life?',
          platformTarget: 'farcaster',
          postStatus: 'posted',
          performanceMetrics: {
            views: 1250,
            likes: 89,
            shares: 23,
            comments: 15,
            clickThroughRate: 3.2
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          adVariationId: 'mock-variation-2',
          projectId,
          generatedImageURL: 'https://picsum.photos/400/400?random=2',
          generatedCaption: '⚡ Limited time: Get this before everyone else finds out about it!',
          platformTarget: 'farcaster',
          postStatus: 'posted',
          performanceMetrics: {
            views: 980,
            likes: 67,
            shares: 18,
            comments: 12,
            clickThroughRate: 2.8
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    }
  },

  /**
   * Update an ad variation
   * @param {string} adVariationId - Ad variation ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated variation
   */
  async updateAdVariation(adVariationId, updates) {
    try {
      const { data, error } = await supabase
        .from('adVariations')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('adVariationId', adVariationId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating ad variation:', error)
      throw error
    }
  },

  /**
   * Update performance metrics for an ad variation
   * @param {string} adVariationId - Ad variation ID
   * @param {Object} metrics - Performance metrics
   * @returns {Promise<Object>} Updated variation
   */
  async updatePerformanceMetrics(adVariationId, metrics) {
    try {
      const { data, error } = await supabase
        .from('adVariations')
        .update({
          performanceMetrics: metrics,
          updatedAt: new Date().toISOString()
        })
        .eq('adVariationId', adVariationId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating performance metrics:', error)
      throw error
    }
  },

  /**
   * Delete all ad variations for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProjectVariations(projectId) {
    try {
      const { error } = await supabase
        .from('adVariations')
        .delete()
        .eq('projectId', projectId)

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error('Error deleting project variations:', error)
      return false
    }
  },

  /**
   * Get all ad variations for a user across all projects
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} User's ad variations
   */
  async getUserVariations(userId, options = {}) {
    try {
      let query = supabase
        .from('adVariations')
        .select(`
          *,
          projects!inner(userId)
        `)
        .eq('projects.userId', userId)
        .order('createdAt', { ascending: false })

      if (options.limit) {
        query = query.limit(options.limit)
      }

      if (options.platform) {
        query = query.eq('platformTarget', options.platform)
      }

      if (options.status) {
        query = query.eq('postStatus', options.status)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching user variations:', error)
      return []
    }
  }
}

/**
 * Analytics and reporting functions
 */
export const analyticsService = {
  /**
   * Get performance analytics for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Analytics data
   */
  async getUserAnalytics(userId, options = {}) {
    try {
      const variations = await adVariationService.getUserVariations(userId, options)
      
      const analytics = {
        totalVariations: variations.length,
        totalViews: 0,
        totalEngagements: 0,
        averageEngagementRate: 0,
        platformBreakdown: {},
        performanceTrends: [],
        topPerformers: []
      }

      variations.forEach(variation => {
        const metrics = variation.performanceMetrics || {}
        analytics.totalViews += metrics.views || 0
        analytics.totalEngagements += (metrics.likes || 0) + (metrics.shares || 0) + (metrics.comments || 0)

        // Platform breakdown
        const platform = variation.platformTarget || 'unknown'
        if (!analytics.platformBreakdown[platform]) {
          analytics.platformBreakdown[platform] = {
            count: 0,
            views: 0,
            engagements: 0
          }
        }
        analytics.platformBreakdown[platform].count++
        analytics.platformBreakdown[platform].views += metrics.views || 0
        analytics.platformBreakdown[platform].engagements += (metrics.likes || 0) + (metrics.shares || 0) + (metrics.comments || 0)
      })

      analytics.averageEngagementRate = analytics.totalViews > 0 
        ? ((analytics.totalEngagements / analytics.totalViews) * 100).toFixed(2)
        : 0

      // Top performers
      analytics.topPerformers = variations
        .map(variation => ({
          ...variation,
          engagementScore: this.calculateEngagementScore(variation.performanceMetrics)
        }))
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, 5)

      return analytics
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      return {
        totalVariations: 0,
        totalViews: 0,
        totalEngagements: 0,
        averageEngagementRate: 0,
        platformBreakdown: {},
        performanceTrends: [],
        topPerformers: []
      }
    }
  },

  /**
   * Calculate engagement score for performance metrics
   * @param {Object} metrics - Performance metrics
   * @returns {number} Engagement score
   */
  calculateEngagementScore(metrics) {
    if (!metrics) return 0

    const views = metrics.views || 0
    const likes = metrics.likes || 0
    const shares = metrics.shares || 0
    const comments = metrics.comments || 0

    // Weighted scoring: shares and comments are worth more than likes
    const score = (likes * 1) + (shares * 3) + (comments * 2)
    return views > 0 ? (score / views) * 100 : 0
  },

  /**
   * Get performance trends over time
   * @param {string} userId - User ID
   * @param {number} days - Number of days to analyze
   * @returns {Promise<Array>} Trend data
   */
  async getPerformanceTrends(userId, days = 30) {
    try {
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000))

      const variations = await adVariationService.getUserVariations(userId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })

      // Group by date
      const trendData = {}
      variations.forEach(variation => {
        const date = new Date(variation.createdAt).toDateString()
        if (!trendData[date]) {
          trendData[date] = {
            date,
            views: 0,
            engagements: 0,
            variations: 0
          }
        }
        
        const metrics = variation.performanceMetrics || {}
        trendData[date].views += metrics.views || 0
        trendData[date].engagements += (metrics.likes || 0) + (metrics.shares || 0) + (metrics.comments || 0)
        trendData[date].variations++
      })

      return Object.values(trendData).sort((a, b) => new Date(a.date) - new Date(b.date))
    } catch (error) {
      console.error('Error fetching performance trends:', error)
      return []
    }
  }
}

/**
 * File upload and management functions
 */
export const fileService = {
  /**
   * Upload a file to Supabase storage
   * @param {File} file - File to upload
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path
   * @returns {Promise<string>} Public URL of uploaded file
   */
  async uploadFile(file, bucket = 'product-images', path = null) {
    try {
      const fileName = path || `${Date.now()}-${file.name}`
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (error) {
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      // Return a placeholder URL for development
      return `https://picsum.photos/400/400?random=${Date.now()}`
    }
  },

  /**
   * Delete a file from Supabase storage
   * @param {string} fileName - File name to delete
   * @param {string} bucket - Storage bucket name
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(fileName, bucket = 'product-images') {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName])

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error('Error deleting file:', error)
      return false
    }
  }
}
