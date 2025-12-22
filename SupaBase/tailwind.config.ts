import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        neon: {
          cyan: '#00ffff',
          purple: '#b026ff',
          pink: '#ff006e',
          blue: '#0096ff',
          green: '#00ff88',
        },
      },
      animation: {
        'fade-in': 'slide-in-up 0.6s ease-out',
        'fade-in-delay': 'slide-in-up 0.6s ease-out 0.2s both',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'liquid-shimmer': 'liquid-shimmer 3s ease infinite',
        'neon-flicker': 'neon-flicker 3s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00ffff, #b026ff, #ff006e, #0096ff)',
        'gradient-neon-vertical': 'linear-gradient(180deg, #00ffff, #b026ff, #ff006e)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a, #1a0a1a, #0a0a1a)',
      },
      boxShadow: {
        // Reduced glow intensity (~60% less) to avoid overpowering UI
        'neon-cyan': '0 0 8px rgba(0, 255, 255, 0.2), 0 0 16px rgba(0, 255, 255, 0.12), 0 0 24px rgba(0, 255, 255, 0.08)',
        'neon-purple': '0 0 8px rgba(176, 38, 255, 0.2), 0 0 16px rgba(176, 38, 255, 0.12), 0 0 24px rgba(176, 38, 255, 0.08)',
        'neon-pink': '0 0 8px rgba(255, 0, 110, 0.2), 0 0 16px rgba(255, 0, 110, 0.12), 0 0 24px rgba(255, 0, 110, 0.08)',
        'neon-blue': '0 0 8px rgba(0, 150, 255, 0.2), 0 0 16px rgba(0, 150, 255, 0.12), 0 0 24px rgba(0, 150, 255, 0.08)',
        'neon-green': '0 0 8px rgba(0, 255, 136, 0.2), 0 0 16px rgba(0, 255, 136, 0.12), 0 0 24px rgba(0, 255, 136, 0.08)',
        'glow-lg': '0 0 16px rgba(0, 255, 255, 0.16), 0 0 32px rgba(176, 38, 255, 0.12)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config



