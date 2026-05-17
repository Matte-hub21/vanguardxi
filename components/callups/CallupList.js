'use client'
import { useState, useEffect } from 'react'
import { CALLUPS, PLAYERS, MATCHES } from '@/lib/supabase/mock-data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

/**
 * CallupList - Display squad announcements
 */
export function CallupList({ matchId, userPlayerId }) {
  const [callups, setCallups] = useState([])
  const [userStatus, setUserStatus] = useState(null) // 'starter' | 'bench' | 'notCalled'

  useEffect(() => {
    // Load callups from mock data
    let filtered = [...CALLUPS]
    if (matchId) {
      filtered = filtered.filter(c => c.match_id === matchId)
    }

    setCallups(filtered)

    // Check user's status
    if (userPlayerId && filtered.length > 0) {
      const callup = filtered[0]
      if (callup.players_called.includes(userPlayerId)) {
        setUserStatus('starter')
      } else if (callup.substitutes.includes(userPlayerId)) {
        setUserStatus('bench')
      } else {
        setUserStatus('notCalled')
      }
    }
  }, [matchId, userPlayerId])

  if (callups.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        No squad announcements yet
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {callups.map(callup => {
        const match = MATCHES.find(m => m.id === callup.match_id)
        const captain = PLAYERS.find(p => p.id === callup.created_by)
        const starters = PLAYERS.filter(p => callup.players_called.includes(p.id))
        const benches = PLAYERS.filter(p => callup.substitutes.includes(p.id))

        return (
          <Card key={callup.id} className="bg-gradient-to-r from-white/5 to-white/[0.02] border-white/10 p-4 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  {match?.opponent_logo} vs {match?.opponent}
                  <Badge variant="outline" className="text-xs">
                    {callup.status === 'published' ? '📢 Published' : '📝 Draft'}
                  </Badge>
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  by {captain?.gamertag} • {new Date(callup.published_at).toLocaleDateString()}
                </p>
              </div>
              {userPlayerId && (
                <div className={`text-xs font-semibold flex items-center gap-1 ${
                  userStatus === 'starter' ? 'text-[#D4AF37]' :
                  userStatus === 'bench' ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {userStatus === 'starter' && <><CheckCircle2 className="h-4 w-4" />STARTER</>}
                  {userStatus === 'bench' && <><AlertCircle className="h-4 w-4" />BENCH</>}
                  {userStatus === 'notCalled' && <><AlertCircle className="h-4 w-4" />NOT CALLED</>}
                </div>
              )}
            </div>

            {/* Message */}
            {callup.message && (
              <p className="text-sm italic text-white/80 border-l-2 border-[#D4AF37] pl-3">
                "{callup.message}"
              </p>
            )}

            {/* Player lists */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Starters */}
              <div>
                <h5 className="text-xs font-semibold text-[#D4AF37] mb-2">
                  STARTING XI ({starters.length})
                </h5>
                <div className="space-y-1">
                  {starters.map(p => (
                    <div key={p.id} className="flex items-center gap-2 text-xs p-1.5 bg-white/[0.02] rounded border border-white/5">
                      <div className="font-mono font-bold text-[#D4AF37] w-6">{p.number}</div>
                      <div className="flex-1">
                        <div className="font-medium">{p.gamertag}</div>
                        <div className="text-[10px] text-muted-foreground">{p.position}</div>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{p.rating}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bench */}
              <div>
                <h5 className="text-xs font-semibold text-amber-400 mb-2">
                  SUBSTITUTES ({benches.length})
                </h5>
                <div className="space-y-1">
                  {benches.map(p => (
                    <div key={p.id} className="flex items-center gap-2 text-xs p-1.5 bg-white/[0.02] rounded border border-white/5 opacity-75">
                      <div className="font-mono font-bold text-amber-400 w-6">{p.number}</div>
                      <div className="flex-1">
                        <div className="font-medium">{p.gamertag}</div>
                        <div className="text-[10px] text-muted-foreground">{p.position}</div>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{p.rating}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 text-[10px] text-muted-foreground border-t border-white/10 pt-2">
              <div>Squad: {starters.length + benches.length} players</div>
              <div>•</div>
              <div>GK: {starters.filter(p => p.position === 'GK').length}</div>
              <div>•</div>
              <div>DEF: {starters.filter(p => ['CB', 'LB', 'RB'].includes(p.position)).length}</div>
              <div>•</div>
              <div>MID: {starters.filter(p => ['CM', 'CDM', 'CAM'].includes(p.position)).length}</div>
              <div>•</div>
              <div>FWD: {starters.filter(p => ['ST', 'LW', 'RW', 'FWD'].includes(p.position)).length}</div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
