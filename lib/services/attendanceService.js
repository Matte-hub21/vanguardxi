import { createClient } from '@/lib/supabase/client'

export async function getMatchAttendance(matchId) {
  const sb = createClient()
  const { data } = await sb.from('attendance').select('*').eq('match_id', matchId)
  return data || []
}

export async function setAttendance(matchId, playerId, status) {
  const sb = createClient()
  const { data: existing } = await sb.from('attendance').select('*').eq('match_id', matchId)
  const row = (existing || []).find(r => r.player_id === playerId)
  if (row) {
    await sb.from('attendance').update({ status }).eq('id', row.id)
  } else {
    await sb.from('attendance').insert({ match_id: matchId, player_id: playerId, status })
  }
  return true
}
