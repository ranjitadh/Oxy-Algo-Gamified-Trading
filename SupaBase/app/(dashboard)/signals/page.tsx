'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { RealtimeChannel } from '@supabase/supabase-js'

export default function SignalsPage() {
  const [user, setUser] = useState<any>(null)
  const [signals, setSignals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'DAILY' | 'WEEKLY'>('ALL')
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    if (!user) return

    let channel: RealtimeChannel | null = null

    const fetchSignals = async () => {
      let query = supabase
        .from('signals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (filter !== 'ALL') {
        query = query.eq('signal_type', filter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching signals:', error)
      } else {
        setSignals(data || [])
      }
      setLoading(false)
    }

    fetchSignals()

    channel = supabase
      .channel('signals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'signals',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          await fetchSignals()
        }
      )
      .subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user, filter, supabase])

  const getDirectionColor = (direction: string) => {
    return direction === 'BUY' ? 'text-green-400' : 'text-red-400'
  }

  const getConfidenceColor = (score: number | null) => {
    if (!score) return 'text-gray-400'
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading signals...</div>
      </div>
    )
  }

  const filteredSignals = filter === 'ALL' ? signals : signals.filter((s) => s.signal_type === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Signals</h1>
          <p className="mt-1 text-sm text-gray-400">Daily and weekly trading signals</p>
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
            onClick={() => setFilter('DAILY')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'DAILY'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setFilter('WEEKLY')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'WEEKLY'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSignals.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            No signals found
          </div>
        ) : (
          filteredSignals.map((signal) => (
            <div key={signal.id} className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-white">{signal.symbol}</span>
                  <span className={`text-sm font-medium ${getDirectionColor(signal.direction)}`}>
                    {signal.direction}
                  </span>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded bg-gray-700 text-gray-300">
                  {signal.signal_type}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Entry:</span>
                  <span className="text-white font-medium">{signal.entry_price?.toFixed(5)}</span>
                </div>
                {signal.take_profit && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Take Profit:</span>
                    <span className="text-green-400 font-medium">{signal.take_profit.toFixed(5)}</span>
                  </div>
                )}
                {signal.stop_loss && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Stop Loss:</span>
                    <span className="text-red-400 font-medium">{signal.stop_loss.toFixed(5)}</span>
                  </div>
                )}
                {signal.confidence_score !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Confidence:</span>
                    <span className={`font-medium ${getConfidenceColor(signal.confidence_score)}`}>
                      {signal.confidence_score}%
                    </span>
                  </div>
                )}
              </div>

              {signal.notes && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-300">{signal.notes}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
                {format(new Date(signal.created_at), 'MMM dd, yyyy HH:mm')}
                {signal.expires_at && (
                  <span className="ml-2">
                    • Expires: {format(new Date(signal.expires_at), 'MMM dd, yyyy')}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


