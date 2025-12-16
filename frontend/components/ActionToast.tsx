'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2, X } from 'lucide-react'
import { ActionStatus } from '@/shared-types'

interface ActionToastProps {
  id: string
  type: string
  status: ActionStatus
  message?: string
  onClose: () => void
}

export function ActionToast({ id, type, status, message, onClose }: ActionToastProps) {
  const getIcon = () => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'RUNNING':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'SUCCESS':
        return 'Completed'
      case 'FAILED':
        return 'Failed'
      case 'RUNNING':
        return 'Processing...'
      default:
        return 'Queued'
    }
  }

  const getActionCopy = () => {
    switch (type) {
      case 'SECURE_PROFITS':
        return "We're tightening safety and protecting gains."
      case 'REDUCE_EXPOSURE':
        return 'Reducing exposure to manage risk.'
      case 'EXIT_CLEAN':
        return 'Exiting cleanly and securing position.'
      case 'PAUSE_SYSTEM':
        return 'System paused. All strategies on hold.'
      default:
        return message || 'Action processed.'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px] z-50"
      >
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            <p className="font-semibold text-sm">{getStatusText()}</p>
            <p className="text-sm text-gray-600 mt-1">{getActionCopy()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

