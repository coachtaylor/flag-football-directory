import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ListingCard from '@/components/ListingCard'

type Props = {
  params: { city: string }
}

export default async function CityLeaguesPage({ params }: Props) {
  const citySlug = params.city

  const { data: city } = await supabase
    .from('cities')
    .select('id, name, state')
    .eq('slug', citySlug)
    .single()

  if (!city) {
    notFound()
  }

  const { data: leagues } = await supabase
    .from('leagues')
    .select(`
      id,
      name,
      description,
      age_groups,
      season,
      registration_open,
      cities:city_id(name, state)
    `)
    .eq('city_id', city.id)
    .order('name')

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Leagues', href: '/youth/leagues' },
    { label: city.name, href: `/youth/leagues/city/${citySlug}` },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-16">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Flag Football Leagues in {city.name}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover leagues and programs in {city.name}, {city.state}
          </p>
        </div>

        {leagues && leagues.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leagues.map((league: any) => (
              <ListingCard
                key={league.id}
                item={{
                  type: 'league',
                  name: league.name,
                  state: league.cities?.state,
                  city_name: league.cities?.name,
                  location: league.cities?.name,
                  detail_href: `/youth/leagues/${league.id}`,
                  verified: true,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600">No leagues found in {city.name}</p>
          </div>
        )}
      </div>
    </div>
  )
}
