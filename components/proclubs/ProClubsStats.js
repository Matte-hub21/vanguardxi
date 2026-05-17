'use client'
import { useState, useEffect } from 'react'
import { useProClubs } from '@/lib/hooks/useProClubs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, ExternalLink, Unlink } from 'lucide-react'

/**
 * ProClubsStats - Display linked Pro Clubs club statistics
 */
export function ProClubsStats({ clubId, onUnlink }) {
  const { getClubInfo } = useProClubs()
  const [clubData, setClubData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (clubId) {
      loadClubData()
    }
  }, [clubId])

  const loadClubData = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getClubInfo(clubId)
      setClubData(data)
    } catch (err) {
      setError('Failed to load club data')
    } finally {
      setLoading(false)
    }
  }

  if (!clubId) return null

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading club data...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="pt-6">
          <div className="text-sm text-red-300">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!clubData?.club) return null

  const club = clubData.club
  const winRate = club.wins + club.draws + club.losses > 0
    ? ((club.wins / (club.wins + club.draws + club.losses)) * 100).toFixed(1)
    : 0

  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] border-[#D4AF37]/30">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            🎮 {club.name}
            <Badge variant="outline" className="text-xs">{club.tag}</Badge>
          </CardTitle>
          <CardDescription className="mt-1">
            EA Sports FC 26 Pro Clubs • Platform: {club.platform}
          </CardDescription>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={loadClubData}
          className="text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Owner info */}
        <div className="flex justify-between items-center p-3 bg-white/[0.02] rounded border border-white/10">
          <div>
            <div className="text-xs text-muted-foreground">OWNER</div>
            <div className="font-semibold">{club.owner}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">DIVISION</div>
            <div className="font-semibold text-[#D4AF37]">{club.division || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">MEMBERS</div>
            <div className="font-semibold text-blue-400">{club.totalPlayers}</div>
          </div>
        </div>

        {/* Record */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className="bg-green-500/10 rounded p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{club.wins}</div>
            <div className="text-xs text-muted-foreground">Wins</div>
          </div>
          <div className="bg-yellow-500/10 rounded p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{club.draws}</div>
            <div className="text-xs text-muted-foreground">Draws</div>
          </div>
          <div className="bg-red-500/10 rounded p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{club.losses}</div>
            <div className="text-xs text-muted-foreground">Losses</div>
          </div>
          <div className="bg-blue-500/10 rounded p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{club.goalsFor}</div>
            <div className="text-xs text-muted-foreground">GF</div>
          </div>
          <div className="bg-orange-500/10 rounded p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{club.goalsAgainst}</div>
            <div className="text-xs text-muted-foreground">GA</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/[0.02] rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="font-bold text-[#D4AF37] text-sm">{winRate}%</div>
          </div>
          <div className="bg-white/[0.02] rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">Goal Diff</div>
            <div className={`font-bold text-sm ${club.goalDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {club.goalDifference > 0 ? '+' : ''}{club.goalDifference}
            </div>
          </div>
          <div className="bg-white/[0.02] rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">Total Matches</div>
            <div className="font-bold text-amber-400 text-sm">{club.wins + club.draws + club.losses}</div>
          </div>
        </div>

        {/* Recent matches */}
        {clubData.recentMatches && clubData.recentMatches.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">RECENT MATCHES</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {clubData.recentMatches.slice(0, 5).map((match, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white/[0.02] rounded">
                  <div className="flex-1">
                    <div className="font-medium truncate">{match.opponentName || 'vs Opponent'}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(match.matchDate || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`font-bold ${
                    match.matchResult === 'WIN' ? 'text-green-400' :
                    match.matchResult === 'LOSS' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {match.scoreFor || 0} - {match.scoreAgainst || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-white/10">
          <Button
            onClick={() => window.open(`https://www.ea.com/en-us/games/fifa`, '_blank')}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View on EA
          </Button>
          <Button
            onClick={() => onUnlink?.()}
            size="sm"
            variant="outline"
            className="text-xs text-red-400 border-red-500/30"
          >
            <Unlink className="h-3 w-3 mr-1" />
            Unlink
          </Button>
        </div>

        {/* Last updated */}
        <div className="text-[10px] text-muted-foreground text-right">
          Last updated: {new Date(club.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
