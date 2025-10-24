import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import OrgCard from '@/components/OrgCard'
import Breadcrumbs from '@/components/Breadcrumbs'

type SP = Record<string, string | undefined>

export const dynamic = 'force-dynamic'

const cleanSearchTerm = (term: string) =>
  term.replace(/[(),]/g, ' ').replace(/\s+/g, ' ').trim()

export default async function TournamentsPage({ searchParams }: { searchParams?: SP }) {
  const rawQ    = (searchParams?.q || '').trim()
  const q       = cleanSearchTerm(rawQ)
  const state   = (searchParams?.state || '').trim().toUpperCase()
  const level   = (searchParams?.level || '').trim().toLowerCase()      // rec | competitive | elite
  const format  = (searchParams?.format || '').trim().toUpperCase()     // 5v5 | 7v7 | 8v8
  const contact = (searchParams?.contact || '').trim().toLowerCase()    // contact | non-contact
  const ages    = (searchParams?.age || '').trim().toUpperCase()        // 6U ... ADULT
  const range   = (searchParams?.range || 'upcoming')                   // upcoming | all | past

  const today = new Date().toISOString().slice(0,10)

  let eQ = supabase
    .from('events')
    .select(
      'id, slug, name, location, state, start_date, end_date, website, signup_url, cover_url, verified, divisions, formats, comp_levels, contact_type',
      { count: 'exact' }
    )
    .eq('kind','tournament')

  if (range === 'upcoming') eQ = eQ.gte('start_date', today)
  else if (range === 'past') eQ = eQ.lt('start_date', today)

  if (q)       eQ = eQ.or(`name.ilike.%${q}%,location.ilike.%${q}%`)
  if (state)   eQ = eQ.eq('state', state)
  if (level)   eQ = eQ.overlaps('comp_levels', [level])
  if (format)  eQ = eQ.overlaps('formats', [format])
  if (contact) eQ = eQ.eq('contact_type', contact)
  if (ages)    eQ = eQ.overlaps('divisions', [ages])

  const { data: tournaments, error, count } = await eQ.order('start_date', { ascending: range !== 'past' })
  if (error) console.error('tournaments query error:', error)

  const results = tournaments || []
  const total = typeof count === 'number' ? count : results.length

  return (
    <section className="container py-8">
      <Breadcrumbs items={[{ label: 'Tournaments' }]} className="mb-6" />

      <div className="space-y-3">
        <h1 className="section-heading">Tournament calendar</h1>
        <p className="section-subheading">
          Track upcoming travel and showcase events with filters for level, game type, and timing.
        </p>
      </div>

      <div className="surface-card mt-8 mb-8">
        <form className="grid gap-5 p-6 sm:p-8">
          <div>
            <input
              className="input w-full"
              name="q"
              defaultValue={rawQ}
              placeholder="Search tournaments or locations..."
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <select className="select w-full" name="state" defaultValue={state}>
              <option value="">All states</option>
              {US_STATES.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
            <select className="select w-full" name="age" defaultValue={ages}>
              <option value="">All ages</option>
              {['6U','8U','10U','12U','14U','16U','18U','ADULT'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select className="select w-full" name="level" defaultValue={level}>
              <option value="">Any level</option>
              <option value="rec">Recreational</option>
              <option value="competitive">Competitive</option>
              <option value="elite">Elite</option>
            </select>
            <select className="select w-full" name="format" defaultValue={format}>
              <option value="">Any game type</option>
              <option value="5v5">5v5</option>
              <option value="7v7">7v7</option>
              <option value="8v8">8v8</option>
            </select>
            <select className="select w-full" name="contact" defaultValue={contact}>
              <option value="">Any contact</option>
              <option value="non-contact">Non-contact</option>
              <option value="contact">Contact</option>
            </select>
            <select className="select w-full" name="range" defaultValue={range}>
              <option value="upcoming">Upcoming</option>
              <option value="all">All</option>
              <option value="past">Past</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full sm:w-auto">
            Search &amp; Filter
          </button>
        </form>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-[#345c72]/90">
          Showing <span className="font-semibold text-[#001f3d]">{total}</span> tournament{total === 1 ? '' : 's'}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((t: any) => (
          <OrgCard
            key={t.id}
            o={{
              type: 'Tournament',
              id: t.id,
              slug: t.slug,
              name: t.name,
              cover_url: t.cover_url,
              city_name: t.location,
              state: t.state,
              verified: t.verified,
            }}
          />
        ))}
      </div>

      {results.length === 0 && (
        <div className="empty-state mt-6">
          <div className="empty-state-icon">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <h3 className="empty-state-title">No tournaments found</h3>
          <p className="empty-state-description">
            Try updating your filters or switching the show dropdown to a different range
          </p>
          <a href="/tournaments" className="btn btn-outline mt-4">
            Clear Filters
          </a>
        </div>
      )}
    </section>
  )
}
