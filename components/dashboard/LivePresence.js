'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GlassCard } from '@/components/common/GlassCard'
import { PresenceDot } from '@/components/common/PresenceDot'
import { usePresence } from '@/lib/hooks/usePresence'
import { PLAYERS } from '@/lib/supabase/mock-data'
import { Radio } from 'lucide-react'

const ORDER = { in_match: 0, online: 1, idle: 2, offline: 3 }

export function LivePresence() {
  const { byId, onlineCount } = usePresence()
  const rows = PLAYERS.map(p => ({ ...p, status: byId[p.id]?.status || 'offline' }))
    .sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9))
    .slice(0, 8)

  return (
    <GlassCard className="col-span-12 lg:col-span-4 p-0" delay={0.3}>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] flex items-center gap-1.5"><Radio className="h-3 w-3 animate-pulse" /> Live</div>
          <div className="font-display text-xl font-bold mt-1">Presence</div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-black gold-text leading-none">{onlineCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">online</div>
        </div>
      </div>
      <div className="px-5 pb-5 space-y-2">
        <AnimatePresence initial={false}>
          {rows.map(p => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 glass rounded-lg p-2"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 border border-white/10">
                  <AvatarImage src={p.avatar} />
                  <AvatarFallback className="text-[10px]">{p.gamertag.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5"><PresenceDot status={p.status} /></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{p.gamertag}</div>
                <div className="text-[10px] text-muted-foreground capitalize">{p.status.replace('_', ' ')}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  )
}
