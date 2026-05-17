'use client'
import { useState, useCallback } from 'react'
import {
  calculatePlayerStats,
  calculateTeamStats,
  calculateTimelineStats,
  calculatePossession,
  getTopPerformers,
} from '@/lib/services/matchAnalysisService'

/**
 * useMatchAnalysis - Hook per gestione match analysis
 */
export function useMatchAnalysis(matchId) {
  const [events, setEvents] = useState([])
  const [videoUrl, setVideoUrl] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Aggiungi un evento
  const addEvent = useCallback(
    (eventData) => {
      const newEvent = {
        id: `event_${Date.now()}`,
        match_id: matchId,
        timestamp: new Date().toISOString(),
        ...eventData,
      }
      setEvents(prev => [...prev, newEvent])
      return newEvent
    },
    [matchId]
  )

  // Rimuovi un evento
  const removeEvent = useCallback(eventId => {
    setEvents(prev => prev.filter(e => e.id !== eventId))
  }, [])

  // Modifica un evento
  const updateEvent = useCallback((eventId, updates) => {
    setEvents(prev => prev.map(e => (e.id === eventId ? { ...e, ...updates } : e)))
  }, [])

  // Carica video
  const handleVideoUpload = useCallback(file => {
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
    }
  }, [])

  // Calcola statistiche
  const getPlayerStats = useCallback(
    playerId => {
      return calculatePlayerStats(events, playerId)
    },
    [events]
  )

  const getTeamStats = useCallback(
    teamId => {
      return calculateTeamStats(events, teamId)
    },
    [events]
  )

  const getTimeline = useCallback(() => {
    return calculateTimelineStats(events)
  }, [events])

  const getPossession = useCallback(
    (team1Id, team2Id) => {
      return calculatePossession(events, team1Id, team2Id)
    },
    [events]
  )

  const getTopPerformers = useCallback(
    (allPlayers, teamId) => {
      const teamPlayerStats = allPlayers
        .filter(p => p.team_id === teamId)
        .map(p => getPlayerStats(p.id))
      return getTopPerformers(teamPlayerStats)
    },
    [getPlayerStats]
  )

  // Salva su Supabase
  const saveToDatabase = useCallback(async (teamId = 'vanguard-xi', opponent = 'Unknown') => {
    try {
      const payload = {
        match_id: matchId,
        team_id: teamId,
        opponent,
        video_url: videoUrl,
        events: events.map(e => ({
          type: e.type,
          playerId: e.playerId,
          team: e.team,
          timestamp: e.timestamp,
          accuracy: e.accuracy,
          description: e.description
        })),
        team1_stats: calculateTeamStats(events, 'team1'),
        team2_stats: calculateTeamStats(events, 'team2'),
        possession: calculatePossession(events, 'team1', 'team2')
      }

      const response = await fetch('/api/matchanalyst/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (!data.ok) throw new Error(data.error)
      
      return {
        success: true,
        analysis_id: data.analysis_id,
        message: 'Analysis saved to database successfully!'
      }
    } catch (error) {
      console.error('Save error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }, [events, matchId, videoUrl])

  // Carica da Supabase
  const loadFromDatabase = useCallback(async (analysisId) => {
    try {
      const response = await fetch(`/api/matchanalyst/save?analysis_id=${analysisId}`)
      const data = await response.json()
      
      if (!data.ok) throw new Error(data.error)
      
      // Ricarica gli eventi
      setEvents(data.events.map(e => ({
        id: e.id,
        type: e.event_type,
        playerId: e.player_id,
        team: e.team,
        timestamp: e.timestamp,
        accuracy: e.details?.accuracy,
        description: e.details?.description
      })))

      return {
        success: true,
        analysis: data.analysis,
        events: data.events,
        message: 'Analysis loaded from database!'
      }
    } catch (error) {
      console.error('Load error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }, [])

  // Esporta dati
  const exportAnalysis = useCallback(() => {
    return {
      match_id: matchId,
      total_events: events.length,
      events,
      exported_at: new Date().toISOString(),
    }
  }, [events, matchId])

  // Cancella tutti i dati
  const clearAnalysis = useCallback(() => {
    setEvents([])
    setVideoUrl(null)
    setCurrentTime(0)
  }, [])

  return {
    // State
    events,
    videoUrl,
    currentTime,
    duration,
    isPlaying,

    // Setters
    setEvents,
    setVideoUrl,
    setCurrentTime,
    setDuration,
    setIsPlaying,

    // Methods
    addEvent,
    removeEvent,
    updateEvent,
    handleVideoUpload,
    getPlayerStats,
    getTeamStats,
    getTimeline,
    getPossession,
    getTopPerformers,
    saveToDatabase,
    loadFromDatabase,
    exportAnalysis,
    clearAnalysis,
  }
}
