'use client'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  message?: string
  variant?: 'cube' | 'bars' | 'rings' | 'classic'
}

export default function Loading({ 
  size = 'md', 
  fullScreen = false, 
  message,
  variant = 'cube'
}: LoadingProps) {
  const sizeClasses = {
    sm: { cube: 'scale-75', bars: 'scale-75', rings: 'scale-75' },
    md: { cube: 'scale-100', bars: 'scale-100', rings: 'scale-100' },
    lg: { cube: 'scale-150', bars: 'scale-125', rings: 'scale-125' }
  }

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'
    : 'flex items-center justify-center py-12'

  const renderLoader = () => {
    switch (variant) {
      case 'cube':
        return (
          <div className={`trading-cube-loader ${sizeClasses[size].cube}`}>
            <div className="cube-face">
              <div className="text-neon-cyan font-bold text-xs">↑</div>
            </div>
            <div className="cube-face">
              <div className="text-neon-purple font-bold text-xs">$</div>
            </div>
            <div className="cube-face">
              <div className="text-neon-green font-bold text-xs">+</div>
            </div>
            <div className="cube-face">
              <div className="text-neon-pink font-bold text-xs">%</div>
            </div>
            <div className="cube-face">
              <div className="text-neon-blue font-bold text-xs">O</div>
            </div>
            <div className="cube-face">
              <div className="text-neon-cyan font-bold text-xs">X</div>
            </div>
          </div>
        )
      
      case 'bars':
        return (
          <div className={`trading-bars-loader ${sizeClasses[size].bars}`}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        )
      
      case 'rings':
        return (
          <div className={`orbiting-rings-loader ${sizeClasses[size].rings}`}>
            <div className="ring" style={{ left: 'calc(50% - 10px)', top: 'calc(50% - 10px)' }}></div>
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-neon-cyan rounded-full animate-pulse" style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)' }}></div>
            </div>
          </div>
        )
      
      case 'classic':
      default:
        return (
          <div className="relative">
            {/* Outer ring - Cyan */}
            <div className={`${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-16 h-16' : 'w-24 h-24'} border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin`}></div>
            
            {/* Middle ring - Purple */}
            <div className={`absolute inset-0 ${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-16 h-16' : 'w-24 h-24'} border-4 border-transparent border-r-neon-purple rounded-full animate-spin`} style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
            
            {/* Inner ring - Pink */}
            <div className={`absolute inset-0 ${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-16 h-16' : 'w-24 h-24'} border-4 border-transparent border-b-neon-pink rounded-full animate-spin`} style={{ animationDuration: '1.2s' }}></div>
            
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'} bg-neon-cyan rounded-full animate-pulse`}></div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Main Loader */}
        {renderLoader()}

        {/* Loading Text */}
        {message && (
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium animate-pulse">{message}</p>
          </div>
        )}

        {/* Optional: Loading dots animation */}
        {!message && variant !== 'bars' && (
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0s', boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}></div>
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s', boxShadow: '0 0 10px rgba(176, 38, 255, 0.5)' }}></div>
            <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s', boxShadow: '0 0 10px rgba(255, 0, 110, 0.5)' }}></div>
          </div>
        )}
      </div>
    </div>
  )
}
