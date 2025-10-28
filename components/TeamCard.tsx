// components/TeamCard.tsx
type TeamLike = {
  slug?: string
  cover_url?: string | null
  name: string
  verified?: boolean
  city_name?: string
  state?: string
  age_groups?: string[]
  gender?: string | null
  comp_levels?: string[]
  detail_href?: string
}

export default function TeamCard({ t, team }: { t?: TeamLike; team?: TeamLike }) {
  const data = t ?? team
  if (!data) return null

  const slug = data.slug ?? ''
  const fallbackHref = slug ? (data.age_groups?.includes('ADULT') ? `/adult/teams/${slug}` : `/youth/teams/${slug}`) : '#'
  const detailHref = data.detail_href || fallbackHref

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#001f3d]/10 bg-white shadow-[0_16px_40px_-28px_rgba(0,31,61,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(0,31,61,0.55)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#001f3d] via-[#345c72] to-[#e87a00]" />

      {/* Image */}
      <div className="aspect-video bg-gradient-to-br from-[#001f3d] via-[#345c72] to-[#123a55] relative overflow-hidden">
        {data.cover_url ? (
          <img
            src={data.cover_url}
            alt={data.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="h-16 w-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
        {/* Header with badges */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/10 bg-[#001f3d]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#001f3d]">
            Team
          </span>
          {data.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Team name */}
        <h3 className="text-lg font-semibold text-[#001f3d] line-clamp-2 transition-colors group-hover:text-[#e87a00]">
          {data.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-[#345c72]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{data.city_name}, {data.state}</span>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-2">
          {data.age_groups?.slice(0, 3).map((age: string) => (
            <span
              key={age}
              className="rounded-xl border border-[#001f3d]/10 bg-[#f6f7fa] px-3 py-1 text-xs font-semibold text-[#345c72]"
            >
              {age}
            </span>
          ))}
          {data.gender && (
            <span className="rounded-xl border border-[#001f3d]/10 bg-[#f6f7fa] px-3 py-1 text-xs font-semibold capitalize text-[#345c72]">
              {data.gender}
            </span>
          )}
          {data.comp_levels?.slice(0, 1).map((level: string) => (
            <span
              key={level}
              className="rounded-xl border border-[#001f3d]/10 bg-[#f6f7fa] px-3 py-1 text-xs font-semibold capitalize text-[#345c72]"
            >
              {level}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-1">
          <a
            href={detailHref}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#e87a00] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_45px_-22px_rgba(232,122,0,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-24px_rgba(232,122,0,0.65)]"
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  )
}
