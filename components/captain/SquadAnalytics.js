'use client'
import { PLAYERS, TEAM } from '@/lib/supabase/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users } from 'lucide-react'

/**
 * SquadAnalytics - Team statistics and performance metrics
 */
export function SquadAnalytics() {
  // Calculate various stats
  const avgRating = (PLAYERS.reduce((sum, p) => sum + p.rating, 0) / PLAYERS.length).toFixed(1)
  const totalForm = (PLAYERS.reduce((sum, p) => sum + p.form, 0) / PLAYERS.length).toFixed(1)

  // Positions breakdown
  const positionStats = {}
  PLAYERS.forEach(p => {
    if (!positionStats[p.position]) {
      positionStats[p.position] = { count: 0, avgRating: 0, players: [] }
    }
    positionStats[p.position].count++
    positionStats[p.position].players.push(p)
  })

  Object.keys(positionStats).forEach(pos => {
    const players = positionStats[pos].players
    positionStats[pos].avgRating = (players.reduce((sum, p) => sum + p.rating, 0) / players.length).toFixed(1)
  })

  // Attributes analysis
  const attributes = {
    pace: PLAYERS.reduce((sum, p) => sum + p.pace, 0) / PLAYERS.length,
    shooting: PLAYERS.reduce((sum, p) => sum + p.shooting, 0) / PLAYERS.length,
    passing: PLAYERS.reduce((sum, p) => sum + p.passing, 0) / PLAYERS.length,
    dribbling: PLAYERS.reduce((sum, p) => sum + p.dribbling, 0) / PLAYERS.length,
    defending: PLAYERS.reduce((sum, p) => sum + p.defending, 0) / PLAYERS.length,
    physical: PLAYERS.reduce((sum, p) => sum + p.physical, 0) / PLAYERS.length,
  }

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D4AF37]">{avgRating}</div>
              <div className="text-xs text-muted-foreground mt-1">Average Rating</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{totalForm}</div>
              <div className="text-xs text-muted-foreground mt-1">Squad Form</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{PLAYERS.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Squad</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">{Object.keys(positionStats).length}</div>
              <div className="text-xs text-muted-foreground mt-1">Positions</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attributes heatmap */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#D4AF37]" />
            Squad Attributes
          </CardTitle>
          <CardDescription>Average stats across the team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(attributes).map(([attr, value]) => (
              <div key={attr}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium capitalize">{attr}</span>
                  <span className="text-xs font-bold text-[#D4AF37]">{value.toFixed(0)}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#D4AF37] to-amber-400 h-full rounded-full"
                    style={{ width: `${(value / 99) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Position breakdown */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#D4AF37]" />
            Position Breakdown
          </CardTitle>
          <CardDescription>Squad composition by position</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(positionStats)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([position, stats]) => (
                <div key={position} className="bg-white/[0.02] rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">{position}</span>
                    <span className="text-lg font-bold text-[#D4AF37]">{stats.count}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Avg Rating</span>
                    <span className="text-amber-400 font-semibold">{stats.avgRating}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Top rated by position */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
            Top Rated Players by Position
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(positionStats).map(([position, stats]) => {
              const topPlayer = stats.players.sort((a, b) => b.rating - a.rating)[0]
              return (
                <div key={position} className="flex items-center justify-between p-2 bg-white/[0.02] rounded border border-white/10">
                  <div>
                    <div className="font-medium text-sm">{position}</div>
                    <div className="text-xs text-muted-foreground">{topPlayer.gamertag}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#D4AF37]">{topPlayer.rating}</div>
                    <div className="text-xs text-amber-400">Form: {topPlayer.form}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
