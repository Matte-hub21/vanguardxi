import { createClient } from '@/lib/supabase/client'

export async function listAnnouncements() {
  const sb = createClient()
  const { data } = await sb.from('announcements').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function createAnnouncement(payload) {
  const sb = createClient()
  const { data } = await sb.from('announcements').insert({ ...payload, created_at: new Date().toISOString() })
  return data?.[0]
}
