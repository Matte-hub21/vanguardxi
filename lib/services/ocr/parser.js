// Simple Levenshtein for fuzzy matching gamertags
function lev(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase()
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    const cost = a[i-1] === b[j-1] ? 0 : 1
    dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost)
  }
  return dp[a.length][b.length]
}

export function matchPlayers(extractedPlayers, roster) {
  return extractedPlayers.map(ep => {
    let best = null, bestScore = Infinity
    for (const r of roster) {
      const s = Math.min(lev(ep.name, r.gamertag), lev(ep.name, r.name))
      if (s < bestScore) { bestScore = s; best = r }
    }
    const matched = bestScore <= Math.max(2, Math.floor(ep.name.length * 0.3))
    return { ...ep, player_id: matched ? best.id : null, matched_to: matched ? best.gamertag : null, match_confidence: matched ? 1 - bestScore / Math.max(ep.name.length, 1) : 0 }
  })
}

export function pickMVP(rows) {
  if (!rows.length) return null
  return [...rows].sort((a,b) => b.rating - a.rating)[0]
}
