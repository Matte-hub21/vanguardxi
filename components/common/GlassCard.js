'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function GlassCard({ children, className, hover = true, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        'glass rounded-xl p-5 relative overflow-hidden transition-colors',
        hover && 'hover:border-[#D4AF37]/30',
        className
      )}
      {...props}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      {children}
    </motion.div>
  )
}
