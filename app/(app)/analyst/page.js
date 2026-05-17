'use client'
import { useRole } from '@/lib/hooks/useRole'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { MatchAnalystDashboard } from '@/components/matchanalyst/MatchAnalystDashboard'
import { useState } from 'react'
import { MATCHES } from '@/lib/supabase/mock-data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * Match Analyst Page
 */
export default function AnalystPage() {
  const { isCaptain } = useRole()
  const [selectedMatchId, setSelectedMatchId] = useState(MATCHES.find(m => m.status === 'completed')?.id || 'm1')

  const upcomingMatches = MATCHES.filter(m => m.status === 'completed' || m.status === 'upcoming')

  return (
    <RoleGuard requiredRole="captain" fallback={<div className="text-center py-12">Solo capitani possono accedere al Match Analyst</div>}>
      <div className="space-y-6">
        {/* Match Selector */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">
              Seleziona Partita
            </label>
            <Select value={selectedMatchId} onValueChange={setSelectedMatchId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {upcomingMatches.map(match => (
                  <SelectItem key={match.id} value={match.id}>
                    {match.opponent_logo} {match.opponent} •{' '}
                    {new Date(match.scheduled_at).toLocaleDateString('it-IT')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Match Analyst Dashboard */}
        <MatchAnalystDashboard matchId={selectedMatchId} />
      </div>
    </RoleGuard>
  )
}
