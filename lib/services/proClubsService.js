/**
 * Pro Clubs API Service
 * Interacts with EA Sports undocumented Pro Clubs API
 * https://proclubs.ea.com/api/fc
 */

const PROCLUBS_API_BASE = 'https://proclubs.ea.com/api/fc'
const CORS_PROXY = 'https://proxy.corsfix.com/?'
const CACHE_DURATION = 6 * 3600000 // 6 hours

// Simple in-memory cache
const cache = new Map()

/**
 * Fetch from Pro Clubs API with CORS proxy
 */
async function fetchProClubsAPI(endpoint, params = {}) {
  try {
    // Build query string
    const queryParams = new URLSearchParams({
      platform: 'common-gen5', // PS5/Xbox Series X|S/PC
      ...params,
    })

    const url = `${PROCLUBS_API_BASE}${endpoint}?${queryParams.toString()}`
    const proxiedUrl = `${CORS_PROXY}${encodeURIComponent(url)}`

    // Check cache
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    // Make request
    const response = await fetch(proxiedUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Pro Clubs API error: ${response.status}`)
    }

    const data = await response.json()

    // Cache result
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    })

    return data
  } catch (error) {
    console.error('Pro Clubs API error:', error)
    throw error
  }
}

/**
 * Search for clubs by name
 */
export async function searchClubs(clubName) {
  try {
    const data = await fetchProClubsAPI('/currentSeasonLeaderboard/search', {
      clubName: clubName,
      maxResultCount: 10,
    })
    return data
  } catch (error) {
    console.error('Error searching clubs:', error)
    return []
  }
}

/**
 * Get club information and statistics
 */
export async function getClubInfo(clubId) {
  try {
    const data = await fetchProClubsAPI('/clubs/info', {
      clubIds: clubId,
    })
    return data?.[0] || null
  } catch (error) {
    console.error('Error fetching club info:', error)
    return null
  }
}

/**
 * Get club overall statistics
 */
export async function getClubStats(clubId) {
  try {
    const data = await fetchProClubsAPI('/clubs/overallStats', {
      clubIds: clubId,
    })
    return data?.[0] || null
  } catch (error) {
    console.error('Error fetching club stats:', error)
    return null
  }
}

/**
 * Get club match history
 */
export async function getClubMatches(clubId, matchType = 'leagueMatch') {
  try {
    const data = await fetchProClubsAPI('/clubs/matches', {
      clubIds: clubId,
      matchType: matchType,
      maxResultCount: 20,
    })
    return data || []
  } catch (error) {
    console.error('Error fetching club matches:', error)
    return []
  }
}

/**
 * Get player statistics
 */
export async function getPlayerStats(playerId, seasonId = 'current') {
  try {
    const data = await fetchProClubsAPI('/members/stats', {
      playerId: playerId,
      seasonId: seasonId,
    })
    return data || null
  } catch (error) {
    console.error('Error fetching player stats:', error)
    return null
  }
}

/**
 * Parse club response into unified format
 */
export function parseClubData(rawData) {
  if (!rawData) return null

  return {
    id: rawData.clubId?.toString(),
    name: rawData.clubName,
    tag: rawData.clubTag,
    kit: {
      color: rawData.kitColor || '#000000',
      pattern: rawData.kitPattern,
    },
    owner: rawData.ownerName,
    platform: rawData.platform,
    division: rawData.division,
    seasonDivision: rawData.seasonDivision,
    totalPlayers: rawData.totalMembers,
    wins: rawData.wins,
    draws: rawData.draws,
    losses: rawData.losses,
    goalsFor: rawData.goalsFor,
    goalsAgainst: rawData.goalsAgainst,
    goalDifference: rawData.goalsFor - rawData.goalsAgainst,
    crestAssetId: rawData.crestAssetId,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Clear cache (for manual refresh)
 */
export function clearCache() {
  cache.clear()
}

/**
 * Get cache stats (for debugging)
 */
export function getCacheStats() {
  return {
    size: cache.size,
    items: Array.from(cache.keys()),
  }
}
