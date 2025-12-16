'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { RiskBadge } from './RiskBadge'
import { Strategy } from '@/shared-types'
import { formatPercent } from '@/lib/utils'

interface StrategyCardProps {
  strategy: Strategy
  isActive?: boolean
  onActivate?: () => void
  onDeactivate?: () => void
  onPause?: () => void
}

export function StrategyCard({
  strategy,
  isActive,
  onActivate,
  onDeactivate,
  onPause,
}: StrategyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={isActive ? 'border-primary border-2' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{strategy.name}</CardTitle>
              <CardDescription className="mt-2">{strategy.description}</CardDescription>
            </div>
            <RiskBadge risk={strategy.riskProfile as 'LOW' | 'MEDIUM' | 'HIGH'} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {strategy.monthlyPerformance !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Monthly</p>
                <p className="text-lg font-semibold">
                  {formatPercent(strategy.monthlyPerformance)}
                </p>
              </div>
            )}
            {strategy.winRate !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-lg font-semibold">{strategy.winRate}%</p>
              </div>
            )}
            {strategy.marketFitNow !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Market Fit</p>
                <p className="text-lg font-semibold">{strategy.marketFitNow}%</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {isActive ? (
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={onPause} className="flex-1">
                Pause Strategy
              </Button>
              <Button variant="destructive" onClick={onDeactivate} className="flex-1">
                Stand By
              </Button>
            </div>
          ) : (
            <Button onClick={onActivate} className="w-full">
              Activate Engine
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

