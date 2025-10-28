// app/states/[state]/page.tsx
import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import TeamCard from '@/components/TeamCard'
import OrgCard from '@/components/OrgCard'

export default async function StatePage({ params }: { params: { state: string } }) {
  const stateCode = params.state.toUpperCase()
  
  // Find the state info
  const stateInfo = US_STATES.find(s => s.code === stateCode)
  if (!stateInfo) return notFound()

  const today = new Date().toISOString().slice(0, 10)

  // First, get all cities in this state
  const { data: cities } = await supabase
    .from('cities')
    .select('id')
    .eq('state', stateCode)

  const cityIds = cities?.map(c => c.id) || []

  // Get teams for this state
  const { data: teams } = cityIds.length > 0 
    ? await supabase
        .from('teams')
        .select('id, slug, name, gender, age_groups, comp_levels, verified, cover_url, cities:city_id(name, state)')
        .in('city_id', cityIds)
        .order('name')
    : { data: [] }

  // Get leagues for this state
  const { data: leagues } = cityIds.length > 0
    ? await supabase
        .from('leagues')
        .select('id, slug, name, fees, divisions, formats, verified, cover_url, cities:city_id(name, state)')
        .in('city_id', cityIds)
        .order('name')
    : { data: [] }

  // Get clinics for this state
  const { data: clinics } = await supabase
    .from('events')
    .select('id, slug, name, location, start_date, end_date, verified, cover_url')
    .eq('kind', 'clinic')
    .eq('state', stateCode)
    .gte('start_date', today)
    .order('start_date')

  // Get tournaments for this state
  const { data: tournaments } = await supabase
    .from('events')
    .select('id, slug, name, location, start_date, end_date, verified, cover_url')
    .eq('kind', 'tournament')
    .eq('state', stateCode)
    .gte('start_date', today)
    .order('start_date')

  const totalPrograms = (teams?.length || 0) + (leagues?.length || 0) + (clinics?.length || 0) + (tournaments?.length || 0)

  const statBlocks = [
    {
      label: 'Teams',
      count: teams?.length || 0,
      href: `/youth/teams?state=${stateCode}`,
    },
    {
      label: 'Leagues',
      count: leagues?.length || 0,
      href: `/youth/leagues?state=${stateCode}`,
    },
    {
      label: 'Clinics',
      count: clinics?.length || 0,
      href: `/youth/clinics?state=${stateCode}`,
    },
    {
      label: 'Tournaments',
      count: tournaments?.length || 0,
      href: `/youth/tournaments?state=${stateCode}`,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full overflow-hidden bg-gray-50">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-4 sm:px-8 lg:px-12">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'States' }, { label: stateInfo.name }]} className="py-0 text-sm text-[#345c72]" />
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#001f3d]/10 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#001f3d]">
                {stateInfo.code} • Flag Football Directory
              </span>

              <div className="space-y-5">
                <h1 className="text-4xl font-semibold tracking-tight text-[#001f3d] sm:text-5xl xl:text-[3.25rem] xl:leading-[1.1]">
                  {stateInfo.name} flag football programs
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#123a55]/90 sm:text-xl">
                  {totalPrograms === 0
                    ? 'We\'re gathering programs for this state. Share yours to help others connect.'
                    : `Discover ${totalPrograms} programs, leagues, clinics, and tournaments happening in ${stateInfo.name}. Filter by category to find the perfect fit for your athletes.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[#345c72]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1 text-sm font-medium text-[#345c72]">
                  <svg className="w-3 h-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified programs
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#e87a00]" />
                  Local opportunities
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                  <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-[#345c72]">
                    <span className="absolute inset-1 rounded-full bg-white" />
                  </span>
                  Statewide coverage
                </span>
              </div>
            </div>

            <div className="grid gap-4 rounded-[24px] border border-[#001f3d]/10 bg-white/95 p-5 shadow-[0_18px_45px_-32px_rgba(0,31,61,0.38)] sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {statBlocks.map((stat) => (
                  <Link
                    key={stat.label}
                    href={stat.href}
                    className="group flex items-center gap-4 rounded-2xl border border-[#001f3d]/15 bg-white px-5 py-4 transition hover:border-[#e87a00]/40 hover:bg-white hover:shadow-[0_16px_32px_-24px_rgba(0,31,61,0.25)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#001f3d]/5 text-base font-semibold uppercase tracking-[0.2em] text-[#001f3d]">
                      {stat.label.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-sm text-[#345c72]/70">{stat.label}</p>
                      <p className="text-xl font-semibold text-[#001f3d]">{stat.count}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-gray-50">
        {/* Subtle top border for visual separation */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="space-y-12">
            {teams && teams.length > 0 && (
              <section className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#001f3d] sm:text-3xl">
                      Teams in {stateInfo.name}
                    </h2>
                    <p className="text-sm font-medium text-[#345c72]/80 sm:text-base">
                      Showing <span className="font-semibold text-[#001f3d]">{teams.length}</span> team{teams.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <Link
                    href={`/youth/teams?state=${stateCode}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-[#f6f7fa] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#345c72] transition hover:border-[#e87a00]/40 hover:text-[#001f3d]"
                  >
                    View all teams
                    <span>→</span>
                  </Link>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                  {teams.slice(0, 6).map((team: any) => (
                    <div key={team.id} className="w-full max-w-sm">
                      <TeamCard
                        t={{
                          ...team,
                          city_name: team.cities?.name,
                          state: team.cities?.state,
                          detail_href: `/youth/teams/${team.slug}`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {leagues && leagues.length > 0 && (
              <section className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#001f3d] sm:text-3xl">
                      Leagues in {stateInfo.name}
                    </h2>
                    <p className="text-sm font-medium text-[#345c72]/80 sm:text-base">
                      Showing <span className="font-semibold text-[#001f3d]">{leagues.length}</span> league{leagues.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <Link
                    href={`/youth/leagues?state=${stateCode}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-[#f6f7fa] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#345c72] transition hover:border-[#e87a00]/40 hover:text-[#001f3d]"
                  >
                    View all leagues
                    <span>→</span>
                  </Link>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                  {leagues.slice(0, 6).map((league: any) => (
                    <div key={league.id} className="w-full max-w-sm">
                      <OrgCard
                        o={{
                          type: 'League',
                          id: league.id,
                          slug: league.slug,
                          name: league.name,
                          cover_url: league.cover_url,
                          city_name: league.cities?.name,
                          state: league.cities?.state,
                          verified: league.verified,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {clinics && clinics.length > 0 && (
              <section className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#001f3d] sm:text-3xl">
                      Upcoming Clinics in {stateInfo.name}
                    </h2>
                    <p className="text-sm font-medium text-[#345c72]/80 sm:text-base">
                      Showing <span className="font-semibold text-[#001f3d]">{clinics.length}</span> clinic{clinics.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <Link
                    href={`/youth/clinics?state=${stateCode}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-[#f6f7fa] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#345c72] transition hover:border-[#e87a00]/40 hover:text-[#001f3d]"
                  >
                    View all clinics
                    <span>→</span>
                  </Link>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                  {clinics.slice(0, 6).map((clinic: any) => (
                    <div key={clinic.id} className="w-full max-w-sm">
                      <OrgCard
                        o={{
                          type: 'Clinic',
                          id: clinic.id,
                          slug: clinic.slug,
                          name: clinic.name,
                          cover_url: clinic.cover_url,
                          city_name: clinic.location,
                          state: stateCode,
                          verified: clinic.verified,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tournaments && tournaments.length > 0 && (
              <section className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#001f3d] sm:text-3xl">
                      Upcoming Tournaments in {stateInfo.name}
                    </h2>
                    <p className="text-sm font-medium text-[#345c72]/80 sm:text-base">
                      Showing <span className="font-semibold text-[#001f3d]">{tournaments.length}</span> tournament{tournaments.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <Link
                    href={`/youth/tournaments?state=${stateCode}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-[#f6f7fa] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#345c72] transition hover:border-[#e87a00]/40 hover:text-[#001f3d]"
                  >
                    View all tournaments
                    <span>→</span>
                  </Link>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                  {tournaments.slice(0, 6).map((tournament: any) => (
                    <div key={tournament.id} className="w-full max-w-sm">
                      <OrgCard
                        o={{
                          type: 'Tournament',
                          id: tournament.id,
                          slug: tournament.slug,
                          name: tournament.name,
                          cover_url: tournament.cover_url,
                          city_name: tournament.location,
                          state: stateCode,
                          verified: tournament.verified,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {totalPrograms === 0 && (
              <div className="rounded-3xl border border-[#001f3d]/15 bg-[#f6f7fa] px-8 py-14 text-center shadow-[0_18px_45px_-32px_rgba(0,31,61,0.25)]">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#001f3d]/30 bg-white text-[#001f3d]">
                  <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-[#001f3d]">No programs listed in {stateInfo.name} yet</h3>
                <p className="mt-3 text-base text-[#345c72]/90">
                  Share your league, team, or event to help players and families find opportunities nearby.
                </p>
                <Link
                  href="/add-program"
                  className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#001f3d]/15 bg-white px-5 py-3 text-sm font-semibold text-[#001f3d] shadow-sm transition hover:border-[#e87a00] hover:text-[#e87a00]"
                >
                  Add a Program
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
