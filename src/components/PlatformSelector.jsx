import React from 'react'
import { Instagram, MessageCircle } from 'lucide-react'

const PlatformSelector = ({ selectedPlatforms, onPlatformChange }) => {
  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      description: 'Square and story formats, visual focus',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: MessageCircle,
      description: 'Vertical video format, trend-focused',
      color: 'from-black to-red-500'
    },
    {
      id: 'farcaster',
      name: 'Farcaster',
      icon: MessageCircle,
      description: 'Decentralized social, crypto community',
      color: 'from-blue-500 to-purple-500'
    }
  ]

  const togglePlatform = (platformId) => {
    const newSelected = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId]
    
    onPlatformChange(newSelected)
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-dark-text mb-4">Select Target Platforms</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedPlatforms.includes(platform.id)
                ? 'border-primary bg-primary/10'
                : 'border-dark-surface-light bg-dark-surface-light hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center`}>
                <platform.icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-medium text-dark-text">{platform.name}</h4>
            </div>
            <p className="text-sm text-dark-text-secondary">{platform.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlatformSelector