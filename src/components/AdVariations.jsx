import React, { useState } from 'react'
import { Eye, Send, Edit3, Copy } from 'lucide-react'

const AdVariations = ({ variations, onBack, onPost }) => {
  const [selectedVariations, setSelectedVariations] = useState(variations.map(v => v.id))

  const toggleVariation = (id) => {
    setSelectedVariations(prev =>
      prev.includes(id)
        ? prev.filter(vid => vid !== id)
        : [...prev, id]
    )
  }

  const handlePost = () => {
    const variationsToPost = variations.filter(v => selectedVariations.includes(v.id))
    onPost(variationsToPost)
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-dark-text">Generated Ad Variations</h3>
          <p className="text-dark-text-secondary">Review and select ads to post</p>
        </div>
        <div className="text-sm text-dark-text-secondary">
          {selectedVariations.length} of {variations.length} selected
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {variations.map((variation) => (
          <div
            key={variation.id}
            className={`bg-dark-surface-light rounded-lg overflow-hidden border-2 transition-all ${
              selectedVariations.includes(variation.id)
                ? 'border-primary'
                : 'border-transparent hover:border-primary/50'
            }`}
          >
            {/* Image placeholder */}
            <div className="aspect-[4/5] bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <div className="text-center text-dark-text-secondary">
                <Eye className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Generated Image Preview</p>
              </div>
            </div>

            <div className="p-4">
              {/* Platform Badge */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getPlatformColor(variation.platform)} mb-3`}>
                {variation.platform}
              </div>

              {/* Caption */}
              <p className="text-dark-text text-sm mb-4 line-clamp-3">
                {variation.caption}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVariation(variation.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedVariations.includes(variation.id)
                      ? 'bg-primary text-white'
                      : 'bg-dark-surface text-dark-text hover:bg-dark-surface-light'
                  }`}
                >
                  {selectedVariations.includes(variation.id) ? 'Selected' : 'Select'}
                </button>
                
                <button className="p-2 bg-dark-surface text-dark-text-secondary hover:text-dark-text rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                
                <button className="p-2 bg-dark-surface text-dark-text-secondary hover:text-dark-text rounded-lg transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 bg-dark-surface-light text-dark-text py-3 rounded-lg font-medium hover:bg-dark-surface transition-colors"
        >
          Back
        </button>
        <button
          onClick={handlePost}
          disabled={selectedVariations.length === 0}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Post Selected Ads ({selectedVariations.length})
        </button>
      </div>
    </div>
  )
}

export default AdVariations