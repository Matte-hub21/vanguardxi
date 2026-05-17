'use client'
import { useState, useCallback } from 'react'
import { FORMATION_TEMPLATES, PLAYERS } from '@/lib/supabase/mock-data'
import { Button } from '@/components/ui/button'
import { X, Save } from 'lucide-react'

/**
 * FormationBuilder - Drag-drop interface to place players in formation
 */
export function FormationBuilder({ 
  matchId, 
  formationCode = '4-3-3', 
  onSave,
  initialLineup = [],
  disabled = false 
}) {
  const formation = FORMATION_TEMPLATES[formationCode]
  if (!formation) return <div className="text-red-500">Invalid formation</div>

  const [lineup, setLineup] = useState(initialLineup.length > 0 ? initialLineup : [])
  const [availablePlayers, setAvailablePlayers] = useState(
    PLAYERS.filter(p => !lineup.find(l => l.player_id === p.id))
  )
  const [draggedPlayer, setDraggedPlayer] = useState(null)
  const [positionSlots, setPositionSlots] = useState(
    Object.entries(formation.slots).flatMap(([pos, count]) =>
      Array(count).fill(null).map((_, i) => ({
        id: `${pos}-${i}`,
        position: pos,
        player: lineup.find(l => l.position_slot === `${pos}-${i}`)?.player_id || null,
      }))
    )
  )

  // Handle dropping player on slot
  const handleDrop = useCallback((slotId) => {
    if (!draggedPlayer) return

    const newSlots = positionSlots.map(slot =>
      slot.id === slotId ? { ...slot, player: draggedPlayer.id } : slot
    )

    // Remove from other slots if needed
    const filteredSlots = newSlots.map(slot => ({
      ...slot,
      player: slot.player === draggedPlayer.id && slot.id !== slotId ? null : slot.player,
    }))

    setPositionSlots(filteredSlots)
    setLineup(prevLineup => {
      const exists = prevLineup.find(l => l.player_id === draggedPlayer.id)
      if (exists) return prevLineup
      return [...prevLineup, { player_id: draggedPlayer.id, position_slot: slotId }]
    })
    setAvailablePlayers(prev => prev.filter(p => p.id !== draggedPlayer.id))
    setDraggedPlayer(null)
  }, [draggedPlayer, positionSlots])

  // Handle removing player from slot
  const handleRemovePlayer = (slotId, playerId) => {
    const player = PLAYERS.find(p => p.id === playerId)
    setPositionSlots(prev => prev.map(s => s.id === slotId ? { ...s, player: null } : s))
    setLineup(prev => prev.filter(l => l.player_id !== playerId))
    setAvailablePlayers(prev => [...prev, player].sort((a, b) => a.number - b.number))
  }

  // Save lineup
  const handleSave = async () => {
    const formationData = {
      match_id: matchId,
      formation_code: formationCode,
      players_positions: positionSlots
        .filter(s => s.player)
        .map(s => ({ player_id: s.player, position: s.position, slot: s.id })),
      status: 'confirmed',
    }
    onSave?.(formationData)
  }

  // Pitch visualization - positioning by formation type
  const getSlotPosition = (index, pos, total) => {
    const baseY = { GK: 85, DEF: 65, CDM: 45, MID: 45, CAM: 35, FWD: 25, ST: 15 }
    const y = baseY[pos] || 50

    // Spread horizontally based on count
    const xSpacing = total > 1 ? 100 / (total + 1) : 50
    const x = (index + 1) * xSpacing

    return { x, y }
  }

  const slots = positionSlots.reduce((acc, slot) => {
    if (!acc[slot.position]) acc[slot.position] = []
    acc[slot.position].push(slot)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {/* Pitch */}
      <div className="bg-gradient-to-b from-green-900/30 to-green-800/20 border border-green-700/30 rounded-lg aspect-video relative overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Field lines */}
          <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5" />
          {/* Penalty boxes */}
          <rect x="0" y="40" width="15" height="20" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5" />
          <rect x="85" y="40" width="15" height="20" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5" />
        </svg>

        {/* Player slots */}
        {positionSlots.map((slot, idx) => {
          const slotsForPos = slots[slot.position]
          const posInGroup = slotsForPos.indexOf(slot)
          const pos = getSlotPosition(posInGroup, slot.position, slotsForPos.length)
          const player = slot.player ? PLAYERS.find(p => p.id === slot.player) : null

          return (
            <div
              key={slot.id}
              onDrop={() => handleDrop(slot.id)}
              onDragOver={e => e.preventDefault()}
              className="absolute w-12 h-12 bg-white/5 border border-white/20 rounded-full flex items-center justify-center cursor-drop-target hover:bg-white/10 transition-colors group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {player ? (
                <div className="text-center text-xs">
                  <div className="font-bold text-[#D4AF37]">{player.number}</div>
                  <button
                    onClick={() => handleRemovePlayer(slot.id, player.id)}
                    className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ) : (
                <div className="text-[10px] text-muted-foreground">{slot.position}</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Available players */}
      <div>
        <h4 className="text-xs font-semibold mb-2 text-muted-foreground">AVAILABLE PLAYERS</h4>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 max-h-24 overflow-y-auto">
          {availablePlayers.map(player => (
            <div
              key={player.id}
              draggable={!disabled}
              onDragStart={() => setDraggedPlayer(player)}
              onDragEnd={() => setDraggedPlayer(null)}
              className="bg-white/5 border border-white/20 rounded p-1 text-center cursor-move hover:bg-white/10 hover:border-[#D4AF37] transition-all text-[10px]"
            >
              <div className="font-bold text-[#D4AF37]">{player.number}</div>
              <div className="text-[8px] truncate text-muted-foreground">{player.gamertag}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-2 text-xs text-muted-foreground">
        <div>Players: {lineup.length}/{Object.values(formation.slots).reduce((a, b) => a + b, 0)}</div>
        <div>•</div>
        <div>Available: {availablePlayers.length}</div>
      </div>

      {/* Save button */}
      {!disabled && (
        <Button
          onClick={handleSave}
          disabled={lineup.length !== Object.values(formation.slots).reduce((a, b) => a + b, 0)}
          className="w-full bg-[#D4AF37] text-black hover:bg-[#e6c200]"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Formation
        </Button>
      )}
    </div>
  )
}
