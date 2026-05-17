/**
 * GET /api/callups/list?match_id=m1
 * Get callups for a specific match or all callups
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('match_id')

    // Mock implementation - return empty
    // In production, would query Supabase for match_id
    
    return Response.json({
      ok: true,
      callups: [],
      match_id: matchId || null,
    })
  } catch (error) {
    console.error('Callup fetch error:', error)
    return Response.json(
      { error: error.message || 'Failed to fetch callups' },
      { status: 500 }
    )
  }
}
