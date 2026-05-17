import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin.from('competitions').select('*').order('name')
    if (error) throw error
    return NextResponse.json({ ok: true, competitions: data || [] })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    if (!body.id || !body.name) return NextResponse.json({ error: 'id+name required' }, { status: 400 })
    const admin = createAdminClient()
    const payload = {
      id: body.id, name: body.name, slug: body.slug || body.id,
      logo: body.logo || null, color: body.color || '#D4AF37',
      ical_url: body.ical_url || null, sync_enabled: body.sync_enabled !== false,
    }
    const { data, error } = await admin.from('competitions').upsert(payload).select().single()
    if (error) throw error
    return NextResponse.json({ ok: true, competition: data })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
