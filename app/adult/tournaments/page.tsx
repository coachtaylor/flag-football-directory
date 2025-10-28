import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import OrgCard from '@/components/OrgCard'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

type SearchParams = Record<string, string | undefined>

const cleanSearchTerm = (term: string) => term.replace(/[(),]/g, ' ').replace(/\s+/g, ' ').trim()

const normalizeLocation = (location?: string | null, fallbackState?: string | null) => {
  if (!location?.trim()) {
    return {
      city: null,
      state: fallbackState?.toUpperCase() || null,
    }
  }

  const parts = location.split(',').map((part) => part.trim()).filter(Boolean)

  if (parts.length === 0) {
    return {
      city: null,
      state: fallbackState?.toUpperCase() || null,
    }
  }

  if (parts.length === 1) {
    const only = parts[0]
    if (/^[A-Za-z]{2}$/.test(only)) {
      return {
        city: null,
        state: only.toUpperCase(),
      }
    }
    return {
      city: only,
      state: fallbackState?.toUpperCase() || null,
    }
  }

  const city = parts.slice(0, -1).join(', ')
  const statePart = parts[parts.length - 1]

  return {
    city,
    state: statePart.length <= 5 ? statePart.toUpperCase() : statePart,
  }
}

const AGE_OPTIONS = ['ADULT', 'OPEN', 'COED', 'MASTERS']
const FORMAT_OPTIONS = ['5v5', '6v6', '7v7', '8v8']
const LEVEL_OPTIONS = ['rec', 'competitive', 'elite']

export default async function AdultTournamentsPage({ searchParams }: { searchParams?: SearchParams }) {
  const rawQ = (searchParams?.q || '').trim()
  const q = cleanSearchTerm(rawQ)
  const state = (searchParams?.state || '').trim().toUpperCase()
  const format = (searchParams?.format || '').trim().toLowerCase()
  const level = (searchParams?.level || '').trim().toLowerCase()
  const contact = (searchParams?.contact || '').trim().toLowerCase()
  const ageFilter = (searchParams?.age || 'ADULT').trim().toUpperCase()
  const range = (searchParams?.range || 'upcoming').trim().toLowerCase() as 'upcoming' | 'all' | 'past'

  const today = new Date().toISOString().slice(0, 10)

  let eQ = supabase
    .from('events')
    .select(
      'id, slug, name, location, state, start_date, end_date, website, signup_url, cover_url, verified, divisions, formats, comp_levels, contact_type',
      { count: 'exact' }
    )
    .eq('kind', 'tournament')
    .overlaps('divisions', [ageFilter || 'ADULT'])

  if (range === 'upcoming') eQ = eQ.gte('start_date', today)
  else if (range === 'past') eQ = eQ.lt('start_date', today)

  if (q) eQ = eQ.or(`name.ilike.%${q}%,location.ilike.%${q}%`)
  if (state) eQ = eQ.eq('state', state)
  if (format) eQ = eQ.overlaps('formats', [format])
  if (level) eQ = eQ.overlaps('comp_levels', [level])
  if (contact) eQ = eQ.eq('contact_type', contact)

  const { data: tournaments, error, count } = await eQ.order('start_date', { ascending: range !== 'past' })
  if (error) {
    console.error('[adult-tournaments] query failed', error)
  }

  const results = tournaments || []
  const total = typeof count === 'number' ? count : results.length

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-50/50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-8 lg:px-12">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Adult', href: '/adult' }, { label: 'Tournaments' }]} className="py-0 text-sm text-[#345c72]" />
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#001f3d] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#e87a00] to-[#f59e0b]" />
                Adult Tournaments Calendar
              </span>

              <div className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-[#001f3d] sm:text-5xl xl:text-[3.5rem] xl:leading-[1.05]">
                  Travel & showcase events for adult teams
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#345c72] sm:text-xl">
                  Dial in game formats, contact rules, and competition level to build your adult tournament schedule.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/50 px-3 py-1.5 shadow-sm">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified directors
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/50 px-3 py-1.5 shadow-sm">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#e87a00] to-[#f59e0b]" />
                  Formats from 5v5 to 8v8
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-blue-50/50 px-3 py-1.5 shadow-sm">
                  <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#345c72] to-[#1e40af]">
                    <span className="absolute inset-1 rounded-full bg-white" />
                  </span>
                  National footprint
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
                    placeholder="Search tournaments or host cities..."
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

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
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
                  name="age"
                  defaultValue={ageFilter}
                >
                  {AGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/20 px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 focus:shadow-sm transition-all duration-200"
                  name="format"
                  defaultValue={format}
                >
                  <option value="">Any format</option>
                  {FORMAT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/20 px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 focus:shadow-sm transition-all duration-200"
                  name="level"
                  defaultValue={level}
                >
                  <option value="">Any level</option>
                  {LEVEL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/20 px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 focus:shadow-sm transition-all duration-200"
                  name="contact"
                  defaultValue={contact}
                >
                  <option value="">Any contact</option>
                  <option value="non-contact">Non-contact</option>
                  <option value="contact">Contact</option>
                </select>
                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/20 px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 focus:shadow-sm transition-all duration-200"
                  name="range"
                  defaultValue={range}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="all">All dates</option>
                  <option value="past">Past</option>
                </select>
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
              <h2 className="text-2xl font-semibold text-[#001f3d] sm:text-3xl">Tournaments matching your filters</h2>
              <p className="text-sm font-medium !text-[#001f3d] sm:text-base">
                Showing <span className="font-semibold text-[#001f3d]">{total}</span> tournament{total === 1 ? '' : 's'}
              </p>
            </div>

            {(q || state || format || level || contact || ageFilter !== 'ADULT' || range !== 'upcoming') && (
              <a
                href="/adult/tournaments"
                className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-gradient-to-r from-white to-orange-50/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#345c72] transition hover:border-[#e87a00]/40 hover:text-[#001f3d] hover:shadow-sm"
              >
                Reset filters
                <span>↺</span>
              </a>
            )}
          </div>

          {results.length > 0 ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {results.map((tournament: any) => {
                const { city, state: derivedState } = normalizeLocation(tournament.location, tournament.state)
                return (
                  <div key={tournament.id} className="w-full max-w-sm">
                    <OrgCard
                      o={{
                        type: 'Tournament',
                        id: tournament.id,
                        slug: tournament.slug,
                        name: tournament.name,
                        cover_url: tournament.cover_url,
                        city_name: city,
                        state: derivedState || tournament.state || null,
                        verified: tournament.verified,
                      }}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-[#001f3d]/15 bg-gradient-to-br from-white via-orange-50/20 to-blue-50/10 px-8 py-14 text-center shadow-lg shadow-[#001f3d]/10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#001f3d]/30 bg-gradient-to-br from-white to-orange-50/30 text-[#001f3d]">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#001f3d]">No adult tournaments found</h3>
              <p className="mt-3 text-base text-[#345c72]/90">
                Try widening the filters or changing the date range to uncover more adult events.
              </p>
              <a
                href="/adult/tournaments"
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
