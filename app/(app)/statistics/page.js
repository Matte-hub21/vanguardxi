'use client'
import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/common/GlassCard'
import { listStats } from '@/lib/services/statsService'
import { listPlayers } from '@/lib/services/playerService'
import { listMatches } from '@/lib/services/matchService'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, RadarChart, PolarAngleAxis, PolarGrid, Radar } from 'recharts'
import { Trophy, Target, Crosshair, Award } from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'
import { format } from 'date-fns'

const GOLD = '#D4AF37'
const tooltipStyle = { background: '#0e0e12', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, fontSize: 12 }

export default function StatisticsPage() {
  const [stats, setStats] = useState([])
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])

  useEffect(() => {
    Promise.all([listStats(), listPlayers(), listMatches({ status: 'completed' })]).then(([s, p, m]) => {
      setStats(s); setPlayers(p); setMatches(m)
    })
  }, [])

  const completed = matches.sort((a,b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
  const totalGoals = stats.reduce((s, r) => s + r.goals, 0)
  const totalAssists = stats.reduce((s, r) => s + r.assists, 0)
  const wins = matches.filter(m => m.result === 'W').length
  const draws = matches.filter(m => m.result === 'D').length
  const losses = matches.filter(m => m.result === 'L').length

  const resultData = [
    { name: 'Wins', value: wins, color: GOLD },
    { name: 'Draws', value: draws, color: '#F5C518' },
    { name: 'Losses', value: losses, color: '#7a1f1f' },
  ]

  const goalsOverTime = completed.map(m => ({
    name: format(new Date(m.scheduled_at), 'MMM d'),
    Scored: m.score_us, Conceded: m.score_them,
  }))

  const topScorers = players.map(p => {
    const ps = stats.filter(s => s.player_id === p.id)
    return { gamertag: p.gamertag, avatar: p.avatar, position: p.position, goals: ps.reduce((s, r) => s + r.goals, 0), assists: ps.reduce((s, r) => s + r.assists, 0), avg_rating: ps.length ? Number((ps.reduce((s,r) => s + r.rating, 0) / ps.length).toFixed(2)) : 0 }
  })
  const scorers = [...topScorers].sort((a,b) => b.goals - a.goals).slice(0, 6)
  const assisters = [...topScorers].sort((a,b) => b.assists - a.assists).slice(0, 6)
  const ratings = [...topScorers].sort((a,b) => b.avg_rating - a.avg_rating).slice(0, 6)

  // Radar: average attributes of starting XI
  const xi = [...players].sort((a,b) => b.rating - a.rating).slice(0, 11)
  const avg = (k) => xi.length ? Math.round(xi.reduce((s,p) => s + p[k], 0) / xi.length) : 0
  const radarData = [
    { attr: 'Pace', value: avg('pace') }, { attr: 'Shooting', value: avg('shooting') },
    { attr: 'Passing', value: avg('passing') }, { attr: 'Dribbling', value: avg('dribbling') },
    { attr: 'Defending', value: avg('defending') }, { attr: 'Physical', value: avg('physical') },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Performance</div>
        <h1 className="font-display text-3xl lg:text-4xl font-black mt-1">Statistics</h1>
        <p className="text-sm text-muted-foreground mt-1">Season-long analytics across {completed.length} matches.</p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 lg:col-span-3"><StatCard label="Total Goals" value={totalGoals} sub={`${(totalGoals/(completed.length||1)).toFixed(1)} per match`} icon={Target} accent /></div>
        <div className="col-span-6 lg:col-span-3"><StatCard label="Assists" value={totalAssists} sub="all comps" icon={Crosshair} /></div>
        <div className="col-span-6 lg:col-span-3"><StatCard label="Wins" value={wins} sub={`${draws}D · ${losses}L`} icon={Trophy} /></div>
        <div className="col-span-6 lg:col-span-3"><StatCard label="Top Rated" value={ratings[0]?.avg_rating || '—'} sub={ratings[0]?.gamertag || ''} icon={Award} accent /></div>

        <GlassCard className="col-span-12 lg:col-span-8">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Form</div>
          <div className="font-display text-lg font-bold mb-2">Goals Over Time</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={goalsOverTime}>
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="Scored" stroke={GOLD} strokeWidth={2.5} dot={{ fill: GOLD, r: 4 }} />
                <Line type="monotone" dataKey="Conceded" stroke="#7a1f1f" strokeWidth={2} dot={{ fill: '#7a1f1f', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 lg:col-span-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Results</div>
          <div className="font-display text-lg font-bold mb-2">W / D / L</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={resultData} dataKey="value" innerRadius={50} outerRadius={85} stroke="#0a0a0d" strokeWidth={3}>
                  {resultData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 lg:col-span-6">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Leaderboards</div>
          <div className="font-display text-lg font-bold mb-3">Top Scorers</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scorers} layout="vertical">
                <XAxis type="number" stroke="#666" fontSize={11} />
                <YAxis type="category" dataKey="gamertag" stroke="#999" fontSize={11} width={90} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="goals" fill={GOLD} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 lg:col-span-6">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Squad Profile</div>
          <div className="font-display text-lg font-bold mb-3">Starting XI Attributes</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272f" />
                <PolarAngleAxis dataKey="attr" stroke="#888" fontSize={11} />
                <Radar dataKey="value" stroke={GOLD} fill={GOLD} fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 lg:col-span-6 p-0">
          <div className="px-5 pt-5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Playmakers</div>
            <div className="font-display text-lg font-bold mb-3">Top Assists</div>
          </div>
          <div className="px-5 pb-5 space-y-2">
            {assisters.map((p, i) => (
              <div key={p.gamertag} className="glass rounded-lg p-3 flex items-center gap-3">
                <div className="font-display text-xl font-bold gold-text w-6">{i+1}</div>
                <Avatar className="h-9 w-9"><AvatarImage src={p.avatar} /><AvatarFallback>{p.gamertag.slice(0,2)}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{p.gamertag}</div>
                  <div className="text-[10px] text-muted-foreground">{p.position}</div>
                </div>
                <div className="font-display text-xl font-bold">{p.assists}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 lg:col-span-6 p-0">
          <div className="px-5 pt-5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Form Rankings</div>
            <div className="font-display text-lg font-bold mb-3">Average Rating</div>
          </div>
          <div className="px-5 pb-5 space-y-2">
            {ratings.map((p, i) => (
              <div key={p.gamertag} className="glass rounded-lg p-3 flex items-center gap-3">
                <div className="font-display text-xl font-bold gold-text w-6">{i+1}</div>
                <Avatar className="h-9 w-9"><AvatarImage src={p.avatar} /><AvatarFallback>{p.gamertag.slice(0,2)}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{p.gamertag}</div>
                  <div className="text-[10px] text-muted-foreground">{p.position}</div>
                </div>
                <div className="font-display text-xl font-bold gold-text">{p.avg_rating}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
