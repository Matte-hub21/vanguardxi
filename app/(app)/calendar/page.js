'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, isToday } from 'date-fns'
import { GlassCard } from '@/components/common/GlassCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { listMatches } from '@/lib/services/matchService'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AddMatchDialog } from '@/components/competitions/AddMatchDialog'

export default function CalendarPage() {
  const [current, setCurrent] = useState(new Date())
  const [matches, setMatches] = useState([])

  useEffect(() => { listMatches().then(setMatches) }, [])

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const matchesOnDay = (d) => matches.filter(m => isSameDay(new Date(m.scheduled_at), d))

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Schedule</div>
          <h1 className="font-display text-3xl lg:text-4xl font-black mt-1">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">All fixtures across the season at a glance.</p>
        </div>
        <AddMatchDialog onCreated={() => listMatches().then(setMatches)} />
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="font-display text-2xl font-bold">{format(current, 'MMMM yyyy')}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="border-white/10" onClick={() => setCurrent(subMonths(current, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="border-white/10" onClick={() => setCurrent(new Date())}>Today</Button>
            <Button variant="outline" size="icon" className="border-white/10" onClick={() => setCurrent(addMonths(current, 1))}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="text-center py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const inMonth = isSameMonth(d, current)
            const today = isToday(d)
            const dayMatches = matchesOnDay(d)
            return (
              <div key={i} className={`min-h-[88px] lg:min-h-[110px] rounded-lg p-2 border ${today ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5' : 'border-white/5 bg-white/[0.02]'} ${!inMonth && 'opacity-40'}`}>
                <div className={`text-xs font-semibold ${today ? 'text-[#D4AF37]' : 'text-white/70'}`}>{format(d, 'd')}</div>
                <div className="mt-1 space-y-1">
                  {dayMatches.map(m => (
                    <Link key={m.id} href={`/matches/${m.id}`}>
                      <div className={`text-[10px] px-1.5 py-1 rounded truncate ${m.status === 'upcoming' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20' : m.result === 'W' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : m.result === 'L' ? 'bg-red-400/10 text-red-400 border border-red-400/20' : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'}`}>
                        {m.opponent_logo} {m.opponent_tag}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
