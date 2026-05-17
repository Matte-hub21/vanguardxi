import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/formations/save
 * Save or update a formation for a match
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { match_id, formation_code, players_positions, status = 'confirmed' } = body

    // Validate input
    if (!match_id || !formation_code || !Array.isArray(players_positions)) {
      return Response.json(
        { error: 'match_id, formation_code, and players_positions are required' },
        { status: 400 }
      )
    }

    if (players_positions.length === 0) {
      return Response.json(
        { error: 'At least one player must be positioned' },
        { status: 400 }
      )
    }

    // For mock implementation, just return success
    // In production, this would save to Supabase
    
    return Response.json({
      ok: true,
      match_id,
      formation_code,
      players_count: players_positions.length,
      status,
      saved_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Formation save error:', error)
    return Response.json(
      { error: error.message || 'Failed to save formation' },
      { status: 500 }
    )
  }
}
