import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import Link from 'next/link'

type StateMeta = {
  code: string
  name: string
  t: number
  l: number
  c: number
  tr: number
  total: number
}

const formatStateTotals = (state: StateMeta) => [
  { label: 'Teams', value: state.t },
  { label: 'Leagues', value: state.l },
  { label: 'Clinics', value: state.c },
  { label: 'Tournaments', value: state.tr },
]

export default async function StatesGrid() {
  const today = new Date().toISOString().slice(0, 10)

  const { data: teams } = await supabase.from('teams').select('id, cities:city_id(state)')
  const { data: leagues } = await supabase.from('leagues').select('id, cities:city_id(state)')
  const { data: events } = await supabase.from('events').select('state, kind, start_date').gte('start_date', today)

  const teamCounts: Record<string, number> = {}
  const leagueCounts: Record<string, number> = {}
  const clinicCounts: Record<string, number> = {}
  const tournamentCounts: Record<string, number> = {}

  for (const team of teams || []) {
    const state = (team as any)?.cities?.state
    if (state) teamCounts[state] = (teamCounts[state] || 0) + 1
  }

  for (const league of leagues || []) {
    const state = (league as any)?.cities?.state
    if (state) leagueCounts[state] = (leagueCounts[state] || 0) + 1
  }

  for (const event of events || []) {
    if (!event?.state) continue
    if (event.kind === 'clinic') clinicCounts[event.state] = (clinicCounts[event.state] || 0) + 1
    else tournamentCounts[event.state] = (tournamentCounts[event.state] || 0) + 1
  }

  const activeStates = US_STATES
    .map((state) => {
      const meta: StateMeta = {
        code: state.code,
        name: state.name,
        t: teamCounts[state.code] || 0,
        l: leagueCounts[state.code] || 0,
        c: clinicCounts[state.code] || 0,
        tr: tournamentCounts[state.code] || 0,
        total:
          (teamCounts[state.code] || 0) +
          (leagueCounts[state.code] || 0) +
          (clinicCounts[state.code] || 0) +
          (tournamentCounts[state.code] || 0),
      }
      return meta
    })
    .filter((state) => state.total > 0)
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))

  if (!activeStates.length) return null

  const topStates = activeStates.slice(0, 3)
  const otherStates = activeStates.slice(3)

  return (
    <div id="explore-states" className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#001f3d]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#001f3d]">
          <span className="w-2 h-2 rounded-full bg-[#e87a00]"></span>
          Explore the map
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-[#001f3d] sm:text-4xl">
            Active flag football states
          </h2>
          <p className="text-lg text-[#345c72]/90 max-w-2xl mx-auto">
            {activeStates.length} {activeStates.length === 1 ? 'state has' : 'states have'} verified programs, clinics, and tournaments. 
            Tap a state to explore full program listings.
          </p>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {topStates.map((state, idx) => (
          <Link
            key={state.code}
            href={`/states/${state.code.toLowerCase()}`}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200/60 hover:border-[#001f3d]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full max-w-sm"
          >
            {/* Color accent based on ranking */}
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{ 
                backgroundColor: idx === 0 ? '#e87a00' : idx === 1 ? '#001f3d' : '#345c72' 
              }}
            />
            
            <div className="p-6 pt-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#345c72]/70 mb-2">{state.code}</p>
                  <h3 className="text-xl font-semibold text-[#001f3d] mb-1">{state.name}</h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div 
                    className="rounded-xl px-3 py-2 text-center"
                    style={{ 
                      backgroundColor: idx === 0 ? '#e87a00' : '#001f3d',
                      color: 'white'
                    }}
                  >
                    <p className="text-xs font-medium opacity-90 text-white">Programs</p>
                    <p className="text-lg font-semibold text-white">{state.total}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {formatStateTotals(state).map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2 text-center">
                    <p className="text-xs font-medium text-[#345c72]/70">{item.label}</p>
                    <p className="text-sm font-semibold text-[#001f3d]">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center text-sm font-medium text-[#345c72]/70 group-hover:text-[#e87a00] transition-colors">
                <span>View {state.name} overview</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {otherStates.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#001f3d] mb-2">All Active States</h3>
            <p className="text-sm text-[#345c72]/70">Organized by activity level</p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {otherStates.map((state, index) => (
              <Link
                key={state.code}
                href={`/states/${state.code.toLowerCase()}`}
                className="group flex items-center justify-between rounded-xl bg-white border border-gray-200/60 hover:border-[#001f3d]/20 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg relative"
              >
                {/* Subtle left border accent */}
                <div 
                  className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full opacity-60"
                  style={{ 
                    backgroundColor: index % 3 === 0 ? '#e87a00' : index % 3 === 1 ? '#001f3d' : '#345c72' 
                  }}
                />
                
                <div className="flex-1 pl-3">
                  <p className="text-sm font-semibold text-[#001f3d]">{state.name}</p>
                  <p className="text-xs text-[#345c72]/70">
                    {state.total} {state.total === 1 ? 'program' : 'programs'}
                  </p>
                </div>
                <span className="text-sm font-medium text-[#345c72]/50 group-hover:text-[#e87a00] transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
