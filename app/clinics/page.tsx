// app/clinics/page.tsx
import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import OrgCard from '@/components/OrgCard'

export default async function ClinicsPage({ searchParams }: { searchParams?: Record<string,string> }) {
  const q = (searchParams?.q || '').trim()
  const state = (searchParams?.state || '').toUpperCase()
  const today = new Date().toISOString().slice(0,10)

  let eQ = supabase
    .from('events')
    .select('id, slug, name, location, state, start_date, end_date, website, signup_url, cover_url, verified')
    .eq('kind','clinic')
    .gte('start_date', today)

  if (q)     eQ = eQ.or(`name.ilike.%${q}%,location.ilike.%${q}%`)
  if (state) eQ = eQ.eq('state', state)

  const { data: clinics, error } = await eQ.order('start_date', { ascending: true })
  if (error) console.error('clinics query error:', error)

  return (
    <section className="grid gap-6">
      <header className="grid gap-3">
        <h1 className="text-2xl font-semibold">Clinics</h1>
        <form className="grid gap-2 sm:flex sm:items-center sm:gap-2">
          <input className="border rounded p-2" name="q" defaultValue={q} placeholder="Search clinic or location…" />
          <select className="border rounded p-2" name="state" defaultValue={state}>
            <option value="">All states</option>
            {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
          <button className="btn btn-primary">Filter</button>
        </form>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {(clinics || []).map((c:any) => (
          <OrgCard key={c.id} o={{
            type: 'Clinic', id: c.id, slug: c.slug, name: c.name,
            cover_url: c.cover_url, city_name: c.location, state: c.state, verified: c.verified
          }} />
        ))}
        {(!clinics || clinics.length===0) && (
          <div className="card"><p className="text-sm text-gray-700">No clinics found.</p></div>
        )}
      </div>
    </section>
  )
}
