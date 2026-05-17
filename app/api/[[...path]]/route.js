import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  return NextResponse.json({ message: 'Vanguard XI API', status: 'ok' })
}

export async function POST(request, { params }) {
  return NextResponse.json({ ok: true })
}
