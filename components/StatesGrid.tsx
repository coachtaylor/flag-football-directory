// components/StatesGrid.tsx
import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import Link from 'next/link'

const ArrowRightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
    <section id="explore-states" className="py-20 lg:py-24 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#001f3d] mb-4">
            Browse by State
          </h2>
          <p className="text-xl text-[#345c72]">
            {active.length} {active.length === 1 ? 'state' : 'states'} with active programs
          </p>
        </div>

        {/* States Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {active.map((s) => (
            <StateCard key={s.code} state={s} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Individual State Card Component
function StateCard({ state }: { state: any }) {
  // Rotate between the 3 main colors for variety
  const colors = [
    { bg: 'bg-[#001f3d]', text: 'text-[#001f3d]' },
    { bg: 'bg-[#345c72]', text: 'text-[#345c72]' },
    { bg: 'bg-[#e87a00]', text: 'text-[#e87a00]' },
  ]
  
  const colorIndex = state.name.charCodeAt(0) % colors.length
  const color = colors[colorIndex]

  return (
    <Link 
      href={`/states/${state.code.toLowerCase()}`}
      className="block bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100"
    >
      {/* Colored header */}
      <div className={`${color.bg} p-6 text-white`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">
              {state.name}
            </h3>
            <p className="text-white/90 text-sm font-medium">
              {state.total} {state.total === 1 ? 'program' : 'programs'}
            </p>
          </div>
          <div className="bg-white/20 p-2 rounded-xl">
            <ArrowRightIcon />
          </div>
        </div>
      </div>

      {/* Program counts */}
      <div className="p-6 bg-[#f6f6f6]">
        <div className="grid grid-cols-2 gap-3">
          {state.t > 0 && (
            <div className="text-center">
              <div className="text-3xl font-bold text-[#001f3d] mb-1">{state.t}</div>
              <div className="text-sm text-[#345c72] font-medium">Teams</div>
            </div>
          )}
          {state.l > 0 && (
            <div className="text-center">
              <div className="text-3xl font-bold text-[#001f3d] mb-1">{state.l}</div>
              <div className="text-sm text-[#345c72] font-medium">Leagues</div>
            </div>
          )}
          {state.c > 0 && (
            <div className="text-center">
              <div className="text-3xl font-bold text-[#001f3d] mb-1">{state.c}</div>
              <div className="text-sm text-[#345c72] font-medium">Clinics</div>
            </div>
          )}
          {state.tr > 0 && (
            <div className="text-center">
              <div className="text-3xl font-bold text-[#001f3d] mb-1">{state.tr}</div>
              <div className="text-sm text-[#345c72] font-medium">Tournaments</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}