'use client'

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden flex items-center justify-center">
      {/* Animated background effects */}
      <div className="animated-grid"></div>
      <div className="particle-bg"></div>
      
      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Trading Cube Loader */}
        <div className="trading-cube-loader scale-150">
          <div className="cube-face">
            <div className="text-neon-cyan font-bold text-lg">↑</div>
          </div>
          <div className="cube-face">
            <div className="text-neon-purple font-bold text-lg">$</div>
          </div>
          <div className="cube-face">
            <div className="text-neon-green font-bold text-lg">+</div>
          </div>
          <div className="cube-face">
            <div className="text-neon-pink font-bold text-lg">%</div>
          </div>
          <div className="cube-face">
            <div className="text-neon-blue font-bold text-lg">O</div>
          </div>
          <div className="cube-face">
            <div className="text-neon-cyan font-bold text-lg">X</div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-neon neon-text">
            Oxy Algo
          </h2>
          <p className="text-gray-400 text-sm">Initializing Trading Platform...</p>
          
          {/* Trading Bars Animation */}
          <div className="flex justify-center mt-6">
            <div className="trading-bars-loader">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
