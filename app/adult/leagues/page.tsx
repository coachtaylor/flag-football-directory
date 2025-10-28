import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

const cleanSearchTerm = (term: string) =>
  term.replace(/[(),]/g, ' ').replace(/\s+/g, ' ').trim()

const slugify = (value?: string | null) =>
  (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default async function AdultLeaguesPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const rawQ = (searchParams?.q || '').trim()
  const q = cleanSearchTerm(rawQ)
  const state = (searchParams?.state || '').trim().toUpperCase()
  const format = (searchParams?.format || '').trim()
  const contact = (searchParams?.contact || '').toLowerCase()

  const hasFilters = Boolean(q || state || format || contact)

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

  let lQ = supabase
    .from('leagues')
    .select('id,slug,name,verified,cover_url,divisions,formats,contact_type,city_id,cities:city_id!inner(name,state)')
    .overlaps('divisions', ['ADULT'])

  if (q) {
    const filters = [`name.ilike.%${q}%`]
    if (cityMatches.length) filters.push(`city_id.in.(${cityMatches.join(',')})`)
    lQ = lQ.or(filters.join(','))
  }
  if (state) lQ = lQ.eq('cities.state', state)
  if (format) lQ = lQ.overlaps('formats', [format])
  if (contact) lQ = lQ.eq('contact_type', contact)

  const { data: leagues, error } = await lQ.order('name')
  if (error) {
    console.error('[adult-leagues] query failed', error)
  }

  const results = leagues || []

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-50/50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-8 lg:px-12">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Adult', href: '/adult' }, { label: 'Leagues' }]} className="py-0 text-sm text-[#345c72]" />
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#001f3d] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#e87a00] to-[#f59e0b]" />
                Adult Leagues Directory
              </span>

              <div className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-[#001f3d] sm:text-5xl xl:text-[3.5rem] xl:leading-[1.05]">
                  Discover competitive adult flag football{' '}
                  <span className="relative inline-block text-[#e87a00]">
                    leagues near you
                    <span className="absolute inset-x-0 bottom-1 -z-10 h-3 rounded-full bg-gradient-to-r from-[#e87a00]/40 to-[#f59e0b]/40" />
                  </span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#345c72] sm:text-xl">
                  Filter by location, format, and contact rules to find the adult league that matches your squad&apos;s style of play.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/50 px-3 py-1.5 shadow-sm">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified organizers
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/50 px-3 py-1.5 shadow-sm">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#e87a00] to-[#f59e0b]" />
                  5v5 • 7v7 • 8v8
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
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    name="q"
                    defaultValue={rawQ}
                    placeholder="Search leagues or cities..."
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

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/20 px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 focus:shadow-sm transition-all duration-200"
                  name="format"
                  defaultValue={format}
                >
                  <option value="">Any format</option>
                  <option value="5v5">5v5</option>
                  <option value="6v6">6v6</option>
                  <option value="7v7">7v7</option>
                  <option value="8v8">8v8</option>
                </select>
                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/20 px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 focus:shadow-sm transition-all duration-200"
                  name="contact"
                  defaultValue={contact}
                >
                  <option value="">Any contact</option>
                  <option value="non-contact">Non-contact</option>
                  <option value="semi-contact">Semi-contact</option>
                  <option value="contact">Contact</option>
                </select>
                <div className="rounded-2xl border border-[#001f3d]/10 bg-white/60 px-3 py-3 text-sm font-medium text-[#345c72]">
                  Adult divisions only
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#001f3d]">
                Leagues matching your filters
              </h2>
              <p className="text-sm font-medium !text-[#001f3d] sm:text-base">
                Showing <span className="font-semibold text-[#001f3d]">{results.length}</span> league{results.length === 1 ? '' : 's'}
              </p>
            </div>

            {hasFilters && (
              <a
                href="/adult/leagues"
                className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#345c72] transition hover:border-[#e87a00]/40 hover:text-[#001f3d] hover:shadow-sm"
              >
                Reset filters
                <span>↺</span>
              </a>
            )}
          </div>

          {results.length > 0 ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {results.map((league: any) => (
                <div key={league.id} className="w-full max-w-sm">
                  <LeagueCard league={league} />
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
              <h3 className="mt-6 text-2xl font-semibold text-[#001f3d]">No adult leagues found</h3>
              <p className="mt-3 text-base text-[#345c72]/90">
                Try adjusting your filters or search a nearby city to explore more options.
              </p>
              <a
                href="/adult/leagues"
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

function LeagueCard({ league }: { league: any }) {
  const safeSlug =
    typeof league.slug === 'string' && league.slug.trim().length > 0 ? league.slug.trim() : null
  const generatedSlug = slugify(league.name)
  const fallbackId =
    typeof league.id === 'number' || (typeof league.id === 'string' && league.id.trim().length > 0)
      ? String(league.id).trim()
      : null
  const slugOrId = safeSlug ?? (generatedSlug || null) ?? fallbackId
  const href = slugOrId ? `/adult/leagues/${slugOrId}` : '/adult/leagues'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#001f3d]/10 bg-white shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(0,31,61,0.55)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#001f3d] via-[#345c72] to-[#e87a00]" />

      <div className="aspect-video bg-gradient-to-br from-[#001f3d] via-[#345c72] to-[#123a55] relative overflow-hidden">
        {league.cover_url ? (
          <img
            src={league.cover_url}
            alt={league.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="h-16 w-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/10 bg-[#001f3d]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#001f3d]">
            League
          </span>
          {league.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-[#001f3d] line-clamp-2 transition-colors group-hover:text-[#e87a00]">
          {league.name}
        </h3>

        <div className="flex items-center gap-1.5 text-sm font-medium text-[#345c72]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>
            {league.cities?.name}, {league.cities?.state}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {league.formats?.slice(0, 2).map((f: string) => (
            <span
              key={f}
              className="rounded-xl border border-[#001f3d]/10 bg-[#f6f7fa] px-3 py-1 text-xs font-semibold text-[#345c72]"
            >
              {f}
            </span>
          ))}
          {league.contact_type && (
            <span className="rounded-xl border border-[#001f3d]/10 bg-[#f6f7fa] px-3 py-1 text-xs font-semibold capitalize text-[#345c72]">
              {league.contact_type}
            </span>
          )}
          {league.divisions?.includes('ADULT') && (
            <span className="rounded-xl border border-[#001f3d]/10 bg-[#f6f7fa] px-3 py-1 text-xs font-semibold text-[#345c72]">
              Adult Division
            </span>
          )}
        </div>

        <div className="pt-1">
          <a
            href={href}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#e87a00] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_45px_-22px_rgba(232,122,0,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-24px_rgba(232,122,0,0.65)]"
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  )
}
