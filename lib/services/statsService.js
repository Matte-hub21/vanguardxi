import { createClient } from '@/lib/supabase/client'

export async function listStats() {
  const sb = createClient()
  const { data } = await sb.from('stats').select('*')
  return data || []
}

export async function getMatchStats(matchId) {
  const sb = createClient()
  const { data } = await sb.from('stats').select('*').eq('match_id', matchId)
  return data || []
}

export async function getPlayerSeasonStats(playerId) {
  const sb = createClient()
  const { data } = await sb.from('stats').select('*').eq('player_id', playerId)
  const rows = data || []
  return {
    appearances: rows.length,
    goals: rows.reduce((s, r) => s + r.goals, 0),
    assists: rows.reduce((s, r) => s + r.assists, 0),
    tackles: rows.reduce((s, r) => s + r.tackles, 0),
    motm: rows.filter(r => r.motm).length,
    avg_rating: rows.length ? Number((rows.reduce((s, r) => s + r.rating, 0) / rows.length).toFixed(2)) : 0,
  }
}
