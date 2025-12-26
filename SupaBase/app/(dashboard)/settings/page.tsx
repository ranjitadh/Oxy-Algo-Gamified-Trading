'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeAccount } from '@/hooks/useRealtimeAccount'
import Loading from '@/components/Loading'

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
    return <Loading size="lg" variant="cube" message="Loading settings..." />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-neon neon-text mb-2">
          Settings
        </h1>
        <p className="text-gray-400 text-lg">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Account Information Card */}
        <div className="group relative glass-strong rounded-2xl p-6 border border-neon-cyan/30 shadow-neon-cyan hover:shadow-neon-cyan hover:border-neon-cyan transition-all duration-300 animate-fade-in overflow-hidden">
          <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center mr-4">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue neon-text">
                Account Information
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 glass rounded-lg text-white border border-neon-cyan/20 focus:border-neon-cyan focus:shadow-neon-cyan transition-all duration-300 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={user.id}
                  disabled
                  className="w-full px-4 py-3 glass rounded-lg text-white font-mono text-sm border border-neon-cyan/20 focus:border-neon-cyan focus:shadow-neon-cyan transition-all duration-300 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Created
                </label>
                <input
                  type="text"
                  value={new Date(user.created_at).toLocaleString()}
                  disabled
                  className="w-full px-4 py-3 glass rounded-lg text-white border border-neon-cyan/20 focus:border-neon-cyan focus:shadow-neon-cyan transition-all duration-300 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trading Agent Control Card */}
        <div className="group relative glass-strong rounded-2xl p-6 border border-neon-purple/30 shadow-neon-purple hover:shadow-neon-purple hover:border-neon-purple transition-all duration-300 animate-fade-in-delay overflow-hidden">
          <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center mr-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink neon-text">
                Trading Agent Control
              </h2>
            </div>
            <form className="space-y-4" onSubmit={handleTradingControl}>
              {tradingError && (
                <div className="glass rounded-lg p-3 border border-red-500/50 text-red-300 neon-text text-sm bg-red-900/20">
                  {tradingError}
                </div>
              )}
              {tradingMessage && (
                <div className="glass rounded-lg p-3 border border-neon-green/50 text-neon-green neon-text text-sm bg-green-900/20">
                  {tradingMessage}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Action
                </label>
                <div className="flex items-center space-x-6">
                  <label className="inline-flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      className="w-5 h-5 text-neon-cyan bg-gray-700 border-gray-600 focus:ring-neon-cyan focus:ring-2 cursor-pointer"
                      checked={tradingAction === 'start'}
                      onChange={() => setTradingAction('start')}
                    />
                    <span className="ml-3 text-gray-300 group-hover:text-neon-cyan transition-colors">Start Trading Agent</span>
                  </label>
                  <label className="inline-flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      className="w-5 h-5 text-neon-purple bg-gray-700 border-gray-600 focus:ring-neon-purple focus:ring-2 cursor-pointer"
                      checked={tradingAction === 'stop'}
                      onChange={() => setTradingAction('stop')}
                    />
                    <span className="ml-3 text-gray-300 group-hover:text-neon-purple transition-colors">Stop Trading Agent</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Symbols (optional)
                </label>
                <input
                  type="text"
                  value={tradingSymbols}
                  onChange={(e) => setTradingSymbols(e.target.value)}
                  placeholder="e.g. BTCUSDT, XAUUSD (comma separated)"
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 border border-neon-purple/20 focus:border-neon-purple focus:shadow-neon-purple focus:outline-none transition-all duration-300"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Leave empty to control the global agent, or provide one or more symbols.
                </p>
              </div>
              <button
                type="submit"
                disabled={tradingLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-neon-purple to-neon-pink text-white rounded-lg font-bold hover:shadow-neon-purple disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group shadow-lg"
              >
                <span className="relative z-10 flex items-center justify-center text-white font-bold drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]">
                  {tradingLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                      Sending command...
                    </>
                  ) : (
                    'Send Trading Command'
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          </div>
        </div>

        {/* Request Market Analysis Card */}
        <div className="group relative glass-strong rounded-2xl p-6 border border-neon-blue/30 shadow-neon-blue hover:shadow-neon-blue hover:border-neon-blue transition-all duration-300 animate-fade-in-delay overflow-hidden" style={{ animationDelay: '0.4s' }}>
          <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center mr-4">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-cyan neon-text">
                Request Market Analysis
              </h2>
            </div>
            <form className="space-y-4" onSubmit={handleAnalysisRequest}>
              {analysisError && (
                <div className="glass rounded-lg p-3 border border-red-500/50 text-red-300 neon-text text-sm bg-red-900/20">
                  {analysisError}
                </div>
              )}
              {analysisMessage && (
                <div className="glass rounded-lg p-3 border border-neon-green/50 text-neon-green neon-text text-sm bg-green-900/20">
                  {analysisMessage}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Symbol
                </label>
                <input
                  type="text"
                  value={analysisSymbol}
                  onChange={(e) => setAnalysisSymbol(e.target.value)}
                  placeholder="e.g. BTCUSDT"
                  required
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 border border-neon-blue/20 focus:border-neon-blue focus:shadow-neon-blue focus:outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeframe (optional)
                </label>
                <input
                  type="text"
                  value={analysisTimeframe}
                  onChange={(e) => setAnalysisTimeframe(e.target.value)}
                  placeholder="e.g. 1h, 4h, 1d"
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 border border-neon-blue/20 focus:border-neon-blue focus:shadow-neon-blue focus:outline-none transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                disabled={analysisLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan text-white rounded-lg font-bold hover:shadow-neon-blue disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group shadow-lg"
              >
                <span className="relative z-10 flex items-center justify-center text-white font-bold drop-shadow-[0_0_8px_rgba(0,150,255,0.8)]">
                  {analysisLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                      Requesting analysis...
                    </>
                  ) : (
                    'Request Analysis'
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          </div>
        </div>

        {/* Telegram AI Assistant Card */}
        <div className="group relative glass-strong rounded-2xl p-6 border border-neon-green/30 shadow-neon-green hover:shadow-neon-green hover:border-neon-green transition-all duration-300 animate-fade-in-delay overflow-hidden" style={{ animationDelay: '0.6s' }}>
          <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-neon-green/20 flex items-center justify-center mr-4">
                <span className="text-2xl">💬</span>
              </div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-cyan neon-text">
                Telegram AI Assistant
              </h2>
            </div>
            <form className="space-y-4" onSubmit={handleTelegramSend}>
              {telegramError && (
                <div className="glass rounded-lg p-3 border border-red-500/50 text-red-300 neon-text text-sm bg-red-900/20">
                  {telegramError}
                </div>
              )}
              {telegramStatus && (
                <div className="glass rounded-lg p-3 border border-neon-green/50 text-neon-green neon-text text-sm bg-green-900/20">
                  {telegramStatus}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={telegramMessage}
                  onChange={(e) => setTelegramMessage(e.target.value)}
                  placeholder="Ask the Telegram assistant anything about your trading..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 border border-neon-green/20 focus:border-neon-green focus:shadow-neon-green focus:outline-none transition-all duration-300 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Chat ID (optional)
                </label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="Override default chat id if needed"
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 border border-neon-green/20 focus:border-neon-green focus:shadow-neon-green focus:outline-none transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                disabled={telegramLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-neon-green to-neon-cyan text-white rounded-lg font-bold hover:shadow-neon-green disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group shadow-lg"
              >
                <span className="relative z-10 flex items-center justify-center text-white font-bold drop-shadow-[0_0_8px_rgba(0,255,136,0.8)]">
                  {telegramLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    'Send to Telegram Assistant'
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          </div>
        </div>

        {/* Trading Bot Status Card */}
        <div className="group relative glass-strong rounded-2xl p-6 border border-neon-pink/30 shadow-neon-pink hover:shadow-neon-pink hover:border-neon-pink transition-all duration-300 animate-fade-in-delay overflow-hidden" style={{ animationDelay: '0.8s' }}>
          <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple neon-text">
                Trading Bot Status
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass rounded-lg border border-neon-pink/20">
                <span className="text-gray-300 font-medium">Bot Status</span>
                <div className={`px-4 py-2 rounded-full text-sm font-bold neon-text animate-glow ${
                  account?.bot_status
                    ? 'bg-green-900/30 text-neon-green border border-neon-green shadow-neon-green'
                    : 'bg-red-900/30 text-red-400 border border-red-500/50 shadow-neon-pink'
                }`}>
                  {account?.bot_status ? 'ONLINE' : 'OFFLINE'}
                </div>
              </div>
              <div className="text-sm text-gray-400 p-4 glass rounded-lg border border-gray-700/30">
                Bot status is controlled via webhook from your trading system.
                Contact your administrator to change this setting.
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences Card */}
        <div className="group relative glass-strong rounded-2xl p-6 border border-neon-cyan/30 shadow-neon-cyan hover:shadow-neon-cyan hover:border-neon-cyan transition-all duration-300 animate-fade-in-delay overflow-hidden" style={{ animationDelay: '1s' }}>
          <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center mr-4">
                <span className="text-2xl">🔔</span>
              </div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue neon-text">
                Notification Preferences
              </h2>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 glass rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">Email Notifications</label>
                  <p className="text-sm text-gray-400">Receive email alerts for important events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-700 border border-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-cyan/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:shadow-neon-cyan after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-400 after:border-2 after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-neon-cyan peer-checked:to-neon-blue peer-checked:border-neon-cyan"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 glass rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300">
                <div>
                  <label className="text-gray-300 font-medium block mb-1">In-App Alerts</label>
                  <p className="text-sm text-gray-400">Show alerts in the dashboard</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.alerts}
                    onChange={(e) => setNotifications({ ...notifications, alerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-700 border border-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-cyan/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:shadow-neon-cyan after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-400 after:border-2 after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-neon-cyan peer-checked:to-neon-blue peer-checked:border-neon-cyan"></div>
                </label>
              </div>
              <button
                onClick={handleUpdateNotifications}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-white rounded-lg font-bold hover:shadow-neon-cyan transition-all duration-300 relative overflow-hidden group shadow-lg"
              >
                <span className="relative z-10 text-white font-bold drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">Save Preferences</span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Account Statistics Card */}
        <div className="group relative glass-strong rounded-2xl p-6 border border-neon-purple/30 shadow-neon-purple hover:shadow-neon-purple hover:border-neon-purple transition-all duration-300 animate-fade-in-delay overflow-hidden" style={{ animationDelay: '1.2s' }}>
          <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center mr-4">
                <span className="text-2xl">📈</span>
              </div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink neon-text">
                Account Statistics
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 glass rounded-lg border border-neon-purple/20 hover:border-neon-purple/40 transition-all duration-300">
                <span className="text-gray-400 font-medium">Current Balance:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue font-bold text-lg neon-text">
                  ${account?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 glass rounded-lg border border-neon-purple/20 hover:border-neon-purple/40 transition-all duration-300">
                <span className="text-gray-400 font-medium">Current Equity:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-cyan font-bold text-lg neon-text">
                  ${account?.equity?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 glass rounded-lg border border-neon-purple/20 hover:border-neon-purple/40 transition-all duration-300">
                <span className="text-gray-400 font-medium">Account ID:</span>
                <span className="text-white font-mono text-sm">{account?.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
