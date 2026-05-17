'use client'
import { motion } from 'framer-motion'

export function Logo({ size = 'md', showText = true }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base' }
  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${sizes[size]} relative rounded-lg gold-border bg-gradient-to-br from-[#1a1a22] to-black flex items-center justify-center gold-glow`}
      >
        <span className="font-display font-black gold-text">V</span>
        <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
      </motion.div>
      {showText && (
        <div className="leading-tight">
          <div className="font-display text-base font-bold tracking-widest text-white">VANGUARD XI</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/80">Pro Clubs HQ</div>
        </div>
      )}
    </div>
  )
}
