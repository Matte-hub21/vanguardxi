'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getUpcomingMatches } from '@/lib/services/matchService'
import { ChevronRight, MapPin, Clock } from 'lucide-react'

export function UpcomingMatches() {
  const [matches, setMatches] = useState([])
  useEffect(() => { getUpcomingMatches(4).then(setMatches) }, [])
  const next = matches[0]

  return (
    <GlassCard className="col-span-12 lg:col-span-8 p-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Next Fixture</div>
          <div className="font-display text-xl font-bold mt-1">Upcoming Matches</div>
        </div>
        <Link href="/matches">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[#D4AF37]">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      {next && (
        <Link href={`/matches/${next.id}`}>
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="mx-5 mt-4 relative overflow-hidden rounded-xl gold-border bg-gradient-to-br from-[#1a1a22] via-[#15151b] to-black p-6"
          >
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#D4AF37]/20 blur-3xl" />
            <div className="relative grid grid-cols-3 items-center gap-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🛡️</div>
                <div className="font-display font-bold text-lg">VGD</div>
                <div className="text-xs text-muted-foreground">Vanguard XI</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-[#D4AF37]">{next.competition} · {next.venue}</div>
                <div className="font-display text-4xl font-black gold-text mt-2">VS</div>
                <div className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {format(new Date(next.scheduled_at), 'EEE, MMM d · HH:mm')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">{next.opponent_logo}</div>
                <div className="font-display font-bold text-lg">{next.opponent_tag}</div>
                <div className="text-xs text-muted-foreground">{next.opponent}</div>
              </div>
            </div>
            <div className="relative mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> Online · EA Servers EU</span>
              <Badge className="bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/15">
                {formatDistanceToNow(new Date(next.scheduled_at), { addSuffix: true })}
              </Badge>
            </div>
          </motion.div>
        </Link>
      )}

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        {matches.slice(1).map((m, i) => (
          <Link key={m.id} href={`/matches/${m.id}`}>
            <motion.div
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-lg p-3 hover:border-[#D4AF37]/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{m.opponent_logo}</span>
                <Badge variant="outline" className="text-[10px] border-white/10">{m.competition}</Badge>
              </div>
              <div className="mt-2 font-semibold text-sm truncate">{m.opponent}</div>
              <div className="text-xs text-muted-foreground mt-1">{format(new Date(m.scheduled_at), 'MMM d · HH:mm')}</div>
            </motion.div>
          </Link>
        ))}
      </div>
    </GlassCard>
  )
}
