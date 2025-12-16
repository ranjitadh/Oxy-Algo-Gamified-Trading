'use client'

import { Badge } from './ui/badge'
import { Coins } from 'lucide-react'

interface CreditBadgeProps {
  credits: number
}

export function CreditBadge({ credits }: CreditBadgeProps) {
  return (
    <Badge variant="outline" className="gap-1">
      <Coins className="h-3 w-3" />
      {credits.toLocaleString()}
    </Badge>
  )
}

