import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const PerformanceChart = () => {
  const data = [
    { name: 'Mon', engagement: 400, conversions: 24 },
    { name: 'Tue', engagement: 300, conversions: 13 },
    { name: 'Wed', engagement: 200, conversions: 98 },
    { name: 'Thu', engagement: 278, conversions: 39 },
    { name: 'Fri', engagement: 189, conversions: 48 },
    { name: 'Sat', engagement: 239, conversions: 38 },
    { name: 'Sun', engagement: 349, conversions: 43 },
  ]

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="engagement" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="conversions" 
            stroke="#EC4899" 
            strokeWidth={2}
            dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PerformanceChart