import { createClient } from '@/lib/supabase/client'

export async function listCompetitions() {
  const sb = createClient()
  const { data } = await sb.from('competitions').select('*').order('name')
  return data || []
}

export async function upsertCompetition(payload) {
  const r = await fetch('/api/competitions', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return r.json()
}

export async function syncCompetition(id) {
  const r = await fetch(`/api/competitions/${id}/sync`, { method: 'POST' })
  return r.json()
}

export async function deleteCompetition(id) {
  const r = await fetch(`/api/competitions/${id}`, { method: 'DELETE' })
  return r.json()
}
