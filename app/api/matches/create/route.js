import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request) {
  try {
    const body = await request.json()
    const required = ['opponent', 'scheduled_at']
    for (const f of required) if (!body[f]) return NextResponse.json({ error: `${f} required` }, { status: 400 })

    const admin = createAdminClient()
    const id = body.id || `m-manual-${Date.now()}`
    const startMs = new Date(body.scheduled_at).getTime()
    const status = body.status || (startMs > Date.now() ? 'upcoming' : 'completed')
    let result = body.result || null
    if (!result && status === 'completed' && body.score_us != null && body.score_them != null) {
      result = body.score_us > body.score_them ? 'W' : body.score_us < body.score_them ? 'L' : 'D'
    }
    const row = {
      id,
      opponent: body.opponent,
      opponent_tag: (body.opponent_tag || body.opponent || '???').slice(0, 4).toUpperCase(),
      opponent_logo: body.opponent_logo || '🏆',
      scheduled_at: new Date(body.scheduled_at).toISOString(),
      competition: body.competition || 'Friendly',
      status,
      venue: body.venue || 'Home',
      importance: body.importance || 'medium',
      score_us: body.score_us != null ? Number(body.score_us) : null,
      score_them: body.score_them != null ? Number(body.score_them) : null,
      result,
    }
    const { data, error } = await admin.from('matches').upsert(row).select().single()
    if (error) throw error

    await admin.from('activity_feed').insert({
      id: `ac-match-${Date.now()}`, kind: 'match', actor: 'Coach',
      text: `New match ${status === 'completed' ? 'logged' : 'scheduled'}: vs ${body.opponent}`,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true, match: data })
  } catch (e) {
    console.error('matches/create error', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
