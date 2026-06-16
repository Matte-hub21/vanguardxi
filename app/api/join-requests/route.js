import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * POST /api/join-requests
 * Player submits a join request
 */
export async function POST(req) {
  try {
    const body = await req.json()
    const { email, full_name, platform, site_username, ea_gamertag, console_gamertag, preferred_position, notes } = body

    // Validation
    if (!email || !full_name || !platform || !site_username || !ea_gamertag || !console_gamertag || !preferred_position) {
      return NextResponse.json(
        { error: 'Compila tutti i campi obbligatori' },
        { status: 400 }
      )
    }

    if (!['xbox', 'playstation'].includes(platform)) {
      return NextResponse.json(
        { error: 'Piattaforma non valida' },
        { status: 400 }
      )
    }

    // Check if email already requested
    const { data: existing } = await supabase
      .from('join_requests')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Hai già inviato una richiesta. Attendi la risposta del capitano.' },
        { status: 409 }
      )
    }

    // Create request
    const { data, error } = await supabase
      .from('join_requests')
      .insert([
        {
          email,
          full_name,
          platform,
          site_username,
          ea_gamertag,
          console_gamertag,
          preferred_position,
          notes: notes || null,
          role_name: 'player'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Richiesta inviata! Il capitano la esaminerà presto.',
      request_id: data.id
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/join-requests
 * Captain gets all pending requests
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'pending'

    // Get current user
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session?.user) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }

    // Check if captain
    const { data: userData } = await supabase
      .from('profiles')
      .select('role_name')
      .eq('id', session.user.id)
      .single()

    if (userData?.role_name !== 'captain') {
      return NextResponse.json(
        { error: 'Solo capitani possono visualizzare le richieste' },
        { status: 403 }
      )
    }

    // Get requests
    const { data: requests, error } = await supabase
      .from('join_requests')
      .select('*')
      .eq('status', status)
      .order('requested_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      requests,
      total: requests.length
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/join-requests/[id]
 * Captain approves/rejects a request
 */
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url)
    const requestId = searchParams.get('id')
    const body = await req.json()
    const { status, captain_response_notes } = body

    if (!requestId) {
      return NextResponse.json(
        { error: 'ID richiesta mancante' },
        { status: 400 }
      )
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status non valido' },
        { status: 400 }
      )
    }

    // Get current user
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session?.user) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }

    // Check if captain
    const { data: userData } = await supabase
      .from('profiles')
      .select('role_name')
      .eq('id', session.user.id)
      .single()

    if (userData?.role_name !== 'captain') {
      return NextResponse.json(
        { error: 'Solo capitani possono approvare richieste' },
        { status: 403 }
      )
    }

    // Update request
    const { data, error } = await supabase
      .from('join_requests')
      .update({
        status,
        captain_response_notes: captain_response_notes || null,
        responded_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // If approved, create player profile
    if (status === 'approved') {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            email: data.email,
            full_name: data.full_name,
            platform: data.platform,
            site_username: data.site_username,
            ea_gamertag: data.ea_gamertag,
            console_gamertag: data.console_gamertag,
            preferred_position: data.preferred_position,
            role_name: 'player',
            is_active: true
          }
        ])

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Non fa fallire la risposta
      }
    }

    return NextResponse.json({
      success: true,
      message: status === 'approved' ? 'Giocatore accettato!' : 'Richiesta rifiutata.',
      request: data
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
