'use client'
import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin } from 'lucide-react'

/**
 * MatchCard - Optimized match display component
 * Memoized to prevent unnecessary re-renders
 */
const MatchCard = memo(function MatchCard({ match, isSelected, onClick }) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
          : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/10'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-2">
            {/* Opponent */}
            <div className="text-lg font-bold">
              {match.opponent_logo} <span className="text-[#D4AF37]">vs</span> {match.opponent}
            </div>

            {/* Date and Time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(match.scheduled_at).toLocaleDateString()} •{' '}
              {new Date(match.scheduled_at).toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>

            {/* Venue */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {match.venue}
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs bg-white/10">
                {match.competition}
              </Badge>
              <Badge
                className={`text-xs ${
                  match.importance === 'high'
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : match.importance === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      : 'bg-green-500/20 text-green-300 border-green-500/30'
                }`}
              >
                {match.importance}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}, (prevProps, nextProps) => {
  // Only re-render if match ID or selection status changed
  return (
    prevProps.match.id === nextProps.match.id &&
    prevProps.isSelected === nextProps.isSelected
  )
})

export default MatchCard
