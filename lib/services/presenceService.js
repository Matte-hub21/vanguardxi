'use client'
// Realtime presence using Supabase channels in production, mock heartbeat in dev.
// Same public API: subscribePresence(cb), setMyStatus(s), getPresence(id).

import { PLAYERS } from '@/lib/supabase/mock-data'
import { createClient } from '@/lib/supabase/client'

const USE_MOCK = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_USE_MOCK_AUTH : 'true') === 'true'

// status: 'online' | 'in_match' | 'idle' | 'offline'
const state = new Map()
const listeners = new Set()
let started = false
let channel = null
let ticker = null

function emit() {
  const snap = Array.from(state.values())
  listeners.forEach(fn => fn(snap))
}

// ---------- MOCK MODE ----------
function seedMock() {
  PLAYERS.forEach((p, i) => {
    let status = 'offline'
    if (i < 9) status = 'online'
    if (i === 3 || i === 6) status = 'in_match'
    if (i === 7) status = 'idle'
    state.set(p.id, { player_id: p.id, gamertag: p.gamertag, status, last_seen: Date.now() })
  })
  state.set('p1', { player_id: 'p1', gamertag: 'GHOST_07', status: 'online', last_seen: Date.now() })
}
function tickMock() {
  const ids = Array.from(state.keys()).filter(id => id !== 'p1')
  for (let i = 0; i < 2; i++) {
    const pid = ids[Math.floor(Math.random() * ids.length)]
    const cur = state.get(pid); if (!cur) continue
    const opts = ['online','online','idle','offline','in_match']
    const next = opts[Math.floor(Math.random() * opts.length)]
    if (next !== cur.status) state.set(pid, { ...cur, status: next, last_seen: Date.now() })
  }
  emit()
}

// ---------- REAL SUPABASE PRESENCE ----------
async function startSupabasePresence() {
  const sb = createClient()
  const { data } = await sb.auth.getUser()
  const user = data?.user
  const me = {
    player_id: 'p1', // current captain in this MVP; later: map to profile.player_id
    gamertag: user?.user_metadata?.full_name || user?.email || 'You',
    status: 'online',
    last_seen: Date.now(),
  }

  channel = sb.channel('vanguard-presence', { config: { presence: { key: user?.id || 'anon' } } })
  channel
    .on('presence', { event: 'sync' }, () => {
      const sync = channel.presenceState()
      // Build presence map from all connected clients
      state.clear()
      // Seed all 14 players as offline first
      PLAYERS.forEach(p => state.set(p.id, { player_id: p.id, gamertag: p.gamertag, status: 'offline', last_seen: 0 }))
      Object.values(sync).flat().forEach(entry => {
        if (entry?.player_id) state.set(entry.player_id, entry)
      })
      emit()
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track(me)
      }
    })
}

export function startPresence() {
  if (started) return
  started = true
  if (USE_MOCK) {
    seedMock(); emit()
    ticker = setInterval(tickMock, 6000)
  } else {
    startSupabasePresence().catch(err => console.error('presence error', err))
  }
}

export function stopPresence() {
  if (ticker) { clearInterval(ticker); ticker = null }
  if (channel) { channel.unsubscribe(); channel = null }
  started = false
}

export function subscribePresence(cb) {
  startPresence()
  listeners.add(cb)
  cb(Array.from(state.values()))
  return () => listeners.delete(cb)
}

export function setMyStatus(status) {
  const me = state.get('p1') || { player_id: 'p1' }
  state.set('p1', { ...me, status, last_seen: Date.now() })
  if (channel) channel.track({ ...me, status, last_seen: Date.now() })
  emit()
}

export function getPresence(playerId) {
  return state.get(playerId) || { player_id: playerId, status: 'offline' }
}
