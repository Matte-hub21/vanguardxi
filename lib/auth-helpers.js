'use client'
import { createClient } from '@/lib/supabase/client'

export async function signInWithDiscord(redirectTo = '/dashboard') {
  const sb = createClient()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const { data, error } = await sb.auth.signInWithOAuth({
    provider: 'discord',
    options: { redirectTo: `${origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}` },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const sb = createClient()
  await sb.auth.signOut()
}

export async function getSession() {
  const sb = createClient()
  const { data } = await sb.auth.getSession()
  return data.session
}
