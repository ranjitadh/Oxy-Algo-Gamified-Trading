'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeTrades(userId: string, accountId?: string) {
  const [trades, setTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    let channel: RealtimeChannel | null = null

    const fetchTrades = async () => {
      let query = supabase
        .from('trades')
        .select('*, screenshots(*)')
        .eq('user_id', userId)
        .order('opened_at', { ascending: false })

      if (accountId) {
        query = query.eq('account_id', accountId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching trades:', error)
      } else {
        setTrades(data || [])
      }
      setLoading(false)
    }

    fetchTrades()

    channel = supabase
      .channel('trades-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          await fetchTrades()
        }
      )
      .subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [userId, accountId, supabase])

  return { trades, loading }
}



