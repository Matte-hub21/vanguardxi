import { NextResponse } from 'next/server'
import { extractStandings } from '@/lib/services/ocr/standingsExtractor'

export const maxDuration = 60

export async function POST(request) {
  try {
    const { imageBase64, mimeType } = await request.json()
    if (!imageBase64) return NextResponse.json({ error: 'imageBase64 required' }, { status: 400 })
    const data = await extractStandings(imageBase64, mimeType || 'image/png')
    return NextResponse.json({ ok: true, ...data })
  } catch (e) {
    console.error('standings extract error', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
