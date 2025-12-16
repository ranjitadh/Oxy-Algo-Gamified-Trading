'use client'

import { useQuery } from '@tanstack/react-query'
import { InstrumentCard } from '@/components/InstrumentCard'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { InstrumentWithSignal } from '@/shared-types'

export default function DashboardPage() {
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentWithSignal | null>(null)

  const { data: instruments, isLoading } = useQuery({
    queryKey: ['instruments', 'with-signals'],
    queryFn: async () => {
      const response = await api.get('/instruments/with-signals')
      return response.data as InstrumentWithSignal[]
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading instruments...</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your trading instruments at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instruments?.map((instrument) => (
          <InstrumentCard
            key={instrument.id}
            instrument={instrument}
            onClick={() => setSelectedInstrument(instrument)}
          />
        ))}
      </div>

      {selectedInstrument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedInstrument.displayName}</CardTitle>
                <button
                  onClick={() => setSelectedInstrument(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedInstrument.signal ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-2xl font-bold">{selectedInstrument.signal.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg">{selectedInstrument.signal.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className="text-lg">{selectedInstrument.signal.risk}</p>
                  </div>
                  {selectedInstrument.signal.activeStrategyName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Active Strategy</p>
                      <p className="text-lg">{selectedInstrument.signal.activeStrategyName}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No signal data available for this instrument.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

