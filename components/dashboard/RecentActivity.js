'use client'
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { listActivity } from '@/lib/services/activityService'
import { subscribeActivity } from '@/lib/services/realtimeService'
import { Goal, Trophy, UserPlus, Megaphone, Calendar, Users, Star, Radio } from 'lucide-react'

const ICONS = {
  goal: Goal, motm: Star, attendance: Users, match: Calendar,
  announcement: Megaphone, assist: Goal, win: Trophy, join: UserPlus,
}
const COLORS = {
  goal: 'text-emerald-400 bg-emerald-400/10',
  motm: 'text-[#D4AF37] bg-[#D4AF37]/10',
  attendance: 'text-blue-400 bg-blue-400/10',
  match: 'text-purple-400 bg-purple-400/10',
  announcement: 'text-orange-400 bg-orange-400/10',
  assist: 'text-cyan-400 bg-cyan-400/10',
  win: 'text-[#D4AF37] bg-[#D4AF37]/10',
  join: 'text-pink-400 bg-pink-400/10',
}

export function RecentActivity() {
  const [items, setItems] = useState([])

  useEffect(() => {
    listActivity(10).then(setItems)
    return subscribeActivity((row) => {
      setItems(prev => [row, ...prev].slice(0, 12))
    })
  }, [])

  return (
    <GlassCard className="col-span-12 lg:col-span-4 p-0 overflow-hidden" delay={0.1}>
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] flex items-center gap-1.5"><Radio className="h-3 w-3 animate-pulse" /> Live Feed</div>
          <div className="font-display text-xl font-bold mt-1">Recent Activity</div>
        </div>
        <span className="text-[10px] text-emerald-400 inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> streaming
        </span>
      </div>
      <div className="max-h-[420px] overflow-y-auto scrollbar-thin px-5 pb-5 space-y-3">
        <AnimatePresence initial={false}>
          {items.map((a) => {
            const Icon = ICONS[a.kind] || Megaphone
            return (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3"
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${COLORS[a.kind] || 'text-white/70 bg-white/5'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm leading-snug"><span className="font-semibold text-white">{a.actor}</span> <span className="text-muted-foreground">{a.text}</span></div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </GlassCard>
  )
}
