import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types for TypeScript-like documentation
export const DatabaseSchema = {
  users: {
    userId: 'uuid',
    email: 'text',
    subscriptionTier: 'text', // 'basic', 'pro', 'enterprise'
    paymentMethodId: 'text',
    socialMediaAccounts: 'jsonb',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },
  projects: {
    projectId: 'uuid',
    userId: 'uuid',
    productName: 'text',
    productImageURL: 'text',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },
  adVariations: {
    adVariationId: 'uuid',
    projectId: 'uuid',
    generatedImageURL: 'text',
    generatedCaption: 'text',
    platformTarget: 'text', // 'farcaster', 'instagram', 'tiktok'
    postStatus: 'text', // 'draft', 'posted', 'failed'
    performanceMetrics: 'jsonb',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  }
}
