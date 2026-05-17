// Server-only admin client using SERVICE ROLE key. Bypasses RLS.
// NEVER import this from any client component. Use only inside route handlers / server actions.
import { createClient } from '@supabase/supabase-js'

let _admin = null
export function createAdminClient() {
  if (_admin) return _admin
  _admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  return _admin
}
