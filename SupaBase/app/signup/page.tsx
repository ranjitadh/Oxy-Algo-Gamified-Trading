'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Account will be automatically created by database trigger
        // (see supabase/migrations/003_auto_create_account.sql)
        // So we don't need to create it manually here

        // Check if email confirmation is required
        if (authData.session) {
          // User is automatically signed in - redirect to dashboard
          setIsRedirecting(true)
          
          // Wait a moment for session cookies to be set
          await new Promise(resolve => setTimeout(resolve, 300))
          
          // Verify session exists
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            // Use hard redirect to ensure middleware runs with new session
            window.location.href = '/dashboard'
          } else {
            setIsRedirecting(false)
            setError('Session not created. Please try logging in.')
          }
        } else {
          // Email confirmation required
          // Account will be created automatically by database trigger
          setSuccess(true)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-dark relative overflow-hidden flex items-center justify-center px-4">
        <div className="animated-grid" />
        <div className="particle-bg" />

        <div className="relative z-10 max-w-md w-full">
          <div className="glass-strong rounded-2xl p-8 border border-neon-green/30 shadow-neon-green space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-2">
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-neon neon-text">
                Verify your email
              </h2>
              <p className="text-gray-300 text-sm">
                We&apos;ve sent a confirmation link to{' '}
                <span className="font-semibold text-white">{email}</span>
              </p>
              <p className="text-xs text-gray-500">
                Click the link in the email to verify your account and activate your Oxy Algo dashboard.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center mt-2 px-4 py-2 text-xs font-semibold text-neon-cyan hover:text-neon-blue underline-offset-2 hover:underline transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden flex items-center justify-center px-4">
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
              Create your Oxy Algo account
            </h2>
            <p className="text-sm text-gray-400">
              Unlock AI-powered trading signals and real-time insights
            </p>
          </div>

          <form className="mt-2 space-y-6" onSubmit={handleSignup}>
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-neon-purple/20 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple/60 focus:border-neon-purple/80"
                  placeholder="Password (min. 6 characters)"
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300 mb-1">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-neon-purple/20 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple/60 focus:border-neon-purple/80"
                  placeholder="Re-type your password"
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="group relative w-full inline-flex justify-center items-center rounded-[18px] bg-[linear-gradient(90deg,rgba(0,255,255,0.35)_4%,rgba(176,38,255,0.08)_94%)] px-4 py-2.5 text-sm font-semibold text-white hover:shadow-neon-purple transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  boxShadow:
                    '0px 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 10px 0px rgba(0, 255, 255, 1), 0px 0px 20px 0px rgba(0, 255, 255, 1), 0px 0px 30px 0px rgba(0, 255, 255, 1), 0px 4px 12px 0px rgba(0, 0, 0, 0.15), 0px 4px 12px 0px rgba(0, 0, 0, 0.15), 0px 4px 12px 0px rgba(0, 0, 0, 0.15), 0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
                }}
              >
                <span className="relative z-10">
                  {isRedirecting ? 'Redirecting...' : isLoading ? 'Creating account...' : 'Create account'}
                </span>
              </button>

              <div className="text-center text-xs text-gray-400">
                <span>Already have an account? </span>
                <Link
                  href="/login"
                  className="text-neon-cyan hover:text-neon-blue font-semibold underline-offset-2 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

