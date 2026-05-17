'use client'
import { GlassCard } from './GlassCard'

export function StatCard({ label, value, sub, icon: Icon, accent = false, delay = 0 }) {
  return (
    <GlassCard delay={delay} className={accent ? 'gold-border gold-glow' : ''}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
          <div className={`mt-2 font-display text-3xl font-bold ${accent ? 'gold-text' : 'text-white'}`}>{value}</div>
          {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
        </div>
        {Icon && (
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'bg-white/5 text-white/70'}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </GlassCard>
  )
}
