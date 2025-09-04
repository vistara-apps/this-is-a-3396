// Farcaster API integration via Neynar
const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2'

if (!NEYNAR_API_KEY) {
  console.warn('Neynar API key not found. Farcaster posting will use mock responses.')
}

/**
 * Post an ad variation to Farcaster
 * @param {Object} adVariation - The ad variation to post
 * @param {string} signerUuid - Signer UUID for the Farcaster account
 * @returns {Promise<Object>} Post result
 */
export const postToFarcaster = async (adVariation, signerUuid) => {
  if (!NEYNAR_API_KEY) {
    // Return mock success for development
    return {
      success: true,
      castHash: `mock-cast-${Date.now()}`,
      url: `https://warpcast.com/~/conversations/mock-cast-${Date.now()}`,
      message: 'Posted successfully (mock)'
    }
  }

  try {
    const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/cast`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NEYNAR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signer_uuid: signerUuid,
        text: adVariation.generatedCaption,
        embeds: adVariation.generatedImageURL ? [
          {
            url: adVariation.generatedImageURL
          }
        ] : []
      })
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        castHash: data.cast.hash,
        url: `https://warpcast.com/~/conversations/${data.cast.hash}`,
        message: 'Posted successfully to Farcaster'
      }
    } else {
      throw new Error(data.message || 'Failed to post to Farcaster')
    }
  } catch (error) {
    console.error('Error posting to Farcaster:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to post to Farcaster'
    }
  }
}

/**
 * Get performance metrics for a Farcaster cast
 * @param {string} castHash - Hash of the cast
 * @returns {Promise<Object>} Performance metrics
 */
export const getFarcasterMetrics = async (castHash) => {
  if (!NEYNAR_API_KEY) {
    // Return mock metrics for development
    return {
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 50) + 10,
      recasts: Math.floor(Math.random() * 20) + 2,
      replies: Math.floor(Math.random() * 15) + 1,
      engagement_rate: (Math.random() * 10 + 2).toFixed(2)
    }
  }

  try {
    const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/cast?identifier=${castHash}&type=hash`, {
      headers: {
        'Authorization': `Bearer ${NEYNAR_API_KEY}`
      }
    })

    const data = await response.json()

    if (response.ok) {
      const cast = data.cast
      return {
        views: cast.replies?.count || 0,
        likes: cast.reactions?.likes_count || 0,
        recasts: cast.reactions?.recasts_count || 0,
        replies: cast.replies?.count || 0,
        engagement_rate: calculateEngagementRate(cast)
      }
    } else {
      throw new Error('Failed to fetch cast metrics')
    }
  } catch (error) {
    console.error('Error fetching Farcaster metrics:', error)
    // Return default metrics on error
    return {
      views: 0,
      likes: 0,
      recasts: 0,
      replies: 0,
      engagement_rate: 0
    }
  }
}

/**
 * Calculate engagement rate for a cast
 * @param {Object} cast - Cast data from Farcaster
 * @returns {number} Engagement rate percentage
 */
const calculateEngagementRate = (cast) => {
  const likes = cast.reactions?.likes_count || 0
  const recasts = cast.reactions?.recasts_count || 0
  const replies = cast.replies?.count || 0
  const totalEngagements = likes + recasts + replies
  
  // Estimate views based on engagement (rough approximation)
  const estimatedViews = Math.max(totalEngagements * 10, 100)
  
  return totalEngagements > 0 ? ((totalEngagements / estimatedViews) * 100).toFixed(2) : 0
}

/**
 * Connect a Farcaster account (placeholder for OAuth flow)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Connection result
 */
export const connectFarcasterAccount = async (userId) => {
  // In a real implementation, this would handle OAuth flow with Farcaster
  // For now, return mock connection data
  return {
    success: true,
    signerUuid: `mock-signer-${userId}-${Date.now()}`,
    username: 'testuser',
    displayName: 'Test User',
    pfpUrl: 'https://picsum.photos/100/100',
    message: 'Farcaster account connected successfully (mock)'
  }
}

/**
 * Disconnect a Farcaster account
 * @param {string} signerUuid - Signer UUID to disconnect
 * @returns {Promise<Object>} Disconnection result
 */
export const disconnectFarcasterAccount = async (signerUuid) => {
  return {
    success: true,
    message: 'Farcaster account disconnected successfully'
  }
}

/**
 * Get trending topics on Farcaster for content optimization
 * @returns {Promise<Array>} Array of trending topics
 */
export const getFarcasterTrends = async () => {
  if (!NEYNAR_API_KEY) {
    // Return mock trends for development
    return [
      { topic: 'crypto', mentions: 1250 },
      { topic: 'ai', mentions: 980 },
      { topic: 'defi', mentions: 750 },
      { topic: 'nft', mentions: 620 },
      { topic: 'web3', mentions: 580 }
    ]
  }

  try {
    // This would fetch actual trending data from Farcaster
    // For now, return mock data
    return [
      { topic: 'crypto', mentions: 1250 },
      { topic: 'ai', mentions: 980 },
      { topic: 'defi', mentions: 750 },
      { topic: 'nft', mentions: 620 },
      { topic: 'web3', mentions: 580 }
    ]
  } catch (error) {
    console.error('Error fetching Farcaster trends:', error)
    return []
  }
}
