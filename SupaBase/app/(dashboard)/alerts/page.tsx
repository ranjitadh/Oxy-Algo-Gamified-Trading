'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeAlerts } from '@/hooks/useRealtimeAlerts'
import Loading from '@/components/Loading'
import { format } from 'date-fns'

export default function AlertsPage() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient() as any

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const { alerts, loading } = useRealtimeAlerts(user?.id || '')

  const toggleSeen = async (alertId: string, currentSeen: boolean) => {
    await supabase
      .from('alerts')
      .update({ seen: !currentSeen } as any)
      .eq('id', alertId)
  }

  const markAllAsSeen = async () => {
    const unseenAlerts = alerts.filter((a: any) => !a.seen)
    if (unseenAlerts.length === 0) return

    await supabase
      .from('alerts')
      .update({ seen: true } as any)
      .in('id', unseenAlerts.map((a: any) => a.id))
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'ERROR':
        return {
          border: 'border-red-500/50',
          bg: 'bg-red-900/20',
          text: 'text-red-300',
          badge: 'bg-red-900/50 border-red-500/40 text-red-300',
          icon: '❌'
        }
      case 'WARNING':
        return {
          border: 'border-yellow-500/50',
          bg: 'bg-yellow-900/20',
          text: 'text-yellow-300',
          badge: 'bg-yellow-900/50 border-yellow-500/40 text-yellow-300',
          icon: '⚠️'
        }
      case 'SUCCESS':
        return {
          border: 'border-neon-green/50',
          bg: 'bg-green-900/20',
          text: 'text-neon-green',
          badge: 'bg-green-900/50 border-neon-green/40 text-neon-green',
          icon: '✅'
        }
      default:
        return {
          border: 'border-neon-blue/50',
          bg: 'bg-blue-900/20',
          text: 'text-neon-blue',
          badge: 'bg-blue-900/50 border-neon-blue/40 text-blue-300',
          icon: 'ℹ️'
        }
    }
  }

  if (loading || !user) {
    return <Loading size="lg" variant="rings" message="Loading alerts..." />
  }

  const unseenCount = alerts.filter((a: any) => !a.seen).length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-neon neon-text mb-2">
            Alerts
          </h1>
          <p className="text-gray-400 text-lg">
            {unseenCount > 0 ? (
              <span className="text-yellow-400 font-medium">
                {unseenCount} unread alert{unseenCount !== 1 ? 's' : ''}
              </span>
            ) : (
              <span>All alerts read</span>
            )}
          </p>
        </div>
        {unseenCount > 0 && (
          <button
            onClick={markAllAsSeen}
            className="px-5 py-2.5 bg-gradient-to-r from-neon-cyan to-neon-blue text-white rounded-lg text-sm font-bold hover:shadow-neon-blue transition-all duration-300 relative overflow-hidden group shadow-lg"
          >
            <span className="relative z-10 text-white font-bold drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
              Mark All as Read
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center border border-neon-cyan/20">
            <div className="text-5xl mb-4">🔔</div>
            <div className="text-gray-400 text-lg font-medium mb-2">No alerts found</div>
            <div className="text-gray-500 text-sm">Alerts will appear here when triggered</div>
          </div>
        ) : (
          alerts.map((alert: any, index: number) => {
            const typeColors = getAlertTypeColor(alert.alert_type)
            return (
              <div
                key={alert.id}
                className={`group relative glass-strong rounded-2xl p-6 border-l-4 ${typeColors.border} ${typeColors.bg} ${
                  !alert.seen ? 'ring-2 ring-neon-cyan/50 shadow-neon-cyan' : ''
                } hover:border-opacity-100 transition-all duration-300 overflow-hidden animate-fade-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="liquid-crystal absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">{typeColors.icon}</div>
                        <h3 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors">
                          {alert.title}
                        </h3>
                        {!alert.seen && (
                          <span className="px-3 py-1 text-xs font-bold rounded-full bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-neon-cyan animate-pulse">
                            New
                          </span>
                        )}
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-lg border ${typeColors.badge}`}>
                          {alert.alert_type}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">{alert.message}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="mr-2">🕐</span>
                        {format(new Date(alert.created_at), 'MMM dd, yyyy HH:mm:ss')}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSeen(alert.id, alert.seen)}
                      className={`ml-4 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                        alert.seen
                          ? 'glass text-gray-300 hover:text-white border border-gray-700/50 hover:border-neon-cyan/30'
                          : 'bg-gradient-to-r from-neon-cyan to-neon-blue text-white hover:shadow-neon-cyan border border-neon-cyan/50'
                      }`}
                    >
                      {alert.seen ? 'Mark Unread' : 'Mark Read'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
