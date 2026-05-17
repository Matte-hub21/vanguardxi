/**
 * Match Analysis Service
 * Calcola statistiche da eventi tracciati
 */

export const EVENT_TYPES = {
  SHOT: 'shot',
  PASS: 'pass',
  INTERCEPT: 'intercept',
  TACKLE: 'tackle',
  DRIBBLE: 'dribble',
  FOUL: 'foul',
  GOAL: 'goal',
  SAVE: 'save',
  HEADER: 'header',
}

export const SHOT_ACCURACY = {
  ON_TARGET: 'on_target',
  WIDE: 'wide',
  HIGH: 'high',
  BLOCKED: 'blocked',
  GOAL: 'goal',
}

/**
 * Calcola statistiche aggregate per un giocatore
 */
export function calculatePlayerStats(events, playerId) {
  const playerEvents = events.filter(e => e.player_id === playerId)

  const shots = playerEvents.filter(e => e.type === EVENT_TYPES.SHOT)
  const passes = playerEvents.filter(e => e.type === EVENT_TYPES.PASS)
  const completedPasses = passes.filter(e => e.completed === true)
  const intercepts = playerEvents.filter(e => e.type === EVENT_TYPES.INTERCEPT)
  const tackles = playerEvents.filter(e => e.type === EVENT_TYPES.TACKLE)
  const dribbles = playerEvents.filter(e => e.type === EVENT_TYPES.DRIBBLE)
  const fouls = playerEvents.filter(e => e.type === EVENT_TYPES.FOUL)
  const goals = playerEvents.filter(e => e.type === EVENT_TYPES.GOAL)
  const saves = playerEvents.filter(e => e.type === EVENT_TYPES.SAVE)

  const shotsOnTarget = shots.filter(e => e.accuracy === SHOT_ACCURACY.ON_TARGET || e.accuracy === SHOT_ACCURACY.GOAL)

  return {
    player_id: playerId,
    total_events: playerEvents.length,
    shots: shots.length,
    shots_on_target: shotsOnTarget.length,
    shot_accuracy: shots.length > 0 ? Math.round((shotsOnTarget.length / shots.length) * 100) : 0,
    goals: goals.length,
    passes: passes.length,
    completed_passes: completedPasses.length,
    pass_accuracy: passes.length > 0 ? Math.round((completedPasses.length / passes.length) * 100) : 0,
    intercepts: intercepts.length,
    tackles: tackles.length,
    dribbles: dribbles.length,
    fouls_committed: fouls.length,
    saves: saves.length,
    headers: playerEvents.filter(e => e.type === EVENT_TYPES.HEADER).length,
    rating: calculatePlayerRating(playerEvents),
  }
}

/**
 * Calcola rating complessivo basato su eventi
 */
function calculatePlayerRating(events) {
  if (events.length === 0) return 0

  let points = 0

  events.forEach(e => {
    switch (e.type) {
      case EVENT_TYPES.GOAL:
        points += 30
        break
      case EVENT_TYPES.SHOT:
        points += e.accuracy === SHOT_ACCURACY.GOAL ? 30 : e.accuracy === SHOT_ACCURACY.ON_TARGET ? 5 : 1
        break
      case EVENT_TYPES.PASS:
        points += e.completed ? 2 : -1
        break
      case EVENT_TYPES.INTERCEPT:
        points += 5
        break
      case EVENT_TYPES.TACKLE:
        points += 4
        break
      case EVENT_TYPES.DRIBBLE:
        points += e.success ? 3 : 1
        break
      case EVENT_TYPES.FOUL:
        points -= 2
        break
      case EVENT_TYPES.SAVE:
        points += 8
        break
      default:
        break
    }
  })

  // Normalizza a scala 1-10
  const rating = Math.min(10, Math.max(1, 5 + points / events.length))
  return Math.round(rating * 10) / 10
}

/**
 * Calcola statistiche squadra da tutti gli eventi
 */
export function calculateTeamStats(events, teamId) {
  const teamEvents = events.filter(e => e.team_id === teamId)

  const shots = teamEvents.filter(e => e.type === EVENT_TYPES.SHOT)
  const passes = teamEvents.filter(e => e.type === EVENT_TYPES.PASS)
  const completedPasses = passes.filter(e => e.completed === true)
  const goals = teamEvents.filter(e => e.type === EVENT_TYPES.GOAL)

  return {
    team_id: teamId,
    total_events: teamEvents.length,
    shots: shots.length,
    goals: goals.length,
    passes: passes.length,
    completed_passes: completedPasses.length,
    pass_accuracy: passes.length > 0 ? Math.round((completedPasses.length / passes.length) * 100) : 0,
    possession_events: teamEvents.length,
    intercepts: teamEvents.filter(e => e.type === EVENT_TYPES.INTERCEPT).length,
    tackles: teamEvents.filter(e => e.type === EVENT_TYPES.TACKLE).length,
    fouls: teamEvents.filter(e => e.type === EVENT_TYPES.FOUL).length,
  }
}

/**
 * Calcola timeline con eventi aggregati per minuto
 */
export function calculateTimelineStats(events) {
  const timeline = {}

  events.forEach(e => {
    const minute = Math.floor(e.minute / 5) * 5 // Raggruppa per 5 minuti
    if (!timeline[minute]) {
      timeline[minute] = { goals: 0, shots: 0, passes: 0, minute }
    }

    if (e.type === EVENT_TYPES.GOAL) timeline[minute].goals++
    if (e.type === EVENT_TYPES.SHOT) timeline[minute].shots++
    if (e.type === EVENT_TYPES.PASS && e.completed) timeline[minute].passes++
  })

  return Object.values(timeline).sort((a, b) => a.minute - b.minute)
}

/**
 * Calcola Possession % approssimativo
 */
export function calculatePossession(events, team1Id, team2Id) {
  const team1Events = events.filter(e => e.team_id === team1Id).length
  const team2Events = events.filter(e => e.team_id === team2Id).length
  const total = team1Events + team2Events

  if (total === 0) return { team1: 50, team2: 50 }

  return {
    team1: Math.round((team1Events / total) * 100),
    team2: Math.round((team2Events / total) * 100),
  }
}

/**
 * Identifica Top Performers
 */
export function getTopPerformers(allPlayerStats, limit = 3) {
  return allPlayerStats.sort((a, b) => b.rating - a.rating).slice(0, limit)
}
