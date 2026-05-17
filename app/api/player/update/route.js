import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'
const ALLOWED_FIELDS = ['gamertag','name','position','number','rating','role','avatar','pace','shooting','passing','dribbling','defending','physical']

export async function POST(request) {
  try {
    const body = await request.json()
    const { id, ...patch } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const clean = {}
    for (const k of ALLOWED_FIELDS) {
      if (patch[k] !== undefined && patch[k] !== null && patch[k] !== '') {
        clean[k] = ['number','rating','pace','shooting','passing','dribbling','defending','physical'].includes(k) ? Number(patch[k]) : patch[k]
      }
    }
    if (Object.keys(clean).length === 0) return NextResponse.json({ error: 'no fields to update' }, { status: 400 })

    if (USE_MOCK) {
      const { mockClient } = await import('@/lib/supabase/mock-store')
      await mockClient.from('players').update(clean).eq('id', id)
      return NextResponse.json({ ok: true })
    }

    const admin = createAdminClient()
    const { data, error } = await admin.from('players').update(clean).eq('id', id).select().single()
    if (error) throw error

    // activity feed entry
    await admin.from('activity_feed').insert({
      id: `ac-profile-${Date.now()}`,
      kind: 'join', actor: data.gamertag,
      text: 'updated their profile',
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true, player: data })
  } catch (e) {
    console.error('player/update error', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
