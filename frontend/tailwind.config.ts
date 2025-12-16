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
        primary: {
          DEFAULT: 'hsl(220, 90%, 56%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(220, 14%, 96%)',
          foreground: 'hsl(220, 9%, 46%)',
        },
        muted: {
          DEFAULT: 'hsl(220, 14%, 96%)',
          foreground: 'hsl(220, 9%, 46%)',
        },
        accent: {
          DEFAULT: 'hsl(220, 14%, 96%)',
          foreground: 'hsl(220, 9%, 46%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        border: 'hsl(220, 13%, 91%)',
        input: 'hsl(220, 13%, 91%)',
        ring: 'hsl(220, 90%, 56%)',
        // Status colors
        good: 'hsl(142, 76%, 36%)',
        neutral: 'hsl(38, 92%, 50%)',
        avoid: 'hsl(0, 84%, 60%)',
        // Risk colors
        'risk-low': 'hsl(142, 76%, 36%)',
        'risk-medium': 'hsl(38, 92%, 50%)',
        'risk-high': 'hsl(0, 84%, 60%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
export default config

