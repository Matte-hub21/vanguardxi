'use client'
import { motion } from 'framer-motion'

const CONFIG = {
  online:   { color: 'bg-emerald-400', ring: 'ring-emerald-400/40', label: 'Online', pulse: true },
  in_match: { color: 'bg-[#D4AF37]',  ring: 'ring-[#D4AF37]/40',  label: 'In Match', pulse: true },
  idle:     { color: 'bg-amber-400',   ring: 'ring-amber-400/30',  label: 'Idle', pulse: false },
  offline:  { color: 'bg-zinc-600',    ring: 'ring-zinc-600/20',   label: 'Offline', pulse: false },
}

export function PresenceDot({ status = 'offline', size = 'sm', className = '', withLabel = false }) {
  const cfg = CONFIG[status] || CONFIG.offline
  const dim = size === 'lg' ? 'h-3 w-3' : size === 'md' ? 'h-2.5 w-2.5' : 'h-2 w-2'
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`relative inline-flex ${dim}`}>
        {cfg.pulse && (
          <motion.span
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 2.2 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            className={`absolute inset-0 rounded-full ${cfg.color}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dim} ${cfg.color} ring-2 ${cfg.ring}`} />
      </span>
      {withLabel && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{cfg.label}</span>}
    </span>
  )
}
