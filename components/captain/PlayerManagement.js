'use client'
import { useState, useMemo, memo, Suspense } from 'react'
import { PLAYERS } from '@/lib/supabase/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Search } from 'lucide-react'
import PlayerCard from '@/components/common/PlayerCard'
import { PlayerCardSkeleton } from '@/components/common/Skeletons'
import { debounce } from '@/lib/utils/performance'

/**
 * PlayerManagement - View and manage squad roster (optimized)
 */
const PlayerManagement = memo(function PlayerManagement() {
  const [filter, setFilter] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('all')

  const positions = ['all', 'GK', 'CB', 'LB', 'RB', 'CM', 'CDM', 'CAM', 'LW', 'RW', 'ST', 'FWD']

  // Memoize filtered results - only recalculate when filter or position changes
  const filtered = useMemo(() => {
    return PLAYERS.filter(p => {
      const matchesSearch =
        p.gamertag.toLowerCase().includes(filter.toLowerCase()) ||
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.number.toString().includes(filter)
      const matchesPosition = selectedPosition === 'all' || p.position === selectedPosition
      return matchesSearch && matchesPosition
    })
  }, [filter, selectedPosition])

  // Memoize position counts
  const positionCounts = useMemo(() => {
    const counts = {}
    PLAYERS.forEach(p => {
      counts[p.position] = (counts[p.position] || 0) + 1
    })
    return counts
  }, [])

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D4AF37]">{PLAYERS.length}</div>
              <div className="text-xs text-muted-foreground">Total Players</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{positionCounts['GK'] || 0}</div>
              <div className="text-xs text-muted-foreground">Goalkeepers</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {(positionCounts['CB'] || 0) + (positionCounts['LB'] || 0) + (positionCounts['RB'] || 0)}
              </div>
              <div className="text-xs text-muted-foreground">Defenders</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {PLAYERS.filter(p => ['LW', 'RW', 'ST', 'FWD'].includes(p.position)).length}
              </div>
              <div className="text-xs text-muted-foreground">Forwards</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search player..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>

            {/* Position filter */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">POSITIONS</div>
              <div className="flex flex-wrap gap-2">
                {positions.map(pos => (
                  <button
                    key={pos}
                    onClick={() => setSelectedPosition(pos)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      selectedPosition === pos
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white/5 border border-white/10 hover:border-[#D4AF37]'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player list - optimized with memoization */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Suspense fallback={[1, 2, 3].map(i => <PlayerCardSkeleton key={i} />)}>
          {filtered.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              onClick={() => {
                /* Handle player click if needed */
              }}
            />
          ))}
        </Suspense>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No players found</p>
        </div>
      )}
    </div>
  )
})

export default PlayerManagement
