import { createClient } from '@/lib/supabase/client'

export async function listMatches({ status } = {}) {
  const sb = createClient()
  let q = sb.from('matches').select('*').order('scheduled_at', { ascending: true })
  if (status) q = q.eq('status', status)
  const { data } = await q
  return data || []
}

export async function getMatch(id) {
  const sb = createClient()
  const { data } = await sb.from('matches').select('*').eq('id', id).single()
  return data
}

export async function getUpcomingMatches(limit = 5) {
  const sb = createClient()
  const { data } = await sb.from('matches').select('*').eq('status', 'upcoming').order('scheduled_at', { ascending: true })
  return (data || []).slice(0, limit)
}

export async function getRecentMatches(limit = 5) {
  const sb = createClient()
  const { data } = await sb.from('matches').select('*').eq('status', 'completed').order('scheduled_at', { ascending: false })
  return (data || []).slice(0, limit)
}
