'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ConfidenceRing } from './ConfidenceRing'
import { StatusPill } from './StatusPill'
import { RiskBadge } from './RiskBadge'
import { InstrumentWithSignal } from '@/shared-types'

interface InstrumentCardProps {
  instrument: InstrumentWithSignal
  onClick?: () => void
}

export function InstrumentCard({ instrument, onClick }: InstrumentCardProps) {
  const signal = instrument.signal
  const confidence = signal?.confidence || 0
  const status = signal?.status || 'NEUTRAL'
  const risk = signal?.risk || 'MEDIUM'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle className="text-xl">{instrument.displayName}</CardTitle>
          <p className="text-sm text-muted-foreground">{instrument.symbol}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Confidence</p>
              <ConfidenceRing confidence={confidence} size={60} />
            </div>
            <div className="space-y-2">
              <StatusPill status={status as 'GOOD' | 'NEUTRAL' | 'AVOID'} />
              <RiskBadge risk={risk as 'LOW' | 'MEDIUM' | 'HIGH'} />
            </div>
          </div>
          {signal?.activeStrategyName && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Active: <span className="font-medium">{signal.activeStrategyName}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

