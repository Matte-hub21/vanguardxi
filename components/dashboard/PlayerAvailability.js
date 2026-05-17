'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { listPlayers } from '@/lib/services/playerService'
import { getMatchAttendance } from '@/lib/services/attendanceService'
import { getUpcomingMatches } from '@/lib/services/matchService'
import { useRealtimeTable } from '@/lib/hooks/useRealtimeTable'
import { usePresence } from '@/lib/hooks/usePresence'
import { PresenceDot } from '@/components/common/PresenceDot'
import { Check, X, HelpCircle, Clock } from 'lucide-react'

const STATUS = {
  confirmed: { icon: Check, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', label: 'Ready' },
  declined: { icon: X, color: 'text-red-400 bg-red-400/10 border-red-400/20', label: 'Out' },
  maybe: { icon: HelpCircle, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', label: 'Maybe' },
  pending: { icon: Clock, color: 'text-muted-foreground bg-white/5 border-white/10', label: 'Pending' },
}

export function PlayerAvailability() {
  const [players, setPlayers] = useState([])
  const [att, setAtt] = useState([])
  const [match, setMatch] = useState(null)
  const { byId } = usePresence()

  useEffect(() => {
    (async () => {
      const ups = await getUpcomingMatches(1)
      const m = ups[0]
      setMatch(m)
      const [ps, as] = await Promise.all([listPlayers(), getMatchAttendance(m.id)])
      setPlayers(ps); setAtt(as)
    })()
  }, [])

  // Live: when attendance changes for the current match, refresh
  useRealtimeTable('attendance', async (payload) => {
    if (!match) return
    if (payload.new?.match_id !== match.id && payload.old?.match_id !== match.id) return
    const next = await getMatchAttendance(match.id)
    setAtt(next)
  })

  const counts = att.reduce((acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }), {})

  return (
    <GlassCard className="col-span-12 lg:col-span-7 p-0" delay={0.2}>
      <div className="px-5 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Roster Status</div>
            <div className="font-display text-xl font-bold mt-1">Player Availability</div>
            {match && <div className="text-xs text-muted-foreground mt-1">For: vs {match.opponent}</div>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-400/10 border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/15">{counts.confirmed || 0} Ready</Badge>
            <Badge className="bg-amber-400/10 border-amber-400/30 text-amber-400 hover:bg-amber-400/15">{counts.maybe || 0} Maybe</Badge>
            <Badge className="bg-red-400/10 border-red-400/30 text-red-400 hover:bg-red-400/15">{counts.declined || 0} Out</Badge>
          </div>
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {players.map(p => {
          const a = att.find(x => x.player_id === p.id)
          const s = STATUS[a?.status || 'pending']
          const Icon = s.icon
          const presence = byId[p.id]?.status || 'offline'
          return (
            <motion.div layout key={p.id} className="glass rounded-lg p-2.5 flex items-center gap-2.5">
              <div className="relative">
                <Avatar className="h-9 w-9 border border-white/10">
                  <AvatarImage src={p.avatar} />
                  <AvatarFallback className="bg-[#D4AF37]/10 text-[#D4AF37] text-xs">{p.gamertag.slice(0,2)}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5"><PresenceDot status={presence} /></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{p.gamertag}</div>
                <div className="text-[10px] text-muted-foreground">{p.position} · #{p.number}</div>
              </div>
              <div className={`h-6 w-6 rounded-md flex items-center justify-center border ${s.color}`}>
                <Icon className="h-3 w-3" />
              </div>
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}
