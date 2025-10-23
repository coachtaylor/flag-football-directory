import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import Link from 'next/link'

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
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Browse Flag Football Programs by State
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Find teams, leagues, clinics, and tournaments in your state
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {active.map(s=>(
            <article key={s.code} className="card card-hover card-padding-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-primary">{s.name}</h3>
                <span className="text-sm font-medium text-secondary bg-gray-100 px-2 py-1 rounded">{s.code}</span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">Teams</span>
                  <span className="font-semibold text-primary">{s.t}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">Leagues</span>
                  <span className="font-semibold text-primary">{s.l}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">Clinics</span>
                  <span className="font-semibold text-primary">{s.c}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">Tournaments</span>
                  <span className="font-semibold text-primary">{s.tr}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {s.t>0 && <Link href={`/teams?state=${s.code}`} className="btn btn-outline btn-xs">Teams</Link>}
                {s.l>0 && <Link href={`/leagues?state=${s.code}`} className="btn btn-outline btn-xs">Leagues</Link>}
                {s.c>0 && <Link href={`/clinics?state=${s.code}`} className="btn btn-outline btn-xs">Clinics</Link>}
                {s.tr>0 && <Link href={`/tournaments?state=${s.code}`} className="btn btn-outline btn-xs">Tournaments</Link>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import Link from 'next/link'

// Minimal, professional icons
const TeamIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const LeagueIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
)

const ClinicIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const TournamentIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
        {active.map((s, idx) => (
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
      href={`/states/${state.code}`}
      className="group block"
    >
      <article className="h-full bg-white border border-gray-200 rounded-lg p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-sm cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {state.name}
            </h3>
            <p className="text-sm text-gray-500">
              {state.total} {state.total === 1 ? 'program' : 'programs'}
            </p>
          </div>
          
          {/* Subtle arrow */}
          <div className="text-gray-400 group-hover:text-gray-600 transition-colors mt-1 ml-2 flex-shrink-0">
            <ArrowIcon />
          </div>
        </div>

        {/* Stats - Clean, minimal layout */}
        <div className="space-y-2">
          {state.t > 0 && (
            <div className="flex items-center justify-between text-sm py-1.5">
              <div className="flex items-center gap-2 text-gray-600">
                <TeamIcon />
                <span>Teams</span>
              </div>
              <span className="font-medium text-gray-900">{state.t}</span>
            </div>
          )}
          
          {state.l > 0 && (
            <div className="flex items-center justify-between text-sm py-1.5">
              <div className="flex items-center gap-2 text-gray-600">
                <LeagueIcon />
                <span>Leagues</span>
              </div>
              <span className="font-medium text-gray-900">{state.l}</span>
            </div>
          )}
          
          {state.c > 0 && (
            <div className="flex items-center justify-between text-sm py-1.5">
              <div className="flex items-center gap-2 text-gray-600">
                <ClinicIcon />
                <span>Clinics</span>
              </div>
              <span className="font-medium text-gray-900">{state.c}</span>
            </div>
          )}
          
          {state.tr > 0 && (
            <div className="flex items-center justify-between text-sm py-1.5">
              <div className="flex items-center gap-2 text-gray-600">
                <TournamentIcon />
                <span>Tournaments</span>
              </div>
              <span className="font-medium text-gray-900">{state.tr}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}