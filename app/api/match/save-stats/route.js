import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'

export async function POST(request) {
  try {
    const { match_id, players, score_us, score_them } = await request.json()
    if (!match_id || !Array.isArray(players)) {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
    }

    if (USE_MOCK) {
      const { mockClient } = await import('@/lib/supabase/mock-store')
      await mockClient.from('stats').delete().eq('match_id', match_id)
      let topRating = -1, mvp = null
      for (const p of players) {
        if (!p.player_id) continue
        const rating = Number(p.rating) || 0
        if (rating > topRating) { topRating = rating; mvp = p.player_id }
        await mockClient.from('stats').insert({
          id: `st-${match_id}-${p.player_id}`,
          match_id, player_id: p.player_id,
          goals: Number(p.goals)||0, assists: Number(p.assists)||0,
          tackles: Number(p.tackles)||0, passes: Number(p.passes)||0,
          rating, motm: false,
        })
      }
      if (mvp) await mockClient.from('stats').update({ motm: true }).eq('id', `st-${match_id}-${mvp}`)
      const result = score_us > score_them ? 'W' : score_us < score_them ? 'L' : 'D'
      await mockClient.from('matches').update({ status: 'completed', score_us: Number(score_us)||0, score_them: Number(score_them)||0, result }).eq('id', match_id)
      await mockClient.from('activity_feed').insert({
        id: `ac-ocr-${Date.now()}`, kind: 'match', actor: 'OCR',
        text: `Match stats imported • ${score_us}-${score_them} ${result}`,
        created_at: new Date().toISOString(),
      })
      return NextResponse.json({ ok: true, mvp_player_id: mvp })
    }

    // REAL Supabase via service-role (bypasses RLS)
    const admin = createAdminClient()

    // 1. Wipe previous stats for this match
    await admin.from('stats').delete().eq('match_id', match_id)

    // 2. Build rows + identify MVP
    let topRating = -1, mvp = null
    const rows = []
    for (const p of players) {
      if (!p.player_id) continue
      const rating = Number(p.rating) || 0
      if (rating > topRating) { topRating = rating; mvp = p.player_id }
      rows.push({
        id: `st-${match_id}-${p.player_id}`,
        match_id, player_id: p.player_id,
        goals: Number(p.goals)||0, assists: Number(p.assists)||0,
        tackles: Number(p.tackles)||0, passes: Number(p.passes)||0,
        rating, motm: p.player_id === mvp,
      })
    }
    // re-mark only the actual MVP after full loop
    rows.forEach(r => r.motm = r.player_id === mvp)

    if (rows.length) {
      const { error: insErr } = await admin.from('stats').insert(rows)
      if (insErr) throw insErr
    }

    // 3. Update match score + result
    const result = score_us > score_them ? 'W' : score_us < score_them ? 'L' : 'D'
    const { error: mErr } = await admin.from('matches').update({
      status: 'completed',
      score_us: Number(score_us)||0,
      score_them: Number(score_them)||0,
      result,
    }).eq('id', match_id)
    if (mErr) throw mErr

    // 4. Activity feed entry
    await admin.from('activity_feed').insert({
      id: `ac-ocr-${Date.now()}`,
      kind: 'match',
      actor: 'OCR',
      text: `Match stats imported from screenshot • ${score_us}-${score_them} ${result}`,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true, mvp_player_id: mvp })
  } catch (e) {
    console.error('save-stats error', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
