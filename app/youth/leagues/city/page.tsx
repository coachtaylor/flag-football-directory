import { supabase } from '@/lib/supabase'
import { JsonLd } from '@/lib/jsonld'
import Link from 'next/link'

export default async function CityPage({ params }: { params: { city: string }}) {
  const { data: city } = await supabase.from('cities').select('*').eq('slug', params.city).maybeSingle()
  const cityId = city?.id
  const { data: leagues } = cityId
    ? await supabase.from('leagues').select('*').eq('city_id', cityId).order('name')
    : { data: [] }

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `Flag Football Leagues in ${city?.name || params.city}`,
    'itemListElement': (leagues || []).map((l: any, i: number) => ({
      '@type': 'ListItem', 'position': i + 1, 'url': l.website || ''
    }))
  }

  return (
    <section className="grid gap-4">
      <JsonLd data={itemList} />
      <h1 className="text-2xl font-semibold">Leagues in {city?.name || params.city}</h1>
      <p className="small">Updated: Oct 2025</p>
      <div className="grid gap-3">
        {(leagues || []).map((l: any) => (
          <article key={l.id} className="card">
            <h3 className="font-semibold">{l.name}</h3>
            <p className="text-sm text-gray-700">{(l.divisions || []).join(' • ')} {l.fees ? `• $${l.fees}` : ''}</p>
            {l.signup_url ? <a className="link" href={l.signup_url} target="_blank">Sign up</a> : null}
            {l.website ? <a className="link ml-2" href={l.website} target="_blank" rel="noopener">Website</a> : null}
          </article>
        ))}
      </div>
      <div className="card">
        <h3 className="font-semibold">Feature your league on this page</h3>
        <p className="text-sm text-gray-700">Get seen by local families. $50–$100/mo.</p>
        <Link href="/submit" className="btn btn-primary mt-2 inline-block">Get featured</Link>
      </div>
      <div className="card">
        <h3 className="font-semibold">Need officials?</h3>
        <Link href="/submit" className="link">Hire officials</Link>
      </div>
    </section>
  )
}
