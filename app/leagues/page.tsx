// app/leagues/page.tsx
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

export default async function LeaguesPage({ searchParams }: { searchParams?: any }) {
  const rawQ = (searchParams?.q || '').trim()
  const q = cleanSearchTerm(rawQ)
  const state = (searchParams?.state || '').trim().toUpperCase()
  const gender = (searchParams?.gender || '').toLowerCase()
  const format = (searchParams?.format || '').trim()
  const contact = (searchParams?.contact || '').toLowerCase()
  const ages = (searchParams?.age || '').toUpperCase()

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

  // Build query
  let lQ = supabase
    .from('leagues')
    .select('id,slug,name,verified,cover_url,divisions,formats,contact_type,city_id,cities:city_id!inner(name,state)')

  if (q) {
    const filters = [`name.ilike.%${q}%`]
    if (cityMatches.length) filters.push(`city_id.in.(${cityMatches.join(',')})`)
    lQ = lQ.or(filters.join(','))
  }
  if (state)   lQ = lQ.eq('cities.state', state)
  if (ages)    lQ = lQ.overlaps('divisions', [ages])
  if (format)  lQ = lQ.overlaps('formats', [format])
  if (contact) lQ = lQ.eq('contact_type', contact)

  const { data: leagues, error } = await lQ.order('name')
  if (error) {
    console.error('[leagues] query failed', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full overflow-hidden bg-gray-50">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-4 sm:px-8 lg:px-12">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Leagues' }]} className="py-0 text-sm text-[#345c72]" />
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#001f3d]/10 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#001f3d]">
                Leagues Directory
              </span>

              <div className="space-y-5">
                <h1 className="text-4xl font-semibold tracking-tight text-[#001f3d] sm:text-5xl xl:text-[3.25rem] xl:leading-[1.1]">
                  Find verified flag football leagues near you
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#123a55]/90 sm:text-xl">
                  Explore youth and adult leagues with transparent pricing, formats, and contact info.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[#345c72]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1 text-sm font-medium text-[#345c72]">
                  <svg className="w-3 h-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified leagues
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#e87a00]" />
                  Multiple formats
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                  <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-[#345c72]">
                    <span className="absolute inset-1 rounded-full bg-white" />
                  </span>
                  Nationwide coverage
                </span>
              </div>
            </div>

            <form
              method="get"
              className="grid gap-4 rounded-[24px] border border-[#001f3d]/10 bg-white/95 p-5 shadow-[0_18px_45px_-32px_rgba(0,31,61,0.38)] sm:p-6"
            >
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr),auto] sm:items-center">
                <label className="flex grow items-center gap-3 rounded-2xl border border-[#001f3d]/15 bg-white px-4 py-3 focus-within:border-[#e87a00] focus-within:ring-2 focus-within:ring-[#e87a00]/25">
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
                  className="inline-flex items-center justify-center rounded-2xl bg-[#e87a00] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_20px_50px_-20px_rgba(232,122,0,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-22px_rgba(232,122,0,0.6)]"
                >
                  Search
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-white px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                  name="state"
                  defaultValue={state}
                >
                  <option value="">All states</option>
                  {US_STATES.map(s => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-white px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                  name="age"
                  defaultValue={ages}
                >
                  <option value="">All ages</option>
                  {['6U','8U','10U','12U','14U','16U','18U','ADULT'].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-white px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                  name="format"
                  defaultValue={format}
                >
                  <option value="">Any format</option>
                  <option value="5v5">5v5</option>
                  <option value="7v7">7v7</option>
                  <option value="8v8">8v8</option>
                </select>
                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-white px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                  name="contact"
                  defaultValue={contact}
                >
                  <option value="">Any contact</option>
                  <option value="non-contact">Non-contact</option>
                  <option value="contact">Contact</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-gray-50">
        {/* Subtle top border for visual separation */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#001f3d] sm:text-3xl">
                Leagues matching your filters
              </h2>
              <p className="text-sm font-medium text-[#345c72]/80 sm:text-base">
                Showing <span className="font-semibold text-[#001f3d]">{leagues?.length || 0}</span> league{(leagues?.length || 0) === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* Leagues Grid */}
          {leagues && leagues.length > 0 ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {leagues.map((league: any) => (
                <div key={league.id} className="w-full max-w-sm">
                  <LeagueCard league={league} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-[#001f3d]/15 bg-gray-50 px-8 py-14 text-center shadow-[0_18px_45px_-32px_rgba(0,31,61,0.25)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#001f3d]/30 bg-white text-[#001f3d]">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#001f3d]">No leagues found</h3>
              <p className="mt-3 text-base text-[#345c72]/90">
                Try adjusting your filters or search in a different location
              </p>
              <a href="/leagues" className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#001f3d]/15 bg-white px-5 py-3 text-sm font-semibold text-[#001f3d] shadow-sm transition hover:border-[#e87a00] hover:text-[#e87a00]">
                Clear Filters
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// League Card Component
function LeagueCard({ league }: { league: any }) {
  const safeSlug =
    typeof league.slug === 'string' && league.slug.trim().length > 0 ? league.slug.trim() : null
  const generatedSlug = slugify(league.name)
  const fallbackId =
    typeof league.id === 'number' || (typeof league.id === 'string' && league.id.trim().length > 0)
      ? String(league.id).trim()
      : null
  const slugOrId = safeSlug ?? (generatedSlug || null) ?? fallbackId
  const href = slugOrId ? `/leagues/${slugOrId}` : '/leagues'
  const baseButtonClasses =
    'inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition bg-[#e87a00] shadow-[0_18px_45px_-22px_rgba(232,122,0,0.55)] hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-24px_rgba(232,122,0,0.65)]'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#001f3d]/10 bg-white shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(0,31,61,0.55)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#001f3d] via-[#345c72] to-[#e87a00]" />

      {/* Image */}
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

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
        {/* Header with badges */}
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

        {/* League name */}
        <h3 className="text-lg font-semibold text-[#001f3d] line-clamp-2 transition-colors group-hover:text-[#e87a00]">
          {league.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-[#345c72]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{league.cities?.name}, {league.cities?.state}</span>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-2">
          {league.divisions?.slice(0, 3).map((div: string) => (
            <span
              key={div}
              className="rounded-xl border border-[#001f3d]/10 bg-[#f6f7fa] px-3 py-1 text-xs font-semibold text-[#345c72]"
            >
              {div}
            </span>
          ))}
          {league.formats?.map((f: string) => (
            <span
              key={f}
              className="rounded-xl border border-[#001f3d]/10 bg-[#f6f7fa] px-3 py-1 text-xs font-semibold text-[#345c72]"
            >
              {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-1">
          <a
            href={href}
            className={baseButtonClasses}
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  )
}
