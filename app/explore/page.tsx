// app/explore/page.tsx
import { supabase } from '@/lib/supabase'
import ResultsToolbar from '@/components/ResultsToolbar'
import ListingCard from '@/components/ListingCard'
import { JsonLd } from '@/lib/jsonld'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

type SearchParams = {
  category?: 'league' | 'tournament' | 'clinic'
  q?: string
  state?: string
  from?: string
  sort?: 'relevance' | 'fee_asc' | 'date_asc'
  view?: 'grid' | 'list'
  page?: string
}

const PAGE_SIZE = 24

export default async function Explore({ searchParams }: { searchParams: SearchParams }) {
  const category = (searchParams.category || 'league') as NonNullable<SearchParams['category']>
  const q = (searchParams.q || '').trim()
  const state = (searchParams.state || '').trim().toUpperCase()
  const from = (searchParams.from || '').trim()
  const sort = (searchParams.sort || 'relevance') as NonNullable<SearchParams['sort']>
  const view = (searchParams.view || 'grid') as NonNullable<SearchParams['view']>
  const page = Math.max(1, parseInt(searchParams.page || '1', 10))
  const fromDate = from || new Date().toISOString().slice(0, 10)

  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE - 1

  let items: any[] = []
  let total = 0

  if (category === 'league') {
    // 1) Cities list (for browse-by-city)
    let cityQ = supabase.from('cities').select('id,name,state,slug', { count: 'exact' })
    if (state) cityQ = cityQ.eq('state', state)
    if (q) cityQ = cityQ.or(`name.ilike.%${q}%,state.ilike.%${q}%,slug.ilike.%${q}%`)
    const { data: cities, count: cCount } = await cityQ.order('state').order('name').range(start, end)

    const cityItems = (cities || []).map((c) => ({
      type: 'City',
      name: c.name,
      state: c.state,
      city_name: c.name,
      detail_href: `/youth/leagues/${c.slug}`,
      spec: 'Browse leagues in this city',
      cover_url: undefined,
      verified: false,
    }))

    // 2) Specific league matches (if q present)
    let lCount = 0
    let leagueItems: any[] = []
    if (q) {
      let lQ = supabase
        .from('leagues')
        .select(
          `
          id, name, fees, divisions, nights, formats, contact_type, comp_levels,
          signup_url, website, verified, city_id,
          cities!inner(name, slug, state)
        `,
          { count: 'exact' }
        )
        .or(`name.ilike.%${q}%,website.ilike.%${q}%`)

      if (state) lQ = lQ.eq('cities.state', state)
      if (sort === 'fee_asc') lQ = lQ.order('fees', { ascending: true, nullsFirst: true })

      const { data: leagues, count } = await lQ.limit(PAGE_SIZE)
      lCount = count || 0

      leagueItems = (leagues || []).map((l: any) => {
        const spec = [
          l.fees ? `$${l.fees}` : 'Fee varies',
          (l.formats || []).join('/'),
          l.contact_type,
          (l.comp_levels || []).join('/'),
          (l.divisions || []).join(' / '), // age groups
          (l.nights || []).join(', '),
        ]
          .filter(Boolean)
          .join(' · ')

        return {
          type: 'League',
          name: l.name,
          state: l.cities?.state,
          city_name: l.cities?.name,
          spec, // <-- richer spec shown on the card
          signup_url: l.signup_url,
          website: l.website,
          verified: !!l.verified,
          detail_href: `/youth/leagues/${l.cities?.slug}`,
        }
      })
    }

    items = [...cityItems, ...leagueItems]
    total = (cCount || 0) + (lCount || 0)
  } else {
    // EVENTS: tournaments or clinics
    let eQ = supabase
      .from('events')
      .select('id,name,state,location,start_date,end_date,divisions,fee,website,signup_url,kind', { count: 'exact' })
      .eq('kind', category)
      .gte('start_date', fromDate)

    if (state) eQ = eQ.eq('state', state)
    if (q) eQ = eQ.or(`name.ilike.%${q}%,location.ilike.%${q}%`)

    if (sort === 'date_asc' || sort === 'relevance') {
      eQ = eQ.order('start_date', { ascending: true })
    } else if (sort === 'fee_asc') {
      eQ = eQ.order('fee', { ascending: true, nullsFirst: true }).order('start_date', { ascending: true })
    }

    const { data: events, count } = await eQ.range(start, end)
    total = count || 0

    items = (events || []).map((e: any) => ({
      type: category === 'tournament' ? 'Tournament' : 'Clinic',
      name: e.name,
      state: e.state,
      location: e.location || null,
      date_str: e.end_date ? `${e.start_date}–${e.end_date}` : e.start_date,
      divisions: e.divisions,
      spec: `${e.fee ? `$${e.fee}` : 'Fee varies'}${
        (e.divisions || []).length ? ` · ${(e.divisions || []).join(' / ')}` : ''
      }`,
      website: e.website,
      signup_url: e.signup_url,
      verified: false,
      detail_href: undefined,
    }))
  }

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Explore — ${category}`,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: it.detail_href || it.signup_url || it.website || '',
    })),
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const viewIsList = view === 'list'

  const makePageHref = (p: number) => {
    const usp = new URLSearchParams()
    usp.set('category', category)
    if (q) usp.set('q', q)
    if (state) usp.set('state', state)
    if (category !== 'league' && from) usp.set('from', from)
    if (sort) usp.set('sort', sort)
    if (view) usp.set('view', view)
    usp.set('page', String(p))
    return `/explore?${usp.toString()}`
  }

  return (
    <section className="container py-8 space-y-6">
      <JsonLd data={itemList} />
      <Breadcrumbs items={[{ label: 'Explore' }]} className="mb-2" />

      <div className="space-y-3">
        <h1 className="section-heading">Explore programs & events</h1>
        <p className="section-subheading">
          Tune the filters below to browse verified teams, leagues, clinics, and tournaments across the U.S.
        </p>
      </div>

      <div className="surface-card p-6 sm:p-8">
        <ResultsToolbar total={total} />
      </div>

      <div className={viewIsList ? 'grid gap-3' : 'grid gap-3 sm:grid-cols-2 md:grid-cols-3'}>
        {items.map((it, idx) => (
          <ListingCard key={idx} item={it} view={viewIsList ? 'list' : 'grid'} />
        ))}
        {!items.length && (
          <div className="surface-card p-6 text-sm text-[#345c72]">
            No results. Try a broader query or clear filters.
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <a className={`btn ${page <= 1 ? 'opacity-50 pointer-events-none' : ''}`} href={makePageHref(page - 1)}>
            Prev
          </a>
          <span className="small">Page {page} of {pages}</span>
          <a className={`btn ${page >= pages ? 'opacity-50 pointer-events-none' : ''}`} href={makePageHref(page + 1)}>
            Next
          </a>
        </div>
      )}
    </section>
  )
}
