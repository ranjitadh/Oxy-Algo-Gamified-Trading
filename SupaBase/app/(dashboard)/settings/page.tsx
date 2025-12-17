'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeAccount } from '@/hooks/useRealtimeAccount'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [notifications, setNotifications] = useState({
    email: true,
    alerts: true,
  })
  const supabase = createClient()

  const { account, loading: accountLoading } = useRealtimeAccount(user?.id || '')

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        setEmail(user.email || '')
      }
    }
    getUser()
  }, [supabase])

  const handleUpdateNotifications = async () => {
    // In a real app, you'd save this to a user_preferences table
    // For now, we'll just show a success message
    alert('Notification preferences saved!')
  }

  if (accountLoading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={user.id}
                disabled
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Created
              </label>
              <input
                type="text"
                value={new Date(user.created_at).toLocaleString()}
                disabled
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Trading Bot Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Bot Status</span>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                account?.bot_status
                  ? 'bg-green-900/50 text-green-300 border border-green-500'
                  : 'bg-red-900/50 text-red-300 border border-red-500'
              }`}>
                {account?.bot_status ? 'ON' : 'OFF'}
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Bot status is controlled via webhook from your trading system.
              Contact your administrator to change this setting.
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-medium">Email Notifications</label>
                <p className="text-sm text-gray-400">Receive email alerts for important events</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-medium">In-App Alerts</label>
                <p className="text-sm text-gray-400">Show alerts in the dashboard</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.alerts}
                onChange={(e) => setNotifications({ ...notifications, alerts: e.target.checked })}
                className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleUpdateNotifications}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Save Preferences
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Balance:</span>
              <span className="text-white font-medium">
                ${account?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current Equity:</span>
              <span className="text-white font-medium">
                ${account?.equity?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Account ID:</span>
              <span className="text-white font-mono text-sm">{account?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


