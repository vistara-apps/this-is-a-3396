// Utility functions for the AdGenius AI application
import { clsx } from 'clsx'

/**
 * Combine class names conditionally
 * @param {...any} classes - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...classes) {
  return clsx(classes)
}

/**
 * Format a date to a readable string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return dateObj.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now - dateObj) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`
  }
  
  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`
}

/**
 * Format a number with appropriate suffixes (K, M, B)
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(num, decimals = 1) {
  if (num < 1000) {
    return num.toString()
  }
  
  if (num < 1000000) {
    return (num / 1000).toFixed(decimals).replace(/\.0$/, '') + 'K'
  }
  
  if (num < 1000000000) {
    return (num / 1000000).toFixed(decimals).replace(/\.0$/, '') + 'M'
  }
  
  return (num / 1000000000).toFixed(decimals).replace(/\.0$/, '') + 'B'
}

/**
 * Format a percentage value
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add when truncated
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100, suffix = '...') {
  if (!text || text.length <= maxLength) {
    return text || ''
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Generate a random ID
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) {
    return true
  }
  
  if (typeof value === 'string') {
    return value.trim() === ''
  }
  
  if (Array.isArray(value)) {
    return value.length === 0
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  
  return false
}

/**
 * Validate an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate a URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Extract domain from URL
 * @param {string} url - URL to extract domain from
 * @returns {string} Domain name
 */
export function extractDomain(url) {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return ''
  }
}

/**
 * Sleep for a specified amount of time
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the specified time
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with the function result
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (i === maxRetries) {
        throw lastError
      }
      
      const delay = baseDelay * Math.pow(2, i)
      await sleep(delay)
    }
  }
}

/**
 * Calculate engagement rate
 * @param {Object} metrics - Performance metrics
 * @returns {number} Engagement rate as a percentage
 */
export function calculateEngagementRate(metrics) {
  if (!metrics || !metrics.views || metrics.views === 0) {
    return 0
  }
  
  const engagements = (metrics.likes || 0) + (metrics.shares || 0) + (metrics.comments || 0)
  return (engagements / metrics.views) * 100
}

/**
 * Get platform-specific formatting for content
 * @param {string} platform - Platform name
 * @param {string} content - Content to format
 * @returns {string} Formatted content
 */
export function formatContentForPlatform(platform, content) {
  switch (platform.toLowerCase()) {
    case 'farcaster':
      // Farcaster has a 320 character limit
      return truncateText(content, 320)
    
    case 'instagram':
      // Instagram allows up to 2,200 characters
      return truncateText(content, 2200)
    
    case 'tiktok':
      // TikTok allows up to 150 characters
      return truncateText(content, 150)
    
    default:
      return content
  }
}

/**
 * Get optimal image dimensions for a platform
 * @param {string} platform - Platform name
 * @returns {Object} Optimal dimensions
 */
export function getOptimalImageDimensions(platform) {
  const dimensions = {
    farcaster: { width: 1200, height: 630, aspectRatio: '1.91:1' },
    instagram: { width: 1080, height: 1080, aspectRatio: '1:1' },
    tiktok: { width: 1080, height: 1920, aspectRatio: '9:16' }
  }
  
  return dimensions[platform.toLowerCase()] || dimensions.farcaster
}

/**
 * Generate color variations for charts and visualizations
 * @param {string} baseColor - Base color in hex format
 * @param {number} count - Number of variations to generate
 * @returns {Array} Array of color variations
 */
export function generateColorVariations(baseColor, count = 5) {
  const colors = []
  const hsl = hexToHsl(baseColor)
  
  for (let i = 0; i < count; i++) {
    const lightness = Math.max(20, Math.min(80, hsl.l + (i - Math.floor(count / 2)) * 15))
    colors.push(hslToHex(hsl.h, hsl.s, lightness))
  }
  
  return colors
}

/**
 * Convert hex color to HSL
 * @param {string} hex - Hex color
 * @returns {Object} HSL values
 */
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 }
}

/**
 * Convert HSL to hex color
 * @param {number} h - Hue
 * @param {number} s - Saturation
 * @param {number} l - Lightness
 * @returns {string} Hex color
 */
function hslToHex(h, s, l) {
  h /= 360
  s /= 100
  l /= 100
  
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  const toHex = (c) => {
    const hex = Math.round(c * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Parse error messages for user-friendly display
 * @param {Error|string} error - Error to parse
 * @returns {string} User-friendly error message
 */
export function parseErrorMessage(error) {
  if (typeof error === 'string') {
    return error
  }
  
  if (error?.message) {
    // Handle common API errors
    if (error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.'
    }
    
    if (error.message.includes('unauthorized') || error.message.includes('401')) {
      return 'Authentication required. Please log in and try again.'
    }
    
    if (error.message.includes('forbidden') || error.message.includes('403')) {
      return 'You don\'t have permission to perform this action.'
    }
    
    if (error.message.includes('not found') || error.message.includes('404')) {
      return 'The requested resource was not found.'
    }
    
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return 'Too many requests. Please wait a moment and try again.'
    }
    
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },
  
  clear() {
    try {
      localStorage.clear()
      return true
    } catch {
      return false
    }
  }
}
