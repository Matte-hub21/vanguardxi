'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { PLAYERS } from '@/lib/supabase/mock-data'

/**
 * MatchAnalytics - Visualizza statistiche post-partita
 */
export function MatchAnalytics({
  team1Stats,
  team2Stats,
  allPlayerStats,
  possessionData,
  timelineData,
}) {
  if (!team1Stats || !team2Stats) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="pt-6 text-center text-muted-foreground">
          Aggiungi eventi per visualizzare le statistiche
        </CardContent>
      </Card>
    )
  }

  const COLORS = ['#D4AF37', '#EF4444']

  // Prepare player stats for display
  const topPlayers = allPlayerStats
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Team Stats Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-sm">🔵 Vanguard XI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Tiri</div>
                <div className="text-2xl font-bold text-[#D4AF37]">{team1Stats.shots}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Gol</div>
                <div className="text-2xl font-bold text-green-400">{team1Stats.goals}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Passaggi</div>
                <div className="text-2xl font-bold">{team1Stats.passes}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Precisione Passaggi</div>
                <div className="text-2xl font-bold text-blue-400">{team1Stats.pass_accuracy}%</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Intercetti</div>
                <div className="text-2xl font-bold">{team1Stats.intercepts}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Tackle</div>
                <div className="text-2xl font-bold">{team1Stats.tackles}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-sm">🔴 Avversari</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Tiri</div>
                <div className="text-2xl font-bold text-[#D4AF37]">{team2Stats.shots}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Gol</div>
                <div className="text-2xl font-bold text-green-400">{team2Stats.goals}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Passaggi</div>
                <div className="text-2xl font-bold">{team2Stats.passes}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Precisione Passaggi</div>
                <div className="text-2xl font-bold text-blue-400">{team2Stats.pass_accuracy}%</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Intercetti</div>
                <div className="text-2xl font-bold">{team2Stats.intercepts}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Tackle</div>
                <div className="text-2xl font-bold">{team2Stats.tackles}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Possession Chart */}
      {possessionData && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-sm">Possesso Palla</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Vanguard XI', value: possessionData.team1 },
                      { name: 'Avversari', value: possessionData.team2 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#D4AF37" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip formatter={value => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      {timelineData && timelineData.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-sm">Timeline - Eventi per 5 Minuti</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="minute" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }} />
                <Legend />
                <Bar dataKey="goals" fill="#00c853" name="Gol" />
                <Bar dataKey="shots" fill="#ff6f00" name="Tiri" />
                <Bar dataKey="passes" fill="#2196f3" name="Passaggi" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Players */}
      {topPlayers.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-sm">⭐ Top Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPlayers.map((stats, idx) => {
                const player = PLAYERS.find(p => p.id === stats.player_id)
                return (
                  <div key={stats.player_id} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {idx === 0 && '🥇'}
                        {idx === 1 && '🥈'}
                        {idx === 2 && '🥉'}
                        {idx > 2 && `#${idx + 1}`}
                        <span className="text-[#D4AF37]">#{player?.number} {player?.gamertag}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stats.goals > 0 && `⚽ ${stats.goals} Gol • `}
                        {stats.shots > 0 && `🎯 ${stats.shots} Tiri • `}
                        {stats.passes > 0 && `🔵 ${stats.passes} Pass (${stats.pass_accuracy}%) • `}
                        {stats.total_events} eventi
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-[#D4AF37] text-black text-sm font-bold">
                        {stats.rating.toFixed(1)}/10
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
