'use client'
import { useState, useMemo, memo } from 'react'
import { MATCHES } from '@/lib/supabase/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LineupManager } from '@/components/formations/LineupManager'
import { CallupManager } from '@/components/callups/CallupManager'
import MatchCard from '@/components/common/MatchCard'
import { Calendar, Play, Edit2, Share2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

/**
 * MatchManagement - Manage lineups and callups for matches (optimized)
 */
const MatchManagement = memo(function MatchManagement() {
  const [selectedMatch, setSelectedMatch] = useState(null)
  
  // Memoize upcoming matches - only recalculate when MATCHES data changes
  const upcoming = useMemo(() => {
    return MATCHES.filter(m => m.status === 'upcoming')
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Match list - optimized with memoization */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-semibold text-[#D4AF37] flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Matches
          </h3>

          {upcoming.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              isSelected={selectedMatch?.id === match.id}
              onClick={() => setSelectedMatch(match)}
            />
          ))}
        </div>

        {/* Details panel */}
        {selectedMatch && (
          <Card className="lg:col-span-1 bg-gradient-to-b from-white/5 to-white/[0.02] border-white/10 h-fit sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">{selectedMatch.opponent_logo} Match Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">OPPONENT</div>
                <div className="font-semibold">{selectedMatch.opponent}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">DATE & TIME</div>
                <div className="font-semibold text-sm">
                  {new Date(selectedMatch.scheduled_at).toLocaleDateString('it-IT', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                  })}{' '}
                  at{' '}
                  {new Date(selectedMatch.scheduled_at).toLocaleTimeString('it-IT', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">VENUE</div>
                <div className="font-semibold">{selectedMatch.venue}</div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#e6c200] text-sm">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Set Lineup
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Formation Builder</DialogTitle>
                      <DialogDescription>
                        vs {selectedMatch.opponent} • {new Date(selectedMatch.scheduled_at).toLocaleDateString()}
                      </DialogDescription>
                    </DialogHeader>
                    <LineupManager matchId={selectedMatch.id} />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Announce Squad
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Squad Callup</DialogTitle>
                      <DialogDescription>
                        Publish lineup and announce selected players
                      </DialogDescription>
                    </DialogHeader>
                    <CallupManager matchId={selectedMatch.id} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
})

export default MatchManagement
