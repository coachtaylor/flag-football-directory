// components/StatesGrid.tsx
import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import Link from 'next/link'

const MapPinIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export default async function StatesGrid() {
  const today = new Date().toISOString().slice(0,10)

  // teams per state
  const { data: teams } = await supabase
    .from('teams')
    .select('id, cities:city_id(state)')
  const teamCounts = (teams || []).reduce<Record<string, number>>((acc, t: any)=> {
    const st = t?.cities?.state; if (!st) return acc; acc[st]=(acc[st]||0)+1; return acc
  }, {})

  // leagues per state
  const { data: leagues } = await supabase
    .from('leagues')
    .select('id, cities:city_id(state)')
  const leagueCounts = (leagues || []).reduce<Record<string, number>>((acc, l: any)=> {
    const st = l?.cities?.state; if (!st) return acc; acc[st]=(acc[st]||0)+1; return acc
  }, {})

  // events per state by kind
  const { data: events } = await supabase
    .from('events')
    .select('state, kind, start_date')
    .gte('start_date', today)

  const tourneyCounts: Record<string, number> = {}
  const clinicCounts: Record<string, number> = {}
  for (const e of events || []) {
    if (!e?.state) continue
    if (e.kind === 'clinic') clinicCounts[e.state] = (clinicCounts[e.state]||0)+1
    else tourneyCounts[e.state] = (tourneyCounts[e.state]||0)+1
  }

  const active = US_STATES
    .map(s => {
      const t = teamCounts[s.code]||0, l = leagueCounts[s.code]||0, c = clinicCounts[s.code]||0, tr = tourneyCounts[s.code]||0
      return { ...s, t, l, c, tr, total: t+l+c+tr }
    })
    .filter(s => s.total>0)
    .sort((a,b)=> b.total - a.total || a.name.localeCompare(b.name))

  if (!active.length) return null

  return (
    <section id="explore-states" className="section-sm">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Browse by State
        </h2>
        <p className="text-gray-600">
          {active.length} {active.length === 1 ? 'state' : 'states'} with active programs
        </p>
      </div>

      {/* States Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {active.map((s) => (
          <StateCard key={s.code} state={s} />
        ))}
      </div>
    </section>
  )
}

// Individual State Card Component
function StateCard({ state }: { state: any }) {
  return (
    <Link 
      href={`/states/${state.code.toLowerCase()}`}
      className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
    >
      {/* Header with state name */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
            <MapPinIcon />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
              {state.name}
            </h3>
            <p className="text-xs text-gray-500">
              {state.total} {state.total === 1 ? 'program' : 'programs'}
            </p>
          </div>
        </div>
        <div className="text-gray-400 group-hover:text-red-600 transition-colors">
          <ChevronRightIcon />
        </div>
      </div>

      {/* Program counts */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {state.t > 0 && (
          <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded">
            <span className="text-gray-600">Teams</span>
            <span className="font-semibold text-gray-900">{state.t}</span>
          </div>
        )}
        {state.l > 0 && (
          <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded">
            <span className="text-gray-600">Leagues</span>
            <span className="font-semibold text-gray-900">{state.l}</span>
          </div>
        )}
        {state.c > 0 && (
          <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded">
            <span className="text-gray-600">Clinics</span>
            <span className="font-semibold text-gray-900">{state.c}</span>
          </div>
        )}
        {state.tr > 0 && (
          <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded">
            <span className="text-gray-600">Tournaments</span>
            <span className="font-semibold text-gray-900">{state.tr}</span>
          </div>
        )}
      </div>
    </Link>
  )
}