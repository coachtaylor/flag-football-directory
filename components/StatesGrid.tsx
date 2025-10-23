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

// Color schemes for cards - alternating between brand colors
const colorSchemes = [
  {
    bg: 'bg-[#345c72]',           // Blue-gray
    text: 'text-white',
    iconBg: 'bg-white/10',
    iconText: 'text-white',
    countBg: 'bg-white/10',
    countText: 'text-white',
    shadow: 'shadow-[#345c72]/20',
    hoverShadow: 'hover:shadow-[#345c72]/30',
  },
  {
    bg: 'bg-[#001f3d]',           // Navy
    text: 'text-white',
    iconBg: 'bg-white/10',
    iconText: 'text-white',
    countBg: 'bg-white/10',
    countText: 'text-white',
    shadow: 'shadow-[#001f3d]/20',
    hoverShadow: 'hover:shadow-[#001f3d]/30',
  },
  {
    bg: 'bg-[#e87a00]',           // Orange
    text: 'text-white',
    iconBg: 'bg-white/10',
    iconText: 'text-white',
    countBg: 'bg-white/10',
    countText: 'text-white',
    shadow: 'shadow-[#e87a00]/20',
    hoverShadow: 'hover:shadow-[#e87a00]/30',
  },
  {
    bg: 'bg-[#001f3d]',           // Navy (repeat)
    text: 'text-white',
    iconBg: 'bg-white/10',
    iconText: 'text-white',
    countBg: 'bg-white/10',
    countText: 'text-white',
    shadow: 'shadow-[#001f3d]/20',
    hoverShadow: 'hover:shadow-[#001f3d]/30',
  },
]

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
        <h2 className="text-2xl font-semibold text-[#001f3d] mb-2">
          Browse by State
        </h2>
        <p className="text-[#345c72]">
          {active.length} {active.length === 1 ? 'state' : 'states'} with active programs
        </p>
      </div>

      {/* States Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {active.map((s, index) => (
          <StateCard key={s.code} state={s} colorScheme={colorSchemes[index % colorSchemes.length]} />
        ))}
      </div>
    </section>
  )
}

// Individual State Card Component
function StateCard({ state, colorScheme }: { state: any; colorScheme: typeof colorSchemes[0] }) {
  return (
    <Link 
      href={`/states/${state.code.toLowerCase()}`}
      className="group block bg-white rounded-2xl overflow-hidden border-2 border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1"
    >
      {/* Colored Header with state name - WHITE TEXT */}
      <div className={`
        ${colorScheme.bg} ${colorScheme.text}
        p-5 transition-all duration-300
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
        
            <div>
              <h3 className="font-semibold text-white">
                {state.name}
              </h3>
              <p className="text-xs text-white/80">
                {state.total} {state.total === 1 ? 'program' : 'programs'}
              </p>
            </div>
          </div>
          <div className="text-white transition-transform duration-300 group-hover:translate-x-1">
            <ChevronRightIcon />
          </div>
        </div>
      </div>

      {/* White Background - Program counts with dark text */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {state.t > 0 && (
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-[#345c72]">Teams</span>
              <span className="font-semibold text-[#001f3d]">{state.t}</span>
            </div>
          )}
          {state.l > 0 && (
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-[#345c72]">Leagues</span>
              <span className="font-semibold text-[#001f3d]">{state.l}</span>
            </div>
          )}
          {state.c > 0 && (
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-[#345c72]">Clinics</span>
              <span className="font-semibold text-[#001f3d]">{state.c}</span>
            </div>
          )}
          {state.tr > 0 && (
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-[#345c72]">Tournaments</span>
              <span className="font-semibold text-[#001f3d]">{state.tr}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}