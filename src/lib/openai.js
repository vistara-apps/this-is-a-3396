// OpenAI API integration for ad generation
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_BASE_URL = 'https://api.openai.com/v1'

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. Ad generation will use mock data.')
}

/**
 * Generate ad variations using OpenAI
 * @param {string} productImageUrl - URL of the product image
 * @param {string} productName - Name of the product
 * @param {string} platformTarget - Target platform (farcaster, instagram, tiktok)
 * @returns {Promise<Array>} Array of ad variations
 */
export const generateAdVariations = async (productImageUrl, productName, platformTarget = 'farcaster') => {
  if (!OPENAI_API_KEY) {
    // Return mock data for development
    return generateMockAdVariations(productName, platformTarget)
  }

  try {
    // Generate captions using GPT
    const captionResponse = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert social media marketer. Generate 3-5 engaging ad captions for ${platformTarget}. Each caption should be different in style: one casual/friendly, one urgent/scarcity, one benefit-focused, one social proof, and one question-based. Keep captions appropriate for ${platformTarget} format and audience.`
          },
          {
            role: 'user',
            content: `Create ad captions for this product: ${productName}. Make them engaging and conversion-focused for ${platformTarget}.`
          }
        ],
        max_tokens: 500,
        temperature: 0.8
      })
    })

    const captionData = await captionResponse.json()
    const captions = captionData.choices[0].message.content.split('\n').filter(line => line.trim())

    // For now, we'll use the original image URL for all variations
    // In a full implementation, you'd use DALL-E to create image variations
    const adVariations = captions.slice(0, 5).map((caption, index) => ({
      id: `variation-${Date.now()}-${index}`,
      generatedImageURL: productImageUrl,
      generatedCaption: caption.replace(/^\d+\.\s*/, '').trim(),
      platformTarget,
      postStatus: 'draft',
      performanceMetrics: {
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        clickThroughRate: 0
      }
    }))

    return adVariations
  } catch (error) {
    console.error('Error generating ad variations:', error)
    // Fallback to mock data
    return generateMockAdVariations(productName, platformTarget)
  }
}

/**
 * Generate image variations using DALL-E (placeholder for future implementation)
 * @param {string} originalImageUrl - Original product image URL
 * @param {string} prompt - Variation prompt
 * @returns {Promise<string>} Generated image URL
 */
export const generateImageVariation = async (originalImageUrl, prompt) => {
  if (!OPENAI_API_KEY) {
    return originalImageUrl // Return original for now
  }

  try {
    // This would use DALL-E API to create variations
    // For now, return the original image
    return originalImageUrl
  } catch (error) {
    console.error('Error generating image variation:', error)
    return originalImageUrl
  }
}

/**
 * Generate mock ad variations for development/testing
 */
const generateMockAdVariations = (productName, platformTarget) => {
  const mockCaptions = {
    farcaster: [
      `🔥 Just discovered ${productName} and I'm obsessed! Who else needs this in their life?`,
      `⚡ Limited time: Get ${productName} before everyone else finds out about it!`,
      `💡 ${productName} solved my biggest problem. Here's how it can help you too...`,
      `🌟 1000+ people can't be wrong about ${productName}. Join the community!`,
      `🤔 Still using outdated solutions? ${productName} is the upgrade you need.`
    ],
    instagram: [
      `✨ ${productName} is giving me LIFE! Swipe to see the transformation ➡️`,
      `🚨 FLASH SALE: ${productName} - 24 hours only! Link in bio 👆`,
      `💪 How ${productName} changed my daily routine (and it can change yours too!)`,
      `👥 Join 10K+ happy customers who chose ${productName} #GameChanger`,
      `❓ What if I told you ${productName} could solve your biggest challenge?`
    ],
    tiktok: [
      `POV: You discover ${productName} and your life changes forever 🤯`,
      `⏰ You have 24hrs to get ${productName} at this price. GO GO GO!`,
      `The ${productName} hack that everyone's talking about (it actually works!)`,
      `Why everyone's switching to ${productName} (the results speak for themselves)`,
      `Is ${productName} really worth the hype? Let me show you... 👀`
    ]
  }

  const captions = mockCaptions[platformTarget] || mockCaptions.farcaster

  return captions.map((caption, index) => ({
    id: `mock-variation-${Date.now()}-${index}`,
    generatedImageURL: `https://picsum.photos/400/400?random=${index}`,
    generatedCaption: caption,
    platformTarget,
    postStatus: 'draft',
    performanceMetrics: {
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 20),
      comments: Math.floor(Math.random() * 30),
      clickThroughRate: (Math.random() * 5).toFixed(2)
    }
  }))
}
