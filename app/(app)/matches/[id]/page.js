'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/common/GlassCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { getMatch } from '@/lib/services/matchService'
import { listPlayers } from '@/lib/services/playerService'
import { getMatchAttendance, setAttendance } from '@/lib/services/attendanceService'
import { getMatchStats } from '@/lib/services/statsService'
import { subscribeMatch } from '@/lib/services/realtimeService'
import { ArrowLeft, Star, Check, X, HelpCircle, Trophy, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { StatsUpload } from '@/components/matchroom/StatsUpload'

const FORMATION_433 = {
  GK: [[50, 90]],
  DEF: [[15, 70], [38, 75], [62, 75], [85, 70]],
  MID: [[28, 50], [50, 45], [72, 50]],
  ATT: [[20, 22], [50, 18], [80, 22]],
}

function pickFormation(players) {
  const byPos = (codes) => players.filter(p => codes.includes(p.position)).sort((a,b) => b.rating - a.rating)
  const gk = byPos(['GK']).slice(0, 1)
  const def = byPos(['CB','LB','RB']).slice(0, 4)
  const mid = byPos(['CM','CDM','CAM']).slice(0, 3)
  const att = byPos(['ST','LW','RW']).slice(0, 3)
  const out = []
  gk.forEach((p, i) => out.push({ ...p, pos: FORMATION_433.GK[i] }))
  def.forEach((p, i) => out.push({ ...p, pos: FORMATION_433.DEF[i] }))
  mid.forEach((p, i) => out.push({ ...p, pos: FORMATION_433.MID[i] }))
  att.forEach((p, i) => out.push({ ...p, pos: FORMATION_433.ATT[i] }))
  return out
}

export default function MatchroomPage() {
  const { id } = useParams()
  const router = useRouter()
  const [match, setMatch] = useState(null)
  const [players, setPlayers] = useState([])
  const [att, setAtt] = useState([])
  const [stats, setStats] = useState([])

  useEffect(() => { refetch() }, [id])

  // Live subscriptions: any change to this match's attendance/stats/score → auto-refresh
  useEffect(() => {
    if (!id) return
    return subscribeMatch(id, {
      onAttendance: () => getMatchAttendance(id).then(setAtt),
      onStats: () => getMatchStats(id).then(setStats),
      onMatch: () => getMatch(id).then(setMatch),
    })
  }, [id])

  const refetch = async () => {
    const [m, ps, ats, sts] = await Promise.all([getMatch(id), listPlayers(), getMatchAttendance(id), getMatchStats(id)])
    setMatch(m); setPlayers(ps); setAtt(ats); setStats(sts)
  }

  const onSetStatus = async (playerId, status) => {
    await setAttendance(id, playerId, status)
    const next = await getMatchAttendance(id)
    setAtt(next)
    toast.success('Availability updated')
  }

  if (!match) return <div className="text-muted-foreground">Loading matchroom...</div>

  const lineup = pickFormation(players)
  const isPast = match.status === 'completed'
  const motm = stats.find(s => s.motm)
  const motmPlayer = motm ? players.find(p => p.id === motm.player_id) : null

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to matches
      </button>

      {/* Match header */}
      <GlassCard className="p-0 overflow-hidden gold-border">
        <div className="relative p-6 lg:p-10">
          <div className="absolute inset-0 radial-gold opacity-60" />
          <div className="absolute -top-32 -right-20 h-64 w-64 rounded-full bg-[#D4AF37]/20 blur-[100px]" />
          <div className="relative grid grid-cols-3 items-center gap-4">
            <div className="text-center">
              <div className="text-5xl lg:text-6xl mb-3">🛡️</div>
              <div className="font-display text-xl lg:text-2xl font-bold">Vanguard XI</div>
              <div className="text-xs text-muted-foreground mt-1">VGD · Home</div>
            </div>
            <div className="text-center">
              <Badge className="bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37] mb-2 hover:bg-[#D4AF37]/15">{match.competition} · {match.venue}</Badge>
              {isPast ? (
                <div className="font-display text-5xl lg:text-7xl font-black">
                  <span className={match.result === 'W' ? 'gold-text' : 'text-white'}>{match.score_us}</span>
                  <span className="mx-3 text-muted-foreground text-3xl">–</span>
                  <span className="text-white/80">{match.score_them}</span>
                </div>
              ) : (
                <div className="font-display text-5xl lg:text-7xl font-black gold-text">VS</div>
              )}
              <div className="text-xs lg:text-sm text-muted-foreground mt-2">{format(new Date(match.scheduled_at), 'EEEE, MMM d, yyyy · HH:mm')}</div>
              {isPast && match.result && (
                <Badge variant="outline" className={`mt-3 ${match.result === 'W' ? 'border-emerald-400/30 text-emerald-400 bg-emerald-400/10' : match.result === 'L' ? 'border-red-400/30 text-red-400 bg-red-400/10' : 'border-amber-400/30 text-amber-400 bg-amber-400/10'}`}>
                  {match.result === 'W' ? 'Victory' : match.result === 'L' ? 'Defeat' : 'Draw'}
                </Badge>
              )}
            </div>
            <div className="text-center">
              <div className="text-5xl lg:text-6xl mb-3">{match.opponent_logo}</div>
              <div className="font-display text-xl lg:text-2xl font-bold">{match.opponent}</div>
              <div className="text-xs text-muted-foreground mt-1">{match.opponent_tag}</div>
            </div>
          </div>
        </div>
      </GlassCard>

      {motmPlayer && (
        <GlassCard className="gold-border bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-transparent">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl gold-border flex items-center justify-center bg-[#D4AF37]/10">
              <Trophy className="h-7 w-7 text-[#D4AF37]" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Man of the Match</div>
              <div className="font-display text-xl font-bold mt-0.5">{motmPlayer.gamertag}</div>
              <div className="text-xs text-muted-foreground">{motm.goals}G · {motm.assists}A · Rating {motm.rating}</div>
            </div>
            <Avatar className="h-14 w-14 border-2 border-[#D4AF37]/50">
              <AvatarImage src={motmPlayer.avatar} />
              <AvatarFallback>{motmPlayer.gamertag.slice(0,2)}</AvatarFallback>
            </Avatar>
          </div>
        </GlassCard>
      )}

      <Tabs defaultValue="lineup">
        <TabsList className="bg-white/[0.03] border border-white/5">
          <TabsTrigger value="lineup" className="data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]">Lineup</TabsTrigger>
          <TabsTrigger value="attendance" className="data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]">Attendance</TabsTrigger>
          {isPast && <TabsTrigger value="stats" className="data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]">Stats</TabsTrigger>}
          <TabsTrigger value="upload" className="data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]"><Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="lineup" className="mt-5">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Starting XI</div>
                <div className="font-display text-lg font-bold">Formation 4-3-3</div>
              </div>
              <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37]">Auto-picked by rating</Badge>
            </div>
            <div className="relative aspect-[3/4] sm:aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-b from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 border border-emerald-500/10">
              {/* pitch lines */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-white/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-12 border-l border-r border-b border-white/10" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 border-l border-r border-t border-white/10" />
              </div>
              {lineup.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.pos[0]}%`, top: `${p.pos[1]}%` }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative">
                      <Avatar className="h-10 w-10 lg:h-12 lg:w-12 border-2 border-[#D4AF37]/60 bg-black">
                        <AvatarImage src={p.avatar} />
                        <AvatarFallback className="text-xs">{p.gamertag.slice(0,2)}</AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">{p.number}</span>
                    </div>
                    <div className="text-[10px] lg:text-xs font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded">{p.gamertag}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="attendance" className="mt-5">
          <GlassCard className="p-6">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-1">RSVP</div>
            <div className="font-display text-lg font-bold mb-4">Player Attendance</div>
            <div className="space-y-2">
              {players.map(p => {
                const a = att.find(x => x.player_id === p.id)
                const status = a?.status || 'pending'
                return (
                  <div key={p.id} className="glass rounded-lg p-3 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-white/10"><AvatarImage src={p.avatar} /><AvatarFallback>{p.gamertag.slice(0,2)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{p.gamertag}</div>
                      <div className="text-xs text-muted-foreground">{p.position} · #{p.number} · Rating {p.rating}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant={status === 'confirmed' ? 'default' : 'outline'} className={status === 'confirmed' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'border-white/10'} onClick={() => onSetStatus(p.id, 'confirmed')}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant={status === 'maybe' ? 'default' : 'outline'} className={status === 'maybe' ? 'bg-amber-500 hover:bg-amber-600 text-black' : 'border-white/10'} onClick={() => onSetStatus(p.id, 'maybe')}>
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant={status === 'declined' ? 'default' : 'outline'} className={status === 'declined' ? 'bg-red-500 hover:bg-red-600 text-white' : 'border-white/10'} onClick={() => onSetStatus(p.id, 'declined')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </TabsContent>

        {isPast && (
          <TabsContent value="stats" className="mt-5">
            <GlassCard className="p-6">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-1">Match Report</div>
              <div className="font-display text-lg font-bold mb-4">Player Statistics</div>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
                      <th className="text-left px-2 py-2">Player</th>
                      <th className="text-center px-2 py-2">G</th>
                      <th className="text-center px-2 py-2">A</th>
                      <th className="text-center px-2 py-2">T</th>
                      <th className="text-center px-2 py-2">P</th>
                      <th className="text-right px-2 py-2">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.sort((a,b) => b.rating - a.rating).map(s => {
                      const p = players.find(x => x.id === s.player_id)
                      if (!p) return null
                      return (
                        <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="px-2 py-2.5">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7"><AvatarImage src={p.avatar} /><AvatarFallback className="text-[10px]">{p.gamertag.slice(0,2)}</AvatarFallback></Avatar>
                              <div>
                                <div className="font-semibold flex items-center gap-1">{p.gamertag} {s.motm && <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />}</div>
                                <div className="text-[10px] text-muted-foreground">{p.position}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center font-semibold">{s.goals}</td>
                          <td className="text-center">{s.assists}</td>
                          <td className="text-center text-muted-foreground">{s.tackles}</td>
                          <td className="text-center text-muted-foreground">{s.passes}</td>
                          <td className="text-right">
                            <span className={`font-display font-bold ${s.rating >= 8 ? 'gold-text' : s.rating >= 7 ? 'text-emerald-400' : 'text-white'}`}>{s.rating}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </TabsContent>
        )}

        <TabsContent value="upload" className="mt-5">
          <StatsUpload matchId={id} onSaved={refetch} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
