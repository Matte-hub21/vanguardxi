// Seeded demo data for Vanguard XI — fully local, deterministic.
export const TEAM = {
  id: 'vanguard-xi',
  name: 'Vanguard XI',
  tag: 'VGD',
  motto: 'Forged in Gold',
  founded: '2024',
  league: 'FC Pro Clubs Premier Division',
  rank: 3,
  record: { wins: 24, draws: 4, losses: 6 },
}

export const PLAYERS = [
  { id: 'p1', gamertag: 'GHOST_07', name: 'Marco Vidal', position: 'GK', number: 1, rating: 86, pace: 62, shooting: 30, passing: 70, dribbling: 55, defending: 40, physical: 82, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ghost07&backgroundColor=1a1a22', form: 8.2, role_name: 'captain', role_level: 1 },
  { id: 'p2', gamertag: 'IronWall', name: 'Diego Salas', position: 'CB', number: 4, rating: 84, pace: 71, shooting: 48, passing: 72, dribbling: 65, defending: 88, physical: 85, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ironwall&backgroundColor=1a1a22', form: 7.8, role_name: 'player', role_level: 3 },
  { id: 'p3', gamertag: 'Vanguard_King', name: 'Liam Carter', position: 'CB', number: 5, rating: 85, pace: 74, shooting: 52, passing: 75, dribbling: 68, defending: 89, physical: 86, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vking&backgroundColor=1a1a22', form: 8.1, role_name: 'vice_captain', role_level: 2 },
  { id: 'p4', gamertag: 'BlitzLB', name: 'Andre Mensah', position: 'LB', number: 3, rating: 82, pace: 88, shooting: 60, passing: 78, dribbling: 80, defending: 79, physical: 76, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=blitzlb&backgroundColor=1a1a22', form: 7.5, role_name: 'player', role_level: 3 },
  { id: 'p5', gamertag: 'RB_Phantom', name: 'Yuki Tanaka', position: 'RB', number: 2, rating: 83, pace: 89, shooting: 58, passing: 76, dribbling: 82, defending: 80, physical: 74, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=phantom&backgroundColor=1a1a22', form: 7.9, role_name: 'player', role_level: 3 },
  { id: 'p6', gamertag: 'Maestro_10', name: 'Rafael Costa', position: 'CM', number: 8, rating: 87, pace: 78, shooting: 80, passing: 89, dribbling: 88, defending: 65, physical: 75, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=maestro&backgroundColor=1a1a22', form: 8.6, role_name: 'player', role_level: 3 },
  { id: 'p7', gamertag: 'NeoStrike', name: 'Kai Werner', position: 'CM', number: 6, rating: 85, pace: 76, shooting: 74, passing: 86, dribbling: 82, defending: 78, physical: 80, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=neo&backgroundColor=1a1a22', form: 8.0, role_name: 'player', role_level: 3 },
  { id: 'p8', gamertag: 'CDM_Wall', name: 'Omar Sissoko', position: 'CDM', number: 14, rating: 84, pace: 72, shooting: 65, passing: 82, dribbling: 76, defending: 86, physical: 84, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=cdmwall&backgroundColor=1a1a22', form: 7.6, role_name: 'player', role_level: 3 },
  { id: 'p9', gamertag: 'LW_Bolt', name: 'Theo Larsen', position: 'LW', number: 11, rating: 86, pace: 92, shooting: 82, passing: 78, dribbling: 89, defending: 45, physical: 70, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bolt&backgroundColor=1a1a22', form: 8.4, role_name: 'player', role_level: 3 },
  { id: 'p10', gamertag: 'RW_Fury', name: 'Carlos Rivas', position: 'RW', number: 7, rating: 85, pace: 91, shooting: 80, passing: 76, dribbling: 88, defending: 42, physical: 71, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=fury&backgroundColor=1a1a22', form: 8.2, role_name: 'player', role_level: 3 },
  { id: 'p11', gamertag: 'GoldenBoot', name: 'Viktor Pavlov', position: 'ST', number: 9, rating: 88, pace: 84, shooting: 92, dribbling: 84, passing: 72, defending: 38, physical: 82, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gboot&backgroundColor=1a1a22', form: 8.9, role_name: 'player', role_level: 3 },
  { id: 'p12', gamertag: 'Subzero', name: 'Felix Hoffmann', position: 'CAM', number: 21, rating: 83, pace: 80, shooting: 78, passing: 84, dribbling: 86, defending: 50, physical: 70, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=subzero&backgroundColor=1a1a22', form: 7.7, role_name: 'player', role_level: 3 },
  { id: 'p13', gamertag: 'BackupKeeper', name: 'Niko Petrov', position: 'GK', number: 12, rating: 80, pace: 58, shooting: 26, passing: 65, dribbling: 50, defending: 38, physical: 78, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=backup&backgroundColor=1a1a22', form: 7.0, role_name: 'player', role_level: 3 },
  { id: 'p14', gamertag: 'Reserve_ST', name: 'Mateo Silva', position: 'ST', number: 19, rating: 81, pace: 82, shooting: 84, passing: 68, dribbling: 80, defending: 36, physical: 76, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=resst&backgroundColor=1a1a22', form: 7.4, role_name: 'player', role_level: 3 },
]

const now = Date.now()
const day = 86400000

export const MATCHES = [
  // Upcoming
  { id: 'm1', opponent: 'Phoenix Reign', opponent_tag: 'PHX', opponent_logo: '🔥', scheduled_at: new Date(now + day*1 + 3600000*3).toISOString(), competition: 'League', status: 'upcoming', venue: 'Home', importance: 'high' },
  { id: 'm2', opponent: 'Nightwolves FC', opponent_tag: 'NWF', opponent_logo: '🐺', scheduled_at: new Date(now + day*3 + 3600000*4).toISOString(), competition: 'Cup', status: 'upcoming', venue: 'Away', importance: 'medium' },
  { id: 'm3', opponent: 'Crimson Tide', opponent_tag: 'CRT', opponent_logo: '🌊', scheduled_at: new Date(now + day*5).toISOString(), competition: 'League', status: 'upcoming', venue: 'Home', importance: 'medium' },
  { id: 'm4', opponent: 'Storm City', opponent_tag: 'STC', opponent_logo: '⚡', scheduled_at: new Date(now + day*8).toISOString(), competition: 'League', status: 'upcoming', venue: 'Away', importance: 'high' },
  { id: 'm5', opponent: 'Iron Saints', opponent_tag: 'IRN', opponent_logo: '⚔️', scheduled_at: new Date(now + day*12).toISOString(), competition: 'Friendly', status: 'upcoming', venue: 'Home', importance: 'low' },
  // Past
  { id: 'm6', opponent: 'Shadow Eagles', opponent_tag: 'SHE', opponent_logo: '🦅', scheduled_at: new Date(now - day*2).toISOString(), competition: 'League', status: 'completed', venue: 'Home', score_us: 4, score_them: 1, result: 'W' },
  { id: 'm7', opponent: 'Royal Guards', opponent_tag: 'RYG', opponent_logo: '👑', scheduled_at: new Date(now - day*5).toISOString(), competition: 'League', status: 'completed', venue: 'Away', score_us: 2, score_them: 2, result: 'D' },
  { id: 'm8', opponent: 'Apex Predators', opponent_tag: 'APX', opponent_logo: '🦁', scheduled_at: new Date(now - day*8).toISOString(), competition: 'Cup', status: 'completed', venue: 'Home', score_us: 3, score_them: 0, result: 'W' },
  { id: 'm9', opponent: 'Dark Horizon', opponent_tag: 'DKH', opponent_logo: '🌑', scheduled_at: new Date(now - day*11).toISOString(), competition: 'League', status: 'completed', venue: 'Away', score_us: 1, score_them: 2, result: 'L' },
  { id: 'm10', opponent: 'Titan Strike', opponent_tag: 'TTS', opponent_logo: '⚒️', scheduled_at: new Date(now - day*14).toISOString(), competition: 'League', status: 'completed', venue: 'Home', score_us: 5, score_them: 2, result: 'W' },
  { id: 'm11', opponent: 'Velocity FC', opponent_tag: 'VEL', opponent_logo: '🚀', scheduled_at: new Date(now - day*17).toISOString(), competition: 'League', status: 'completed', venue: 'Away', score_us: 3, score_them: 1, result: 'W' },
  { id: 'm12', opponent: 'Onyx United', opponent_tag: 'ONX', opponent_logo: '🖤', scheduled_at: new Date(now - day*20).toISOString(), competition: 'Cup', status: 'completed', venue: 'Home', score_us: 2, score_them: 0, result: 'W' },
  { id: 'm13', opponent: 'Vortex SC', opponent_tag: 'VRX', opponent_logo: '🌀', scheduled_at: new Date(now - day*24).toISOString(), competition: 'League', status: 'completed', venue: 'Away', score_us: 0, score_them: 1, result: 'L' },
]

// Per-match attendance: status one of confirmed | maybe | declined | pending
function seedAttendance() {
  const out = []
  const upcomingIds = ['m1','m2','m3','m4','m5']
  const statuses = ['confirmed','confirmed','confirmed','confirmed','maybe','confirmed','confirmed','maybe','confirmed','confirmed','declined','confirmed','pending','maybe']
  upcomingIds.forEach((mid, mi) => {
    PLAYERS.forEach((p, pi) => {
      out.push({ id: `att-${mid}-${p.id}`, match_id: mid, player_id: p.id, status: statuses[(pi+mi)%statuses.length] })
    })
  })
  return out
}
export const ATTENDANCE = seedAttendance()

// Stats per player per completed match
function seedStats() {
  const out = []
  const completed = ['m6','m7','m8','m9','m10','m11','m12','m13']
  completed.forEach((mid, mi) => {
    PLAYERS.slice(0,11).forEach((p, pi) => {
      const base = (p.rating - 75) / 14
      const goals = p.position === 'ST' || p.position === 'LW' || p.position === 'RW' ? Math.max(0, Math.round(base*2 + Math.sin(mi+pi)*1.2)) : (p.position === 'CM' || p.position === 'CAM' ? Math.max(0, Math.round(base + Math.sin(mi*pi)*0.8)) : 0)
      const assists = (p.position === 'CM' || p.position === 'CAM' || p.position === 'LW' || p.position === 'RW') ? Math.max(0, Math.round(base*1.5 + Math.cos(mi+pi)*1)) : Math.max(0, Math.round(Math.cos(mi*pi)*0.6))
      const tackles = (p.position === 'CB' || p.position === 'LB' || p.position === 'RB' || p.position === 'CDM') ? Math.max(2, Math.round(4 + Math.sin(mi+pi)*2)) : Math.max(0, Math.round(1+Math.cos(mi+pi)))
      const rating = Math.min(10, Math.max(5.5, p.form + (Math.sin(mi*pi+1)*0.6)))
      out.push({ id: `st-${mid}-${p.id}`, match_id: mid, player_id: p.id, goals, assists, tackles, passes: 35 + Math.floor(Math.random()*40), rating: Number(rating.toFixed(1)), motm: false })
    })
  })
  // Mark MOTM per match (top rating)
  completed.forEach(mid => {
    const ms = out.filter(s => s.match_id === mid).sort((a,b) => b.rating - a.rating)
    if (ms[0]) ms[0].motm = true
  })
  return out
}
export const STATS = seedStats()

export const ANNOUNCEMENTS = [
  { id: 'a1', title: 'Squad Meeting — Tactics Review', body: 'Discord voice tonight 21:00 CET. Reviewing the Phoenix Reign matchup. Required for starting XI.', created_at: new Date(now - 3600000*2).toISOString(), author: 'GHOST_07', pinned: true },
  { id: 'a2', title: 'New Kit Drop', body: 'The 2025/26 third kit (Onyx & Gold) is now available in the team store.', created_at: new Date(now - 3600000*12).toISOString(), author: 'Coach', pinned: false },
  { id: 'a3', title: 'Promotion Race', body: 'We are 3 points off the top. Win the next two and we control our own destiny.', created_at: new Date(now - 3600000*26).toISOString(), author: 'Vanguard_King', pinned: false },
  { id: 'a4', title: 'Scrim vs Apex Predators — Friday', body: 'Optional scrim to test the new 4-2-3-1. DM if interested.', created_at: new Date(now - 3600000*40).toISOString(), author: 'Maestro_10', pinned: false },
  { id: 'a5', title: 'Stat Submission Reminder', body: 'Submit your post-match screenshots in #stats within 1h of full-time.', created_at: new Date(now - 3600000*60).toISOString(), author: 'Coach', pinned: false },
  { id: 'a6', title: 'Tournament Bracket Released', body: 'FC Pro Clubs Invitational bracket dropped. We are seed #4. First round vs Onyx United.', created_at: new Date(now - 3600000*72).toISOString(), author: 'GHOST_07', pinned: false },
]

export const ACTIVITY = [
  { id: 'ac1', kind: 'goal', actor: 'GoldenBoot', text: 'scored a brace vs Shadow Eagles', created_at: new Date(now - 3600000*48).toISOString() },
  { id: 'ac2', kind: 'motm', actor: 'Maestro_10', text: 'earned MOTM with rating 9.2', created_at: new Date(now - 3600000*48).toISOString() },
  { id: 'ac3', kind: 'attendance', actor: 'NeoStrike', text: 'confirmed for vs Phoenix Reign', created_at: new Date(now - 3600000*5).toISOString() },
  { id: 'ac4', kind: 'match', actor: 'System', text: 'New match scheduled: vs Iron Saints', created_at: new Date(now - 3600000*8).toISOString() },
  { id: 'ac5', kind: 'announcement', actor: 'Coach', text: 'posted: New Kit Drop', created_at: new Date(now - 3600000*12).toISOString() },
  { id: 'ac6', kind: 'goal', actor: 'LW_Bolt', text: 'scored the winner vs Velocity FC', created_at: new Date(now - day*5).toISOString() },
  { id: 'ac7', kind: 'attendance', actor: 'IronWall', text: 'marked as maybe for vs Nightwolves FC', created_at: new Date(now - 3600000*3).toISOString() },
  { id: 'ac8', kind: 'assist', actor: 'Maestro_10', text: 'recorded 3 assists vs Titan Strike', created_at: new Date(now - day*8).toISOString() },
  { id: 'ac9', kind: 'win', actor: 'System', text: 'Vanguard XI won 5-2 vs Titan Strike', created_at: new Date(now - day*8).toISOString() },
  { id: 'ac10', kind: 'join', actor: 'Reserve_ST', text: 'joined the squad', created_at: new Date(now - day*10).toISOString() },
  { id: 'ac11', kind: 'goal', actor: 'GoldenBoot', text: 'scored a hat-trick vs Titan Strike', created_at: new Date(now - day*8).toISOString() },
  { id: 'ac12', kind: 'motm', actor: 'GHOST_07', text: 'earned MOTM with 6 saves vs Apex Predators', created_at: new Date(now - day*4).toISOString() },
]

// Formation templates
export const FORMATION_TEMPLATES = {
  '4-3-3': { name: '4-3-3 Classic', slots: { GK: 1, DEF: 4, MID: 3, FWD: 3 }, description: 'Balanced formation' },
  '4-2-3-1': { name: '4-2-3-1 Double Pivot', slots: { GK: 1, DEF: 4, CDM: 2, CAM: 1, FWD: 2, ST: 1 }, description: 'Defensive midfield focus' },
  '3-5-2': { name: '3-5-2 Wing Play', slots: { GK: 1, DEF: 3, MID: 5, FWD: 2 }, description: 'Wide attacking play' },
  '5-3-2': { name: '5-3-2 Defensive', slots: { GK: 1, DEF: 5, MID: 3, FWD: 2 }, description: 'Extra defensive cover' },
  '4-4-2': { name: '4-4-2 Classic', slots: { GK: 1, DEF: 4, MID: 4, FWD: 2 }, description: 'Traditional formation' },
}

// Generate formations for upcoming matches
function seedFormations() {
  const out = []
  const formations = ['4-3-3', '4-2-3-1', '3-5-2']
  const upcomingMatches = ['m1', 'm2', 'm3', 'm4', 'm5']
  
  upcomingMatches.forEach((matchId, idx) => {
    const formationCode = formations[idx % formations.length]
    const formationData = FORMATION_TEMPLATES[formationCode]
    
    out.push({
      id: `form-${matchId}`,
      match_id: matchId,
      formation_code: formationCode,
      formation_name: formationData.name,
      created_at: new Date(now - 3600000 * (5 - idx)).toISOString(),
      updated_at: new Date(now - 3600000 * (5 - idx)).toISOString(),
      players_positions: [], // Will be filled when captain sets lineup
      status: 'draft', // draft | confirmed
    })
  })
  
  return out
}
export const FORMATIONS = seedFormations()

// Callup announcements (convocati) for matches
function seedCallups() {
  const out = []
  const upcomingMatches = ['m1', 'm2', 'm3', 'm4', 'm5']
  
  // Some matches have published callups
  upcomingMatches.forEach((matchId, idx) => {
    if (idx < 2) { // Only first 2 matches have callups
      const startPlayers = idx === 0 
        ? ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11'] // 11 starters
        : ['p1', 'p2', 'p4', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13']
      
      const benches = idx === 0 
        ? ['p12', 'p13', 'p14']
        : ['p3', 'p5', 'p14']
      
      out.push({
        id: `callup-${matchId}`,
        match_id: matchId,
        players_called: startPlayers,
        substitutes: benches,
        message: idx === 0 
          ? 'Squad assembled for Phoenix Reign. Ready to dominate. 🔥'
          : 'Selection confirmed for Nightwolves clash. Full squad focus. 🐺',
        published_at: new Date(now - day + 3600000 * idx).toISOString(),
        created_by: 'p1', // Captain GHOST_07
        status: 'published',
        notifications_sent: true,
      })
    }
  })
  
  return out
}
export const CALLUPS = seedCallups()
