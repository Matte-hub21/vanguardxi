import { createClient } from '@/lib/supabase/client'

export async function listPlayers() {
  const sb = createClient()
  const { data } = await sb.from('players').select('*').order('rating', { ascending: false })
  return data || []
}

export async function getPlayer(id) {
  const sb = createClient()
  const { data } = await sb.from('players').select('*').eq('id', id).single()
  return data
}
