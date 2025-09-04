import React from 'react'
import { Plus, TrendingUp, Image, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatsCard from '../components/StatsCard'
import RecentProjects from '../components/RecentProjects'
import PerformanceChart from '../components/PerformanceChart'

const Dashboard = () => {
  const stats = [
    {
      title: 'Ad Variations Generated',
      value: '247',
      change: '+12%',
      trend: 'up',
      icon: Image
    },
    {
      title: 'Posts This Month',
      value: '89',
      change: '+8%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Total Engagement',
      value: '15.2K',
      change: '+23%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      trend: 'up',
      icon: TrendingUp
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/create"
          className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Create New Project</span>
        </Link>
        
        <Link
          to="/analytics"
          className="flex items-center gap-3 bg-dark-surface text-dark-text px-6 py-4 rounded-lg hover:bg-dark-surface-light transition-colors"
        >
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">View Analytics</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-surface rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Performance Overview</h3>
          <PerformanceChart />
        </div>
        
        <div className="bg-dark-surface rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Recent Projects</h3>
          <RecentProjects />
        </div>
      </div>
    </div>
  )
}

export default Dashboard