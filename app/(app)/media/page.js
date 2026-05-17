'use client'
import { GlassCard } from '@/components/common/GlassCard'
import { Upload, Image as ImageIcon, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'

const placeholders = [
  { kind: 'image', label: 'Goal compilation — vs Apex Predators', tag: 'Highlight' },
  { kind: 'image', label: 'Squad photo — Pre-season', tag: 'Team' },
  { kind: 'video', label: 'MOTM montage — Maestro_10', tag: 'Player' },
  { kind: 'image', label: 'Trophy — Cup Round 1', tag: 'Achievement' },
  { kind: 'image', label: 'Tactics board — 4-3-3 high press', tag: 'Tactics' },
  { kind: 'video', label: 'GHOST_07 save reel', tag: 'Highlight' },
]

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Library</div>
          <h1 className="font-display text-3xl lg:text-4xl font-black mt-1">Media</h1>
          <p className="text-sm text-muted-foreground mt-1">Highlights, screenshots and team content. Upload coming soon — OCR will auto-detect stats.</p>
        </div>
        <Button className="bg-[#D4AF37] hover:bg-[#F5C518] text-black font-semibold">
          <Upload className="h-4 w-4 mr-2" /> Upload
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {placeholders.map((m, i) => (
          <GlassCard key={i} delay={i*0.05} className="p-0 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-[#1a1a22] to-black flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-30" />
              {m.kind === 'video' ? <Film className="h-10 w-10 text-[#D4AF37]/60 relative" /> : <ImageIcon className="h-10 w-10 text-[#D4AF37]/60 relative" />}
            </div>
            <div className="p-3">
              <div className="text-[10px] uppercase tracking-widest text-[#D4AF37]">{m.tag}</div>
              <div className="text-sm font-semibold mt-1 truncate">{m.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
