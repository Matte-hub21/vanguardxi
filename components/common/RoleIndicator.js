'use client'
import { useRole } from '@/lib/hooks/useRole'
import { Shield, Crown, Award } from 'lucide-react'

/**
 * RoleIndicator component - Shows user role with icon
 */
export function RoleIndicator() {
  const { roleName, roleLabel } = useRole()

  const roleConfig = {
    admin: { icon: Shield, color: 'text-red-500', bg: 'bg-red-500/10' },
    captain: { icon: Crown, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10' },
    vice_captain: { icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    player: { icon: null, color: 'text-muted-foreground', bg: 'bg-white/5' },
  }

  const config = roleConfig[roleName] || roleConfig.player
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded ${config.bg}`}>
      {Icon && <Icon className={`h-4 w-4 ${config.color}`} />}
      <span className={`text-xs font-semibold uppercase tracking-widest ${config.color}`}>
        {roleLabel}
      </span>
    </div>
  )
}
