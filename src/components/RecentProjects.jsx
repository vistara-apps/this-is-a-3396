import React from 'react'
import { Image, Calendar, TrendingUp } from 'lucide-react'

const RecentProjects = () => {
  const projects = [
    {
      id: 1,
      name: 'Summer Collection Shoes',
      date: '2024-01-15',
      status: 'completed',
      variations: 5,
      engagement: '2.3k'
    },
    {
      id: 2,
      name: 'Tech Gadget Launch',
      date: '2024-01-14',
      status: 'processing',
      variations: 3,
      engagement: '1.8k'
    },
    {
      id: 3,
      name: 'Fitness Equipment',
      date: '2024-01-13',
      status: 'completed',
      variations: 4,
      engagement: '3.1k'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500'
      case 'processing': return 'text-yellow-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="flex items-center justify-between p-4 bg-dark-surface-light rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-dark-text">{project.name}</h4>
              <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>{project.date}</span>
                <span className={`ml-2 ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-dark-text">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">{project.engagement}</span>
            </div>
            <p className="text-sm text-dark-text-secondary">{project.variations} variations</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentProjects