import React, { useState } from 'react'
import { Calendar, TrendingUp, Eye, Heart, MessageCircle, Share } from 'lucide-react'
import PerformanceChart from '../components/PerformanceChart'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')

  const performanceData = [
    {
      id: 1,
      projectName: 'Summer Collection Shoes',
      platform: 'instagram',
      postedAt: '2024-01-15',
      metrics: {
        views: 12500,
        likes: 890,
        comments: 45,
        shares: 23,
        engagement: '7.2%',
        conversions: 12
      }
    },
    {
      id: 2,
      projectName: 'Tech Gadget Launch',
      platform: 'tiktok',
      postedAt: '2024-01-14',
      metrics: {
        views: 8300,
        likes: 650,
        comments: 78,
        shares: 34,
        engagement: '9.1%',
        conversions: 8
      }
    },
    {
      id: 3,
      projectName: 'Fitness Equipment',
      platform: 'farcaster',
      postedAt: '2024-01-13',
      metrics: {
        views: 3200,
        likes: 240,
        comments: 18,
        shares: 12,
        engagement: '8.4%',
        conversions: 5
      }
    }
  ]

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'instagram': return 'from-pink-500 to-purple-500'
      case 'tiktok': return 'from-black to-red-500'
      case 'farcaster': return 'from-blue-500 to-purple-500'
      default: return 'from-gray-500 to-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-text mb-2">Analytics Dashboard</h1>
          <p className="text-dark-text-secondary">Track performance of your ad campaigns</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-dark-text-secondary" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-dark-surface text-dark-text px-4 py-2 rounded-lg border border-dark-surface-light focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-surface rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-blue-500" />
            <span className="text-dark-text-secondary text-sm">Total Views</span>
          </div>
          <p className="text-2xl font-bold text-dark-text">24.0K</p>
          <p className="text-green-500 text-sm">+15% from last period</p>
        </div>

        <div className="bg-dark-surface rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-dark-text-secondary text-sm">Total Likes</span>
          </div>
          <p className="text-2xl font-bold text-dark-text">1.78K</p>
          <p className="text-green-500 text-sm">+23% from last period</p>
        </div>

        <div className="bg-dark-surface rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-dark-text-secondary text-sm">Avg Engagement</span>
          </div>
          <p className="text-2xl font-bold text-dark-text">8.2%</p>
          <p className="text-green-500 text-sm">+0.8% from last period</p>
        </div>

        <div className="bg-dark-surface rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Share className="w-5 h-5 text-purple-500" />
            <span className="text-dark-text-secondary text-sm">Conversions</span>
          </div>
          <p className="text-2xl font-bold text-dark-text">25</p>
          <p className="text-green-500 text-sm">+4 from last period</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-dark-surface rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Performance Trends</h3>
        <PerformanceChart />
      </div>

      {/* Ad Performance Table */}
      <div className="bg-dark-surface rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Individual Ad Performance</h3>
        
        <div className="space-y-4">
          {performanceData.map((ad) => (
            <div key={ad.id} className="bg-dark-surface-light rounded-lg p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getPlatformColor(ad.platform)} rounded-lg flex items-center justify-center text-white font-medium text-sm`}>
                    {ad.platform.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-dark-text">{ad.projectName}</h4>
                    <p className="text-dark-text-secondary text-sm">
                      {ad.platform} • Posted {ad.postedAt}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 text-center">
                  <div>
                    <p className="text-dark-text font-medium">{ad.metrics.views.toLocaleString()}</p>
                    <p className="text-dark-text-secondary text-xs">Views</p>
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">{ad.metrics.likes}</p>
                    <p className="text-dark-text-secondary text-xs">Likes</p>
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">{ad.metrics.comments}</p>
                    <p className="text-dark-text-secondary text-xs">Comments</p>
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">{ad.metrics.shares}</p>
                    <p className="text-dark-text-secondary text-xs">Shares</p>
                  </div>
                  <div>
                    <p className="text-green-500 font-medium">{ad.metrics.engagement}</p>
                    <p className="text-dark-text-secondary text-xs">Engagement</p>
                  </div>
                  <div>
                    <p className="text-primary font-medium">{ad.metrics.conversions}</p>
                    <p className="text-dark-text-secondary text-xs">Conversions</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics