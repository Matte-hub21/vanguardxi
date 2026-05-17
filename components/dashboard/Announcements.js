'use client'
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { GlassCard } from '@/components/common/GlassCard'
import { Badge } from '@/components/ui/badge'
import { listAnnouncements } from '@/lib/services/announcementService'
import { Pin, Megaphone } from 'lucide-react'

export function Announcements() {
  const [items, setItems] = useState([])
  useEffect(() => { listAnnouncements().then(setItems) }, [])
  return (
    <GlassCard className="col-span-12 lg:col-span-5 p-0" delay={0.25}>
      <div className="px-5 pt-5 pb-3">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Team Channel</div>
        <div className="font-display text-xl font-bold mt-1 flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-[#D4AF37]" /> Announcements
        </div>
      </div>
      <div className="max-h-[360px] overflow-y-auto scrollbar-thin px-5 pb-5 space-y-3">
        {items.map(a => (
          <div key={a.id} className={`rounded-lg p-3 border ${a.pinned ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5' : 'border-white/5 bg-white/[0.02]'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {a.pinned && <Pin className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />}
                <div className="font-semibold text-sm truncate">{a.title}</div>
              </div>
              <Badge variant="outline" className="shrink-0 text-[10px] border-white/10">{a.author}</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{a.body}</div>
            <div className="text-[10px] text-muted-foreground mt-2">{formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
