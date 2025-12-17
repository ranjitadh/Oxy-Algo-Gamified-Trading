'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeTrades } from '@/hooks/useRealtimeTrades'
import ScreenshotModal from '@/components/ScreenshotModal'
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
    if (profit > 0) return 'text-green-400'
    if (profit < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  const getDirectionColor = (direction: string) => {
    return direction === 'BUY' ? 'text-green-400' : 'text-red-400'
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading trades...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Trades</h1>
          <p className="mt-1 text-sm text-gray-400">View all your trading activity</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('OPEN')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'OPEN'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setFilter('CLOSED')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'CLOSED'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Closed
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Direction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Entry Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Exit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Lot Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Profit/Loss
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Screenshot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Opened
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-400">
                    No trades found
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade: any) => (
                  <tr key={trade.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {trade.symbol}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getDirectionColor(trade.direction)}`}>
                      {trade.direction}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.entry_price?.toFixed(5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.exit_price ? trade.exit_price.toFixed(5) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.lot_size}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getProfitColor(trade.profit || 0)}`}>
                      ${(trade.profit || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          trade.status === 'OPEN'
                            ? 'bg-green-900/50 text-green-300'
                            : trade.status === 'CLOSED'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-yellow-900/50 text-yellow-300'
                        }`}
                      >
                        {trade.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.screenshots && trade.screenshots.length > 0 ? (
                        <button
                          onClick={() => setSelectedScreenshot(trade.screenshots[0].storage_path)}
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          View
                        </button>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {format(new Date(trade.opened_at), 'MMM dd, yyyy HH:mm')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTrades.some((t: any) => t.ai_comment) && (
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-4">AI Comments</h2>
          <div className="space-y-4">
            {filteredTrades
              .filter((t: any) => t.ai_comment)
              .map((trade: any) => (
                <div key={trade.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="text-sm text-gray-400 mb-1">
                    {trade.symbol} - {trade.direction}
                  </div>
                  <div className="text-white">{trade.ai_comment}</div>
                </div>
              ))}
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


