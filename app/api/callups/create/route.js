/**
 * POST /api/callups/create
 * Create a new squad callup announcement
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { match_id, players_called, substitutes = [], message, status = 'draft' } = body

    // Validate
    if (!match_id || !players_called || players_called.length < 11) {
      return Response.json(
        { error: 'match_id and at least 11 players_called are required' },
        { status: 400 }
      )
    }

    // Mock implementation - return success
    return Response.json({
      ok: true,
      match_id,
      players_count: players_called.length + substitutes.length,
      status,
      created_at: new Date().toISOString(),
      message: 'Squad callup created successfully. Notifications sent to players.',
    })
  } catch (error) {
    console.error('Callup creation error:', error)
    return Response.json(
      { error: error.message || 'Failed to create callup' },
      { status: 500 }
    )
  }
}
