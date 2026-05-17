import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * POST /api/matchanalyst/save
 * Save match analysis to Supabase database
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { match_id, team_id, opponent, video_url, events, team1_stats, team2_stats, possession } = body

    // Validation
    if (!match_id || !events || events.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Missing match_id or events' },
        { status: 400 }
      )
    }

    // Save match analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('match_analysis')
      .insert([
        {
          match_id,
          team_id: team_id || 'vanguard-xi',
          opponent: opponent || 'Unknown',
          video_url: video_url || null,
          analysis_data: {
            events_count: events.length,
            team1_stats,
            team2_stats,
            possession,
            created_at: new Date().toISOString()
          }
        }
      ])
      .select()
      .single()

    if (analysisError) {
      console.error('Supabase analysis error:', analysisError)
      return NextResponse.json(
        { ok: false, error: analysisError.message },
        { status: 400 }
      )
    }

    // Save events
    if (events.length > 0) {
      const eventsToInsert = events.map(event => ({
        analysis_id: analysis.id,
        event_type: event.type,
        player_id: event.playerId,
        team: event.team,
        timestamp: event.timestamp,
        details: {
          accuracy: event.accuracy,
          description: event.description || ''
        }
      }))

      const { error: eventsError } = await supabase
        .from('analysis_events')
        .insert(eventsToInsert)

      if (eventsError) {
        console.error('Supabase events error:', eventsError)
        // Don't fail completely if events fail
      }
    }

    return NextResponse.json({
      ok: true,
      analysis_id: analysis.id,
      events_count: events.length,
      message: 'Match analysis saved successfully to database',
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
 * GET /api/matchanalyst/save?match_id=m1&analysis_id=a1
 * Retrieve match analysis from Supabase database
 */
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams
    const match_id = searchParams.get('match_id')
    const analysis_id = searchParams.get('analysis_id')

    if (analysis_id) {
      // Get specific analysis with events
      const { data: analysis, error: analysisError } = await supabase
        .from('match_analysis')
        .select('*')
        .eq('id', analysis_id)
        .single()

      if (analysisError) {
        return NextResponse.json(
          { ok: false, error: analysisError.message },
          { status: 404 }
        )
      }

      const { data: events, error: eventsError } = await supabase
        .from('analysis_events')
        .select('*')
        .eq('analysis_id', analysis_id)
        .order('timestamp', { ascending: true })

      if (eventsError) {
        console.error('Events retrieval error:', eventsError)
      }

      return NextResponse.json({
        ok: true,
        analysis,
        events: events || [],
        total_events: events?.length || 0
      })
    } else if (match_id) {
      // Get all analyses for a match
      const { data: analyses, error: analysisError } = await supabase
        .from('match_analysis')
        .select('*')
        .eq('match_id', match_id)
        .order('created_at', { ascending: false })

      if (analysisError) {
        return NextResponse.json(
          { ok: false, error: analysisError.message },
          { status: 400 }
        )
      }

      return NextResponse.json({
        ok: true,
        analyses: analyses || [],
        message: `Found ${analyses?.length || 0} analyses for match ${match_id}`,
      })
    } else {
      return NextResponse.json(
        { ok: false, error: 'Please specify match_id or analysis_id' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Match analysis retrieval error:', error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    )
  }
}
