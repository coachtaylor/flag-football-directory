import { supabase } from '@/lib/supabase'

export default async function TournamentDetail({ params }: { params: { slug: string } }) {
  const { data: t } = await supabase
    .from('events')
    .select('*')
    .eq('kind', 'tournament')
    .eq('slug', params.slug)
    .maybeSingle()

  if (!t) return <div className="card">Tournament not found.</div>

  const dateStr = t.end_date ? `${t.start_date}–${t.end_date}` : t.start_date

  return (
    <article className="grid gap-6">
      <header className="grid gap-1">
        <h1 className="text-2xl font-semibold">{t.name}</h1>
        <p className="text-gray-700">{t.location || t.state} • {dateStr}</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-4">
          <section className="card">
            <h2 className="font-semibold mb-2">About</h2>
            <p className="text-sm text-gray-700">{t.about || '—'}</p>
          </section>
        </div>

        <aside className="grid gap-4">
          <section className="card">
            <h3 className="font-semibold">Details</h3>
            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              <li><strong>Price:</strong> {t.price ? `$${t.price}` : t.fee ? `$${t.fee}` : '—'}</li>
              <li><strong>Age groups:</strong> {(t.divisions||[]).join(' / ') || '—'}</li>
              <li><strong>Format:</strong> {(t.formats||[]).join(' / ') || '—'}</li>
              <li><strong>Contact type:</strong> {t.contact_type || '—'}</li>
              <li><strong>Level:</strong> {(t.comp_levels||[]).join(' / ') || '—'}</li>
              <li><strong>Contact:</strong> {t.contact_name || '—'}</li>
              <li><strong>Email:</strong> {t.contact_email || '—'}</li>
              <li><strong>Phone:</strong> {t.contact_phone || '—'}</li>
              <li><strong>Address:</strong> {t.address_line1 || ''} {t.state || ''} {t.postal_code || ''}</li>
              {t.website && <li><a className="link" href={t.website} target="_blank">Website</a></li>}
            </ul>
            <div className="mt-3 flex gap-2">
              {t.contact_email && <a className="btn btn-primary" href={`mailto:${t.contact_email}`}>Contact Tournament</a>}
              {t.website && <a className="btn" target="_blank" href={t.website}>View Website</a>}
            </div>
          </section>
        </aside>
      </div>
    </article>
  )
}
