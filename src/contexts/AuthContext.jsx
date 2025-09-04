import React, { createContext, useContext, useState, useEffect } from 'react'

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

  useEffect(() => {
    // Mock authentication - in real app, integrate with Supabase
    const mockUser = {
      id: '1',
      email: 'user@example.com',
      subscriptionTier: 'pro'
    }
    setUser(mockUser)
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock login
    const mockUser = {
      id: '1',
      email,
      subscriptionTier: 'pro'
    }
    setUser(mockUser)
    return mockUser
  }

  const logout = async () => {
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}