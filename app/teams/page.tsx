import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import TeamCard from '@/components/TeamCard'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

const cleanSearchTerm = (term: string) =>
  term.replace(/[(),]/g, ' ').replace(/\s+/g, ' ').trim()

export default async function TeamsPage({ searchParams }: { searchParams?: any }) {
  const rawQ = (searchParams?.q || '').trim()
  const q = cleanSearchTerm(rawQ)
  const state = (searchParams?.state || '').trim().toUpperCase()
  const gender = (searchParams?.gender || '').trim().toLowerCase()
  const level = (searchParams?.level || '').trim().toLowerCase()         // rec | competitive | elite
  const format = (searchParams?.format || '').trim().toLowerCase()       // 5v5 | 7v7
  const age = (searchParams?.age || '').trim().toUpperCase()             // 6U ... adult

  let cityMatches: number[] = []
  if (q) {
    const { data: cities } = await supabase
      .from('cities')
      .select('id')
      .or(`name.ilike.%${q}%,state.ilike.%${q}%`)

    const ids = (cities || [])
      .map((c: any) => c?.id)
      .filter((id: number | undefined): id is number => typeof id === 'number')
    cityMatches = Array.from(new Set(ids))
  }

  let tQ = supabase
    .from('teams')
    .select('id,slug,name,gender,age_groups,comp_levels,formats,verified,cover_url,city_id,cities:city_id!inner(name,state)')

  if (q) {
    const filters = [`name.ilike.%${q}%`]
    if (cityMatches.length) filters.push(`city_id.in.(${cityMatches.join(',')})`)
    tQ = tQ.or(filters.join(','))
  }
  if (state)   tQ = tQ.eq('cities.state', state)
  if (gender)  tQ = tQ.eq('gender', gender)
  if (level)   tQ = tQ.overlaps('comp_levels', [level])
  if (format)  tQ = tQ.overlaps('formats', [format])
  if (age)     tQ = tQ.overlaps('age_groups', [age])

  const { data: teams, error } = await tQ.order('name')
  if (error) console.error('teams query error:', error)

  const results = teams || []

  return (
    <section className="container py-8">
      <Breadcrumbs items={[{ label: 'Teams' }]} className="mb-6" />

      <div className="space-y-3">
        <h1 className="section-heading">Flag football teams directory</h1>
        <p className="section-subheading">
          Filter by location, level, and age group to match your athletes with the right roster.
        </p>
      </div>

      <div className="surface-card mt-8 mb-8">
        <form className="grid gap-5 p-6 sm:p-8">
          <div>
            <input
              className="input w-full"
              name="q"
              defaultValue={rawQ}
              placeholder="Search teams or cities..."
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <select className="select w-full" name="state" defaultValue={state}>
              <option value="">All states</option>
              {US_STATES.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
            <select className="select w-full" name="gender" defaultValue={gender}>
              <option value="">Any gender</option>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="coed">Coed</option>
            </select>
            <select className="select w-full" name="age" defaultValue={age}>
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
              <option value="">Any format</option>
              <option value="5v5">5v5</option>
              <option value="7v7">7v7</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Search &amp; Filter
          </button>
        </form>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-[#345c72]/90">
          Showing <span className="font-semibold text-[#001f3d]">{results.length}</span> team{results.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((t: any) => (
          <TeamCard
            key={t.id}
            t={{
              ...t,
              city_name: t.cities?.name,
              state: t.cities?.state,
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
          <h3 className="empty-state-title">No teams found</h3>
          <p className="empty-state-description">
            Try adjusting your filters or searching a different city
          </p>
          <a href="/teams" className="btn btn-outline mt-4">
            Clear Filters
          </a>
        </div>
      )}
    </section>
  )
}
