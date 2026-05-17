'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Plus } from 'lucide-react'
import { EVENT_TYPES, SHOT_ACCURACY } from '@/lib/services/matchAnalysisService'
import { PLAYERS } from '@/lib/supabase/mock-data'

/**
 * EventMarker - Tracker degli eventi della partita
 */
export function EventMarker({ currentTime, onAddEvent, events }) {
  const [selectedType, setSelectedType] = useState(EVENT_TYPES.PASS)
  const [selectedPlayer, setSelectedPlayer] = useState(PLAYERS[0]?.id)
  const [selectedTeam, setSelectedTeam] = useState('team_a')
  const [shotAccuracy, setShotAccuracy] = useState(SHOT_ACCURACY.ON_TARGET)
  const [isCompleted, setIsCompleted] = useState(true)

  const handleAddEvent = () => {
    const event = {
      type: selectedType,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: Math.floor(currentTime / 60),
      timestamp: currentTime,
      accuracy: selectedType === EVENT_TYPES.SHOT ? shotAccuracy : undefined,
      completed: selectedType === EVENT_TYPES.PASS ? isCompleted : undefined,
    }
    onAddEvent(event)
    
    // Reset
    setSelectedType(EVENT_TYPES.PASS)
  }

  const eventTypeLabels = {
    [EVENT_TYPES.PASS]: '🔵 Passaggio',
    [EVENT_TYPES.SHOT]: '🎯 Tiro',
    [EVENT_TYPES.GOAL]: '⚽ Gol',
    [EVENT_TYPES.INTERCEPT]: '🛡️ Intercetto',
    [EVENT_TYPES.TACKLE]: '🚷 Tackle',
    [EVENT_TYPES.DRIBBLE]: '🏃 Dribbling',
    [EVENT_TYPES.FOUL]: '🟨 Fallo',
    [EVENT_TYPES.SAVE]: '🥅 Parata',
    [EVENT_TYPES.HEADER]: '⬆️ Colpo di Testa',
  }

  const shotAccuracyLabels = {
    [SHOT_ACCURACY.ON_TARGET]: 'Nello specchio',
    [SHOT_ACCURACY.WIDE]: 'Alto/Largo',
    [SHOT_ACCURACY.HIGH]: 'Alto',
    [SHOT_ACCURACY.BLOCKED]: 'Bloccato',
    [SHOT_ACCURACY.GOAL]: 'Gol',
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-[#D4AF37]" />
          Tracker Eventi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event Type */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Tipo Evento</label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(eventTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Player */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Giocatore</label>
          <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {PLAYERS.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  #{p.number} {p.gamertag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Team */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Squadra</label>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team_a">🔵 Vanguard XI</SelectItem>
              <SelectItem value="team_b">🔴 Avversari</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conditional fields */}
        {selectedType === EVENT_TYPES.SHOT && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Precisione Tiro</label>
            <Select value={shotAccuracy} onValueChange={setShotAccuracy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(shotAccuracyLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedType === EVENT_TYPES.PASS && (
          <div className="flex gap-2">
            <Button
              variant={isCompleted ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsCompleted(true)}
              className={isCompleted ? 'bg-green-600' : ''}
            >
              ✓ Completato
            </Button>
            <Button
              variant={!isCompleted ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsCompleted(false)}
              className={!isCompleted ? 'bg-red-600' : ''}
            >
              ✗ Sbagliato
            </Button>
          </div>
        )}

        {/* Add Event Button */}
        <Button
          onClick={handleAddEvent}
          className="w-full bg-[#D4AF37] text-black hover:bg-[#e6c200]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Evento (Min. {Math.floor(currentTime / 60)})
        </Button>

        {/* Events List */}
        {events.length > 0 && (
          <div className="space-y-2 border-t border-white/10 pt-4">
            <p className="text-xs font-semibold text-muted-foreground">
              {events.length} eventi marcati
            </p>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {events.map((event, idx) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-2 p-2 bg-white/5 rounded border border-white/10"
                >
                  <div className="text-xs flex-1">
                    <div className="font-semibold">
                      {eventTypeLabels[event.type]}
                      {event.player_id && ` - ${PLAYERS.find(p => p.id === event.player_id)?.gamertag}`}
                    </div>
                    <div className="text-muted-foreground">
                      Min. {event.minute}
                      {event.accuracy && ` (${shotAccuracyLabels[event.accuracy]})`}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.team_id === 'team_a' ? '🔵' : '🔴'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
