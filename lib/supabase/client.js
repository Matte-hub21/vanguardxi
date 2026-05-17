'use client'
import { createBrowserClient } from '@supabase/ssr'
import { mockClient } from './mock-store'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'

let _client = null
export function createClient() {
  if (USE_MOCK) return mockClient
  if (_client) return _client
  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return _client
}
