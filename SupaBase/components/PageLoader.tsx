'use client'

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden flex items-center justify-center">
      {/* Animated background effects */}
      <div className="animated-grid"></div>
      <div className="particle-bg"></div>
      
      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        {/* Logo Spinner */}
        <div className="relative">
          <div className="w-32 h-32 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-r-neon-purple rounded-full animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-b-neon-pink rounded-full animate-spin" style={{ animationDuration: '1.2s' }}></div>
          
          {/* Center Logo Area */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-neon neon-text">
              O
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-neon neon-text mb-2">
            Oxy Algo
          </h2>
          <div className="flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

