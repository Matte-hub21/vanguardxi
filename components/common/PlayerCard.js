'use client'
import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * PlayerCard - Optimized player display component
 * Memoized to prevent unnecessary re-renders
 */
const PlayerCard = memo(function PlayerCard({ player, onClick }) {
  return (
    <Card
      className="cursor-pointer transition-all bg-white/5 border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/10 group"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Number and Position */}
          <div className="flex justify-between items-start">
            <div className="text-sm font-bold text-[#D4AF37]">#{player.number}</div>
            <Badge variant="outline" className="text-xs bg-white/10">
              {player.position}
            </Badge>
          </div>

          {/* Gamertag and Name */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {player.gamertag}
            </div>
            <div className="text-sm font-bold group-hover:text-[#D4AF37] transition-colors">
              {player.name}
            </div>
          </div>

          {/* Rating and Form */}
          <div className="flex gap-2 text-xs">
            <span className="text-yellow-400">★ {player.rating}</span>
            <span className="text-green-400">📈 {player.form}</span>
          </div>

          {/* Attributes Row (abbreviated) */}
          <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
            <div>PAC {player.attributes.pace}</div>
            <div>SHO {player.attributes.shooting}</div>
            <div>DRB {player.attributes.dribbling}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}, (prevProps, nextProps) => {
  // Only re-render if player data actually changed
  return (
    prevProps.player.id === nextProps.player.id &&
    prevProps.player.form === nextProps.player.form
  )
})

export default PlayerCard
