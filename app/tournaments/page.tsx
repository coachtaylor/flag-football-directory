import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import OrgCard from '@/components/OrgCard'

type SP = Record<string, string | undefined>

export default async function TournamentsPage({ searchParams }: { searchParams?: SP }) {
  const q       = (searchParams?.q || '').trim()
  const state   = (searchParams?.state || '').toUpperCase()
  const level   = (searchParams?.level || '').toLowerCase()      // rec | competitive | elite
  const format  = (searchParams?.format || '').toUpperCase()     // 5v5 | 7v7 | 8v8
  const contact = (searchParams?.contact || '').toLowerCase()    // contact | non-contact
  const ages    = (searchParams?.age || '').toUpperCase()        // 6U ... ADULT
  const range   = (searchParams?.range || 'upcoming')            // upcoming | all | past

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

  return (
    <section className="grid gap-6">
      <header className="grid gap-3">
        <h1 className="text-2xl font-semibold">Tournaments</h1>
        <form className="grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
          <input className="border rounded p-2" name="q" defaultValue={q} placeholder="Search tournament or location…" />
          <select className="border rounded p-2" name="state" defaultValue={state}>
            <option value="">All states</option>
            {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
          <select className="border rounded p-2" name="age" defaultValue={ages}>
            <option value="">All ages</option>
            {['6U','8U','10U','12U','14U','16U','18U','ADULT'].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select className="border rounded p-2" name="level" defaultValue={level}>
            <option value="">Any level</option>
            <option value="rec">Recreational</option>
            <option value="competitive">Competitive</option>
            <option value="elite">Elite</option>
          </select>
          <select className="border rounded p-2" name="format" defaultValue={format}>
            <option value="">Any game type</option>
            <option value="5v5">5v5</option>
            <option value="7v7">7v7</option>
            <option value="8v8">8v8</option>
          </select>
          <select className="border rounded p-2" name="contact" defaultValue={contact}>
            <option value="">Any contact</option>
            <option value="non-contact">Non-contact</option>
            <option value="contact">Contact</option>
          </select>
          <select className="border rounded p-2" name="range" defaultValue={range}>
            <option value="upcoming">Upcoming</option>
            <option value="all">All</option>
            <option value="past">Past</option>
          </select>
          <button className="btn btn-primary">Filter</button>
        </form>
        <p className="small text-gray-600">{count ?? 0} result{(count||0)===1?'':'s'}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {(tournaments || []).map((t:any) => (
          <OrgCard key={t.id} o={{
            type: 'Tournament',
            id: t.id, slug: t.slug, name: t.name,
            cover_url: t.cover_url,
            city_name: t.location,
            state: t.state,
            verified: t.verified
          }} />
        ))}
        {(!tournaments || tournaments.length===0) && (
          <div className="card">
            <p className="text-sm text-gray-700">
              {range === 'upcoming'
                ? 'No upcoming tournaments match your filters.'
                : 'No tournaments match your filters.'}
              {' '}Try clearing filters or switch the “Show” dropdown to **All**.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
