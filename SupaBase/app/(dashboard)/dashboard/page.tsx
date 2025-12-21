'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeAccount } from '@/hooks/useRealtimeAccount'
import { useRealtimeTrades } from '@/hooks/useRealtimeTrades'
import Loading from '@/components/Loading'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [equityHistory, setEquityHistory] = useState<any[]>([])
  const [profitHistory, setProfitHistory] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        
        if (error) {
          console.error('Error getting user:', error)
          window.location.href = '/login'
          return
        }
        
        console.log('Dashboard: User loaded:', user?.email)
        setUser(user)
      } catch (err) {
        console.error('Exception getting user:', err)
        window.location.href = '/login'
      } finally {
        setUserLoading(false)
      }
    }
    getUser()
  }, [supabase])

  const { account, loading: accountLoading } = useRealtimeAccount(user?.id || '')
  const { trades, loading: tradesLoading } = useRealtimeTrades(user?.id || '', account?.id)

  useEffect(() => {
    if (!account) return

    const history = equityHistory.length > 0 ? equityHistory : []
    const newEntry = {
      time: new Date().toLocaleTimeString(),
      equity: account.equity,
      balance: account.balance,
    }

    if (history.length === 0 || history[history.length - 1].equity !== account.equity) {
      const updated = [...history, newEntry].slice(-50)
      setEquityHistory(updated)
    }
  }, [account?.equity, account?.balance])

  useEffect(() => {
    if (!trades || trades.length === 0) return

    const closedTrades = trades.filter((t: any) => t.status === 'CLOSED')
    const dailyProfit = closedTrades.reduce((acc: number, trade: any) => {
      const tradeDate = new Date(trade.closed_at || trade.opened_at).toDateString()
      const today = new Date().toDateString()
      if (tradeDate === today) {
        return acc + (trade.profit || 0)
      }
      return acc
    }, 0)

    const history = profitHistory.length > 0 ? profitHistory : []
    const newEntry = {
      time: new Date().toLocaleTimeString(),
      profit: dailyProfit,
    }

    if (history.length === 0 || history[history.length - 1].profit !== dailyProfit) {
      const updated = [...history, newEntry].slice(-50)
      setProfitHistory(updated)
    }
  }, [trades])

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-neon-purple rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center glass-strong rounded-2xl p-8 border border-red-500/30">
          <div className="text-red-400 neon-text mb-4 text-xl">Not authenticated</div>
          <a href="/login" className="text-neon-cyan hover:text-neon-blue underline transition-colors">
            Go to login
          </a>
        </div>
      </div>
    )
  }

  const closedTrades = trades.filter((t: any) => t.status === 'CLOSED')
  const openTrades = trades.filter((t: any) => t.status === 'OPEN')
  const winningTrades = closedTrades.filter((t: any) => (t.profit || 0) > 0)
  const winRate =
    closedTrades.length > 0 ? ((winningTrades.length / closedTrades.length) * 100).toFixed(1) : '0.0'

  const totalProfit = closedTrades.reduce((sum: number, t: any) => sum + (t.profit || 0), 0)

  // Custom chart colors with neon theme
  const chartColors = {
    equity: '#00ffff',
    balance: '#00ff88',
    profit: '#b026ff',
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-neon neon-text mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400 text-lg">Real-time trading overview</p>
        <p className="text-gray-500 text-sm mt-1">Logged in as: {user?.email}</p>
      </div>

      {accountLoading ? (
        <Loading size="lg" message="Loading account data..." />
      ) : !account ? (
        <div className="glass-strong rounded-2xl p-6 border border-yellow-500/30 shadow-neon-green relative overflow-hidden">
          <div className="liquid-crystal absolute inset-0 opacity-20"></div>
          <div className="relative z-10">
            <p className="text-yellow-300 neon-text mb-2 text-lg font-semibold">Account record not found</p>
            <p className="text-yellow-400 text-sm">
              Your account is being created. This may take a few moments. Please refresh the page.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Balance Card */}
            <div className="group relative glass-strong rounded-2xl p-6 border border-neon-cyan/30 shadow-neon-cyan hover:shadow-neon-cyan hover:border-neon-cyan transition-all duration-300 animate-fade-in overflow-hidden">
              <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-400 text-sm font-medium">Balance</div>
                  <div className="w-10 h-10 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                    <span className="text-neon-cyan text-xl">💰</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue neon-text">
                  ${account?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </div>
              </div>
            </div>

            {/* Equity Card */}
            <div className="group relative glass-strong rounded-2xl p-6 border border-neon-green/30 shadow-neon-green hover:shadow-neon-green hover:border-neon-green transition-all duration-300 animate-fade-in-delay overflow-hidden">
              <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-400 text-sm font-medium">Equity</div>
                  <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center">
                    <span className="text-neon-green text-xl">📈</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-cyan neon-text">
                  ${account?.equity?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </div>
              </div>
            </div>

            {/* Win Rate Card */}
            <div className="group relative glass-strong rounded-2xl p-6 border border-neon-purple/30 shadow-neon-purple hover:shadow-neon-purple hover:border-neon-purple transition-all duration-300 animate-fade-in-delay overflow-hidden" style={{ animationDelay: '0.4s' }}>
              <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-400 text-sm font-medium">Win Rate</div>
                  <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                    <span className="text-neon-purple text-xl">🎯</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink neon-text">
                  {winRate}%
                </div>
              </div>
            </div>

            {/* Open Trades Card */}
            <div className="group relative glass-strong rounded-2xl p-6 border border-neon-pink/30 shadow-neon-pink hover:shadow-neon-pink hover:border-neon-pink transition-all duration-300 animate-fade-in-delay overflow-hidden" style={{ animationDelay: '0.6s' }}>
              <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-400 text-sm font-medium">Open Trades</div>
                  <div className="w-10 h-10 rounded-lg bg-neon-pink/20 flex items-center justify-center">
                    <span className="text-neon-pink text-xl">⚡</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple neon-text">
                  {openTrades.length}
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Equity & Balance Chart */}
            <div className="glass-strong rounded-2xl p-6 border border-neon-cyan/20 shadow-glow-lg hover:border-neon-cyan/40 transition-all duration-300 relative overflow-hidden">
              <div className="liquid-crystal absolute inset-0 opacity-5"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue mb-4 neon-text">
                  Equity & Balance
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={equityHistory}>
                    <defs>
                      <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.equity} stopOpacity={0.5}/>
                        <stop offset="95%" stopColor={chartColors.equity} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.balance} stopOpacity={0.5}/>
                        <stop offset="95%" stopColor={chartColors.balance} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                        border: '1px solid rgba(0, 255, 255, 0.3)', 
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)'
                      }}
                      labelStyle={{ color: '#00ffff', fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ color: '#9ca3af' }} />
                    <Area
                      type="monotone"
                      dataKey="equity"
                      stroke={chartColors.equity}
                      fill="url(#equityGradient)"
                      strokeWidth={2}
                      name="Equity"
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke={chartColors.balance}
                      fill="url(#balanceGradient)"
                      strokeWidth={2}
                      name="Balance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Profit Chart */}
            <div className="glass-strong rounded-2xl p-6 border border-neon-purple/20 shadow-glow-lg hover:border-neon-purple/40 transition-all duration-300 relative overflow-hidden">
              <div className="liquid-crystal absolute inset-0 opacity-5"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink mb-4 neon-text">
                  Profit
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={profitHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                        border: '1px solid rgba(176, 38, 255, 0.3)', 
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)'
                      }}
                      labelStyle={{ color: '#b026ff', fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ color: '#9ca3af' }} />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke={chartColors.profit}
                      strokeWidth={3}
                      dot={{ fill: chartColors.profit, r: 4 }}
                      activeDot={{ r: 6, fill: chartColors.profit }}
                      name="Profit"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Bot Status */}
            <div className="glass-strong rounded-2xl p-6 border border-neon-green/20 shadow-glow-lg hover:border-neon-green/40 transition-all duration-300 relative overflow-hidden">
              <div className="liquid-crystal absolute inset-0 opacity-5"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-cyan neon-text">
                    Bot Status
                  </h2>
                  <div className={`px-4 py-2 rounded-full text-sm font-bold neon-text animate-glow ${
                    account?.bot_status
                      ? 'bg-green-900/30 text-neon-green border border-neon-green shadow-neon-green'
                      : 'bg-red-900/30 text-red-400 border border-red-500/50 shadow-neon-pink'
                  }`}>
                    {account?.bot_status ? 'ONLINE' : 'OFFLINE'}
                  </div>
                </div>
                <div className="text-gray-300 text-sm">
                  {account?.bot_status
                    ? '🤖 Trading bot is active and monitoring markets'
                    : '⚠️ Trading bot is currently disabled'}
                </div>
              </div>
            </div>

            {/* Trade Summary */}
            <div className="glass-strong rounded-2xl p-6 border border-neon-blue/20 shadow-glow-lg hover:border-neon-blue/40 transition-all duration-300 relative overflow-hidden">
              <div className="liquid-crystal absolute inset-0 opacity-5"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-cyan mb-4 neon-text">
                  Trade Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">Total Trades:</span>
                    <span className="text-white font-bold text-lg">{closedTrades.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">Winning Trades:</span>
                    <span className="text-neon-green font-bold text-lg neon-text">{winningTrades.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400">Losing Trades:</span>
                    <span className="text-red-400 font-bold text-lg">{closedTrades.length - winningTrades.length}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t-2 border-neon-purple/30">
                    <span className="text-gray-300 font-semibold">Total Profit:</span>
                    <span className={`font-bold text-xl neon-text ${totalProfit >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                      ${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
