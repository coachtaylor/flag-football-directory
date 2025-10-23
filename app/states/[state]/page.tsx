// app/states/[state]/page.tsx
import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'

const TeamIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const LeagueIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
)

const ClinicIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const TournamentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: stateInfo.name }
          ]} 
          className="mb-8"
        />
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Flag Football in {stateInfo.name}
          </h1>
          <p className="text-lg text-gray-600">
            {totalPrograms} {totalPrograms === 1 ? 'program' : 'programs'} available
          </p>
        </header>

        {/* Teams Section */}
        {teams && teams.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 text-white shadow-md">
                  <TeamIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
                  <p className="text-sm text-gray-600">{teams.length} {teams.length === 1 ? 'team' : 'teams'}</p>
                </div>
              </div>
              <Link href={`/teams?state=${stateCode}`} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                View All Teams →
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.slice(0, 6).map((team: any) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </section>
        )}

        {/* Leagues Section */}
        {leagues && leagues.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-700 text-white shadow-md">
                  <LeagueIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Leagues</h2>
                  <p className="text-sm text-gray-600">{leagues.length} {leagues.length === 1 ? 'league' : 'leagues'}</p>
                </div>
              </div>
              <Link href={`/leagues?state=${stateCode}`} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                View All Leagues →
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {leagues.slice(0, 6).map((league: any) => (
                <LeagueCard key={league.id} league={league} />
              ))}
            </div>
          </section>
        )}

        {/* Clinics Section */}
        {clinics && clinics.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white shadow-md">
                  <ClinicIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Clinics</h2>
                  <p className="text-sm text-gray-600">{clinics.length} upcoming {clinics.length === 1 ? 'clinic' : 'clinics'}</p>
                </div>
              </div>
              <Link href={`/clinics?state=${stateCode}`} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                View All Clinics →
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clinics.slice(0, 6).map((clinic: any) => (
                <EventCard key={clinic.id} event={clinic} type="clinic" />
              ))}
            </div>
          </section>
        )}

        {/* Tournaments Section */}
        {tournaments && tournaments.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-600 text-white shadow-md">
                  <TournamentIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Tournaments</h2>
                  <p className="text-sm text-gray-600">{tournaments.length} upcoming {tournaments.length === 1 ? 'tournament' : 'tournaments'}</p>
                </div>
              </div>
              <Link href={`/tournaments?state=${stateCode}`} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                View All Tournaments →
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournaments.slice(0, 6).map((tournament: any) => (
                <EventCard key={tournament.id} event={tournament} type="tournament" />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {totalPrograms === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs yet in {stateInfo.name}</h3>
            <p className="text-gray-600 mb-6">
              Be the first to add a program in this state
            </p>
            <Link href="/add-program" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md">
              Add Program
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// Card Components
function TeamCard({ team }: { team: any }) {
  return (
    <Link href={`/teams/${team.slug}`} className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-gray-300 transition-all">
      {team.verified && (
        <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded mb-2">Verified</span>
      )}
      <h3 className="font-semibold text-gray-900 mb-1">{team.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{team.cities?.name}</p>
      <div className="flex flex-wrap gap-1">
        {team.age_groups?.slice(0, 3).map((age: string) => (
          <span key={age} className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded">{age}</span>
        ))}
      </div>
    </Link>
  )
}

function LeagueCard({ league }: { league: any }) {
  return (
    <Link href={`/leagues/${league.slug}`} className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-gray-300 transition-all">
      {league.verified && (
        <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded mb-2">Verified</span>
      )}
      <h3 className="font-semibold text-gray-900 mb-1">{league.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{league.cities?.name}</p>
      {league.fees && (
        <p className="text-sm font-semibold text-gray-900">${league.fees}</p>
      )}
    </Link>
  )
}

function EventCard({ event, type }: { event: any; type: string }) {
  const dateStr = event.end_date 
    ? `${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()}`
    : new Date(event.start_date).toLocaleDateString()

  return (
    <Link href={`/${type}s/${event.slug || event.id}`} className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-gray-300 transition-all">
      {event.verified && (
        <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded mb-2">Verified</span>
      )}
      <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
      <p className="text-sm text-gray-600 mb-1">{event.location}</p>
      <p className="text-xs text-gray-500">{dateStr}</p>
    </Link>
  )
}