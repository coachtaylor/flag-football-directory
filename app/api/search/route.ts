import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const type = searchParams.get('type') || 'all'
  const state = searchParams.get('state')

  if (!q) {
    return NextResponse.json({ results: [] })
  }

  try {
    let query = supabase
      .from('teams')
      .select('id, name, cities:city_id(name, state)')
      .ilike('name', `%${q}%`)

    if (state) {
      query = query.eq('cities.state', state)
    }

    const { data: teams, error: teamsError } = await query

    if (teamsError) {
      console.error('Teams search error:', teamsError)
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    const results = (teams || []).map((team: any) => ({
      id: team.id,
      name: team.name,
      type: 'team',
      location: team.cities?.name,
      state: team.cities?.state,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
