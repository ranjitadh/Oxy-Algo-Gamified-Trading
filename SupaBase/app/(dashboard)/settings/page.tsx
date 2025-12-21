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
  const [tradingAction, setTradingAction] = useState<'start' | 'stop'>('start')
  const [tradingSymbols, setTradingSymbols] = useState('')
  const [tradingLoading, setTradingLoading] = useState(false)
  const [tradingMessage, setTradingMessage] = useState<string | null>(null)
  const [tradingError, setTradingError] = useState<string | null>(null)

  const [analysisSymbol, setAnalysisSymbol] = useState('')
  const [analysisTimeframe, setAnalysisTimeframe] = useState('')
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const [telegramMessage, setTelegramMessage] = useState('')
  const [telegramChatId, setTelegramChatId] = useState('')
  const [telegramLoading, setTelegramLoading] = useState(false)
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null)
  const [telegramError, setTelegramError] = useState<string | null>(null)
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

  const handleTradingControl = async (e: React.FormEvent) => {
    e.preventDefault()
    setTradingLoading(true)
    setTradingError(null)
    setTradingMessage(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Not authenticated. Please log in again.')
      }

      const symbolsList = tradingSymbols
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      const payload: any = {
        action: tradingAction,
      }

      if (symbolsList.length === 1) {
        payload.symbol = symbolsList[0]
      } else if (symbolsList.length > 1) {
        payload.symbols = symbolsList
      }

      const res = await fetch('/api/control/trading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send trading command')
      }

      setTradingMessage('Trading command sent successfully.')
    } catch (err: any) {
      setTradingError(err.message || 'Failed to send trading command')
    } finally {
      setTradingLoading(false)
    }
  }

  const handleAnalysisRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setAnalysisLoading(true)
    setAnalysisError(null)
    setAnalysisMessage(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Not authenticated. Please log in again.')
      }

      const payload: any = {
        action: 'analysis',
        symbol: analysisSymbol,
      }

      if (analysisTimeframe) {
        payload.timeframe = analysisTimeframe
      }

      const res = await fetch('/api/control/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to request analysis')
      }

      setAnalysisMessage('Analysis request sent successfully.')
    } catch (err: any) {
      setAnalysisError(err.message || 'Failed to request analysis')
    } finally {
      setAnalysisLoading(false)
    }
  }

  const handleTelegramSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setTelegramLoading(true)
    setTelegramError(null)
    setTelegramStatus(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Not authenticated. Please log in again.')
      }

      const payload: any = {
        action: 'send_message',
        message: telegramMessage,
      }

      if (telegramChatId) {
        payload.chat_id = telegramChatId
      }

      const res = await fetch('/api/control/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send Telegram message')
      }

      setTelegramStatus('Message sent to Telegram assistant.')
    } catch (err: any) {
      setTelegramError(err.message || 'Failed to send Telegram message')
    } finally {
      setTelegramLoading(false)
    }
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
          <h2 className="text-lg font-semibold text-white mb-4">Trading Agent Control</h2>
          <form className="space-y-4" onSubmit={handleTradingControl}>
            {tradingError && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 rounded text-sm">
                {tradingError}
              </div>
            )}
            {tradingMessage && (
              <div className="bg-green-900/40 border border-green-500 text-green-200 px-3 py-2 rounded text-sm">
                {tradingMessage}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Action
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center text-sm text-gray-300">
                  <input
                    type="radio"
                    className="mr-2"
                    checked={tradingAction === 'start'}
                    onChange={() => setTradingAction('start')}
                  />
                  Start Trading Agent
                </label>
                <label className="inline-flex items-center text-sm text-gray-300">
                  <input
                    type="radio"
                    className="mr-2"
                    checked={tradingAction === 'stop'}
                    onChange={() => setTradingAction('stop')}
                  />
                  Stop Trading Agent
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Symbols (optional)
              </label>
              <input
                type="text"
                value={tradingSymbols}
                onChange={(e) => setTradingSymbols(e.target.value)}
                placeholder="e.g. BTCUSDT, XAUUSD (comma separated)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to control the global agent, or provide one or more symbols.
              </p>
            </div>
            <button
              type="submit"
              disabled={tradingLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {tradingLoading ? 'Sending command...' : 'Send Trading Command'}
            </button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Request Market Analysis</h2>
          <form className="space-y-4" onSubmit={handleAnalysisRequest}>
            {analysisError && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 rounded text-sm">
                {analysisError}
              </div>
            )}
            {analysisMessage && (
              <div className="bg-green-900/40 border border-green-500 text-green-200 px-3 py-2 rounded text-sm">
                {analysisMessage}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Symbol
              </label>
              <input
                type="text"
                value={analysisSymbol}
                onChange={(e) => setAnalysisSymbol(e.target.value)}
                placeholder="e.g. BTCUSDT"
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Timeframe (optional)
              </label>
              <input
                type="text"
                value={analysisTimeframe}
                onChange={(e) => setAnalysisTimeframe(e.target.value)}
                placeholder="e.g. 1h, 4h, 1d"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={analysisLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {analysisLoading ? 'Requesting analysis...' : 'Request Analysis'}
            </button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Telegram AI Assistant</h2>
          <form className="space-y-4" onSubmit={handleTelegramSend}>
            {telegramError && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 rounded text-sm">
                {telegramError}
              </div>
            )}
            {telegramStatus && (
              <div className="bg-green-900/40 border border-green-500 text-green-200 px-3 py-2 rounded text-sm">
                {telegramStatus}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Message
              </label>
              <textarea
                value={telegramMessage}
                onChange={(e) => setTelegramMessage(e.target.value)}
                placeholder="Ask the Telegram assistant anything about your trading..."
                required
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Chat ID (optional)
              </label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="Override default chat id if needed"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={telegramLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {telegramLoading ? 'Sending...' : 'Send to Telegram Assistant'}
            </button>
          </form>
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



