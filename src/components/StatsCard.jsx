import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const StatsCard = ({ title, value, change, trend, icon: Icon }) => {
  const isPositive = trend === 'up'

  return (
    <div className="bg-dark-surface rounded-lg p-6 hover:bg-dark-surface-light transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-text-secondary text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-dark-text mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {change}
            </span>
            <span className="text-dark-text-secondary text-sm">vs last month</span>
          </div>
        </div>
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default StatsCard