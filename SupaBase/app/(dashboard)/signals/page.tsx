'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { RealtimeChannel } from '@supabase/supabase-js'
import Loading from '@/components/Loading'

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
    return direction === 'BUY' ? 'text-neon-green' : 'text-red-400'
  }

  const getDirectionBg = (direction: string) => {
    return direction === 'BUY' 
      ? 'bg-green-900/30 border-green-500/40' 
      : 'bg-red-900/30 border-red-500/40'
  }

  const getConfidenceColor = (score: number | null) => {
    if (!score) return 'text-gray-400'
    if (score >= 80) return 'text-neon-green'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getConfidenceBg = (score: number | null) => {
    if (!score) return 'bg-gray-800/30 border-gray-600/30'
    if (score >= 80) return 'bg-green-900/30 border-green-500/40'
    if (score >= 60) return 'bg-yellow-900/30 border-yellow-500/40'
    return 'bg-red-900/30 border-red-500/40'
  }

  if (loading || !user) {
    return <Loading size="lg" variant="bars" message="Loading signals..." />
  }

  const filteredSignals = filter === 'ALL' ? signals : signals.filter((s) => s.signal_type === filter)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-neon neon-text mb-2">
            AI Signals
          </h1>
          <p className="text-gray-400 text-lg">Daily and weekly trading signals</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
              filter === 'ALL'
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-purple border border-neon-purple/50'
                : 'glass text-gray-300 hover:text-white border border-gray-700/50 hover:border-neon-purple/30'
            }`}
          >
            <span className="relative z-10">All</span>
            {filter === 'ALL' && (
              <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
          <button
            onClick={() => setFilter('DAILY')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
              filter === 'DAILY'
                ? 'bg-gradient-to-r from-neon-green to-neon-cyan text-white shadow-neon-green border border-neon-green/50'
                : 'glass text-gray-300 hover:text-white border border-gray-700/50 hover:border-neon-green/30'
            }`}
          >
            <span className="relative z-10">Daily</span>
            {filter === 'DAILY' && (
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
          <button
            onClick={() => setFilter('WEEKLY')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
              filter === 'WEEKLY'
                ? 'bg-gradient-to-r from-neon-blue to-neon-cyan text-white shadow-neon-blue border border-neon-blue/50'
                : 'glass text-gray-300 hover:text-white border border-gray-700/50 hover:border-neon-blue/30'
            }`}
          >
            <span className="relative z-10">Weekly</span>
            {filter === 'WEEKLY' && (
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSignals.length === 0 ? (
          <div className="col-span-full">
            <div className="glass-strong rounded-2xl p-12 text-center border border-neon-cyan/20">
              <div className="text-5xl mb-4">📡</div>
              <div className="text-gray-400 text-lg font-medium mb-2">No signals found</div>
              <div className="text-gray-500 text-sm">Signals will appear here when available</div>
            </div>
          </div>
        ) : (
          filteredSignals.map((signal, index) => (
            <div 
              key={signal.id} 
              className="group relative glass-strong rounded-2xl p-6 border border-neon-cyan/30 shadow-neon-cyan hover:shadow-neon-cyan hover:border-neon-cyan transition-all duration-300 overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="liquid-crystal absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-white group-hover:text-neon-cyan transition-colors">
                      {signal.symbol}
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${getDirectionBg(signal.direction)} ${getDirectionColor(signal.direction)}`}>
                      {signal.direction}
                    </span>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-lg glass border border-neon-purple/30 text-neon-purple">
                    {signal.signal_type}
                  </span>
                </div>

                {/* Signal Details */}
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center p-3 glass rounded-lg border border-gray-700/30">
                    <span className="text-sm text-gray-400">Entry:</span>
                    <span className="text-white font-bold font-mono text-sm">{signal.entry_price?.toFixed(5)}</span>
                  </div>
                  
                  {signal.take_profit && (
                    <div className="flex justify-between items-center p-3 glass rounded-lg border border-neon-green/30 bg-green-900/10">
                      <span className="text-sm text-gray-400">Take Profit:</span>
                      <span className="text-neon-green font-bold font-mono text-sm">📈 {signal.take_profit.toFixed(5)}</span>
                    </div>
                  )}
                  
                  {signal.stop_loss && (
                    <div className="flex justify-between items-center p-3 glass rounded-lg border border-red-500/30 bg-red-900/10">
                      <span className="text-sm text-gray-400">Stop Loss:</span>
                      <span className="text-red-400 font-bold font-mono text-sm">🛑 {signal.stop_loss.toFixed(5)}</span>
                    </div>
                  )}
                  
                  {signal.confidence_score !== null && (
                    <div className={`flex justify-between items-center p-3 glass rounded-lg border ${getConfidenceBg(signal.confidence_score)}`}>
                      <span className="text-sm text-gray-400">Confidence:</span>
                      <span className={`font-bold text-sm ${getConfidenceColor(signal.confidence_score)}`}>
                        {signal.confidence_score}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {signal.notes && (
                  <div className="mt-5 pt-5 border-t border-gray-700/30">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">🔎</span>
                      <div>
                        <div className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Summary</div>
                        <p className="text-sm text-gray-300 leading-relaxed">{signal.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-5 pt-5 border-t border-gray-700/30 flex items-center justify-between text-xs text-gray-500">
                  <div>
                    {format(new Date(signal.created_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                  {signal.expires_at && (
                    <div className="text-red-400">
                      Expires: {format(new Date(signal.expires_at), 'MMM dd')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
