// components/OrgCard.tsx
export default function OrgCard({ o }: { o: any }) {
  const safeType = typeof o.type === 'string' ? o.type : ''
  const typeLower = safeType.toLowerCase()

  const slugify = (value?: string | null) =>
    (value || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  // Determine gradient colors based on type
  const getGradientColors = () => {
    switch(typeLower) {
      case 'clinic':
        return 'from-[#345c72] to-[#001f3d]'
      case 'tournament':
        return 'from-[#001f3d] to-[#345c72]'
      default:
        return 'from-[#001f3d] to-[#345c72]'
    }
  }

  const getBadgeColor = () => {
    switch(typeLower) {
      case 'clinic':
        return 'bg-[#345c72]/5 text-[#345c72]'
      case 'tournament':
        return 'bg-[#001f3d]/5 text-[#001f3d]'
      default:
        return 'bg-[#001f3d]/5 text-[#001f3d]'
    }
  }

  const routeSegment =
    typeLower === 'clinic' ? 'clinics' : typeLower === 'tournament' ? 'tournaments' : typeLower ? `${typeLower}s` : 'programs'

  const safeSlug =
    typeof o.slug === 'string' && o.slug.trim().length > 0 ? o.slug.trim() : null
  const generatedSlug = slugify(o.name)
  const fallbackId =
    typeof o.id === 'number' || (typeof o.id === 'string' && o.id.trim().length > 0)
      ? String(o.id).trim()
      : null
  const slugOrId = safeSlug ?? (generatedSlug || null) ?? fallbackId
  const href = slugOrId ? `/${routeSegment}/${slugOrId}` : `/${routeSegment}`
  const baseButtonClasses =
    'inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition bg-[#e87a00] text-white shadow-[0_18px_45px_-22px_rgba(232,122,0,0.55)] hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-24px_rgba(232,122,0,0.65)]'
  const locationLabel =
    o.city_name && o.state
      ? `${o.city_name}, ${o.state}`
      : o.city_name || o.state || 'Location coming soon'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#001f3d]/10 bg-white shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(0,31,61,0.55)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#001f3d] via-[#345c72] to-[#e87a00]" />

      {/* Image */}
      <div className={`aspect-video bg-gradient-to-br ${getGradientColors()} relative overflow-hidden`}>
        {o.cover_url ? (
          <img src={o.cover_url} alt={o.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {o.type === 'Clinic' ? (
              <svg className="h-16 w-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            ) : (
              <svg className="h-16 w-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806 1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
        {/* Header with badges */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-2 rounded-full border border-[#001f3d]/10 ${getBadgeColor()} px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]`}>
            {o.type}
          </span>
          {o.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-[#001f3d] line-clamp-2 transition-colors group-hover:text-[#e87a00]">
          {o.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-[#345c72]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{locationLabel}</span>
        </div>

        {/* CTA */}
        <div className="pt-1">
          <a
            href={href}
            className={baseButtonClasses}
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  )
}
