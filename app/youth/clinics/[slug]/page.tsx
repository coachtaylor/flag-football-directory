import Breadcrumbs from '@/components/Breadcrumbs'
import { supabase } from '@/lib/supabase'
import ClinicContactButton from '@/components/ClinicContactButton'

type EventRecord = {
  id: number
  name: string
  slug: string
  kind: string
  about?: string | null
  location?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  address_line1?: string | null
  start_date?: string | null
  end_date?: string | null
  price?: number | string | null
  fee?: number | string | null
  divisions?: string[] | null
  formats?: string[] | null
  comp_levels?: string[] | null
  contact_type?: string | null
  contact_name?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  website?: string | null
  registration_url?: string | null
  signup_url?: string | null
  verified?: boolean | null
}

const formatDate = (value?: string | null) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatDateRange = (start?: string | null, end?: string | null) => {
  const formattedStart = formatDate(start)
  const formattedEnd = formatDate(end)
  if (formattedStart && formattedEnd && formattedStart !== formattedEnd) return `${formattedStart} – ${formattedEnd}`
  return formattedStart || formattedEnd || null
}

const formatCurrency = (value?: number | string | null) => {
  if (value === null || value === undefined || value === '') return 'Included with registration'
  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isFinite(numeric)) {
    return numeric.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: numeric % 1 === 0 ? 0 : 2,
    })
  }
  return typeof value === 'string' ? value : 'Included with registration'
}

const toArray = (value: unknown): string[] => (Array.isArray(value) ? value.filter(Boolean) : [])

const normalizeSlugToName = (value: string) =>
  decodeURIComponent(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const parseLocation = (primary?: string | null, fallbackCity?: string | null, fallbackState?: string | null) => {
  const result = {
    city: fallbackCity?.trim() || null,
    state: fallbackState?.trim() || null,
  }

  if (!primary) return result

  const parts = primary.split(',').map((part) => part.trim()).filter(Boolean)

  if (parts.length === 1) {
    const value = parts[0]
    if (/^[A-Za-z]{2}$/.test(value)) {
      result.state = result.state || value.toUpperCase()
    } else {
      result.city = result.city || value
    }
  } else if (parts.length >= 2) {
    result.city = result.city || parts.slice(0, -1).join(', ')
    const statePart = parts[parts.length - 1]
    result.state = result.state || (statePart.length <= 5 ? statePart.toUpperCase() : statePart)
  }

  return result
}

export default async function ClinicDetail({ params }: { params: { slug: string } }) {
  const slugParam = params.slug

  const { data: initialClinic } = await supabase
    .from('events')
    .select('*')
    .eq('kind', 'clinic')
    .eq('slug', slugParam)
    .maybeSingle<EventRecord>()

  let clinic = initialClinic

  if (!clinic) {
    const numericId = Number(slugParam)
    if (Number.isFinite(numericId)) {
      const { data: clinicById } = await supabase
        .from('events')
        .select('*')
        .eq('kind', 'clinic')
        .eq('id', numericId)
        .maybeSingle<EventRecord>()
      clinic = clinicById ?? null
    }
  }

  if (!clinic) {
    const nameGuess = normalizeSlugToName(slugParam)
    if (nameGuess) {
      const { data: clinicByName } = await supabase
        .from('events')
        .select('*')
        .eq('kind', 'clinic')
        .ilike('name', nameGuess)
        .maybeSingle<EventRecord>()
      clinic = clinicByName ?? null
    }
  }

  if (!clinic || slugParam === 'null' || slugParam === 'undefined') {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative w-full overflow-hidden bg-gray-50">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-4 sm:px-8 lg:px-12">
            <div className="mb-6">
              <Breadcrumbs
                items={[
                  { label: 'Clinics', href: '/youth/clinics' },
                  { label: 'Details Coming Soon' },
                ]}
                className="py-0 text-sm text-[#345c72]"
              />
            </div>

            <div className="rounded-3xl border border-[#001f3d]/15 bg-[#f6f7fa] px-8 py-14 text-center shadow-[0_18px_45px_-32px_rgba(0,31,61,0.25)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#001f3d]/30 bg-white text-[#001f3d]">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697A3.42 3.42 0 009.781 3.89a3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#001f3d]">Details coming soon</h3>
              <p className="mt-3 text-base text-[#345c72]/90">
                We&apos;re prepping the full breakdown for this clinic. Check back soon or explore other training options in the meantime.
              </p>
              <a
                href="/youth/clinics"
                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#001f3d]/15 bg-white px-5 py-3 text-sm font-semibold text-[#001f3d] shadow-sm transition hover:border-[#e87a00] hover:text-[#e87a00]"
              >
                Browse Clinics
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const parsedLocation = parseLocation(clinic.location, clinic.city, clinic.state)
  const locationSegments = [parsedLocation.city, parsedLocation.state].filter(Boolean)
  const location = locationSegments.join(', ')
  const divisions = toArray(clinic.divisions)
  const formats = toArray(clinic.formats)
  const compLevels = toArray(clinic.comp_levels)
  const dateRange = formatDateRange(clinic.start_date, clinic.end_date)
  const priceDisplay = formatCurrency(clinic.price ?? clinic.fee)
  const registerUrl = clinic.registration_url || clinic.signup_url || clinic.website || null

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full overflow-hidden bg-gray-50">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-4 sm:px-8 lg:px-12">
          <div className="mb-6">
              <Breadcrumbs
              items={[
                { label: 'Clinics', href: '/youth/clinics' },
                { label: clinic.name },
              ]}
              className="py-0 text-sm text-[#345c72]"
            />
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#001f3d]/10 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#001f3d]">
                Clinic Profile
              </span>

              <div className="space-y-5">
                <h1 className="text-4xl font-semibold tracking-tight text-[#001f3d] sm:text-5xl xl:text-[3.25rem] xl:leading-[1.1]">
                  {clinic.name}
                </h1>
                <p className="max-w-3xl text-lg leading-relaxed text-[#123a55]/90 sm:text-xl">
                  {[location, dateRange].filter(Boolean).join(' • ') || 'Schedule and location details coming soon.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[#345c72]">
                {clinic.verified && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                    <svg className="h-3 w-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified clinic
                  </span>
                )}
                {formats.length > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#e87a00]" />
                    {formats.join(', ')}
                  </span>
                )}
                {compLevels.length > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                    <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-[#345c72]">
                      <span className="absolute inset-1 rounded-full bg-white" />
                    </span>
                    {compLevels.join(', ')}
                  </span>
                )}
                {divisions.length > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#001f3d]" />
                    {divisions.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                <h2 className="text-xl font-semibold text-[#001f3d]">What to expect</h2>
                <p className="mt-4 text-base leading-relaxed text-[#345c72]/95">
                  {clinic.about?.trim() || 'This clinic hasn&apos;t published a full overview yet. Expect top-tier instruction, detailed position work, and competition tailored to your athletes.'}
                </p>
              </section>

              <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                <h3 className="text-lg font-semibold text-[#001f3d]">Skill focus & player profile</h3>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#345c72]/70">Age groups</p>
                    {divisions.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {divisions.map((division) => (
                          <span key={division} className="rounded-xl border border-[#001f3d]/10 bg-[#f6f7fa] px-3 py-1 text-xs font-semibold text-[#345c72]">
                            {division}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-[#345c72]/80">Age group breakdown coming soon.</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#345c72]/70">Competition level</p>
                    {compLevels.length > 0 ? (
                      <p className="mt-3 text-base font-semibold text-[#001f3d]">{compLevels.join(', ')}</p>
                    ) : (
                      <p className="mt-3 text-sm text-[#345c72]/80">Open to all experience levels.</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                <h3 className="text-lg font-semibold text-[#001f3d]">Schedule & format</h3>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  {dateRange && (
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#345c72]/70">Dates</p>
                      <p className="mt-3 text-base font-semibold text-[#001f3d]">{dateRange}</p>
                    </div>
                  )}
                  {formats.length > 0 && (
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#345c72]/70">Format</p>
                      <p className="mt-3 text-base font-semibold text-[#001f3d]">{formats.join(', ')}</p>
                    </div>
                  )}
                  {clinic.contact_type && (
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#345c72]/70">Contact level</p>
                      <p className="mt-3 text-base font-semibold capitalize text-[#001f3d]">{clinic.contact_type}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-3xl border border-[#001f3d]/10 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)]">
                <h3 className="text-lg font-semibold text-[#001f3d]">Quick info</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#345c72]/80">Registration</dt>
                    <dd className="font-semibold text-[#001f3d]">{priceDisplay}</dd>
                  </div>
                  {dateRange && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#345c72]/80">Dates</dt>
                      <dd className="font-semibold text-right text-[#001f3d]">{dateRange}</dd>
                    </div>
                  )}
                  {divisions.length > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#345c72]/80">Age groups</dt>
                      <dd className="font-semibold text-right text-[#001f3d]">{divisions.join(', ')}</dd>
                    </div>
                  )}
                  {formats.length > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#345c72]/80">Format</dt>
                      <dd className="font-semibold text-right text-[#001f3d]">{formats.join(', ')}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-[#001f3d]/15 to-transparent" />

                <div className="mt-6 space-y-3 text-sm">
                  {clinic.contact_name && (
                    <div>
                      <p className="text-[#345c72]/70">Contact</p>
                      <p className="font-semibold text-[#001f3d]">{clinic.contact_name}</p>
                    </div>
                  )}
                  {clinic.contact_email && (
                    <div>
                      <p className="text-[#345c72]/70">Email</p>
                      <a href={`mailto:${clinic.contact_email}`} className="font-semibold text-[#e87a00] hover:text-[#e87a00]/80">
                        {clinic.contact_email}
                      </a>
                    </div>
                  )}
                  {clinic.contact_phone && (
                    <div>
                      <p className="text-[#345c72]/70">Phone</p>
                      <a href={`tel:${clinic.contact_phone}`} className="font-semibold text-[#001f3d] hover:text-[#e87a00]">
                        {clinic.contact_phone}
                      </a>
                    </div>
                  )}
                  {[clinic.address_line1, location].filter(Boolean).length > 0 && (
                    <div>
                      <p className="text-[#345c72]/70">Location</p>
                      <p className="font-semibold text-[#001f3d]">
                        {[clinic.address_line1, location, clinic.postal_code].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  )}
                  {clinic.website && (
                    <div>
                      <p className="text-[#345c72]/70">Website</p>
                      <a
                        href={clinic.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#e87a00] hover:text-[#e87a00]/80"
                      >
                        Visit website →
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <ClinicContactButton
                    clinicName={clinic.name}
                    clinicId={clinic.id}
                    contactEmail={clinic.contact_email}
                  />
                  {registerUrl && (
                    <a
                      href={registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-[#001f3d]/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#001f3d] shadow-sm transition hover:border-[#e87a00] hover:text-[#e87a00]"
                    >
                      Register Now
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
