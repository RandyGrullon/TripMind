'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signInWithGoogle(redirectTo?: string): Promise<void> {
  const supabase = await createClient()
  const callbackPath = redirectTo
    ? `/auth/callback?next=${encodeURIComponent(redirectTo)}`
    : '/auth/callback'
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${siteUrl}${callbackPath}` },
  })

  if (error) throw new Error(error.message)
  redirect(data.url)
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/')
}

export async function signUpWithEmail(
  email: string,
  password: string,
  nombre: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: nombre } },
  })
  if (error) return { error: error.message }
  return { error: null }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
