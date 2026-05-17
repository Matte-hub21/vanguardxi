import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const maxDuration = 30

export async function POST(request) {
  try {
    const form = await request.formData()
    const file = form.get('file')
    const playerId = form.get('player_id')
    if (!file || !playerId) return NextResponse.json({ error: 'file and player_id required' }, { status: 400 })

    const ext = (file.name?.split('.').pop() || 'png').toLowerCase()
    const safeExt = ['png','jpg','jpeg','webp','gif'].includes(ext) ? ext : 'png'
    const path = `${playerId}/${Date.now()}.${safeExt}`

    const admin = createAdminClient()
    const buffer = Buffer.from(await file.arrayBuffer())
    const { error: upErr } = await admin.storage.from('avatars').upload(path, buffer, {
      contentType: file.type || `image/${safeExt}`,
      upsert: false,
    })
    if (upErr) throw upErr

    const { data: pub } = admin.storage.from('avatars').getPublicUrl(path)
    const url = pub.publicUrl

    // Update player record with new avatar URL
    const { error: updErr } = await admin.from('players').update({ avatar: url }).eq('id', playerId)
    if (updErr) throw updErr

    return NextResponse.json({ ok: true, url })
  } catch (e) {
    console.error('avatar upload error', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
