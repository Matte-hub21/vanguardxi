'use client'
import { useState } from 'react'
import { PLAYERS, MATCHES } from '@/lib/supabase/mock-data'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useRole } from '@/lib/hooks/useRole'
import { Send, X } from 'lucide-react'

/**
 * CallupCreator - Captain creates squad announcement for a match
 */
export function CallupCreator({ matchId: initialMatchId, onSaved, onClose }) {
  const { isCaptain } = useRole()
  const [matchId, setMatchId] = useState(initialMatchId || '')
  const [selected, setSelected] = useState(new Set())
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  // Get available matches (only upcoming)
  const upcomingMatches = MATCHES.filter(m => m.status === 'upcoming').slice(0, 5)

  const selectedArray = Array.from(selected)
  const starters = selectedArray.slice(0, 11)
  const bench = selectedArray.slice(11)

  // Toggle player selection
  const togglePlayer = (playerId) => {
    const updated = new Set(selected)
    if (updated.has(playerId)) {
      updated.delete(playerId)
    } else {
      updated.add(playerId)
    }
    setSelected(updated)
  }

  // Save callup
  const handleSave = async (publish = false) => {
    if (!matchId || selected.size === 0) return

    setSaving(true)
    try {
      const response = await fetch('/api/callups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          match_id: matchId,
          players_called: starters,
          substitutes: bench,
          message: message || `Squad announced for match. Let's go! 💪`,
          status: publish ? 'published' : 'draft',
        }),
      })

      if (!response.ok) throw new Error('Failed to save callup')
      
      const result = await response.json()
      onSaved?.(result)
    } catch (error) {
      console.error('Error saving callup:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!isCaptain()) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded p-4 text-sm text-red-300">
        Only captains can create squad announcements.
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-[#D4AF37]">Create Squad Callup</h3>
        {onClose && <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
      </div>

      {/* Match selection */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">SELECT MATCH</label>
        <select
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-foreground"
        >
          <option value="">Choose a match...</option>
          {upcomingMatches.map(m => (
            <option key={m.id} value={m.id}>
              vs {m.opponent} • {new Date(m.scheduled_at).toLocaleDateString()} @ {m.venue}
            </option>
          ))}
        </select>
      </div>

      {matchId && (
        <>
          {/* Player selection */}
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold mb-2">
                  SELECT SQUAD ({selected.size}/23)
                </h4>
                <p className="text-xs text-muted-foreground">
                  Choose 11 starters and up to 12 substitutes
                </p>
              </div>

              {/* Player grid */}
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-1">
                {PLAYERS.map(player => (
                  <button
                    key={player.id}
                    onClick={() => togglePlayer(player.id)}
                    className={`p-2 rounded border-2 transition-all text-center ${
                      selected.has(player.id)
                        ? selectedArray.indexOf(player.id) < 11
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20' // Starter
                          : 'border-amber-400 bg-amber-400/10' // Bench
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-sm">{player.number}</div>
                    <div className="text-[8px] truncate text-muted-foreground">
                      {player.gamertag.split('_')[0]}
                    </div>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-3 text-xs text-muted-foreground pt-2 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-[#D4AF37]"></div>
                  Starters: {starters.length}/11
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-400"></div>
                  Bench: {bench.length}
                </div>
              </div>
            </div>
          </Card>

          {/* Message */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">
              ANNOUNCEMENT MESSAGE (optional)
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Squad announcement message... e.g., 'Ready for battle! Let's show them what we're made of! 💪'"
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
              rows={3}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleSave(false)}
              disabled={starters.length < 11 || saving}
              variant="outline"
              className="flex-1"
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={starters.length < 11 || saving}
              className="flex-1 bg-[#D4AF37] text-black hover:bg-[#e6c200]"
            >
              <Send className="h-4 w-4 mr-2" />
              Publish & Announce
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
