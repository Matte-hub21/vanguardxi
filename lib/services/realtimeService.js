import { createClient } from '@/lib/supabase/client'

/**
 * Provider-agnostic Realtime layer.
 * Uses Supabase channel API (which our mock-store mimics 1:1).
 *
 * Switch to real Supabase Realtime later: zero code changes needed here.
 */

export function subscribeTable({ table, event = '*', schema = 'public', onChange }) {
  const sb = createClient()
  const ch = sb
    .channel(`rt-${table}-${Math.random().toString(36).slice(2, 7)}`)
    .on('postgres_changes', { event, schema, table }, (payload) => {
      if (event === '*' || payload.event === event) onChange(payload)
    })
    .subscribe()
  return () => ch.unsubscribe()
}

export function subscribeMatch(matchId, { onAttendance, onStats, onMatch } = {}) {
  const unsubs = []
  if (onAttendance) unsubs.push(subscribeTable({ table: 'attendance', onChange: (p) => {
    if (p.new?.match_id === matchId || p.old?.match_id === matchId) onAttendance(p)
  }}))
  if (onStats) unsubs.push(subscribeTable({ table: 'stats', onChange: (p) => {
    if (p.new?.match_id === matchId || p.old?.match_id === matchId) onStats(p)
  }}))
  if (onMatch) unsubs.push(subscribeTable({ table: 'matches', onChange: (p) => {
    if (p.new?.id === matchId) onMatch(p)
  }}))
  return () => unsubs.forEach(fn => fn())
}

export function subscribeActivity(onEvent) {
  return subscribeTable({ table: 'activity_feed', event: 'INSERT', onChange: (p) => onEvent(p.new) })
}
