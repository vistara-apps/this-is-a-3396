import React, { useState } from 'react'
import ImageUploader from '../components/ImageUploader'
import PlatformSelector from '../components/PlatformSelector'
import AdVariations from '../components/AdVariations'

const CreateProject = () => {
  const [projectData, setProjectData] = useState({
    productName: '',
    productImage: null,
    selectedPlatforms: [],
    description: ''
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [adVariations, setAdVariations] = useState([])

  const handleImageUpload = (file) => {
    setProjectData(prev => ({ ...prev, productImage: file }))
  }

  const handlePlatformChange = (platforms) => {
    setProjectData(prev => ({ ...prev, selectedPlatforms: platforms }))
  }

  const generateVariations = async () => {
    setIsGenerating(true)
    
    // Mock AI generation - in real app, call OpenAI API
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockVariations = [
      {
        id: 1,
        imageUrl: '/api/placeholder/400/600',
        caption: '🔥 Don\'t miss out on this amazing deal! Limited time offer on our premium collection. Shop now and save big! #Sale #Fashion #Deal',
        platform: 'instagram',
        style: 'promotional'
      },
      {
        id: 2,
        imageUrl: '/api/placeholder/400/600',
        caption: 'Transform your style with our latest collection ✨ Quality meets affordability. Which one is your favorite? 🤔',
        platform: 'tiktok',
        style: 'engaging'
      },
      {
        id: 3,
        imageUrl: '/api/placeholder/400/600',
        caption: 'Just dropped: The product you\'ve been waiting for 💯 Experience the difference quality makes. Link in bio!',
        platform: 'farcaster',
        style: 'announcement'
      }
    ]
    
    setAdVariations(mockVariations)
    setIsGenerating(false)
    setCurrentStep(3)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={projectData.productName}
                onChange={(e) => setProjectData(prev => ({ ...prev, productName: e.target.value }))}
                className="w-full px-4 py-3 bg-dark-surface-light border border-dark-surface-light rounded-lg text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Product Description
              </label>
              <textarea
                value={projectData.description}
                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-dark-surface-light border border-dark-surface-light rounded-lg text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your product..."
              />
            </div>

            <ImageUploader onImageUpload={handleImageUpload} />

            <button
              onClick={() => setCurrentStep(2)}
              disabled={!projectData.productName || !projectData.productImage}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Next: Select Platforms
            </button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <PlatformSelector
              selectedPlatforms={projectData.selectedPlatforms}
              onPlatformChange={handlePlatformChange}
            />

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-dark-surface-light text-dark-text py-3 rounded-lg font-medium hover:bg-dark-surface transition-colors"
              >
                Back
              </button>
              <button
                onClick={generateVariations}
                disabled={projectData.selectedPlatforms.length === 0 || isGenerating}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Ad Variations'}
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <AdVariations
            variations={adVariations}
            onBack={() => setCurrentStep(2)}
            onPost={(variations) => {
              console.log('Posting variations:', variations)
              alert('Ads posted successfully!')
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text mb-2">Create New Project</h1>
        <p className="text-dark-text-secondary">Generate viral ad variations from your product image</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
              step <= currentStep
                ? 'bg-primary text-white'
                : 'bg-dark-surface-light text-dark-text-secondary'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`flex-1 h-1 mx-4 ${
                step < currentStep ? 'bg-primary' : 'bg-dark-surface-light'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-dark-surface rounded-lg p-6">
        {renderStep()}
      </div>
    </div>
  )
}

export default CreateProject