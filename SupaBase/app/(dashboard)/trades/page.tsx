'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeTrades } from '@/hooks/useRealtimeTrades'
import ScreenshotModal from '@/components/ScreenshotModal'
import Loading from '@/components/Loading'
import { format } from 'date-fns'

export default function TradesPage() {
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL')
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: accountData } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setAccount(accountData)
      }
    }
    getUser()
  }, [supabase])

  const { trades, loading } = useRealtimeTrades(user?.id || '', account?.id)

  const filteredTrades = trades.filter((trade: any) => {
    if (filter === 'ALL') return true
    return trade.status === filter
  })

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-neon-green'
    if (profit < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  const getProfitBgColor = (profit: number) => {
    if (profit > 0) return 'bg-green-900/20 border-green-500/30'
    if (profit < 0) return 'bg-red-900/20 border-red-500/30'
    return 'bg-gray-800/20 border-gray-600/30'
  }

  const getDirectionColor = (direction: string) => {
    return direction === 'BUY' ? 'text-neon-green' : 'text-red-400'
  }

  const getDirectionBg = (direction: string) => {
    return direction === 'BUY' 
      ? 'bg-green-900/30 border-green-500/40' 
      : 'bg-red-900/30 border-red-500/40'
  }

  if (loading || !user) {
    return <Loading size="lg" variant="cube" message="Loading trades..." />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-neon neon-text mb-2">
            Trades
          </h1>
          <p className="text-gray-400 text-lg">View all your trading activity</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
              filter === 'ALL'
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-purple border border-neon-purple/50'
                : 'glass text-gray-300 hover:text-white border border-gray-700/50 hover:border-neon-cyan/30'
            }`}
          >
            <span className="relative z-10">All</span>
            {filter === 'ALL' && (
              <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
          <button
            onClick={() => setFilter('OPEN')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
              filter === 'OPEN'
                ? 'bg-gradient-to-r from-neon-green to-neon-cyan text-white shadow-neon-green border border-neon-green/50'
                : 'glass text-gray-300 hover:text-white border border-gray-700/50 hover:border-neon-green/30'
            }`}
          >
            <span className="relative z-10">Open</span>
            {filter === 'OPEN' && (
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
          <button
            onClick={() => setFilter('CLOSED')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
              filter === 'CLOSED'
                ? 'bg-gradient-to-r from-neon-blue to-neon-cyan text-white shadow-neon-blue border border-neon-blue/50'
                : 'glass text-gray-300 hover:text-white border border-gray-700/50 hover:border-neon-blue/30'
            }`}
          >
            <span className="relative z-10">Closed</span>
            {filter === 'CLOSED' && (
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
        </div>
      </div>

      {/* Trades Table */}
      <div className="group relative glass-strong rounded-2xl border border-neon-cyan/20 shadow-glow-lg overflow-hidden">
        <div className="liquid-crystal absolute inset-0 opacity-5"></div>
        <div className="relative z-10 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700/50">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-neon-cyan/20">
                  Symbol
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-neon-cyan/20">
                  Direction
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-neon-cyan/20">
                  Entry Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-neon-cyan/20">
                  Exit Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-neon-cyan/20">
                  Lot Size
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-neon-cyan/20">
                  Profit/Loss
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-neon-cyan/20">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-neon-cyan/20">
                  Screenshot
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-neon-cyan/20">
                  Opened
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-4xl mb-4">📊</div>
                      <div className="text-gray-400 text-lg font-medium">No trades found</div>
                      <div className="text-gray-500 text-sm mt-2">Start trading to see your activity here</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade: any, index: number) => (
                  <tr 
                    key={trade.id} 
                    className="hover:bg-gray-800/40 transition-all duration-200 border-l-4 border-transparent hover:border-neon-cyan/50 group/row"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-white group-hover/row:text-neon-cyan transition-colors">
                        {trade.symbol}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${getDirectionBg(trade.direction)} ${getDirectionColor(trade.direction)}`}>
                        {trade.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 font-mono">
                        {trade.entry_price?.toFixed(5)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 font-mono">
                        {trade.exit_price ? trade.exit_price.toFixed(5) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 font-medium">
                        {trade.lot_size}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold border ${getProfitBgColor(trade.profit || 0)} ${getProfitColor(trade.profit || 0)}`}>
                        ${(trade.profit || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${
                          trade.status === 'OPEN'
                            ? 'bg-green-900/30 text-neon-green border-green-500/40 shadow-neon-green'
                            : trade.status === 'CLOSED'
                            ? 'bg-gray-700/50 text-gray-300 border-gray-600/40'
                            : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/40'
                        }`}
                      >
                        {trade.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {trade.screenshots && trade.screenshots.length > 0 ? (
                        <button
                          onClick={() => setSelectedScreenshot(trade.screenshots[0].storage_path)}
                          className="px-3 py-1.5 text-sm font-medium text-neon-cyan hover:text-white bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 hover:border-neon-cyan rounded-lg transition-all duration-300"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {format(new Date(trade.opened_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Comments Section */}
      {filteredTrades.some((t: any) => t.ai_comment) && (
        <div className="group relative glass-strong rounded-2xl p-6 border border-neon-purple/30 shadow-neon-purple hover:border-neon-purple/50 transition-all duration-300 overflow-hidden">
          <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center mr-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink neon-text">
                AI Comments
              </h2>
            </div>
            <div className="space-y-4">
              {filteredTrades
                .filter((t: any) => t.ai_comment)
                .map((trade: any, index: number) => (
                  <div 
                    key={trade.id} 
                    className="glass rounded-lg p-4 border-l-4 border-neon-purple/50 hover:border-neon-purple hover:bg-neon-purple/5 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center mb-2">
                      <div className="text-sm font-medium text-gray-400 mr-2">
                        {trade.symbol}
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${getDirectionBg(trade.direction)} ${getDirectionColor(trade.direction)}`}>
                        {trade.direction}
                      </span>
                      <div className={`ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${getProfitBgColor(trade.profit || 0)} ${getProfitColor(trade.profit || 0)}`}>
                        ${(trade.profit || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="text-white text-sm leading-relaxed">{trade.ai_comment}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {selectedScreenshot && (
        <ScreenshotModal
          storagePath={selectedScreenshot}
          isOpen={!!selectedScreenshot}
          onClose={() => setSelectedScreenshot(null)}
        />
      )}
    </div>
  )
}
