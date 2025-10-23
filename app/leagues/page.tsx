// app/leagues/page.tsx
import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'

export default async function LeaguesPage({ searchParams }: { searchParams?: any }) {
  const q = (searchParams?.q || '').trim()
  const state = (searchParams?.state || '').toUpperCase()
  const gender = (searchParams?.gender || '').toLowerCase()
  const format = (searchParams?.format || '').toUpperCase()
  const contact = (searchParams?.contact || '').toLowerCase()
  const ages = (searchParams?.age || '').toUpperCase()

  // Build query
  let lQ = supabase
    .from('leagues')
    .select('id,slug,name,verified,cover_url,divisions,formats,contact_type,city_id,cities:city_id(name,state)')
  
  if (q)       lQ = lQ.or(`name.ilike.%${q}%,cities.name.ilike.%${q}%`)
  if (state)   lQ = lQ.eq('cities.state', state)
  if (ages)    lQ = lQ.overlaps('divisions', [ages])
  if (format)  lQ = lQ.overlaps('formats', [format])
  if (contact) lQ = lQ.eq('contact_type', contact)

  const { data: leagues } = await lQ.order('name')

  return (
    <section className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Leagues</h1>
        <p className="text-secondary">Find flag football leagues near you</p>
      </div>

      {/* Search & Filters */}
      <div className="card card-padding mb-8">
        <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <input 
            className="input" 
            name="q" 
            defaultValue={q} 
            placeholder="Search leagues or cities..." 
          />
          <select className="select" name="state" defaultValue={state}>
            <option value="">All states</option>
            {US_STATES.map(s => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
          <select className="select" name="age" defaultValue={ages}>
            <option value="">All ages</option>
            {['6U','8U','10U','12U','14U','16U','18U','ADULT'].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select className="select" name="format" defaultValue={format}>
            <option value="">Any format</option>
            <option value="5v5">5v5</option>
            <option value="7v7">7v7</option>
            <option value="8v8">8v8</option>
          </select>
          <button className="btn btn-primary lg:col-span-4">
            Apply Filters
          </button>
        </form>
      </div>

      {/* Results count */}
      <p className="text-sm text-secondary mb-6">
        {leagues?.length || 0} leagues found
      </p>

      {/* Leagues Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(leagues || []).map((league: any) => (
          <LeagueCard key={league.id} league={league} />
        ))}
      </div>

      {/* Empty state */}
      {(!leagues || leagues.length === 0) && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <h3 className="empty-state-title">No leagues found</h3>
          <p className="empty-state-description">
            Try adjusting your filters or search in a different location
          </p>
          <a href="/leagues" className="btn btn-outline mt-4">
            Clear Filters
          </a>
        </div>
      )}
    </section>
  )
}

// League Card Component
function LeagueCard({ league }: { league: any }) {
  return (
    <article className="card card-hover card-padding">
      {/* Image */}
      <div className="img-aspect-video mb-4">
        {league.cover_url ? (
          <img src={league.cover_url} alt={league.name} className="img-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
        )}
      </div>

      {/* Header with badges */}
      <div className="flex items-center justify-between mb-3">
        <span className="badge badge-secondary">League</span>
        {league.verified && (
          <span className="badge badge-success flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
          </span>
        )}
      </div>

      {/* League name */}
      <h3 className="text-lg font-semibold text-primary mb-2">
        {league.name}
      </h3>

      {/* Location */}
      <div className="flex items-center gap-1 text-sm text-secondary mb-3">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        <span>{league.cities?.name}, {league.cities?.state}</span>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-2 mb-4">
        {league.divisions?.slice(0, 3).map((div: string) => (
          <span key={div} className="pill text-xs">{div}</span>
        ))}
        {league.formats?.map((f: string) => (
          <span key={f} className="pill text-xs">{f}</span>
        ))}
      </div>

      {/* CTA */}
      <a href={`/leagues/${league.slug}`} className="btn btn-primary w-full">
        View Details
      </a>
    </article>
  )
}