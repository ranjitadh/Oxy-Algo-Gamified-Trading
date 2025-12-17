'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface ScreenshotModalProps {
  storagePath: string
  isOpen: boolean
  onClose: () => void
}

export default function ScreenshotModal({ storagePath, isOpen, onClose }: ScreenshotModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!isOpen || !storagePath) return

    const loadImage = async () => {
      try {
        const { data } = supabase.storage.from('screenshots').getPublicUrl(storagePath)
        setImageUrl(data.publicUrl)
      } catch (error) {
        console.error('Error loading image:', error)
      } finally {
        setLoading(false)
      }
    }

    loadImage()
  }, [isOpen, storagePath, supabase])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300 bg-gray-800 rounded-full p-2 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {loading ? (
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="text-white">Loading image...</div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Trade screenshot"
            className="max-w-full max-h-[90vh] rounded-lg shadow-xl"
          />
        ) : (
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="text-white">Failed to load image</div>
          </div>
        )}
      </div>
    </div>
  )
}


