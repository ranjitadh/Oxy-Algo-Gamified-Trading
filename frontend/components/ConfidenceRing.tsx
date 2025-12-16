'use client'

import { motion } from 'framer-motion'

interface ConfidenceRingProps {
  confidence: number
  size?: number
  strokeWidth?: number
}

export function ConfidenceRing({ confidence, size = 80, strokeWidth = 8 }: ConfidenceRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (confidence / 100) * circumference

  const getColor = () => {
    if (confidence >= 70) return '#22c55e' // green
    if (confidence >= 40) return '#eab308' // yellow
    return '#ef4444' // red
  }

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold">{confidence}%</span>
      </div>
    </div>
  )
}

