// Minimal RFC 5545 (.ics) parser. Handles VEVENT blocks, line folding, UTC and floating times.
export function parseIcs(text) {
  if (!text) return []
  const unfolded = String(text).replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '')
  const lines = unfolded.split(/\r?\n/)
  const events = []
  let cur = null
  for (const raw of lines) {
    const line = raw.trim()
    if (line === 'BEGIN:VEVENT') cur = {}
    else if (line === 'END:VEVENT') { if (cur) events.push(cur); cur = null }
    else if (cur) {
      const idx = line.indexOf(':')
      if (idx < 0) continue
      const left = line.slice(0, idx)
      const value = line.slice(idx + 1)
      const key = left.split(';')[0]
      cur[key] = value
    }
  }
  return events.map(e => ({
    uid: e.UID || `${e.DTSTART}-${e.SUMMARY}`,
    summary: unescape(e.SUMMARY || ''),
    start: parseIcsDate(e.DTSTART),
    end: parseIcsDate(e.DTEND),
    location: unescape(e.LOCATION || ''),
    description: unescape(e.DESCRIPTION || ''),
  })).filter(e => e.start)
}

function unescape(s) { return s.replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\') }
function parseIcsDate(s) {
  if (!s) return null
  const m = s.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?Z?)?$/)
  if (!m) { const d = new Date(s); return isNaN(d) ? null : d.toISOString() }
  const isUtc = s.endsWith('Z')
  const dt = isUtc
    ? new Date(Date.UTC(+m[1], +m[2]-1, +m[3], +(m[4]||0), +(m[5]||0), +(m[6]||0)))
    : new Date(+m[1], +m[2]-1, +m[3], +(m[4]||0), +(m[5]||0), +(m[6]||0))
  return dt.toISOString()
}

// Try to extract opponent + venue from an ICS SUMMARY.
// Examples:
//   "Vanguard XI vs Phoenix Reign" -> { opponent: 'Phoenix Reign', venue: 'Home' }
//   "Onyx United vs Vanguard XI"    -> { opponent: 'Onyx United', venue: 'Away' }
//   "VGD - Phoenix Reign"           -> { opponent: 'Phoenix Reign', venue: 'Home' }
export function extractFixture(summary, teamName = 'Vanguard XI', teamTag = 'VGD') {
  const s = String(summary || '').trim()
  const re = /\s*(?:vs\.?|@|-|–|—|x|×)\s*/i
  const parts = s.split(re).map(p => p.trim()).filter(Boolean)
  if (parts.length >= 2) {
    const [a, b] = parts
    const aIsUs = isUs(a, teamName, teamTag)
    const bIsUs = isUs(b, teamName, teamTag)
    if (aIsUs && !bIsUs) return { opponent: b, venue: 'Home', raw: s }
    if (bIsUs && !aIsUs) return { opponent: a, venue: 'Away', raw: s }
    return { opponent: b || a, venue: 'Home', raw: s }
  }
  return { opponent: s, venue: 'Home', raw: s }
}
function isUs(text, teamName, teamTag) {
  const t = text.toLowerCase()
  return t.includes(teamName.toLowerCase()) || t.includes(teamTag.toLowerCase())
}
