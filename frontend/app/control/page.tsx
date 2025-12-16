'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ActionToast } from '@/components/ActionToast'
import { ActionType, Action, ActionStatus } from '@/shared-types'
import api from '@/lib/api'
import { Shield, TrendingDown, LogOut, Pause } from 'lucide-react'

const actions = [
  {
    type: 'SECURE_PROFITS' as ActionType,
    label: 'Secure Profits',
    description: 'Lock in your gains and protect your wins',
    icon: Shield,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    type: 'REDUCE_EXPOSURE' as ActionType,
    label: 'Reduce Exposure',
    description: 'Lower your risk and tighten positions',
    icon: TrendingDown,
    color: 'bg-yellow-500 hover:bg-yellow-600',
  },
  {
    type: 'EXIT_CLEAN' as ActionType,
    label: 'Exit Clean',
    description: 'Close all positions safely and cleanly',
    icon: LogOut,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    type: 'PAUSE_SYSTEM' as ActionType,
    label: 'Pause System',
    description: 'Temporarily halt all trading activity',
    icon: Pause,
    color: 'bg-gray-500 hover:bg-gray-600',
  },
]

export default function ControlPage() {
  const [activeToasts, setActiveToasts] = useState<Map<string, Action>>(new Map())
  const queryClient = useQueryClient()

  const { data: recentActions } = useQuery({
    queryKey: ['actions'],
    queryFn: async () => {
      const response = await api.get('/actions')
      return response.data as Action[]
    },
    refetchInterval: 5000, // Poll every 5 seconds
  })

  const actionMutation = useMutation({
    mutationFn: async (type: ActionType) => {
      return api.post('/actions', { type })
    },
    onSuccess: (response) => {
      const action = response.data as Action
      setActiveToasts((prev) => new Map(prev).set(action.id, action))
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
  })

  // Update toasts when actions update
  if (recentActions) {
    recentActions.forEach((action) => {
      if (activeToasts.has(action.id)) {
        const current = activeToasts.get(action.id)
        if (current?.status !== action.status) {
          setActiveToasts((prev) => new Map(prev).set(action.id, action))
        }
      }
    })
  }

  const handleAction = (type: ActionType) => {
    actionMutation.mutate(type)
  }

  const removeToast = (id: string) => {
    setActiveToasts((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trade Control Panel</h1>
        <p className="text-gray-600 mt-2">Manage your trading actions with confidence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Card key={action.type} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${action.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{action.label}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleAction(action.type)}
                  className="w-full"
                  disabled={actionMutation.isPending}
                >
                  {actionMutation.isPending ? 'Processing...' : action.label}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {recentActions && recentActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActions.slice(0, 10).map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{action.type.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(action.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      action.status === 'SUCCESS'
                        ? 'bg-green-100 text-green-700'
                        : action.status === 'FAILED'
                          ? 'bg-red-100 text-red-700'
                          : action.status === 'RUNNING'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {action.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {Array.from(activeToasts.values()).map((action) => (
        <ActionToast
          key={action.id}
          id={action.id}
          type={action.type}
          status={action.status}
          message={action.errorMessage}
          onClose={() => removeToast(action.id)}
        />
      ))}
    </>
  )
}

