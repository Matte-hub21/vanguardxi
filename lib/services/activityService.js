import { createClient } from '@/lib/supabase/client'

export async function listActivity(limit = 20) {
  const sb = createClient()
  const { data } = await sb.from('activity_feed').select('*').order('created_at', { ascending: false })
  return (data || []).slice(0, limit)
}
