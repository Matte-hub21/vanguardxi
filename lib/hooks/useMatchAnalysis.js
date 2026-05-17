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
    exportAnalysis,
    clearAnalysis,
  }
}
