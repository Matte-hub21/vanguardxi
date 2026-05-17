import { getClubInfo, getClubStats, parseClubData } from '@/lib/services/proClubsService'

/**
 * POST /api/proclubs/link
 * Link a Pro Club to the team
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { clubId } = body

    if (!clubId) {
      return Response.json(
        { error: 'clubId is required' },
        { status: 400 }
      )
    }

    // Fetch club info and stats
    const clubInfo = await getClubInfo(clubId)
    const clubStats = await getClubStats(clubId)

    if (!clubInfo) {
      return Response.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    // Parse and merge data
    const parsed = parseClubData(clubInfo)
    if (clubStats) {
      parsed.stats = clubStats
    }

    // Mock: In production, would save to database
    return Response.json({
      ok: true,
      message: 'Club linked successfully',
      club: parsed,
      linked_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Pro Clubs link error:', error)
    return Response.json(
      { error: 'Failed to link Pro Club' },
      { status: 500 }
    )
  }
}
