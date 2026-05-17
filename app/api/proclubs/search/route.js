import { searchClubs, getClubInfo, getClubStats, parseClubData } from '@/lib/services/proClubsService'

/**
 * POST /api/proclubs/search
 * Search for Pro Clubs by name
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { clubName } = body

    if (!clubName || clubName.length < 2) {
      return Response.json(
        { error: 'Club name must be at least 2 characters' },
        { status: 400 }
      )
    }

    const results = await searchClubs(clubName)
    
    return Response.json({
      ok: true,
      count: results?.length || 0,
      clubs: (results || []).slice(0, 10).map(club => ({
        id: club.clubId?.toString(),
        name: club.clubName,
        tag: club.clubTag,
        owner: club.ownerName,
        division: club.division,
        wins: club.wins,
        draws: club.draws,
        losses: club.losses,
      })),
    })
  } catch (error) {
    console.error('Pro Clubs search error:', error)
    return Response.json(
      { error: 'Failed to search Pro Clubs' },
      { status: 500 }
    )
  }
}
