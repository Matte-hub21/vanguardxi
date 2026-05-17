import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { parseIcs, extractFixture } from '@/lib/services/icalParser'

export const maxDuration = 45

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const admin = createAdminClient()
    const { data: comp, error: cErr } = await admin.from('competitions').select('*').eq('id', id).single()
    if (cErr || !comp) return NextResponse.json({ error: 'competition not found' }, { status: 404 })
    if (!comp.ical_url) return NextResponse.json({ error: 'no ical_url configured' }, { status: 400 })

    // Fetch the ICS feed
    const r = await fetch(comp.ical_url, { headers: { 'Accept': 'text/calendar' } })
    if (!r.ok) throw new Error(`Failed to fetch ICS: HTTP ${r.status}`)
    const text = await r.text()
    const events = parseIcs(text)
    if (events.length === 0) return NextResponse.json({ ok: true, imported: 0, skipped: 0, message: 'no events found' })

    let imported = 0, updated = 0
    for (const ev of events) {
      const { opponent, venue } = extractFixture(ev.summary)
      const externalId = `${comp.slug}-${ev.uid}`
      const startMs = new Date(ev.start).getTime()
      const status = startMs > Date.now() ? 'upcoming' : 'completed'
      const row = {
        id: externalId,
        opponent: opponent || 'Unknown',
        opponent_tag: (opponent || '???').slice(0, 3).toUpperCase(),
        opponent_logo: comp.logo || '🏆',
        scheduled_at: ev.start,
        competition: comp.name,
        status,
        venue,
        importance: 'medium',
      }
      // upsert by id
      const { error: uErr } = await admin.from('matches').upsert(row, { onConflict: 'id' })
      if (!uErr) { imported++ } else { console.warn('match upsert err', uErr.message) }
    }

    await admin.from('competitions').update({ last_synced_at: new Date().toISOString() }).eq('id', id)
    await admin.from('activity_feed').insert({
      id: `ac-sync-${Date.now()}`, kind: 'match', actor: 'CalendarSync',
      text: `Synced ${imported} fixtures from ${comp.name}`, created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true, imported, total_events: events.length })
  } catch (e) {
    console.error('sync error', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
