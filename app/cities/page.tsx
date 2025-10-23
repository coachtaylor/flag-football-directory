import { supabase } from '@/lib/supabase'
import CitySearch from '@/components/CitySearch'
import { JsonLd } from '@/lib/jsonld'

type City = { id: number; name: string; state: string; slug: string }

export default async function CitiesPage({ searchParams }: { searchParams?: { q?: string } }) {
  const initialQuery = (searchParams?.q || '').trim()
  const { data: cities } = await supabase
    .from('cities')
    .select('id,name,state,slug')
    .order('state', { ascending: true })
    .order('name', { ascending: true })

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Flag Football — Cities',
    itemListElement: (cities || []).map((c: City, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `/leagues/${c.slug}`
    }))
  }

  return (
    <section className="grid gap-6">
      <JsonLd data={itemList} />
      <h1 className="text-2xl font-semibold">Explore your city</h1>
      <p className="small">Updated: Oct 2025</p>
      <CitySearch cities={(cities || []) as City[]} initialQuery={initialQuery} />
    </section>
  )
}
