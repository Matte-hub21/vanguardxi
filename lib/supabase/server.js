import { mockClient } from './mock-store'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'

export async function createClient() {
  if (USE_MOCK) return mockClient
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(toSet) {
          try { toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )
}
