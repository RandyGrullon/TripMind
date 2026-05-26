import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireEnv } from '@/lib/utils/env'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Silently ignore — called from Server Component where cookies are read-only
          }
        },
      },
    }
  )
}
