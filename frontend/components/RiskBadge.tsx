'use client'

import { Badge } from './ui/badge'
import { getRiskColor } from '@/lib/utils'

interface RiskBadgeProps {
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
}

export function RiskBadge({ risk }: RiskBadgeProps) {
  return (
    <Badge className={getRiskColor(risk)}>
      Risk: {risk}
    </Badge>
  )
}

