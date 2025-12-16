'use client'

import { useQuery } from '@tanstack/react-query'
import { TradeStoryCard } from '@/components/TradeStoryCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { Trade } from '@/shared-types'

export default function HistoryPage() {
  const { data: trades, isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const response = await api.get('/trades')
      return response.data as Trade[]
    },
  })

  const { data: stats } = useQuery({
    queryKey: ['trades', 'stats'],
    queryFn: async () => {
      const response = await api.get('/trades/stats')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading trade history...</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trade History</h1>
        <p className="text-gray-600 mt-2">Learn while you earn - review your trading outcomes</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.winRate?.toFixed(1) || 0}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.wins || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${stats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.totalPnl >= 0 ? '+' : ''}{stats.totalPnl?.toFixed(2) || 0}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        {trades && trades.length > 0 ? (
          trades.map((trade) => <TradeStoryCard key={trade.id} trade={trade} />)
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No trades yet. Start trading to see your history here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

