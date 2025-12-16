'use client'

import { Badge } from './ui/badge'
import { getStatusColor, getStatusCopy } from '@/lib/utils'

interface StatusPillProps {
  status: 'GOOD' | 'NEUTRAL' | 'AVOID'
}

export function StatusPill({ status }: StatusPillProps) {
  return (
    <Badge className={getStatusColor(status)}>
      {getStatusCopy(status)}
    </Badge>
  )
}

