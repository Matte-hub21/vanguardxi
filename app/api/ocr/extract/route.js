import { NextResponse } from 'next/server'
import { extractMatchStats } from '@/lib/services/ocr/ocrService'
import { PLAYERS } from '@/lib/supabase/mock-data'

export const maxDuration = 60

export async function POST(request) {
  try {
    const { imageBase64, mimeType, provider } = await request.json()
    if (!imageBase64) return NextResponse.json({ error: 'imageBase64 required' }, { status: 400 })
    const result = await extractMatchStats({ imageBase64, mimeType: mimeType || 'image/png', roster: PLAYERS, provider })
    return NextResponse.json({ ok: true, ...result })
  } catch (e) {
    console.error('OCR error', e)
    return NextResponse.json({ ok: false, error: e.message || 'OCR failed' }, { status: 500 })
  }
}
