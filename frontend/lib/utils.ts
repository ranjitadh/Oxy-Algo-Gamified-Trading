import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function getStatusColor(status: 'GOOD' | 'NEUTRAL' | 'AVOID'): string {
  switch (status) {
    case 'GOOD':
      return 'bg-good text-white'
    case 'NEUTRAL':
      return 'bg-neutral text-white'
    case 'AVOID':
      return 'bg-avoid text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

export function getRiskColor(risk: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (risk) {
    case 'LOW':
      return 'bg-risk-low text-white'
    case 'MEDIUM':
      return 'bg-risk-medium text-white'
    case 'HIGH':
      return 'bg-risk-high text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

export function getStatusCopy(status: 'GOOD' | 'NEUTRAL' | 'AVOID'): string {
  switch (status) {
    case 'GOOD':
      return 'Setup looks healthy.'
    case 'NEUTRAL':
      return "We're watching conditions."
    case 'AVOID':
      return 'Not worth the risk right now.'
    default:
      return 'Status unknown.'
  }
}

