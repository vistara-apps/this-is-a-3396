// AI Growth Hacking Agent for performance analysis and optimization
import { generateAdVariations } from './openai'
import { getFarcasterMetrics, getFarcasterTrends } from './farcaster'

/**
 * AI Growth Hacking Agent class
 * Analyzes performance data and provides optimization insights
 */
export class AIGrowthAgent {
  constructor() {
    this.insights = []
    this.recommendations = []
  }

  /**
   * Analyze ad performance and generate insights
   * @param {Array} adVariations - Array of ad variations with performance data
   * @param {Object} projectData - Project information
   * @returns {Promise<Object>} Analysis results with insights and recommendations
   */
  async analyzePerformance(adVariations, projectData) {
    try {
      const analysis = {
        overview: this.generateOverview(adVariations),
        topPerformers: this.identifyTopPerformers(adVariations),
        insights: await this.generateInsights(adVariations, projectData),
        recommendations: await this.generateRecommendations(adVariations, projectData),
        trends: await this.analyzeTrends(adVariations),
        optimizations: this.suggestOptimizations(adVariations)
      }

      return analysis
    } catch (error) {
      console.error('Error in AI analysis:', error)
      return this.getFallbackAnalysis(adVariations)
    }
  }

  /**
   * Generate performance overview
   * @param {Array} adVariations - Ad variations data
   * @returns {Object} Performance overview
   */
  generateOverview(adVariations) {
    if (!adVariations || adVariations.length === 0) {
      return {
        totalAds: 0,
        totalViews: 0,
        totalEngagements: 0,
        averageEngagementRate: 0,
        bestPerformingPlatform: 'N/A'
      }
    }

    const totalViews = adVariations.reduce((sum, ad) => sum + (ad.performanceMetrics?.views || 0), 0)
    const totalLikes = adVariations.reduce((sum, ad) => sum + (ad.performanceMetrics?.likes || 0), 0)
    const totalShares = adVariations.reduce((sum, ad) => sum + (ad.performanceMetrics?.shares || 0), 0)
    const totalComments = adVariations.reduce((sum, ad) => sum + (ad.performanceMetrics?.comments || 0), 0)
    const totalEngagements = totalLikes + totalShares + totalComments

    const platformPerformance = {}
    adVariations.forEach(ad => {
      const platform = ad.platformTarget || 'unknown'
      if (!platformPerformance[platform]) {
        platformPerformance[platform] = { views: 0, engagements: 0 }
      }
      platformPerformance[platform].views += ad.performanceMetrics?.views || 0
      platformPerformance[platform].engagements += 
        (ad.performanceMetrics?.likes || 0) + 
        (ad.performanceMetrics?.shares || 0) + 
        (ad.performanceMetrics?.comments || 0)
    })

    const bestPlatform = Object.entries(platformPerformance)
      .sort(([,a], [,b]) => b.engagements - a.engagements)[0]?.[0] || 'N/A'

    return {
      totalAds: adVariations.length,
      totalViews,
      totalEngagements,
      averageEngagementRate: totalViews > 0 ? ((totalEngagements / totalViews) * 100).toFixed(2) : 0,
      bestPerformingPlatform: bestPlatform
    }
  }

  /**
   * Identify top performing ads
   * @param {Array} adVariations - Ad variations data
   * @returns {Array} Top performing ads
   */
  identifyTopPerformers(adVariations) {
    if (!adVariations || adVariations.length === 0) return []

    return adVariations
      .map(ad => ({
        ...ad,
        engagementScore: this.calculateEngagementScore(ad.performanceMetrics)
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 3)
  }

  /**
   * Calculate engagement score for an ad
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
  }

  /**
   * Generate AI-powered insights
   * @param {Array} adVariations - Ad variations data
   * @param {Object} projectData - Project information
   * @returns {Promise<Array>} Array of insights
   */
  async generateInsights(adVariations, projectData) {
    const insights = []

    // Performance pattern analysis
    const performanceInsights = this.analyzePerformancePatterns(adVariations)
    insights.push(...performanceInsights)

    // Content analysis
    const contentInsights = this.analyzeContentPatterns(adVariations)
    insights.push(...contentInsights)

    // Platform-specific insights
    const platformInsights = this.analyzePlatformPerformance(adVariations)
    insights.push(...platformInsights)

    // Timing insights
    const timingInsights = this.analyzeTimingPatterns(adVariations)
    insights.push(...timingInsights)

    return insights
  }

  /**
   * Analyze performance patterns
   * @param {Array} adVariations - Ad variations data
   * @returns {Array} Performance insights
   */
  analyzePerformancePatterns(adVariations) {
    const insights = []

    if (adVariations.length === 0) return insights

    const avgEngagement = adVariations.reduce((sum, ad) => {
      const metrics = ad.performanceMetrics || {}
      return sum + (metrics.likes || 0) + (metrics.shares || 0) + (metrics.comments || 0)
    }, 0) / adVariations.length

    const topPerformer = adVariations.reduce((best, current) => {
      const currentScore = this.calculateEngagementScore(current.performanceMetrics)
      const bestScore = this.calculateEngagementScore(best.performanceMetrics)
      return currentScore > bestScore ? current : best
    })

    if (topPerformer) {
      insights.push({
        type: 'performance',
        title: 'Top Performing Content Style',
        description: `Your best performing ad generated ${topPerformer.performanceMetrics?.likes || 0} likes and ${topPerformer.performanceMetrics?.shares || 0} shares.`,
        recommendation: 'Create more content similar to your top performer.',
        confidence: 0.85,
        impact: 'high'
      })
    }

    return insights
  }

  /**
   * Analyze content patterns
   * @param {Array} adVariations - Ad variations data
   * @returns {Array} Content insights
   */
  analyzeContentPatterns(adVariations) {
    const insights = []

    // Analyze caption patterns
    const captionAnalysis = this.analyzeCaptions(adVariations)
    if (captionAnalysis.insight) {
      insights.push(captionAnalysis.insight)
    }

    // Analyze emoji usage
    const emojiAnalysis = this.analyzeEmojiUsage(adVariations)
    if (emojiAnalysis.insight) {
      insights.push(emojiAnalysis.insight)
    }

    return insights
  }

  /**
   * Analyze caption patterns
   * @param {Array} adVariations - Ad variations data
   * @returns {Object} Caption analysis
   */
  analyzeCaptions(adVariations) {
    const captionLengths = adVariations.map(ad => ({
      length: ad.generatedCaption?.length || 0,
      engagement: this.calculateEngagementScore(ad.performanceMetrics)
    }))

    const avgLength = captionLengths.reduce((sum, item) => sum + item.length, 0) / captionLengths.length
    const bestLength = captionLengths.reduce((best, current) => 
      current.engagement > best.engagement ? current : best
    )

    if (bestLength.length > avgLength * 1.2) {
      return {
        insight: {
          type: 'content',
          title: 'Longer Captions Perform Better',
          description: `Your best performing ad has ${bestLength.length} characters, which is ${Math.round(((bestLength.length - avgLength) / avgLength) * 100)}% longer than average.`,
          recommendation: 'Try creating more detailed, longer captions to increase engagement.',
          confidence: 0.75,
          impact: 'medium'
        }
      }
    } else if (bestLength.length < avgLength * 0.8) {
      return {
        insight: {
          type: 'content',
          title: 'Shorter Captions Drive Engagement',
          description: `Your best performing ad has ${bestLength.length} characters, which is ${Math.round(((avgLength - bestLength.length) / avgLength) * 100)}% shorter than average.`,
          recommendation: 'Keep captions concise and punchy for better engagement.',
          confidence: 0.75,
          impact: 'medium'
        }
      }
    }

    return {}
  }

  /**
   * Analyze emoji usage patterns
   * @param {Array} adVariations - Ad variations data
   * @returns {Object} Emoji analysis
   */
  analyzeEmojiUsage(adVariations) {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu

    const emojiAnalysis = adVariations.map(ad => ({
      emojiCount: (ad.generatedCaption?.match(emojiRegex) || []).length,
      engagement: this.calculateEngagementScore(ad.performanceMetrics)
    }))

    const avgEmojis = emojiAnalysis.reduce((sum, item) => sum + item.emojiCount, 0) / emojiAnalysis.length
    const bestEmojiCount = emojiAnalysis.reduce((best, current) => 
      current.engagement > best.engagement ? current : best
    )

    if (bestEmojiCount.emojiCount > avgEmojis && bestEmojiCount.emojiCount > 0) {
      return {
        insight: {
          type: 'content',
          title: 'Emojis Boost Engagement',
          description: `Your best performing ad uses ${bestEmojiCount.emojiCount} emojis, compared to an average of ${avgEmojis.toFixed(1)}.`,
          recommendation: 'Include more relevant emojis in your captions to increase visual appeal and engagement.',
          confidence: 0.70,
          impact: 'medium'
        }
      }
    }

    return {}
  }

  /**
   * Analyze platform-specific performance
   * @param {Array} adVariations - Ad variations data
   * @returns {Array} Platform insights
   */
  analyzePlatformPerformance(adVariations) {
    const insights = []
    const platformData = {}

    adVariations.forEach(ad => {
      const platform = ad.platformTarget || 'unknown'
      if (!platformData[platform]) {
        platformData[platform] = {
          ads: [],
          totalEngagement: 0,
          totalViews: 0
        }
      }
      
      platformData[platform].ads.push(ad)
      const metrics = ad.performanceMetrics || {}
      platformData[platform].totalEngagement += (metrics.likes || 0) + (metrics.shares || 0) + (metrics.comments || 0)
      platformData[platform].totalViews += metrics.views || 0
    })

    const platforms = Object.entries(platformData)
    if (platforms.length > 1) {
      const bestPlatform = platforms.reduce((best, [platform, data]) => {
        const engagementRate = data.totalViews > 0 ? (data.totalEngagement / data.totalViews) * 100 : 0
        const bestRate = best.data.totalViews > 0 ? (best.data.totalEngagement / best.data.totalViews) * 100 : 0
        return engagementRate > bestRate ? { platform, data } : best
      }, { platform: platforms[0][0], data: platforms[0][1] })

      insights.push({
        type: 'platform',
        title: `${bestPlatform.platform.charAt(0).toUpperCase() + bestPlatform.platform.slice(1)} is Your Best Platform`,
        description: `${bestPlatform.platform} shows the highest engagement rate among your tested platforms.`,
        recommendation: `Focus more of your content strategy on ${bestPlatform.platform} for better results.`,
        confidence: 0.80,
        impact: 'high'
      })
    }

    return insights
  }

  /**
   * Analyze timing patterns
   * @param {Array} adVariations - Ad variations data
   * @returns {Array} Timing insights
   */
  analyzeTimingPatterns(adVariations) {
    const insights = []

    // This would analyze posting times if we had that data
    // For now, provide general timing recommendations
    insights.push({
      type: 'timing',
      title: 'Optimal Posting Times',
      description: 'Based on platform best practices, certain times show higher engagement.',
      recommendation: 'Try posting during peak hours: 9-11 AM and 7-9 PM in your audience\'s timezone.',
      confidence: 0.60,
      impact: 'medium'
    })

    return insights
  }

  /**
   * Generate optimization recommendations
   * @param {Array} adVariations - Ad variations data
   * @param {Object} projectData - Project information
   * @returns {Promise<Array>} Array of recommendations
   */
  async generateRecommendations(adVariations, projectData) {
    const recommendations = []

    // Get trending topics for content optimization
    try {
      const trends = await getFarcasterTrends()
      if (trends.length > 0) {
        recommendations.push({
          type: 'content',
          title: 'Leverage Trending Topics',
          description: `Current trending topics include: ${trends.slice(0, 3).map(t => t.topic).join(', ')}`,
          recommendation: 'Consider incorporating these trending topics into your next ad variations.',
          priority: 'medium',
          effort: 'low'
        })
      }
    } catch (error) {
      console.error('Error fetching trends:', error)
    }

    // Performance-based recommendations
    if (adVariations.length > 0) {
      const avgEngagement = adVariations.reduce((sum, ad) => {
        const metrics = ad.performanceMetrics || {}
        return sum + (metrics.likes || 0) + (metrics.shares || 0) + (metrics.comments || 0)
      }, 0) / adVariations.length

      if (avgEngagement < 10) {
        recommendations.push({
          type: 'strategy',
          title: 'Improve Engagement Strategy',
          description: 'Your current ads are showing low engagement rates.',
          recommendation: 'Try more interactive content like questions, polls, or call-to-actions.',
          priority: 'high',
          effort: 'medium'
        })
      }
    }

    // A/B testing recommendations
    recommendations.push({
      type: 'testing',
      title: 'Expand A/B Testing',
      description: 'More variations lead to better optimization insights.',
      recommendation: 'Generate 5-7 variations per product to find the best performing style.',
      priority: 'medium',
      effort: 'low'
    })

    return recommendations
  }

  /**
   * Analyze trends in performance data
   * @param {Array} adVariations - Ad variations data
   * @returns {Promise<Object>} Trend analysis
   */
  async analyzeTrends(adVariations) {
    // This would analyze performance trends over time
    // For now, provide basic trend analysis
    return {
      direction: 'stable',
      confidence: 0.65,
      summary: 'Performance metrics show consistent engagement patterns.',
      prediction: 'Maintaining current strategy should yield similar results.'
    }
  }

  /**
   * Suggest specific optimizations
   * @param {Array} adVariations - Ad variations data
   * @returns {Array} Optimization suggestions
   */
  suggestOptimizations(adVariations) {
    const optimizations = []

    if (adVariations.length > 0) {
      const topPerformer = this.identifyTopPerformers(adVariations)[0]
      
      if (topPerformer) {
        optimizations.push({
          type: 'content_optimization',
          title: 'Replicate Top Performer Elements',
          description: `Your top performing ad has specific characteristics that drive engagement.`,
          action: 'Create variations that incorporate similar language patterns and style.',
          expectedImpact: '+25% engagement rate'
        })
      }

      optimizations.push({
        type: 'frequency_optimization',
        title: 'Optimize Posting Frequency',
        description: 'Consistent posting schedules improve audience retention.',
        action: 'Post 3-5 times per week at consistent times.',
        expectedImpact: '+15% follower growth'
      })
    }

    return optimizations
  }

  /**
   * Get fallback analysis when AI analysis fails
   * @param {Array} adVariations - Ad variations data
   * @returns {Object} Fallback analysis
   */
  getFallbackAnalysis(adVariations) {
    return {
      overview: this.generateOverview(adVariations),
      topPerformers: this.identifyTopPerformers(adVariations),
      insights: [
        {
          type: 'general',
          title: 'Continue Testing',
          description: 'Keep experimenting with different ad variations to find what works best.',
          recommendation: 'Generate more ad variations and test different approaches.',
          confidence: 0.50,
          impact: 'medium'
        }
      ],
      recommendations: [
        {
          type: 'strategy',
          title: 'Focus on Engagement',
          description: 'Prioritize creating content that encourages interaction.',
          recommendation: 'Use questions, calls-to-action, and engaging visuals.',
          priority: 'high',
          effort: 'medium'
        }
      ],
      trends: {
        direction: 'unknown',
        confidence: 0.30,
        summary: 'Insufficient data for trend analysis.',
        prediction: 'Continue monitoring performance for better insights.'
      },
      optimizations: []
    }
  }
}

// Export singleton instance
export const aiGrowthAgent = new AIGrowthAgent()
