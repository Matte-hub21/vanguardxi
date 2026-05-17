'use client'
import { useEffect, useState } from 'react'
import { StatCard } from '@/components/common/StatCard'
import { Trophy, Target, Shield, TrendingUp } from 'lucide-react'
import { listStats } from '@/lib/services/statsService'
import { listMatches } from '@/lib/services/matchService'

export function TeamStats() {
  const [stats, setStats] = useState({ goals: 0, wins: 0, winRate: 0, cleanSheets: 0 })
  useEffect(() => {
    (async () => {
      const [allStats, matches] = await Promise.all([listStats(), listMatches({ status: 'completed' })])
      const goals = allStats.reduce((s, r) => s + r.goals, 0)
      const wins = matches.filter(m => m.result === 'W').length
      const cleanSheets = matches.filter(m => m.score_them === 0).length
      const winRate = matches.length ? Math.round((wins / matches.length) * 100) : 0
      setStats({ goals, wins, winRate, cleanSheets })
    })()
  }, [])
  return (
    <>
      <div className="col-span-6 lg:col-span-3"><StatCard label="Wins" value={stats.wins} sub="this season" icon={Trophy} accent delay={0} /></div>
      <div className="col-span-6 lg:col-span-3"><StatCard label="Goals Scored" value={stats.goals} sub="across all comps" icon={Target} delay={0.05} /></div>
      <div className="col-span-6 lg:col-span-3"><StatCard label="Win Rate" value={`${stats.winRate}%`} sub="league + cup" icon={TrendingUp} delay={0.1} /></div>
      <div className="col-span-6 lg:col-span-3"><StatCard label="Clean Sheets" value={stats.cleanSheets} sub="defensive form" icon={Shield} delay={0.15} /></div>
    </>
  )
}
