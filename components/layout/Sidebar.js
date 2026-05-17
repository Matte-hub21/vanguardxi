'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Swords, Calendar, Users, BarChart3, Image as ImageIcon, Settings, Trophy, Zap } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/matches', label: 'Matches', icon: Swords },
  { href: '/analyst', label: 'Match Analyst', icon: Zap },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/competitions', label: 'Competizioni', icon: Trophy },
  { href: '/players', label: 'Players', icon: Users },
  { href: '/statistics', label: 'Statistics', icon: BarChart3 },
  { href: '/media', label: 'Media', icon: ImageIcon },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ onNavigate }) {
  const pathname = usePathname()
  return (
    <aside className="flex flex-col h-full w-[260px] shrink-0 border-r border-white/5 bg-[#0a0a0d]/95 backdrop-blur-xl">
      <div className="p-5 border-b border-white/5">
        <Logo />
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        <div className="px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Team HQ</div>
        {NAV.map((item, i) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm relative transition-colors',
                  active ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="side-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#D4AF37]"
                  />
                )}
                <Icon className={cn('h-[18px] w-[18px]', active && 'text-[#D4AF37]')} />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="glass rounded-xl p-4 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#D4AF37]/20 blur-2xl" />
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Season 26</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Currently ranked</div>
          <div className="mt-1 font-display text-2xl font-bold gold-text">#3 Premier</div>
        </div>
      </div>
    </aside>
  )
}
