import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import TeamCard from '@/components/TeamCard'

export default async function TeamsPage({ searchParams }: { searchParams?: any }) {
  const q = (searchParams?.q || '').trim()
  const state = (searchParams?.state || '').toUpperCase()
  const gender = (searchParams?.gender || '').toLowerCase()
  const level = (searchParams?.level || '').toLowerCase()         // rec | competitive | elite
  const format = (searchParams?.format || '').toLowerCase()       // 5v5 | 7v7
  const age = (searchParams?.age || '').toUpperCase()             // 6U ... adult

  let tQ = supabase
    .from('teams')
    .select('id,slug,name,gender,age_groups,comp_levels,formats,verified,cover_url,city_id, cities:city_id(name, state)')
  if (q)       tQ = tQ.or(`name.ilike.%${q}%,cities.name.ilike.%${q}%`)
  if (state)   tQ = tQ.eq('cities.state', state)
  if (gender)  tQ = tQ.eq('gender', gender)
  if (level)   tQ = tQ.overlaps('comp_levels', [level])
  if (format)  tQ = tQ.overlaps('formats', [format])
  if (age)     tQ = tQ.overlaps('age_groups', [age])

  const { data: teams } = await tQ.order('name')

  return (
    <section className="grid gap-6">
      <header className="grid gap-3">
        <h1 className="text-2xl font-semibold">Teams</h1>
        <form className="grid gap-2 sm:flex sm:items-center sm:gap-2">
          <input className="border rounded p-2" name="q" defaultValue={q} placeholder="Search team or city…" />
          <select className="border rounded p-2" name="state" defaultValue={state}>
            <option value="">All states</option>
            {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
          <select className="border rounded p-2" name="gender" defaultValue={gender}>
            <option value="">Any gender</option>
            <option value="boys">Boys</option><option value="girls">Girls</option><option value="coed">Coed</option>
          </select>
          <select className="border rounded p-2" name="age" defaultValue={age}>
            <option value="">All ages</option>
            {['6U','8U','10U','12U','14U','16U','18U','ADULT'].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select className="border rounded p-2" name="level" defaultValue={level}>
            <option value="">Any level</option>
            <option value="rec">Recreational</option><option value="competitive">Competitive</option><option value="elite">Elite</option>
          </select>
          <select className="border rounded p-2" name="format" defaultValue={format}>
            <option value="">Any format</option>
            <option value="5v5">5v5</option><option value="7v7">7v7</option>
          </select>
          <button className="btn btn-primary">Filter</button>
        </form>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {(teams || []).map((t:any) => (
          <TeamCard key={t.id} t={{
            ...t,
            city_name: t.cities?.name,
            state: t.cities?.state
          }} />
        ))}
        {(!teams || teams.length===0) && <div className="card"><p className="text-sm text-gray-700">No teams found.</p></div>}
      </div>
    </section>
  )
}
