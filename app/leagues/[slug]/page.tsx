// app/leagues/[slug]/page.tsx
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function LeagueDetailPage({ params }: { params: { slug: string } }) {
  const { data: league } = await supabase
    .from('leagues')
    .select(`
      *,
      cities:city_id(name, state, slug)
    `)
    .eq('slug', params.slug)
    .maybeSingle()

  if (!league) return notFound()

  return (
    <article className="container py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-secondary mb-6">
        <a href="/" className="hover:text-primary">Home</a>
        <span className="mx-2">/</span>
        <a href="/leagues" className="hover:text-primary">Leagues</a>
        <span className="mx-2">/</span>
        <span className="text-primary">{league.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            {league.verified && (
              <span className="badge badge-success mb-2 inline-flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified League
              </span>
            )}
            <h1 className="text-3xl font-bold text-primary mb-2">
              {league.name}
            </h1>
            <div className="flex items-center gap-2 text-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{league.cities?.name}, {league.cities?.state}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-icon" title="Share">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button className="btn btn-ghost btn-icon" title="Save">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <section className="card card-padding">
            <h2 className="text-xl font-semibold text-primary mb-4">About</h2>
            <p className="text-secondary leading-relaxed">
              {league.about || 'No description available.'}
            </p>
          </section>

          {/* Divisions & Format */}
          <section className="card card-padding">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Divisions & Format
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-secondary mb-2">
                  Age Groups
                </h3>
                <div className="flex flex-wrap gap-2">
                  {league.divisions?.map((div: string) => (
                    <span key={div} className="badge badge-secondary">
                      {div}
                    </span>
                  )) || <span className="text-tertiary">Not specified</span>}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-secondary mb-2">
                  Game Format
                </h3>
                <div className="flex flex-wrap gap-2">
                  {league.formats?.map((f: string) => (
                    <span key={f} className="badge badge-secondary">
                      {f}
                    </span>
                  )) || <span className="text-tertiary">Not specified</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Season Info */}
          {(league.season_start || league.season_end) && (
            <section className="card card-padding">
              <h2 className="text-xl font-semibold text-primary mb-4">
                Season Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {league.season_start && (
                  <div>
                    <p className="text-sm text-secondary mb-1">Season Start</p>
                    <p className="font-medium text-primary">
                      {new Date(league.season_start).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {league.season_end && (
                  <div>
                    <p className="text-sm text-secondary mb-1">Season End</p>
                    <p className="font-medium text-primary">
                      {new Date(league.season_end).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <aside className="space-y-6">
          {/* Quick Info Card */}
          <section className="card card-padding sticky top-24">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Quick Info
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-secondary">Registration Fee:</dt>
                <dd className="font-medium text-primary">
                  {league.fees ? `$${league.fees}` : 'Contact for pricing'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary">Contact Type:</dt>
                <dd className="font-medium text-primary capitalize">
                  {league.contact_type || 'Not specified'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary">Skill Level:</dt>
                <dd className="font-medium text-primary">
                  {league.comp_levels?.join(', ') || 'All levels'}
                </dd>
              </div>
              {league.nights && league.nights.length > 0 && (
                <div className="flex justify-between">
                  <dt className="text-secondary">Game Nights:</dt>
                  <dd className="font-medium text-primary">
                    {league.nights.join(', ')}
                  </dd>
                </div>
              )}
            </dl>

            <div className="divider" />

            {/* Contact Info */}
            <div className="space-y-2">
              {league.contact_name && (
                <p className="text-sm">
                  <span className="text-secondary">Contact:</span>{' '}
                  <span className="text-primary font-medium">{league.contact_name}</span>
                </p>
              )}
              {league.contact_email && (
                <p className="text-sm">
                  <span className="text-secondary">Email:</span>{' '}
                  <a href={`mailto:${league.contact_email}`} className="link">
                    {league.contact_email}
                  </a>
                </p>
              )}
              {league.contact_phone && (
                <p className="text-sm">
                  <span className="text-secondary">Phone:</span>{' '}
                  <a href={`tel:${league.contact_phone}`} className="link">
                    {league.contact_phone}
                  </a>
                </p>
              )}
            </div>

            <div className="divider" />

            {/* CTAs */}
            <div className="space-y-3">
              {league.signup_url && (
                <a 
                  href={league.signup_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                >
                  Register Now
                </a>
              )}
              {league.website && (
                <a 
                  href={league.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary w-full"
                >
                  Visit Website
                </a>
              )}
              {league.contact_email && (
                <a 
                  href={`mailto:${league.contact_email}`}
                  className="btn btn-outline w-full"
                >
                  Contact League
                </a>
              )}
            </div>
          </section>
        </aside>
      </div>

      {/* Related Leagues */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-primary mb-6">
          Other Leagues in {league.cities?.name}
        </h2>
        {/* Add query here to fetch related leagues */}
      </section>
    </article>
  )
}