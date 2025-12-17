'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeAccount } from '@/hooks/useRealtimeAccount'
import { useRealtimeTrades } from '@/hooks/useRealtimeTrades'
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
          // Redirect to login if no user
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
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 mb-4">Not authenticated</div>
          <a href="/login" className="text-blue-400 hover:text-blue-300 underline">
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Real-time trading overview</p>
        <p className="mt-1 text-xs text-gray-500">Logged in as: {user?.email}</p>
      </div>

      {accountLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Loading account data...</div>
        </div>
      ) : !account ? (
        <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-4">
          <p className="text-yellow-200 mb-2">Account record not found</p>
          <p className="text-yellow-300 text-sm">
            Your account is being created. This may take a few moments. Please refresh the page.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-white">
                    ${account?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                  </div>
                  <div className="mt-1 text-sm text-gray-400">Balance</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-white">
                    ${account?.equity?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                  </div>
                  <div className="mt-1 text-sm text-gray-400">Equity</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-white">{winRate}%</div>
                  <div className="mt-1 text-sm text-gray-400">Win Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-white">{openTrades.length}</div>
                  <div className="mt-1 text-sm text-gray-400">Open Trades</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Equity & Balance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={equityHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    name="Equity"
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    name="Balance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Profit</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={profitHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Bot Status</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  account?.bot_status
                    ? 'bg-green-900/50 text-green-300 border border-green-500'
                    : 'bg-red-900/50 text-red-300 border border-red-500'
                }`}>
                  {account?.bot_status ? 'ON' : 'OFF'}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {account?.bot_status
                  ? 'Trading bot is active and monitoring markets'
                  : 'Trading bot is currently disabled'}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Trade Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Trades:</span>
                  <span className="text-white font-medium">{closedTrades.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Winning Trades:</span>
                  <span className="text-green-400 font-medium">{winningTrades.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Losing Trades:</span>
                  <span className="text-red-400 font-medium">
                    {closedTrades.length - winningTrades.length}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700">
                  <span className="text-gray-400">Total Profit:</span>
                  <span className={`font-medium ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
