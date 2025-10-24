import { supabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'

export default async function TeamDetail({ params }: { params: { slug: string } }) {
  const { data: team } = await supabase
    .from('teams')
    .select('*, cities:city_id(name,state)')
    .eq('slug', params.slug)
    .maybeSingle()

  if (!team) {
    return (
      <section className="container py-8">
        <Breadcrumbs
          items={[
            { label: 'Teams', href: '/teams' },
            { label: 'Team Not Found' },
          ]}
          className="mb-4"
        />
        <div className="card">Team not found.</div>
      </section>
    )
  }

  return (
    <section className="container py-8">
      <Breadcrumbs
        items={[
          { label: 'Teams', href: '/teams' },
          { label: team.name },
        ]}
        className="mb-6"
      />

      <article className="grid gap-6">
        <div className="grid gap-2">
          <h1 className="text-2xl font-semibold">{team.name}</h1>
          <p className="text-gray-700">{team.cities?.name} • {team.cities?.state}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 grid gap-4">
            <section className="card">
              <h2 className="font-semibold mb-2">About</h2>
              <p className="text-sm text-gray-700">{team.about || '—'}</p>
            </section>
            <section className="card">
              <h2 className="font-semibold mb-2">Accomplishments</h2>
              <p className="text-sm text-gray-700">{team.accomplishments || '—'}</p>
            </section>
          </div>

          <aside className="grid gap-4">
            <section className="card">
              <h3 className="font-semibold">Details</h3>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li><strong>Age groups:</strong> {(team.age_groups||[]).join(' / ') || '—'}</li>
                <li><strong>Format:</strong> {(team.formats||[]).join(' / ') || '—'}</li>
                <li><strong>Contact type:</strong> {team.contact_type || '—'}</li>
                <li><strong>Level:</strong> {(team.comp_levels||[]).join(' / ') || '—'}</li>
                <li><strong>Contact:</strong> {team.contact_name || '—'}</li>
                <li><strong>Email:</strong> {team.contact_email || '—'}</li>
                <li><strong>Phone:</strong> {team.contact_phone || '—'}</li>
                <li><strong>Address:</strong> {team.address_line1 || ''} {team.city || ''} {team.state || ''} {team.postal_code || ''}</li>
                <li><a className="link" href={team.website || '#'} target="_blank">Website</a></li>
              </ul>
              <div className="mt-3 flex gap-2">
                <a className="btn btn-primary" href={`mailto:${team.contact_email || ''}`}>Contact Team</a>
                {team.website && <a className="btn" target="_blank" href={team.website}>View Website</a>}
              </div>
            </section>
          </aside>
        </div>
      </article>
    </section>
  )
}
