import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const competition_id = searchParams.get('competition_id')
  const admin = createAdminClient()
  let q = admin.from('standings').select('*').order('position')
  if (competition_id) q = q.eq('competition_id', competition_id)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, standings: data || [] })
}

export async function POST(request) {
  try {
    const { competition_id, standings, our_team = 'Vanguard XI' } = await request.json()
    if (!competition_id || !Array.isArray(standings)) {
      return NextResponse.json({ error: 'competition_id and standings[] required' }, { status: 400 })
    }
    const admin = createAdminClient()
    await admin.from('standings').delete().eq('competition_id', competition_id)
    const rows = standings.map((s, i) => ({
      id: `st-${competition_id}-${i+1}`,
      competition_id,
      position: Number(s.position) || i + 1,
      team: s.team || '?',
      is_us: String(s.team || '').toLowerCase().includes(String(our_team).toLowerCase()),
      played: Number(s.played) || 0,
      wins: Number(s.wins) || 0,
      draws: Number(s.draws) || 0,
      losses: Number(s.losses) || 0,
      gf: Number(s.gf) || 0,
      ga: Number(s.ga) || 0,
      points: Number(s.points) || 0,
      updated_at: new Date().toISOString(),
    }))
    if (rows.length) {
      const { error } = await admin.from('standings').insert(rows)
      if (error) throw error
    }
    return NextResponse.json({ ok: true, inserted: rows.length })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
