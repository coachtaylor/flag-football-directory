import { supabase } from '@/lib/supabase'

export default async function LeagueDetail({ params }: { params: { slug: string } }) {
  const { data: league } = await supabase
    .from('leagues')
    .select('*, cities:city_id(name,state)')
    .eq('slug', params.slug)
    .maybeSingle()

  if (!league) return <div className="card">League not found.</div>

  return (
    <article className="grid gap-6">
      <header className="grid gap-1">
        <h1 className="text-2xl font-semibold">{league.name}</h1>
        <p className="text-gray-700">{league.cities?.name} • {league.cities?.state}</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-4">
          <section className="card">
            <h2 className="font-semibold mb-2">About</h2>
            <p className="text-sm text-gray-700">{league.about || '—'}</p>
          </section>
        </div>

        <aside className="grid gap-4">
          <section className="card">
            <h3 className="font-semibold">Details</h3>
            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              <li><strong>Price:</strong> {league.fees ? `$${league.fees}` : '—'}</li>
              <li><strong>Age groups:</strong> {(league.divisions||[]).join(' / ') || '—'}</li>
              <li><strong>Format:</strong> {(league.formats||[]).join(' / ') || '—'}</li>
              <li><strong>Contact type:</strong> {league.contact_type || '—'}</li>
              <li><strong>Level:</strong> {(league.comp_levels||[]).join(' / ') || '—'}</li>
              <li><strong>Contact:</strong> {league.contact_name || '—'}</li>
              <li><strong>Email:</strong> {league.contact_email || '—'}</li>
              <li><strong>Phone:</strong> {league.contact_phone || '—'}</li>
              <li><strong>Address:</strong> {league.address_line1 || ''} {league.cities?.name || ''} {league.cities?.state || ''} {league.postal_code || ''}</li>
              {league.website && <li><a className="link" href={league.website} target="_blank">Website</a></li>}
            </ul>
            <div className="mt-3 flex gap-2">
              {league.contact_email && <a className="btn btn-primary" href={`mailto:${league.contact_email}`}>Contact League</a>}
              {league.website && <a className="btn" target="_blank" href={league.website}>View Website</a>}
            </div>
          </section>
        </aside>
      </div>
    </article>
  )
}
