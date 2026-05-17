'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/common/GlassCard'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { listPlayers } from '@/lib/services/playerService'
import { listStats } from '@/lib/services/statsService'
import { Search, Crown, Star } from 'lucide-react'

const POSITION_COLORS = {
  GK: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  CB: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  LB: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  RB: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  CDM: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  CM: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  CAM: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30',
  LW: 'bg-pink-400/10 text-pink-400 border-pink-400/30',
  RW: 'bg-pink-400/10 text-pink-400 border-pink-400/30',
  ST: 'bg-red-400/10 text-red-400 border-red-400/30',
}

function PlayerCard({ p, stats, i }) {
  const totals = stats.filter(s => s.player_id === p.id).reduce((acc, s) => ({
    goals: acc.goals + s.goals, assists: acc.assists + s.assists, motm: acc.motm + (s.motm ? 1 : 0)
  }), { goals: 0, assists: 0, motm: 0 })
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      whileHover={{ y: -4 }}
    >
      <div className="glass rounded-xl overflow-hidden relative group hover:border-[#D4AF37]/40 transition-colors">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#D4AF37]/10 blur-2xl group-hover:bg-[#D4AF37]/20 transition" />
        <div className="relative p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">#{p.number}</div>
              <div className="font-display text-5xl font-black gold-text leading-none mt-1">{p.rating}</div>
              <Badge variant="outline" className={`mt-2 ${POSITION_COLORS[p.position] || ''}`}>{p.position}</Badge>
            </div>
            <Avatar className="h-16 w-16 border-2 border-[#D4AF37]/30">
              <AvatarImage src={p.avatar} />
              <AvatarFallback className="bg-[#D4AF37]/10 text-[#D4AF37]">{p.gamertag.slice(0,2)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <div className="font-display text-lg font-bold">{p.gamertag}</div>
              {p.role === 'Captain' && <Crown className="h-4 w-4 text-[#D4AF37]" />}
            </div>
            <div className="text-xs text-muted-foreground">{p.name}{p.role ? ` · ${p.role}` : ''}</div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="glass rounded-md py-2">
              <div className="font-display font-bold text-lg">{totals.goals}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Goals</div>
            </div>
            <div className="glass rounded-md py-2">
              <div className="font-display font-bold text-lg">{totals.assists}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Assists</div>
            </div>
            <div className="glass rounded-md py-2">
              <div className="font-display font-bold text-lg flex items-center justify-center gap-1">{totals.motm}<Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" /></div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">MOTM</div>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            {[['PAC', p.pace], ['SHO', p.shooting], ['PAS', p.passing], ['DRI', p.dribbling], ['DEF', p.defending], ['PHY', p.physical]].map(([label, v]) => (
              <div key={label} className="flex items-center gap-2">
                <div className="text-[10px] w-7 text-muted-foreground font-semibold">{label}</div>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5C518]" style={{ width: `${v}%` }} />
                </div>
                <div className="text-[10px] w-6 text-right font-semibold">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function PlayersPage() {
  const [players, setPlayers] = useState([])
  const [stats, setStats] = useState([])
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    Promise.all([listPlayers(), listStats()]).then(([p, s]) => { setPlayers(p); setStats(s) })
  }, [])

  const filtered = players.filter(p => {
    if (q && !`${p.gamertag} ${p.name} ${p.position}`.toLowerCase().includes(q.toLowerCase())) return false
    if (filter === 'all') return true
    if (filter === 'gk') return p.position === 'GK'
    if (filter === 'def') return ['CB','LB','RB'].includes(p.position)
    if (filter === 'mid') return ['CM','CDM','CAM'].includes(p.position)
    if (filter === 'att') return ['ST','LW','RW'].includes(p.position)
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Squad</div>
          <h1 className="font-display text-3xl lg:text-4xl font-black mt-1">Roster</h1>
          <p className="text-sm text-muted-foreground mt-1">14 active players · Average rating <span className="text-[#D4AF37] font-semibold">{Math.round(players.reduce((s,p) => s + p.rating, 0) / (players.length || 1))}</span></p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search players..." className="pl-9 bg-white/[0.03] border-white/5" />
          </div>
        </div>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-white/[0.03] border border-white/5">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]">All</TabsTrigger>
          <TabsTrigger value="gk" className="data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]">GK</TabsTrigger>
          <TabsTrigger value="def" className="data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]">Defenders</TabsTrigger>
          <TabsTrigger value="mid" className="data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]">Midfield</TabsTrigger>
          <TabsTrigger value="att" className="data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]">Attack</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p, i) => <PlayerCard key={p.id} p={p} stats={stats} i={i} />)}
      </div>
    </div>
  )
}
