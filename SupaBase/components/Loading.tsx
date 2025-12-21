'use client'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  message?: string
}

export default function Loading({ size = 'md', fullScreen = false, message }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'
    : 'flex items-center justify-center py-12'

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Main Spinner */}
        <div className="relative">
          {/* Outer ring - Cyan */}
          <div className={`${sizeClasses[size]} border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin`}></div>
          
          {/* Middle ring - Purple */}
          <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-neon-purple rounded-full animate-spin`} style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
          
          {/* Inner ring - Pink */}
          <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-b-neon-pink rounded-full animate-spin`} style={{ animationDuration: '1.2s' }}></div>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        {message && (
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium animate-pulse">{message}</p>
          </div>
        )}

        {/* Optional: Loading dots animation */}
        {!message && (
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
    </div>
  )
}

