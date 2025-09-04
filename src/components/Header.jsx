import React from 'react'
import { Bell, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-dark-surface border-b border-dark-surface-light px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Dashboard</h1>
          <p className="text-dark-text-secondary">Welcome back, {user?.email}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-dark-text-secondary hover:text-dark-text cursor-pointer" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <button
              onClick={logout}
              className="text-dark-text-secondary hover:text-dark-text text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header