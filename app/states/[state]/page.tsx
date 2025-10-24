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
      href: `/teams?state=${stateCode}`,
    },
    {
      label: 'Leagues',
      count: leagues?.length || 0,
      href: `/leagues?state=${stateCode}`,
    },
    {
      label: 'Clinics',
      count: clinics?.length || 0,
      href: `/clinics?state=${stateCode}`,
    },
    {
      label: 'Tournaments',
      count: tournaments?.length || 0,
      href: `/tournaments?state=${stateCode}`,
    },
  ]

  return (
    <section className="container py-8">
      <Breadcrumbs items={[{ label: 'States' }, { label: stateInfo.name }]} className="mb-6" />

      <div className="rounded-3xl border border-gray-200 bg-[#001f3d] px-6 py-10 text-white shadow-xl sm:px-12 md:px-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-white/80">
              {stateInfo.code} • Flag Football
            </span>
            <h1 className="text-4xl font-bold sm:text-5xl">{stateInfo.name}</h1>
            <p className="text-lg leading-relaxed text-white/80">
              {totalPrograms === 0
                ? 'We’re gathering programs for this state. Share yours to help others connect.'
                : `Discover ${totalPrograms} programs, leagues, clinics, and tournaments happening in ${stateInfo.name}. Filter by category to find the perfect fit for your athletes.`}
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto">
            {statBlocks.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="group flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 transition hover:border-white/40 hover:bg-white/15"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-base font-semibold uppercase tracking-[0.2em] text-white">
                  {stat.label.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm text-white/70">{stat.label}</p>
                  <p className="text-xl font-semibold text-white">{stat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-12">
        {teams && teams.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#345c72]">
                  Teams
                </p>
                <h2 className="text-3xl font-bold text-[#001f3d]">
                  {teams.length} {teams.length === 1 ? 'Team' : 'Teams'}
                </h2>
                <p className="text-sm text-[#345c72]/80 mt-1">
                  Youth and adult squads representing {stateInfo.name}
                </p>
              </div>
              <Link
                href={`/teams?state=${stateCode}`}
                className="text-sm font-semibold text-[#e87a00] hover:text-[#e87a00]/80 transition-colors"
              >
                View all teams →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teams.slice(0, 6).map((team: any) => (
                <TeamCard
                  key={team.id}
                  t={{
                    ...team,
                    city_name: team.cities?.name,
                    state: team.cities?.state,
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {leagues && leagues.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#345c72]">
                  Leagues
                </p>
                <h2 className="text-3xl font-bold text-[#001f3d]">
                  {leagues.length} {leagues.length === 1 ? 'League' : 'Leagues'}
                </h2>
                <p className="text-sm text-[#345c72]/80 mt-1">
                  Verified league operators across the state
                </p>
              </div>
              <Link
                href={`/leagues?state=${stateCode}`}
                className="text-sm font-semibold text-[#e87a00] hover:text-[#e87a00]/80 transition-colors"
              >
                View all leagues →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {leagues.slice(0, 6).map((league: any) => (
                <OrgCard
                  key={league.id}
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
              ))}
            </div>
          </section>
        )}

        {clinics && clinics.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#345c72]">
                  Clinics
                </p>
                <h2 className="text-3xl font-bold text-[#001f3d]">
                  {clinics.length} Upcoming {clinics.length === 1 ? 'Clinic' : 'Clinics'}
                </h2>
                <p className="text-sm text-[#345c72]/80 mt-1">
                  Skill development opportunities happening soon
                </p>
              </div>
              <Link
                href={`/clinics?state=${stateCode}`}
                className="text-sm font-semibold text-[#e87a00] hover:text-[#e87a00]/80 transition-colors"
              >
                View all clinics →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clinics.slice(0, 6).map((clinic: any) => (
                <OrgCard
                  key={clinic.id}
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
              ))}
            </div>
          </section>
        )}

        {tournaments && tournaments.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#345c72]">
                  Tournaments
                </p>
                <h2 className="text-3xl font-bold text-[#001f3d]">
                  {tournaments.length} Upcoming {tournaments.length === 1 ? 'Tournament' : 'Tournaments'}
                </h2>
                <p className="text-sm text-[#345c72]/80 mt-1">
                  Competitive events to test your squad
                </p>
              </div>
              <Link
                href={`/tournaments?state=${stateCode}`}
                className="text-sm font-semibold text-[#e87a00] hover:text-[#e87a00]/80 transition-colors"
              >
                View all tournaments →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tournaments.slice(0, 6).map((tournament: any) => (
                <OrgCard
                  key={tournament.id}
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
              ))}
            </div>
          </section>
        )}

        {totalPrograms === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <h3 className="empty-state-title">
              No programs listed in {stateInfo.name} yet
            </h3>
            <p className="empty-state-description">
              Share your league, team, or event to help players and families find opportunities nearby.
            </p>
            <Link href="/add-program" className="btn btn-primary mt-4">
              Add a Program
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
