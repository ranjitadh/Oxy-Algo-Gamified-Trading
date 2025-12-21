'use client'

interface LogoProps {
  className?: string
  size?: number
}

export default function Logo({ className = '', size = 32 }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-3"
      >
        {/* Outer circle with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="50%" stopColor="#b026ff" />
            <stop offset="100%" stopColor="#0096ff" />
          </linearGradient>
          <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0096ff" />
            <stop offset="100%" stopColor="#00ffff" />
          </linearGradient>
        </defs>
        
        {/* Outer ring */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          className="animate-pulse"
        />
        
        {/* Inner hexagon representing trading chart */}
        <polygon
          points="60,20 85,35 85,65 60,80 35,65 35,35"
          fill="none"
          stroke="url(#innerGradient)"
          strokeWidth="2.5"
        />
        
        {/* Center circle with O */}
        <circle
          cx="60"
          cy="50"
          r="18"
          fill="url(#logoGradient)"
          opacity="0.2"
        />
        
        {/* Letter O */}
        <text
          x="60"
          y="58"
          textAnchor="middle"
          fill="url(#logoGradient)"
          fontSize="24"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          O
        </text>
        
        {/* Small accent dots */}
        <circle cx="45" cy="30" r="2" fill="#00ffff" className="animate-pulse" style={{ animationDelay: '0s' }} />
        <circle cx="75" cy="30" r="2" fill="#b026ff" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        <circle cx="30" cy="60" r="2" fill="#0096ff" className="animate-pulse" style={{ animationDelay: '1s' }} />
        <circle cx="90" cy="60" r="2" fill="#00ffff" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
      </svg>
    </div>
  )
}

