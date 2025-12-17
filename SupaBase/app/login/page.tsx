'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            AI Trading Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to your account
          </p>
        </div>

        {isMagicLink ? (
          <div className="text-center">
            <p className="text-green-400 mb-4">
              Check your email for the magic link!
            </p>
            <button
              onClick={() => setIsMagicLink(false)}
              className="text-blue-400 hover:text-blue-300"
            >
              Back to login
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
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
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
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
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isRedirecting ? 'Redirecting...' : isLoading ? 'Signing in...' : 'Sign in'}
              </button>

              <button
                type="button"
                onClick={handleMagicLink}
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Send Magic Link
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-gray-400">Don't have an account? </span>
              <Link
                href="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

