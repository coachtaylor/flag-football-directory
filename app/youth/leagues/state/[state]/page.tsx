// app/leagues/state/[state]/page.tsx
import { supabase } from '@/lib/supabase'
import { JsonLd } from '@/lib/jsonld'
import Link from 'next/link'

export default async function LeaguesByState({ params }: { params: { state: string } }) {
  const state = params.state.toUpperCase()

  // 1) Cities in this state
  const { data: cities, error: citiesErr } = await supabase
    .from('cities')
    .select('id,name,slug')
    .eq('state', state)
    .order('name')

  if (citiesErr) {
    return <section className="card"><p className="text-sm text-red-600">Failed to load cities.</p></section>
  }
  if (!cities?.length) {
    return (
      <section className="card">
        <h1 className="text-2xl font-semibold">Leagues in {state}</h1>
        <p className="small text-gray-700">No cities yet. <Link className="link" href="/submit">Submit a program</Link>.</p>
      </section>
    )
  }

  const cityIdToMeta = new Map(cities.map((c) => [c.id, { name: c.name, slug: c.slug }]))
  const cityIds = cities.map((c) => c.id)

  // 2) Leagues ONLY in those cities
  const { data: leagues, error: leaguesErr } = await supabase
    .from('leagues')
    .select('id, name, fees, divisions, nights, formats, contact_type, comp_levels, signup_url, website, verified, city_id')
    .in('city_id', cityIds)
    .order('name', { ascending: true })

  if (leaguesErr) {
    return <section className="card"><p className="text-sm text-red-600">Failed to load leagues.</p></section>
  }

  // Group by city
  const byCity: Record<string, { cityName: string; citySlug: string; rows: any[] }> = {}
  for (const l of leagues || []) {
    const meta = l.city_id ? cityIdToMeta.get(l.city_id) : undefined
    if (!meta) continue
    const key = meta.slug
    if (!byCity[key]) byCity[key] = { cityName: meta.name, citySlug: meta.slug, rows: [] }
    byCity[key].rows.push(l)
  }

  const cityGroups = Object.entries(byCity).sort((a, b) => a[1].cityName.localeCompare(b[1].cityName))
  const totalLeagues = leagues?.length || 0
  const totalCities = cityGroups.length

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Flag Football Leagues in ${state}`,
    itemListElement: (leagues || []).map((l: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: l.signup_url || l.website || '',
    })),
  }

  return (
    <section className="grid gap-6">
      <JsonLd data={itemList} />
      <header className="grid gap-1">
        <h1 className="text-2xl font-semibold">Leagues in {state}</h1>
        <p className="small text-gray-600">Updated: Oct 2025 • {totalLeagues} leagues across {totalCities} cities</p>
        {totalCities > 0 && (
          <div className="flex flex-wrap gap-2">
            {cityGroups.map(([slug, g]) => (
              <a key={slug} href={`#${slug}`} className="badge">{g.cityName}</a>
            ))}
          </div>
        )}
      </header>

      {cityGroups.length ? cityGroups.map(([slug, g]) => (
        <section key={slug} id={slug} className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{g.cityName}</h2>
            <Link className="link" href={`/youth/leagues/${g.citySlug}`}>View {g.cityName} page »</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {g.rows.map((l: any) => {
              const spec = [
                l.fees ? `$${l.fees}` : 'Fee varies',
                (l.formats || []).join(' / '),
                l.contact_type,
                (l.comp_levels || []).join(' / '),
                (l.divisions || []).join(' / '), // age groups
                (l.nights || []).join(', '),
              ]
                .filter(Boolean)
                .join(' · ')

              return (
                <article key={l.id} className="card hover:shadow">
                  <div className="flex items-center justify-between">
                    <span className="small uppercase tracking-wide text-gray-600">League</span>
                    {l.verified && (
                      <span className="small bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                    )}
                  </div>
                  <h3 className="font-semibold mt-1">{l.name}</h3>
                  <p className="small text-gray-700">{spec}</p>
                  <div className="mt-1">
                    {l.signup_url && (
                      <a className="link" target="_blank" href={l.signup_url}>
                        Sign up
                      </a>
                    )}
                    {l.website && (
                      <a className="link ml-2" target="_blank" rel="noopener" href={l.website}>
                        Website
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )) : (
        <div className="card">
          <p className="text-sm text-gray-700">
            No leagues yet. <Link className="link" href="/submit">Submit a program</Link>.
          </p>
        </div>
      )}
    </section>
  )
}
