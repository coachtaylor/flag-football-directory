import { supabase } from '@/lib/supabase'

export default async function ClinicDetail({ params }: { params: { slug: string } }) {
  const { data: clinic } = await supabase
    .from('events')
    .select('*')
    .eq('kind', 'clinic')
    .eq('slug', params.slug)
    .maybeSingle()

  if (!clinic) return <div className="card">Clinic not found.</div>

  const dateStr = clinic.end_date ? `${clinic.start_date}–${clinic.end_date}` : clinic.start_date

  return (
    <article className="grid gap-6">
      <header className="grid gap-1">
        <h1 className="text-2xl font-semibold">{clinic.name}</h1>
        <p className="text-gray-700">{clinic.location || clinic.state} • {dateStr}</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-4">
          <section className="card">
            <h2 className="font-semibold mb-2">About</h2>
            <p className="text-sm text-gray-700">{clinic.about || '—'}</p>
          </section>
        </div>

        <aside className="grid gap-4">
          <section className="card">
            <h3 className="font-semibold">Details</h3>
            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              <li><strong>Price:</strong> {clinic.price ? `$${clinic.price}` : clinic.fee ? `$${clinic.fee}` : '—'}</li>
              <li><strong>Age groups:</strong> {(clinic.divisions||[]).join(' / ') || '—'}</li>
              <li><strong>Format:</strong> {(clinic.formats||[]).join(' / ') || '—'}</li>
              <li><strong>Contact type:</strong> {clinic.contact_type || '—'}</li>
              <li><strong>Level:</strong> {(clinic.comp_levels||[]).join(' / ') || '—'}</li>
              <li><strong>Contact:</strong> {clinic.contact_name || '—'}</li>
              <li><strong>Email:</strong> {clinic.contact_email || '—'}</li>
              <li><strong>Phone:</strong> {clinic.contact_phone || '—'}</li>
              <li><strong>Address:</strong> {clinic.address_line1 || ''} {clinic.state || ''} {clinic.postal_code || ''}</li>
              {clinic.website && <li><a className="link" href={clinic.website} target="_blank">Website</a></li>}
            </ul>
            <div className="mt-3 flex gap-2">
              {clinic.contact_email && <a className="btn btn-primary" href={`mailto:${clinic.contact_email}`}>Contact Clinic</a>}
              {clinic.website && <a className="btn" target="_blank" href={clinic.website}>View Website</a>}
            </div>
          </section>
        </aside>
      </div>
    </article>
  )
}
