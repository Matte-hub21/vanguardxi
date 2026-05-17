'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { GlassCard } from '@/components/common/GlassCard'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { listMatches } from '@/lib/services/matchService'
import { ChevronRight, Trophy } from 'lucide-react'
import { AddMatchDialog } from '@/components/competitions/AddMatchDialog'

function MatchRow({ m }) {
  const isUpcoming = m.status === 'upcoming'
  const resultColor = m.result === 'W' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' : m.result === 'L' ? 'text-red-400 bg-red-400/10 border-red-400/30' : 'text-amber-400 bg-amber-400/10 border-amber-400/30'
  return (
    <Link href={`/matches/${m.id}`}>
      <div className="glass rounded-xl p-4 hover:border-[#D4AF37]/30 transition-colors">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center gap-3 justify-end">
            <div className="text-right">
              <div className="font-display font-bold">Vanguard XI</div>
              <div className="text-[10px] text-muted-foreground">VGD · Home</div>
            </div>
            <div className="h-10 w-10 rounded-lg gold-border flex items-center justify-center">🛡️</div>
          </div>
          <div className="text-center">
            {isUpcoming ? (
              <>
                <div className="font-display text-2xl font-black gold-text">VS</div>
                <div className="text-[10px] text-muted-foreground mt-1">{format(new Date(m.scheduled_at), 'MMM d, HH:mm')}</div>
              </>
            ) : (
              <>
                <div className="font-display text-2xl font-black">{m.score_us} <span className="text-muted-foreground">-</span> {m.score_them}</div>
                <Badge variant="outline" className={`mt-1 text-[10px] ${resultColor}`}>{m.result === 'W' ? 'Win' : m.result === 'L' ? 'Loss' : 'Draw'}</Badge>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center">{m.opponent_logo}</div>
            <div>
              <div className="font-display font-bold">{m.opponent}</div>
              <div className="text-[10px] text-muted-foreground">{m.opponent_tag} · {m.venue}</div>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-white/10">{m.competition}</Badge>
            <span className="text-[11px] text-muted-foreground">{format(new Date(m.scheduled_at), 'EEEE, MMM d, yyyy')}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Link>
  )
}

export default function MatchesPage() {
  const [matches, setMatches] = useState([])
  useEffect(() => { listMatches().then(setMatches) }, [])
  const upcoming = matches.filter(m => m.status === 'upcoming')
  const past = matches.filter(m => m.status === 'completed').sort((a,b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Fixtures</div>
          <h1 className="font-display text-3xl lg:text-4xl font-black mt-1">Matches</h1>
          <p className="text-sm text-muted-foreground mt-1">All scheduled and completed fixtures for Vanguard XI.</p>
        </div>
        <AddMatchDialog onCreated={() => listMatches().then(setMatches)} />
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="bg-white/[0.03] border border-white/5">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]">Results ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-5 space-y-3">
          {upcoming.map(m => <MatchRow key={m.id} m={m} />)}
        </TabsContent>
        <TabsContent value="results" className="mt-5 space-y-3">
          {past.map(m => <MatchRow key={m.id} m={m} />)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
