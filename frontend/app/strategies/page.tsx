'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { StrategyCard } from '@/components/StrategyCard'
import { Strategy, StrategyActivation } from '@/shared-types'
import api from '@/lib/api'
import { useState } from 'react'

export default function StrategiesPage() {
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const { data: strategies, isLoading: strategiesLoading } = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      const response = await api.get('/strategies')
      return response.data as Strategy[]
    },
  })

  const { data: activations, isLoading: activationsLoading } = useQuery({
    queryKey: ['strategies', 'my-activations'],
    queryFn: async () => {
      const response = await api.get('/strategies/my-activations')
      return response.data as StrategyActivation[]
    },
  })

  const activateMutation = useMutation({
    mutationFn: async (strategyId: string) => {
      return api.post(`/strategies/${strategyId}/activate`, {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies', 'my-activations'] })
      setError('')
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to activate strategy')
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: async (activationId: string) => {
      return api.post(`/strategies/activations/${activationId}/deactivate`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies', 'my-activations'] })
      setError('')
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to deactivate strategy')
    },
  })

  const pauseMutation = useMutation({
    mutationFn: async (activationId: string) => {
      return api.post(`/strategies/activations/${activationId}/pause`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies', 'my-activations'] })
      setError('')
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to pause strategy')
    },
  })

  if (strategiesLoading || activationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading strategies...</p>
      </div>
    )
  }

  const activeStrategyIds = new Set(
    activations?.filter((a) => a.status === 'ACTIVE').map((a) => a.strategyId) || [],
  )

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Strategy Hub</h1>
        <p className="text-gray-600 mt-2">Activate and manage your trading strategies</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies?.map((strategy) => {
          const isActive = activeStrategyIds.has(strategy.id)
          const activation = activations?.find(
            (a) => a.strategyId === strategy.id && a.status === 'ACTIVE',
          )

          return (
            <StrategyCard
              key={strategy.id}
              strategy={strategy}
              isActive={isActive}
              onActivate={() => activateMutation.mutate(strategy.id)}
              onDeactivate={() => activation && deactivateMutation.mutate(activation.id)}
              onPause={() => activation && pauseMutation.mutate(activation.id)}
            />
          )
        })}
      </div>
    </>
  )
}

