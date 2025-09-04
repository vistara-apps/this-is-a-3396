import React, { useState } from 'react'
import { User, Bell, CreditCard, Link as LinkIcon, Shield } from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'My E-commerce Store'
    },
    notifications: {
      emailUpdates: true,
      performanceAlerts: true,
      weeklyReports: false
    },
    socialAccounts: {
      instagram: false,
      tiktok: false,
      farcaster: true
    }
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'social', label: 'Social Accounts', icon: LinkIcon },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark-text">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface-light border border-dark-surface-light rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface-light border border-dark-surface-light rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Company/Store Name
                </label>
                <input
                  type="text"
                  value={settings.profile.company}
                  onChange={(e) => updateSetting('profile', 'company', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface-light border border-dark-surface-light rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark-text">Notification Preferences</h3>
            
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-dark-surface-light rounded-lg">
                  <div>
                    <h4 className="text-dark-text font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-dark-text-secondary text-sm">
                      Get notified about important updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark-text">Billing & Subscription</h3>
            
            <div className="bg-dark-surface-light rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-dark-text font-medium">Pro Plan</h4>
                  <p className="text-dark-text-secondary text-sm">$49/month</p>
                </div>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Active</span>
              </div>
              
              <div className="space-y-2 text-sm text-dark-text-secondary">
                <p>• Unlimited ad generations</p>
                <p>• 50 auto-posts per month</p>
                <p>• Advanced analytics</p>
                <p>• Priority support</p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button className="bg-dark-surface text-dark-text px-4 py-2 rounded-lg hover:bg-dark-surface-light transition-colors">
                  Change Plan
                </button>
                <button className="text-red-500 hover:text-red-400 px-4 py-2">
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        )

      case 'social':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark-text">Connected Social Accounts</h3>
            
            <div className="space-y-4">
              {Object.entries(settings.socialAccounts).map(([platform, connected]) => (
                <div key={platform} className="flex items-center justify-between p-4 bg-dark-surface-light rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-dark-text font-medium capitalize">{platform}</h4>
                      <p className="text-dark-text-secondary text-sm">
                        {connected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('socialAccounts', platform, !connected)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      connected
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark-text">Security Settings</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-dark-surface-light rounded-lg">
                <h4 className="text-dark-text font-medium mb-2">Change Password</h4>
                <p className="text-dark-text-secondary text-sm mb-4">
                  Update your password to keep your account secure
                </p>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Change Password
                </button>
              </div>

              <div className="p-4 bg-dark-surface-light rounded-lg">
                <h4 className="text-dark-text font-medium mb-2">Two-Factor Authentication</h4>
                <p className="text-dark-text-secondary text-sm mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text mb-2">Settings</h1>
        <p className="text-dark-text-secondary">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-dark-text hover:bg-dark-surface-light'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-dark-surface rounded-lg p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default Settings