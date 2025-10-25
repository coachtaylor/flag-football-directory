import { supabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import TeamContactButton from '@/components/TeamContactButton'

export default async function TeamDetail({ params }: { params: { slug: string } }) {
  const { data: team } = await supabase
    .from('teams')
    .select('*, cities:city_id(name,state)')
    .eq('slug', params.slug)
    .maybeSingle()

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative w-full overflow-hidden bg-gray-50">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-4 sm:px-8 lg:px-12">
            <div className="mb-6">
              <Breadcrumbs
                items={[
                  { label: 'Teams', href: '/teams' },
                  { label: 'Team Not Found' },
                ]}
                className="py-0 text-sm text-[#345c72]"
              />
            </div>
            <div className="rounded-3xl border border-[#001f3d]/15 bg-[#f6f7fa] px-8 py-14 text-center shadow-[0_18px_45px_-32px_rgba(0,31,61,0.25)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#001f3d]/30 bg-white text-[#001f3d]">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#001f3d]">Team not found</h3>
              <p className="mt-3 text-base text-[#345c72]/90">
                The team you're looking for doesn't exist or may have been removed.
              </p>
              <a
                href="/teams"
                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#001f3d]/15 bg-white px-5 py-3 text-sm font-semibold text-[#001f3d] shadow-sm transition hover:border-[#e87a00] hover:text-[#e87a00]"
              >
                Browse Teams
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full overflow-hidden bg-gray-50">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-4 sm:px-8 lg:px-12">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: 'Teams', href: '/teams' },
                { label: team.name },
              ]}
              className="py-0 text-sm text-[#345c72]"
            />
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#001f3d]/10 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#001f3d]">
                Team Profile
              </span>

              <div className="space-y-5">
                <h1 className="text-4xl font-semibold tracking-tight text-[#001f3d] sm:text-5xl xl:text-[3.25rem] xl:leading-[1.1]">
                  {team.name}
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#123a55]/90 sm:text-xl">
                  {team.cities?.name}, {team.cities?.state} • {team.gender && `${team.gender} • `}{(team.age_groups || []).join(', ')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[#345c72]">
                {team.verified && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1 text-sm font-medium text-[#345c72]">
                    <svg className="w-3 h-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified team
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#e87a00]" />
                  {(team.formats || []).join(', ')}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                  <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-[#345c72]">
                    <span className="absolute inset-1 rounded-full bg-white" />
                  </span>
                  {(team.comp_levels || []).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-gray-50">
        {/* Subtle top border for visual separation */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                <h2 className="text-xl font-semibold text-[#001f3d] mb-4">About</h2>
                <p className="text-[#345c72]/90 leading-relaxed">
                  {team.about?.trim()
                    ? team.about
                    : 'We are gathering more information about this program. Coaches can submit an update to share coaching philosophy, culture, and player development focus.'}
                </p>
              </section>

              <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                <h2 className="text-xl font-semibold text-[#001f3d] mb-4">Accomplishments</h2>
                {Array.isArray(team.accomplishments) ? (
                  <ul className="space-y-2 text-[#345c72]/90">
                    {(team.accomplishments as string[])
                      .filter((item) => typeof item === 'string' && item.trim().length > 0)
                      .map((item, index) => (
                        <li key={`${item}-${index}`} className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#e87a00]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    {(!Array.isArray(team.accomplishments) ||
                      !(team.accomplishments as string[]).some((item) => typeof item === 'string' && item.trim().length > 0)) && (
                        <li className="text-[#345c72]/70">
                          Tournament finishes, league titles, and community highlights will appear here once the team shares them.
                        </li>
                      )}
                  </ul>
                ) : (
                  <p className="text-[#345c72]/90 leading-relaxed">
                    {typeof team.accomplishments === 'string' && team.accomplishments.trim().length > 0
                      ? team.accomplishments
                      : 'Tournament finishes, league titles, and community highlights will appear here once the team shares them.'}
                  </p>
                )}
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                <h3 className="text-lg font-semibold text-[#001f3d] mb-4">Team Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-[#345c72]">Age groups:</span>
                    <p className="text-[#001f3d]">{(team.age_groups || []).join(' / ') || '—'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#345c72]">Format:</span>
                    <p className="text-[#001f3d]">{(team.formats || []).join(' / ') || '—'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#345c72]">Contact type:</span>
                    <p className="text-[#001f3d]">{team.contact_type || '—'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#345c72]">Level:</span>
                    <p className="text-[#001f3d]">{(team.comp_levels || []).join(' / ') || '—'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#345c72]">Gender:</span>
                    <p className="text-[#001f3d]">{team.gender || '—'}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                <h3 className="text-lg font-semibold text-[#001f3d] mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {team.contact_name && (
                    <div>
                      <span className="text-sm font-medium text-[#345c72]">Contact:</span>
                      <p className="text-[#001f3d]">{team.contact_name}</p>
                    </div>
                  )}
                  {team.contact_email && (
                    <div>
                      <span className="text-sm font-medium text-[#345c72]">Email:</span>
                      <p className="text-[#001f3d]">{team.contact_email}</p>
                    </div>
                  )}
                  {team.contact_phone && (
                    <div>
                      <span className="text-sm font-medium text-[#345c72]">Phone:</span>
                      <p className="text-[#001f3d]">{team.contact_phone}</p>
                    </div>
                  )}
                  {(team.address_line1 || team.city || team.state || team.postal_code) && (
                    <div>
                      <span className="text-sm font-medium text-[#345c72]">Address:</span>
                      <p className="text-[#001f3d]">{[team.address_line1, team.city, team.state, team.postal_code].filter(Boolean).join(' ')}</p>
                    </div>
                  )}
                  {team.website && (
                    <div>
                      <span className="text-sm font-medium text-[#345c72]">Website:</span>
                      <a 
                        href={team.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#e87a00] hover:text-[#e87a00]/80 transition-colors"
                      >
                        Visit website →
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 space-y-3">
                  <TeamContactButton
                    teamName={team.name}
                    teamId={team.id}
                    contactEmail={team.contact_email}
                  />
                  {team.website && (
                    <a 
                      href={team.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-[#001f3d]/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#001f3d] shadow-sm transition hover:border-[#e87a00] hover:text-[#e87a00]"
                    >
                      View Website
                    </a>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
