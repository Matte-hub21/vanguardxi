/**
 * GET /api/formations/list?match_id=m1
 * Get formation for a specific match
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('match_id')

    if (!matchId) {
      return Response.json(
        { error: 'match_id query parameter is required' },
        { status: 400 }
      )
    }

    // For mock implementation, return empty (in production would query Supabase)
    return Response.json({
      ok: true,
      formations: [],
      match_id: matchId,
    })
  } catch (error) {
    console.error('Formation fetch error:', error)
    return Response.json(
      { error: error.message || 'Failed to fetch formations' },
      { status: 500 }
    )
  }
}
