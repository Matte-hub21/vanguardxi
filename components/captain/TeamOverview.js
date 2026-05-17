'use client'
import { TEAM, PLAYERS, MATCHES } from '@/lib/supabase/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Users, Calendar, TrendingUp } from 'lucide-react'

/**
 * TeamOverview - Squad stats and team performance
 */
export function TeamOverview() {
  const upcoming = MATCHES.filter(m => m.status === 'upcoming').length
  const totalPlayers = PLAYERS.length
  const avgRating = (PLAYERS.reduce((sum, p) => sum + p.rating, 0) / totalPlayers).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Team header */}
      <Card className="bg-gradient-to-r from-[#D4AF37]/10 to-white/5 border-[#D4AF37]/30">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="text-3xl">👑</span>
                {TEAM.name}
              </CardTitle>
              <CardDescription className="text-base mt-2 italic">
                "{TEAM.motto}"
              </CardDescription>
            </div>
            <Badge className="text-sm bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]">
              #{TEAM.rank} - {TEAM.league}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Wins</div>
              <div className="text-2xl font-bold text-green-400">{TEAM.record.wins}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Draws</div>
              <div className="text-2xl font-bold text-yellow-400">{TEAM.record.draws}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Losses</div>
              <div className="text-2xl font-bold text-red-400">{TEAM.record.losses}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Formed</div>
              <div className="text-2xl font-bold">{TEAM.founded}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Users className="h-6 w-6 text-[#D4AF37] mx-auto" />
              <div className="text-2xl font-bold">{totalPlayers}</div>
              <div className="text-xs text-muted-foreground">Total Squad</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Calendar className="h-6 w-6 text-amber-400 mx-auto" />
              <div className="text-2xl font-bold">{upcoming}</div>
              <div className="text-xs text-muted-foreground">Upcoming Matches</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <TrendingUp className="h-6 w-6 text-green-400 mx-auto" />
              <div className="text-2xl font-bold">{avgRating}</div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Trophy className="h-6 w-6 text-[#D4AF37] mx-auto" />
              <div className="text-2xl font-bold">
                {((TEAM.record.wins / (TEAM.record.wins + TEAM.record.draws + TEAM.record.losses)) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top performers */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Top Performers</CardTitle>
          <CardDescription>Based on current form rating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {PLAYERS
              .sort((a, b) => b.form - a.form)
              .slice(0, 5)
              .map((player, idx) => (
                <div key={player.id} className="flex items-center justify-between p-2 bg-white/[0.02] rounded border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-bold text-[#D4AF37]">{idx + 1}.</div>
                    <div>
                      <div className="font-medium">{player.gamertag}</div>
                      <div className="text-xs text-muted-foreground">{player.position}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-400">{player.form}</div>
                    <div className="text-xs text-muted-foreground">Form Rating</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
