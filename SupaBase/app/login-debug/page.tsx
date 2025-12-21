'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginDebugPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const supabase = createClient()

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  useEffect(() => {
    // Check current session on load
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        addLog(`Error getting session: ${error.message}`)
      } else if (data.session) {
        addLog(`Current session exists: ${data.session.user.email}`)
      } else {
        addLog('No current session')
      }
    })
  }, [supabase])

  const handleLogin = async () => {
    setLogs([])
    addLog('Starting login process...')
    addLog(`Email: ${email}`)

    try {
      addLog('Calling signInWithPassword...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        addLog(`ERROR: ${error.message}`)
        return
      }

      addLog(`Login response received`)
      addLog(`User ID: ${data.user?.id}`)
      addLog(`Session exists: ${data.session ? 'YES' : 'NO'}`)

      if (data.session) {
        addLog('Session found in response')
      } else {
        addLog('No session in response, checking...')
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          addLog(`Session check error: ${sessionError.message}`)
        } else if (sessionData.session) {
          addLog('Session found after delay')
        } else {
          addLog('Session still not found')
        }
      }

      // Check cookies
      addLog('Checking cookies...')
      const cookies = document.cookie.split(';')
      const supabaseCookies = cookies.filter(c => c.includes('supabase') || c.includes('sb-'))
      if (supabaseCookies.length > 0) {
        addLog(`Found ${supabaseCookies.length} Supabase cookies`)
        supabaseCookies.forEach(c => addLog(`  Cookie: ${c.trim().substring(0, 50)}...`))
      } else {
        addLog('No Supabase cookies found')
      }

    } catch (err: any) {
      addLog(`EXCEPTION: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">Login Debug Page</h1>
        
        <div className="bg-gray-800 p-4 rounded mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
          />
          <button
            onClick={handleLogin}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Login
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-white font-bold mb-2">Debug Logs:</h2>
          <div className="bg-black p-4 rounded font-mono text-sm text-green-400 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">
                No logs yet. Click the Test Login button to start.
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



