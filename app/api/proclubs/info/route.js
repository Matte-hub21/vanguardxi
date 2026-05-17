import { getClubInfo, getClubMatches, parseClubData } from '@/lib/services/proClubsService'

/**
 * GET /api/proclubs/info?clubId=12345
 * Get linked Pro Club information and recent matches
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get('clubId')

    if (!clubId) {
      return Response.json(
        { error: 'clubId query parameter is required' },
        { status: 400 }
      )
    }

    // Fetch club info and matches
    const clubInfo = await getClubInfo(clubId)
    const matches = await getClubMatches(clubId, 'leagueMatch')

    if (!clubInfo) {
      return Response.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    const parsed = parseClubData(clubInfo)

    return Response.json({
      ok: true,
      club: parsed,
      recentMatches: (matches || []).slice(0, 10),
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Pro Clubs info error:', error)
    return Response.json(
      { error: 'Failed to fetch Pro Club info' },
      { status: 500 }
    )
  }
}
