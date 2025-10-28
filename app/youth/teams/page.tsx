import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import TeamCard from '@/components/TeamCard'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const cleanSearchTerm = (term: string) =>
  term.replace(/[(),]/g, ' ').replace(/\s+/g, ' ').trim()

export default async function TeamsPage({ searchParams }: { searchParams?: any }) {
  const rawQ = (searchParams?.q || '').trim()
  const q = cleanSearchTerm(rawQ)
  const state = (searchParams?.state || '').trim().toUpperCase()
  const gender = (searchParams?.gender || '').trim().toLowerCase()
  const level = (searchParams?.level || '').trim().toLowerCase() // rec | competitive | elite
  const format = (searchParams?.format || '').trim().toLowerCase() // 5v5 | 7v7
  const age = (searchParams?.age || '').trim().toUpperCase() // 6U ... adult

  const hasFilters = Boolean(q || state || gender || level || format || age)

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
  if (state) tQ = tQ.eq('cities.state', state)
  if (gender) tQ = tQ.eq('gender', gender)
  if (level) tQ = tQ.overlaps('comp_levels', [level])
  if (format) tQ = tQ.overlaps('formats', [format])
  if (age) tQ = tQ.overlaps('age_groups', [age])

  const { data: teams, error } = await tQ.order('name')
  if (error) console.error('teams query error:', error)

  const results = teams || []

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-50/50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-8 lg:px-12">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Youth' }, { label: 'Teams' }]} className="py-0 text-sm text-[#345c72]" />
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#001f3d] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#e87a00] to-[#f59e0b]"></span>
                Teams Directory
              </span>

              <div className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-[#001f3d] sm:text-5xl xl:text-[3.5rem] xl:leading-[1.05]">
                  Compare verified flag football teams and{' '}
                  <span className="relative inline-block text-[#e87a00]">
                    build the right roster
                    <span className="absolute inset-x-0 bottom-1 -z-10 h-3 rounded-full bg-gradient-to-r from-[#e87a00]/40 to-[#f59e0b]/40" />
                  </span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#345c72] sm:text-xl">
                  Dial in location, competition level, and formats to discover programs that match your athletes&apos; goals—whether you&apos;re chasing rings or rising through the ranks.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/50 px-3 py-1.5 shadow-sm">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified submissions
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/50 px-3 py-1.5 shadow-sm">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#e87a00] to-[#f59e0b]" />
                  Filter by age &amp; level
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-blue-50/50 px-3 py-1.5 shadow-sm">
                  <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#345c72] to-[#1e40af]">
                    <span className="absolute inset-1 rounded-full bg-white" />
                  </span>
                  Nationwide coverage
                </span>
              </div>
            </div>

            <form
              method="get"
              className="grid gap-4 rounded-[24px] border border-[#001f3d]/15 bg-gradient-to-br from-white via-orange-50/20 to-blue-50/10 p-5 shadow-lg shadow-[#001f3d]/10 sm:p-6"
            >
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr),auto] sm:items-center">
                <label className="flex grow items-center gap-3 rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/30 px-4 py-3 focus-within:border-[#e87a00] focus-within:ring-2 focus-within:ring-[#e87a00]/25 focus-within:shadow-md transition-all duration-200">
                  <SearchIcon />
                  <input
                    type="text"
                    name="q"
                    defaultValue={rawQ}
                    placeholder="Search teams or cities..."
                    className="w-full text-sm font-medium text-[#001f3d] placeholder:text-[#345c72]/60 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#e87a00] to-[#f59e0b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#e87a00]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e87a00]/40"
                >
                  Search
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/20 px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 focus:shadow-sm transition-all duration-200"
                  name="state"
                  defaultValue={state}
                >
                  <option value="">All states</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/20 px-3 py-3 text-sm font-medium text-[#001f3d] capitalize focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 focus:shadow-sm transition-all duration-200"
                  name="gender"
                  defaultValue={gender}
                >
                  <option value="">Any gender</option>
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="coed">Coed</option>
                </select>

                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/20 px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 focus:shadow-sm transition-all duration-200"
                  name="age"
                  defaultValue={age}
                >
                  <option value="">All ages</option>
                  {['6U', '8U', '10U', '12U', '14U', '16U', '18U', 'ADULT'].map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/20 px-3 py-3 text-sm font-medium text-[#001f3d] capitalize focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 focus:shadow-sm transition-all duration-200"
                  name="level"
                  defaultValue={level}
                >
                  <option value="">Any level</option>
                  <option value="rec">Recreational</option>
                  <option value="competitive">Competitive</option>
                  <option value="elite">Elite</option>
                </select>

                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/20 px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 focus:shadow-sm transition-all duration-200"
                  name="format"
                  defaultValue={format}
                >
                  <option value="">Any format</option>
                  <option value="5v5">5v5</option>
                  <option value="7v7">7v7</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-gray-50">
        {/* Subtle top border for visual separation */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-[#001f3d]/20 to-transparent"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#001f3d] sm:text-3xl">
                Teams matching your filters
              </h2>
              <p className="text-sm font-medium !text-[#001f3d] sm:text-base">
                Showing <span className="font-semibold text-[#001f3d]">{results.length}</span> team
                {results.length === 1 ? '' : 's'}
              </p>
            </div>

            {hasFilters && (
            <a
              href="/youth/teams"
                className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#345c72] transition hover:border-[#e87a00]/40 hover:text-[#001f3d] hover:shadow-sm"
              >
                Reset filters
                <span>↺</span>
              </a>
            )}
          </div>

          {results.length > 0 ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {results.map((t: any) => (
                <div key={t.id} className="w-full max-w-sm">
                  <TeamCard
                    t={{
                      ...t,
                      city_name: t.cities?.name,
                      state: t.cities?.state,
                      detail_href: `/youth/teams/${t.slug}`,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-[#001f3d]/15 bg-gradient-to-br from-white via-orange-50/20 to-blue-50/10 px-8 py-14 text-center shadow-lg shadow-[#001f3d]/10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#001f3d]/30 bg-gradient-to-br from-white to-orange-50/30 text-[#001f3d]">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#001f3d]">No teams matched those filters</h3>
              <p className="mt-3 text-base text-[#345c72]/90">
                Try searching a nearby city, expanding the age range, or clearing the filters to see everything available.
              </p>
              <a
                href="/youth/teams"
                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/30 px-5 py-3 text-sm font-semibold text-[#001f3d] shadow-sm transition hover:border-[#e87a00] hover:text-[#e87a00] hover:shadow-md"
              >
                Clear filters
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
