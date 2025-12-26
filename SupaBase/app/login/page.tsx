'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMagicLink, setIsMagicLink] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log('Attempting login...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        throw error
      }

      console.log('Login successful, data:', data)

      // Show redirecting message
      setIsRedirecting(true)

      // Wait for session to be established and cookies to be set
      let session = null
      let attempts = 0
      const maxAttempts = 5

      while (!session && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const { data: sessionData } = await supabase.auth.getSession()
        session = sessionData.session
        attempts++
        console.log(`Session check attempt ${attempts}:`, session ? 'Found' : 'Not found')
      }

      if (session) {
        console.log('Session confirmed, redirecting...')
        console.log('Session details:', {
          access_token: session.access_token?.substring(0, 20) + '...',
          expires_at: session.expires_at,
          user_id: session.user?.id
        })
        
        // Explicitly set the session to ensure it's persisted in cookies
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token || '',
        })
        
        if (setSessionError) {
          console.error('Error setting session:', setSessionError)
          setIsRedirecting(false)
          setIsLoading(false)
          setError('Failed to save session. Please try again.')
          return
        }
        
        // Wait for cookies to be written
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Double-check session is still there
        const { data: finalSession } = await supabase.auth.getSession()
        if (!finalSession.session) {
          console.error('Session lost after setSession!')
          setIsRedirecting(false)
          setIsLoading(false)
          setError('Session not persisted. Please try again.')
          return
        }
        
        // Verify cookies are set
        const cookies = document.cookie
        const hasSupabaseCookies = cookies.includes('sb-') || cookies.includes('supabase') || cookies.includes('auth-token')
        console.log('Cookies check:', hasSupabaseCookies ? 'Found Supabase cookies' : 'No Supabase cookies found')
        
        if (!hasSupabaseCookies) {
          console.warn('Warning: No Supabase cookies found, but session exists')
          console.log('All cookies:', document.cookie)
        }
        
        // Use window.location for a hard redirect - this ensures full page reload and middleware runs
        console.log('Redirecting to /dashboard...')
        // Clear any URL parameters first
        const cleanUrl = window.location.origin + '/dashboard'
        window.location.replace(cleanUrl)
      } else {
        console.error('Session not found after multiple attempts')
        setIsRedirecting(false)
        setIsLoading(false)
        setError('Session not created. Please refresh the page and try again.')
      }
    } catch (err: any) {
      console.error('Login catch error:', err)
      setError(err.message || 'Failed to sign in')
      setIsLoading(false)
      setIsRedirecting(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      setIsMagicLink(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden flex items-center justify-center px-4">
      {/* Background FX */}
      <div className="animated-grid" />
      <div className="particle-bg" />

      <div className="relative z-10 max-w-md w-full">
        <div className="glass-strong rounded-2xl p-8 border border-neon-cyan/20 shadow-glow-lg space-y-8">
          {/* Header / Branding */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Logo size={40} />
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-neon neon-text">
              Oxy Algo
            </h2>
            <p className="text-sm text-gray-400">
              Sign in to your trading command center
            </p>
          </div>

        {isMagicLink ? (
          <div className="text-center space-y-4">
            <p className="text-neon-green font-medium">
              Check your email for the magic link!
            </p>
            <p className="text-xs text-gray-500">
              Open the link on this device to jump straight into your dashboard.
            </p>
            <button
              onClick={() => setIsMagicLink(false)}
              className="text-neon-cyan hover:text-neon-blue text-sm font-semibold underline-offset-2 hover:underline transition-colors"
            >
              Back to password login
            </button>
          </div>
        ) : (
          <form className="mt-6 space-y-6" onSubmit={handleEmailLogin}>
            {error && (
              <div className="glass rounded-lg border border-red-500/60 bg-red-900/30 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-neon-cyan/20 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/60 focus:border-neon-cyan/80"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-neon-purple/20 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple/60 focus:border-neon-purple/80"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="group relative w-full inline-flex justify-center items-center rounded-[18px] bg-[linear-gradient(90deg,rgba(0,255,255,0.46)_4%,rgba(176,38,255,0.44)_94%)] px-4 py-2.5 text-sm font-semibold text-white shadow-neon-cyan hover:shadow-neon-purple transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {isRedirecting ? 'Redirecting...' : isLoading ? 'Signing in...' : 'Sign in'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleMagicLink}
                disabled={isLoading}
                className="group relative w-full inline-flex justify-center items-center rounded-lg border border-neon-cyan/30 bg-black/40 px-4 py-2.5 text-sm font-semibold text-gray-200 hover:bg-neon-cyan/10 hover:border-neon-cyan/60 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Send magic link instead
              </button>
            </div>

            <div className="text-center pt-2 text-xs text-gray-400">
              <span>Don&apos;t have an account? </span>
              <Link
                href="/signup"
                className="text-neon-cyan hover:text-neon-blue font-semibold underline-offset-2 hover:underline"
              >
                Create one
              </Link>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  )
}

