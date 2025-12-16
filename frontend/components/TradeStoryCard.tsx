'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Trade } from '@/shared-types'
import { formatPercent } from '@/lib/utils'

interface TradeStoryCardProps {
  trade: Trade
}

export function TradeStoryCard({ trade }: TradeStoryCardProps) {
  const isWin = trade.outcome === 'WIN'
  const isLoss = trade.outcome === 'LOSS'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {trade.instrument?.displayName || trade.instrumentId}
            </CardTitle>
            <Badge
              className={
                isWin
                  ? 'bg-green-500 text-white'
                  : isLoss
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-500 text-white'
              }
            >
              {trade.outcome}
            </Badge>
          </div>
          {trade.strategy && (
            <p className="text-sm text-muted-foreground mt-1">
              Strategy: {trade.strategy.name}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {trade.beforeImageUrl && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Before</p>
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={trade.beforeImageUrl}
                  alt="Before trade"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          {trade.afterImageUrl && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">After</p>
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={trade.afterImageUrl}
                  alt="After trade"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          {trade.aiSummary && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">AI Explanation</p>
              <p className="text-sm text-muted-foreground">{trade.aiSummary}</p>
            </div>
          )}
          {trade.pnlPct !== null && (
            <div className="pt-2">
              <p className="text-lg font-semibold">
                {formatPercent(trade.pnlPct)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

