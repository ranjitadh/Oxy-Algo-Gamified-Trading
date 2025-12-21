'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Start loading animation
    setLoading(true)
    setProgress(0)

    // Simulate progress with smooth increments
    let currentProgress = 0
    const interval = setInterval(() => {
      if (currentProgress < 90) {
        currentProgress += Math.random() * 15
        if (currentProgress > 90) currentProgress = 90
        setProgress(currentProgress)
      } else {
        clearInterval(interval)
      }
    }, 50)

    // Complete loading after navigation
    const timeout = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 300)
    }, 500)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [pathname, searchParams])

  if (!loading && progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: `0 0 10px rgba(0, 255, 255, 0.6), 0 0 20px rgba(176, 38, 255, 0.4), 0 0 30px rgba(255, 0, 110, 0.2)`,
          transition: 'width 0.2s ease-out',
        }}
      />
      {/* Glowing trail effect */}
      <div
        className="absolute top-0 h-full bg-neon-cyan opacity-30 blur-sm transition-all duration-300"
        style={{
          width: `${progress}%`,
          left: '0',
        }}
      />
    </div>
  )
}

