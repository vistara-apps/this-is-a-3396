// Stripe integration for subscription management
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('Stripe publishable key not found. Payment features will use mock responses.')
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 15,
    currency: 'usd',
    interval: 'month',
    features: [
      '50 ad generations per month',
      '10 auto-posts per month',
      'Basic analytics',
      'Farcaster integration'
    ],
    limits: {
      adGenerations: 50,
      autoPosts: 10
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited ad generations',
      '50 auto-posts per month',
      'Advanced analytics',
      'All platform integrations',
      'AI Growth Hacking Agent',
      'Priority support'
    ],
    limits: {
      adGenerations: -1, // unlimited
      autoPosts: 50
    }
  }
}

/**
 * Initialize Stripe (placeholder for actual Stripe.js integration)
 * @returns {Promise<Object>} Stripe instance
 */
export const initializeStripe = async () => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    return {
      mock: true,
      message: 'Stripe not configured - using mock payment flow'
    }
  }

  try {
    // In a real implementation, you'd load Stripe.js here
    // const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY)
    // return stripe
    
    return {
      mock: true,
      message: 'Stripe initialized (mock)'
    }
  } catch (error) {
    console.error('Error initializing Stripe:', error)
    return null
  }
}

/**
 * Create a subscription checkout session
 * @param {string} planId - Subscription plan ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Checkout session result
 */
export const createCheckoutSession = async (planId, userId) => {
  const plan = SUBSCRIPTION_PLANS[planId]
  
  if (!plan) {
    throw new Error('Invalid subscription plan')
  }

  if (!STRIPE_PUBLISHABLE_KEY) {
    // Return mock checkout session for development
    return {
      success: true,
      sessionId: `mock-session-${Date.now()}`,
      url: `https://checkout.stripe.com/mock-session-${Date.now()}`,
      message: 'Checkout session created (mock)'
    }
  }

  try {
    // In a real implementation, this would call your backend API
    // which would create a Stripe checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planId,
        userId,
        successUrl: `${window.location.origin}/settings?success=true`,
        cancelUrl: `${window.location.origin}/settings?canceled=true`
      })
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        sessionId: data.sessionId,
        url: data.url,
        message: 'Checkout session created successfully'
      }
    } else {
      throw new Error(data.error || 'Failed to create checkout session')
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    // Return mock session on error for development
    return {
      success: true,
      sessionId: `mock-session-${Date.now()}`,
      url: `https://checkout.stripe.com/mock-session-${Date.now()}`,
      message: 'Checkout session created (mock - API error)'
    }
  }
}

/**
 * Get subscription status for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Subscription status
 */
export const getSubscriptionStatus = async (userId) => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    // Return mock subscription for development
    return {
      active: true,
      plan: 'pro',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      cancelAtPeriodEnd: false,
      usage: {
        adGenerations: 25,
        autoPosts: 8
      }
    }
  }

  try {
    // In a real implementation, this would call your backend API
    // which would fetch subscription data from Stripe
    const response = await fetch(`/api/subscription-status/${userId}`)
    const data = await response.json()

    if (response.ok) {
      return data
    } else {
      throw new Error(data.error || 'Failed to fetch subscription status')
    }
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    // Return default subscription on error
    return {
      active: false,
      plan: 'basic',
      status: 'inactive',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      usage: {
        adGenerations: 0,
        autoPosts: 0
      }
    }
  }
}

/**
 * Cancel a subscription
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelSubscription = async (userId) => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    return {
      success: true,
      message: 'Subscription canceled (mock)'
    }
  }

  try {
    const response = await fetch(`/api/cancel-subscription/${userId}`, {
      method: 'POST'
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        message: 'Subscription canceled successfully'
      }
    } else {
      throw new Error(data.error || 'Failed to cancel subscription')
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to cancel subscription'
    }
  }
}

/**
 * Update payment method
 * @param {string} userId - User ID
 * @param {string} paymentMethodId - New payment method ID
 * @returns {Promise<Object>} Update result
 */
export const updatePaymentMethod = async (userId, paymentMethodId) => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    return {
      success: true,
      message: 'Payment method updated (mock)'
    }
  }

  try {
    const response = await fetch(`/api/update-payment-method/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentMethodId
      })
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        message: 'Payment method updated successfully'
      }
    } else {
      throw new Error(data.error || 'Failed to update payment method')
    }
  } catch (error) {
    console.error('Error updating payment method:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to update payment method'
    }
  }
}

/**
 * Get usage statistics for billing
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Usage statistics
 */
export const getUsageStats = async (userId) => {
  try {
    // In a real implementation, this would fetch from your database
    // For now, return mock usage data
    return {
      currentPeriod: {
        adGenerations: Math.floor(Math.random() * 40) + 10,
        autoPosts: Math.floor(Math.random() * 15) + 5,
        periodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        periodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      },
      limits: SUBSCRIPTION_PLANS.pro.limits
    }
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return {
      currentPeriod: {
        adGenerations: 0,
        autoPosts: 0,
        periodStart: new Date(),
        periodEnd: new Date()
      },
      limits: SUBSCRIPTION_PLANS.basic.limits
    }
  }
}
