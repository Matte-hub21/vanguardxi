// In-memory mock implementation that mimics the parts of the Supabase API we use.
// Keep this surface aligned with the real Supabase client so swapping is painless.
import { PLAYERS, MATCHES, STATS, ATTENDANCE, ANNOUNCEMENTS, ACTIVITY, TEAM, FORMATIONS, CALLUPS } from './mock-data'

const tables = {
  players: [...PLAYERS],
  matches: [...MATCHES],
  stats: [...STATS],
  attendance: [...ATTENDANCE],
  announcements: [...ANNOUNCEMENTS],
  activity_feed: [...ACTIVITY],
  formations: [...FORMATIONS],
  callups: [...CALLUPS],
  team: [TEAM],
}

const listeners = new Map()
function emit(table, event, row) {
  const subs = listeners.get(table) || []
  subs.forEach(fn => fn({ event, new: row, old: row }))
}

function queryBuilder(table) {
  let rows = [...(tables[table] || [])]
  const api = {
    select() { return api },
    eq(col, val) { rows = rows.filter(r => r[col] === val); return api },
    in(col, vals) { rows = rows.filter(r => vals.includes(r[col])); return api },
    order(col, opts={}) {
      const dir = opts.ascending === false ? -1 : 1
      rows.sort((a,b) => (a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0) * dir)
      return api
    },
    limit(n) { rows = rows.slice(0, n); return api },
    single() { return Promise.resolve({ data: rows[0] || null, error: null }) },
    then(resolve) { resolve({ data: rows, error: null }) },
    insert(payload) {
      const items = Array.isArray(payload) ? payload : [payload]
      const inserted = items.map(it => ({ id: it.id || `${table}-${Math.random().toString(36).slice(2,9)}`, ...it }))
      tables[table].push(...inserted)
      inserted.forEach(r => emit(table, 'INSERT', r))
      return { select: () => ({ then: (r) => r({ data: inserted, error: null }) }), then: (r) => r({ data: inserted, error: null }) }
    },
    update(patch) {
      return {
        eq(col, val) {
          const updated = []
          tables[table] = tables[table].map(r => {
            if (r[col] === val) { const nr = { ...r, ...patch }; updated.push(nr); return nr }
            return r
          })
          updated.forEach(r => emit(table, 'UPDATE', r))
          return { select: () => ({ then: (cb) => cb({ data: updated, error: null }) }), then: (cb) => cb({ data: updated, error: null }) }
        }
      }
    },
    delete() {
      return {
        eq(col, val) {
          const removed = tables[table].filter(r => r[col] === val)
          tables[table] = tables[table].filter(r => r[col] !== val)
          removed.forEach(r => emit(table, 'DELETE', r))
          return { then: (cb) => cb({ data: removed, error: null }) }
        }
      }
    },
  }
  return api
}

let mockSession = null
const authListeners = new Set()

export const mockClient = {
  from(table) { return queryBuilder(table) },
  auth: {
    async signInWithOAuth({ provider, options }) {
      // Simulate Discord OAuth — instantly create a session.
      mockSession = {
        user: {
          id: 'mock-user-1',
          email: 'captain@vanguardxi.gg',
          user_metadata: {
            full_name: 'Marco "GHOST_07" Vidal',
            avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ghost07&backgroundColor=1a1a22',
            provider,
          },
        },
        access_token: 'mock-token',
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('vgd_mock_session', JSON.stringify(mockSession))
      }
      authListeners.forEach(fn => fn('SIGNED_IN', mockSession))
      return { data: { url: options?.redirectTo || '/dashboard' }, error: null }
    },
    async signOut() {
      mockSession = null
      if (typeof window !== 'undefined') localStorage.removeItem('vgd_mock_session')
      authListeners.forEach(fn => fn('SIGNED_OUT', null))
      return { error: null }
    },
    async getSession() {
      if (!mockSession && typeof window !== 'undefined') {
        try { mockSession = JSON.parse(localStorage.getItem('vgd_mock_session') || 'null') } catch {}
      }
      return { data: { session: mockSession }, error: null }
    },
    async getUser() {
      const { data } = await this.getSession()
      return { data: { user: data.session?.user || null }, error: null }
    },
    onAuthStateChange(cb) {
      authListeners.add(cb)
      return { data: { subscription: { unsubscribe: () => authListeners.delete(cb) } } }
    },
  },
  channel(name) {
    const ch = {
      on(_evt, opts, cb) {
        const table = opts?.table || name
        if (!listeners.has(table)) listeners.set(table, [])
        listeners.get(table).push(cb)
        ch._table = table; ch._cb = cb
        return ch
      },
      subscribe() { return ch },
      unsubscribe() {
        if (ch._table && ch._cb) {
          const arr = listeners.get(ch._table) || []
          listeners.set(ch._table, arr.filter(f => f !== ch._cb))
        }
        return ch
      },
    }
    return ch
  },
}
