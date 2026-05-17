import { NextResponse } from 'next/server'

/**
 * POST /api/matchanalyst/save
 * Save match analysis to database
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { match_id, events, team1_stats, team2_stats, possession } = body

    // Validation
    if (!match_id || !events || events.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Missing match_id or events' },
        { status: 400 }
      )
    }

    // Mock: Store in memory (in production, use Supabase)
    const analysis = {
      id: `analysis_${Date.now()}`,
      match_id,
      total_events: events.length,
      team1_stats,
      team2_stats,
      possession,
      events,
      created_at: new Date().toISOString(),
    }

    // TODO: Save to Supabase
    // await supabase.from('match_analysis').insert([analysis])

    return NextResponse.json({
      ok: true,
      analysis_id: analysis.id,
      events_count: events.length,
      message: 'Match analysis saved successfully',
    })
  } catch (error) {
    console.error('Match analysis save error:', error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/matchanalyst/stats?match_id=m1
 * Retrieve match analysis statistics
 */
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams
    const match_id = searchParams.get('match_id')

    if (!match_id) {
      return NextResponse.json(
        { ok: false, error: 'Missing match_id parameter' },
        { status: 400 }
      )
    }

    // TODO: Fetch from Supabase
    // const { data } = await supabase
    //   .from('match_analysis')
    //   .select('*')
    //   .eq('match_id', match_id)
    //   .single()

    return NextResponse.json({
      ok: true,
      match_id,
      analysis: null, // Placeholder
      message: 'Analysis not found',
    })
  } catch (error) {
    console.error('Match analysis retrieval error:', error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    )
  }
}
