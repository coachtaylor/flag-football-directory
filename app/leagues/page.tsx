import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import OrgCard from '@/components/OrgCard'

export default async function LeaguesPage({ searchParams }: { searchParams?: any }) {
  const q = (searchParams?.q || '').trim()
  const state = (searchParams?.state || '').toUpperCase()
  const gender = (searchParams?.gender || '').toLowerCase()
  const format = (searchParams?.format || '').toUpperCase()       // 5v5/7v7/8v8
  const contact = (searchParams?.contact || '').toLowerCase()     // contact/non-contact
  const ages = (searchParams?.age || '').toUpperCase()

  let lQ = supabase
    .from('leagues')
    .select('id,slug,name,verified,cover_url,divisions,formats,contact_type,city_id,cities:city_id(name,state)')
  if (q)       lQ = lQ.or(`name.ilike.%${q}%,cities.name.ilike.%${q}%`)
  if (state)   lQ = lQ.eq('cities.state', state)
  if (gender)  lQ = lQ.ilike('name', `%${gender}%`)               // (if you store gender in a column, switch to eq/overlaps)
  if (ages)    lQ = lQ.overlaps('divisions', [ages])
  if (format)  lQ = lQ.overlaps('formats', [format])
  if (contact) lQ = lQ.eq('contact_type', contact)

  const { data: leagues } = await lQ.order('name')

  return (
    <section className="grid gap-6">
      <header className="grid gap-3">
        <h1 className="text-2xl font-semibold">Leagues</h1>
        <form className="grid gap-2 sm:flex sm:items-center sm:gap-2">
          <input className="border rounded p-2" name="q" defaultValue={q} placeholder="Search league or city…" />
          <select className="border rounded p-2" name="state" defaultValue={state}>
            <option value="">All states</option>
            {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
          <select className="border rounded p-2" name="age" defaultValue={ages}>
            <option value="">All ages</option>
            {['6U','8U','10U','12U','14U','16U','18U','ADULT'].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select className="border rounded p-2" name="format" defaultValue={format}>
            <option value="">Any game type</option>
            <option value="5v5">5v5</option><option value="7v7">7v7</option><option value="8v8">8v8</option>
          </select>
          <select className="border rounded p-2" name="contact" defaultValue={contact}>
            <option value="">Any contact</option>
            <option value="non-contact">Non-contact</option><option value="contact">Contact</option>
          </select>
          <button className="btn btn-primary">Filter</button>
        </form>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {(leagues || []).map((l:any) => (
          <OrgCard key={l.id} o={{
            type: 'League', id: l.id, slug: l.slug, name: l.name,
            verified: l.verified, cover_url: l.cover_url, city_name: l.cities?.name, state: l.cities?.state
          }} />
        ))}
        {(!leagues || leagues.length===0) && <div className="card"><p className="text-sm text-gray-700">No leagues found.</p></div>}
      </div>
    </section>
  )
}
