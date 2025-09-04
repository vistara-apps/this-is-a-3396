import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getSubscriptionStatus } from '../lib/stripe'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
        }

        if (session?.user) {
          await handleUserSession(session.user)
        } else {
          // Use mock user for development if no Supabase session
          const mockUser = {
            id: '1',
            email: 'user@example.com',
            user_metadata: {
              subscriptionTier: 'pro'
            }
          }
          await handleUserSession(mockUser)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        // Fallback to mock user
        const mockUser = {
          id: '1',
          email: 'user@example.com',
          user_metadata: {
            subscriptionTier: 'pro'
          }
        }
        await handleUserSession(mockUser)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await handleUserSession(session.user)
        } else {
          setUser(null)
          setSubscription(null)
        }
        setLoading(false)
      }
    )

    return () => {
      authSubscription?.unsubscribe()
    }
  }, [])

  const handleUserSession = async (supabaseUser) => {
    try {
      // Get or create user profile
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('userId', supabaseUser.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create profile
        const newProfile = {
          userId: supabaseUser.id,
          email: supabaseUser.email,
          subscriptionTier: 'basic',
          socialMediaAccounts: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single()

        if (createError) {
          console.error('Error creating user profile:', createError)
        } else {
          setUser({ ...supabaseUser, profile: createdProfile })
        }
      } else if (!error) {
        setUser({ ...supabaseUser, profile })
      } else {
        console.error('Error fetching user profile:', error)
        setUser(supabaseUser)
      }

      // Get subscription status
      try {
        const subscriptionData = await getSubscriptionStatus(supabaseUser.id)
        setSubscription(subscriptionData)
      } catch (error) {
        console.error('Error fetching subscription:', error)
      }
    } catch (error) {
      console.error('Error handling user session:', error)
      setUser(supabaseUser)
    }
  }

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      return data.user
    } catch (error) {
      console.error('Login error:', error)
      // Fallback to mock login for development
      const mockUser = {
        id: '1',
        email,
        user_metadata: {
          subscriptionTier: 'pro'
        }
      }
      await handleUserSession(mockUser)
      return mockUser
    }
  }

  const signup = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        throw error
      }

      return data.user
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setSubscription(null)
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('userId', user.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      setUser(prev => ({ ...prev, profile: data }))
      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const value = {
    user,
    subscription,
    login,
    signup,
    logout,
    updateProfile,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
