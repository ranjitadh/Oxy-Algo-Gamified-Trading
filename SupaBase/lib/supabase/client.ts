import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return document.cookie.split(';').map(cookie => {
            const [name, ...rest] = cookie.split('=')
            return { 
              name: name.trim(), 
              value: decodeURIComponent(rest.join('=')) 
            }
          })
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = [
              `path=${options?.path || '/'}`,
              options?.maxAge ? `max-age=${options.maxAge}` : '',
              options?.domain ? `domain=${options.domain}` : '',
              options?.secure ? 'secure' : '',
              options?.sameSite ? `samesite=${options.sameSite}` : '',
            ].filter(Boolean).join('; ')
            
            document.cookie = `${name}=${encodeURIComponent(value)}; ${cookieOptions}`
          })
        },
      },
    }
  )
}

