import { useState, useCallback } from 'react'
import { CALLUPS, PLAYERS } from '@/lib/supabase/mock-data'

/**
 * useCallups - Hook to manage squad callup announcements
 * Handles creating, fetching, and checking player status
 */
export function useCallups(matchId = null) {
  const [callups, setCallups] = useState(() => {
    if (matchId) {
      return CALLUPS.filter(c => c.match_id === matchId)
    }
    return CALLUPS
  })

  // Get callup for specific match
  const getCallupForMatch = useCallback((mid) => {
    return CALLUPS.find(c => c.match_id === mid)
  }, [])

  // Check if player is called up (starter)
  const isStarter = useCallback((playerId, mid) => {
    const callup = getCallupForMatch(mid)
    return callup?.players_called.includes(playerId) || false
  }, [getCallupForMatch])

  // Check if player is on bench
  const isBench = useCallback((playerId, mid) => {
    const callup = getCallupForMatch(mid)
    return callup?.substitutes.includes(playerId) || false
  }, [getCallupForMatch])

  // Get player status for match
  const getPlayerStatus = useCallback((playerId, mid) => {
    const callup = getCallupForMatch(mid)
    if (!callup) return null
    if (callup.players_called.includes(playerId)) return 'starter'
    if (callup.substitutes.includes(playerId)) return 'bench'
    return 'notCalled'
  }, [getCallupForMatch])

  // Get squad info for match
  const getSquadInfo = useCallback((mid) => {
    const callup = getCallupForMatch(mid)
    if (!callup) return null

    const starters = PLAYERS.filter(p => callup.players_called.includes(p.id))
    const benches = PLAYERS.filter(p => callup.substitutes.includes(p.id))

    return {
      starters,
      benches,
      totalSquad: starters.length + benches.length,
      message: callup.message,
      publishedAt: callup.published_at,
      createdBy: callup.created_by,
      status: callup.status,
    }
  }, [getCallupForMatch])

  // Create new callup
  const createCallup = useCallback(async (data) => {
    try {
      const response = await fetch('/api/callups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create callup')
      return await response.json()
    } catch (error) {
      console.error('Error creating callup:', error)
      throw error
    }
  }, [])

  return {
    callups,
    getCallupForMatch,
    isStarter,
    isBench,
    getPlayerStatus,
    getSquadInfo,
    createCallup,
  }
}
