import { useState, useCallback } from 'react'

/**
 * useProClubs - Hook to manage Pro Clubs linking and searching
 */
export function useProClubs() {
  const [searching, setSearching] = useState(false)
  const [linking, setLinking] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [linkedClub, setLinkedClub] = useState(null)
  const [error, setError] = useState(null)

  // Search for clubs
  const searchClubs = useCallback(async (clubName) => {
    if (!clubName || clubName.length < 2) {
      setSearchResults([])
      return
    }

    setSearching(true)
    setError(null)

    try {
      const response = await fetch('/api/proclubs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubName }),
      })

      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()
      setSearchResults(data.clubs || [])
    } catch (err) {
      setError(err.message || 'Failed to search clubs')
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  // Link a club
  const linkClub = useCallback(async (clubId) => {
    setLinking(true)
    setError(null)

    try {
      const response = await fetch('/api/proclubs/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Link failed')
      }

      const data = await response.json()
      setLinkedClub(data.club)
      return data.club
    } catch (err) {
      setError(err.message || 'Failed to link club')
      throw err
    } finally {
      setLinking(false)
    }
  }, [])

  // Get club info
  const getClubInfo = useCallback(async (clubId) => {
    try {
      const response = await fetch(`/api/proclubs/info?clubId=${clubId}`)

      if (!response.ok) throw new Error('Failed to fetch club info')

      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message || 'Failed to fetch club info')
      throw err
    }
  }, [])

  // Clear state
  const clearSearch = useCallback(() => {
    setSearchResults([])
    setError(null)
  }, [])

  return {
    searchResults,
    linkedClub,
    searching,
    linking,
    error,
    searchClubs,
    linkClub,
    getClubInfo,
    clearSearch,
  }
}
