import Breadcrumbs from '@/components/Breadcrumbs'
import { supabase } from '@/lib/supabase'

type LeagueRecord = {
  id: number
  name: string
  slug: string
  about?: string | null
  verified?: boolean | null
  cover_url?: string | null
  season_start?: string | null
  season_end?: string | null
  divisions?: string[] | null
  formats?: string[] | null
  comp_levels?: string[] | null
  nights?: string[] | null
  fees?: number | string | null
  contact_type?: string | null
  contact_name?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  address_line1?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  website?: string | null
  registration_url?: string | null
  signup_url?: string | null
  cities?: { name?: string | null; state?: string | null } | null
}

const formatDate = (value?: string | null) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatDateRange = (start?: string | null, end?: string | null) => {
  const formattedStart = formatDate(start)
  const formattedEnd = formatDate(end)
  if (formattedStart && formattedEnd) return `${formattedStart} – ${formattedEnd}`
  return formattedStart || formattedEnd || null
}

const formatCurrency = (value?: number | string | null) => {
  if (value === null || value === undefined || value === '') return 'Contact for pricing'
  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isFinite(numeric)) {
    return numeric.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: numeric % 1 === 0 ? 0 : 2,
    })
  }
  return typeof value === 'string' ? value : 'Contact for pricing'
}

const toArray = (value: unknown): string[] => (Array.isArray(value) ? value.filter(Boolean) : [])

const buildLocation = (league: LeagueRecord) => {
  const cityCandidates = [
    league.cities?.name,
    league.city,
  ].map((value) => (value || '').toString().trim()).filter(Boolean)

  const stateCandidates = [
    league.cities?.state,
    league.state,
  ].map((value) => (value || '').toString().trim()).filter(Boolean)

  const city = cityCandidates.find(Boolean) || null
  const state = stateCandidates.find(Boolean) || null

  return {
    city,
    state: state ? state.toUpperCase() : null,
    label: [city, state ? state.toUpperCase() : null].filter(Boolean).join(', '),
  }
}

const normalizeSlugToName = (value: string) =>
  decodeURIComponent(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export default async function LeagueDetailPage({ params }: { params: { slug: string } }) {
  const slugParam = params.slug

  const { data: initialLeague } = await supabase
    .from('leagues')
    .select(
      `
        *,
        cities:city_id(name,state)
      `,
    )
    .eq('slug', slugParam)
    .maybeSingle<LeagueRecord>()

  let resolvedLeague = initialLeague

  if (!resolvedLeague) {
    const numericId = Number(slugParam)
    if (Number.isFinite(numericId)) {
      const { data: leagueById } = await supabase
        .from('leagues')
        .select(
          `
            *,
            cities:city_id(name,state)
          `,
        )
        .eq('id', numericId)
        .maybeSingle<LeagueRecord>()
      resolvedLeague = leagueById ?? null
    }
  }

  if (!resolvedLeague) {
    const nameGuess = normalizeSlugToName(slugParam)
    if (nameGuess) {
      const { data: leagueByName } = await supabase
        .from('leagues')
        .select(
          `
            *,
            cities:city_id(name,state)
          `,
        )
        .ilike('name', nameGuess)
        .maybeSingle<LeagueRecord>()
      resolvedLeague = leagueByName ?? null
    }
  }

  if (!resolvedLeague || slugParam === 'null' || slugParam === 'undefined') {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative w-full overflow-hidden bg-gray-50">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-4 sm:px-8 lg:px-12">
            <div className="mb-6">
              <Breadcrumbs
                items={[
                  { label: 'Leagues', href: '/leagues' },
                  { label: 'Details Coming Soon' },
                ]}
                className="py-0 text-sm text-[#345c72]"
              />
            </div>

            <div className="rounded-3xl border border-[#001f3d]/15 bg-[#f6f7fa] px-8 py-14 text-center shadow-[0_18px_45px_-32px_rgba(0,31,61,0.25)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#001f3d]/30 bg-white text-[#001f3d]">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#001f3d]">Details coming soon</h3>
              <p className="mt-3 text-base text-[#345c72]/90">
                We&apos;re collecting season details for this league. Check back shortly or explore other leagues in your area.
              </p>
              <a
                href="/leagues"
                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#001f3d]/15 bg-white px-5 py-3 text-sm font-semibold text-[#001f3d] shadow-sm transition hover:border-[#e87a00] hover:text-[#e87a00]"
              >
                Browse Leagues
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const league = resolvedLeague

  const leagueLocation = buildLocation(league)
  const locationParts = [
    leagueLocation.city,
    leagueLocation.state,
  ].filter(Boolean)
  const location = locationParts.join(', ')
  const divisions = toArray(league.divisions)
  const formats = toArray(league.formats)
  const compLevels = toArray(league.comp_levels)
  const nights = toArray(league.nights)
  const seasonRange = formatDateRange(league.season_start, league.season_end)
  const priceDisplay = formatCurrency(league.fees)
  const registerUrl = league.registration_url || league.signup_url || null

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full overflow-hidden bg-gray-50">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-4 sm:px-8 lg:px-12">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: 'Leagues', href: '/leagues' },
                { label: league.name },
              ]}
              className="py-0 text-sm text-[#345c72]"
            />
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#001f3d]/10 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#001f3d]">
                League Profile
              </span>

              <div className="space-y-5">
                <h1 className="text-4xl font-semibold tracking-tight text-[#001f3d] sm:text-5xl xl:text-[3.25rem] xl:leading-[1.1]">
                  {league.name}
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#123a55]/90 sm:text-xl">
                  {[location, seasonRange].filter(Boolean).join(' • ') || 'Details coming soon'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[#345c72]">
                {league.verified && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                    <svg className="h-3 w-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified league
                  </span>
                )}
                {formats.length > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#e87a00]" />
                    {formats.join(', ')}
                  </span>
                )}
                {league.contact_type && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1 capitalize">
                    <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-[#345c72]">
                      <span className="absolute inset-1 rounded-full bg-white" />
                    </span>
                    {league.contact_type} play
                  </span>
                )}
                {compLevels.length > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#001f3d]" />
                    {compLevels.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                <h2 className="text-xl font-semibold text-[#001f3d]">About this league</h2>
                <p className="mt-4 text-base leading-relaxed text-[#345c72]/95">
                  {league.about?.trim() || 'This league has not provided an overview yet. Check back soon for more storylines, rules, and highlights.'}
                </p>
              </section>

              <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                <h3 className="text-lg font-semibold text-[#001f3d]">Divisions & formats</h3>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#345c72]/70">Age groups</p>
                    {divisions.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {divisions.map((division) => (
                          <span key={division} className="rounded-xl border border-[#001f3d]/10 bg-[#f6f7fa] px-3 py-1 text-xs font-semibold text-[#345c72]">
                            {division}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-[#345c72]/80">Age divisions coming soon.</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#345c72]/70">Game format</p>
                    {formats.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formats.map((format) => (
                          <span key={format} className="rounded-xl border border-[#001f3d]/10 bg-[#f6f7fa] px-3 py-1 text-xs font-semibold text-[#345c72]">
                            {format}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-[#345c72]/80">Format details will be shared closer to kickoff.</p>
                    )}
                  </div>
                </div>
              </section>

              {(seasonRange || nights.length > 0 || compLevels.length > 0) && (
                <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                  <h3 className="text-lg font-semibold text-[#001f3d]">Season snapshot</h3>
                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
                    {seasonRange && (
                      <div>
                        <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#345c72]/70">Season window</p>
                        <p className="mt-3 text-base font-semibold text-[#001f3d]">{seasonRange}</p>
                      </div>
                    )}
                    {nights.length > 0 && (
                      <div>
                        <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#345c72]/70">Game nights</p>
                        <p className="mt-3 text-base font-semibold text-[#001f3d]">{nights.join(', ')}</p>
                      </div>
                    )}
                    {compLevels.length > 0 && (
                      <div>
                        <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#345c72]/70">Competition levels</p>
                        <p className="mt-3 text-base font-semibold capitalize text-[#001f3d]">{compLevels.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                <h3 className="text-lg font-semibold text-[#001f3d]">Quick info</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#345c72]/80">Registration fee</dt>
                    <dd className="font-semibold text-[#001f3d]">{priceDisplay}</dd>
                  </div>
                  {league.contact_type && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#345c72]/80">Contact level</dt>
                      <dd className="font-semibold capitalize text-[#001f3d]">{league.contact_type}</dd>
                    </div>
                  )}
                  {divisions.length > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#345c72]/80">Age range</dt>
                      <dd className="font-semibold text-[#001f3d]">{divisions.join(', ')}</dd>
                    </div>
                  )}
                  {formats.length > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#345c72]/80">Formats</dt>
                      <dd className="font-semibold text-[#001f3d]">{formats.join(', ')}</dd>
                    </div>
                  )}
                  {nights.length > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#345c72]/80">Game nights</dt>
                      <dd className="font-semibold text-[#001f3d]">{nights.join(', ')}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-[#001f3d]/15 to-transparent" />

                <div className="mt-6 space-y-3 text-sm">
                  {league.contact_name && (
                    <div>
                      <p className="text-[#345c72]/70">Contact</p>
                      <p className="font-semibold text-[#001f3d]">{league.contact_name}</p>
                    </div>
                  )}
                  {league.contact_email && (
                    <div>
                      <p className="text-[#345c72]/70">Email</p>
                      <a href={`mailto:${league.contact_email}`} className="font-semibold text-[#e87a00] hover:text-[#e87a00]/80">
                        {league.contact_email}
                      </a>
                    </div>
                  )}
                  {league.contact_phone && (
                    <div>
                      <p className="text-[#345c72]/70">Phone</p>
                      <a href={`tel:${league.contact_phone}`} className="font-semibold text-[#001f3d] hover:text-[#e87a00]">
                        {league.contact_phone}
                      </a>
                    </div>
                  )}
                  {[league.address_line1, location].filter(Boolean).length > 0 && (
                    <div>
                      <p className="text-[#345c72]/70">Location</p>
                      <p className="font-semibold text-[#001f3d]">
                        {[league.address_line1, location, league.postal_code].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  )}
                  {league.website && (
                    <div>
                      <p className="text-[#345c72]/70">Website</p>
                      <a
                        href={league.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#e87a00] hover:text-[#e87a00]/80"
                      >
                        Visit website →
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {league.contact_email && (
                    <a
                      href={`mailto:${league.contact_email}`}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-[#e87a00] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_45px_-22px_rgba(232,122,0,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-24px_rgba(232,122,0,0.65)]"
                    >
                      Contact League
                    </a>
                  )}
                  {registerUrl && (
                    <a
                      href={registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-[#001f3d]/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#001f3d] shadow-sm transition hover:border-[#e87a00] hover:text-[#e87a00]"
                    >
                      Register Now
                    </a>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
