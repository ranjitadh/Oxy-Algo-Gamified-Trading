'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeAlerts } from '@/hooks/useRealtimeAlerts'
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
        return 'bg-red-900/50 border-red-500'
      case 'WARNING':
        return 'bg-yellow-900/50 border-yellow-500'
      case 'SUCCESS':
        return 'bg-green-900/50 border-green-500'
      default:
        return 'bg-blue-900/50 border-blue-500'
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading alerts...</div>
      </div>
    )
  }

  const unseenCount = alerts.filter((a: any) => !a.seen).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Alerts</h1>
          <p className="mt-1 text-sm text-gray-400">
            {unseenCount > 0 && (
              <span className="text-yellow-400">{unseenCount} unread alert{unseenCount !== 1 ? 's' : ''}</span>
            )}
            {unseenCount === 0 && <span>All alerts read</span>}
          </p>
        </div>
        {unseenCount > 0 && (
          <button
            onClick={markAllAsSeen}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow p-8 text-center text-gray-400">
            No alerts found
          </div>
        ) : (
          alerts.map((alert: any) => (
            <div
              key={alert.id}
              className={`bg-gray-800 rounded-lg shadow p-6 border-l-4 ${getAlertTypeColor(alert.alert_type)} ${
                !alert.seen ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                    {!alert.seen && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-600 text-white">
                        New
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      alert.alert_type === 'ERROR' ? 'bg-red-900/50 text-red-300' :
                      alert.alert_type === 'WARNING' ? 'bg-yellow-900/50 text-yellow-300' :
                      alert.alert_type === 'SUCCESS' ? 'bg-green-900/50 text-green-300' :
                      'bg-blue-900/50 text-blue-300'
                    }`}>
                      {alert.alert_type}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{alert.message}</p>
                  <div className="text-sm text-gray-400">
                    {format(new Date(alert.created_at), 'MMM dd, yyyy HH:mm:ss')}
                  </div>
                </div>
                <button
                  onClick={() => toggleSeen(alert.id, alert.seen)}
                  className={`ml-4 px-3 py-1 rounded text-sm font-medium ${
                    alert.seen
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {alert.seen ? 'Mark Unread' : 'Mark Read'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}



