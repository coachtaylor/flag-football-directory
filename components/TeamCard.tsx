// components/TeamCard.tsx
export default function TeamCard({ t }: { t: any }) {
  return (
    <article className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1">
      {/* Image */}
      <div className="aspect-video bg-gradient-to-br from-[#001f3d] to-[#345c72] relative overflow-hidden">
        {t.cover_url ? (
          <img src={t.cover_url} alt={t.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header with badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#001f3d]/5 text-[#001f3d]">
            Team
          </span>
          {t.verified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Team name */}
        <h3 className="text-lg font-semibold text-[#001f3d] mb-2 line-clamp-2 group-hover:text-[#e87a00] transition-colors">
          {t.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-[#345c72] mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{t.city_name}, {t.state}</span>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-2 mb-4">
          {t.age_groups?.slice(0, 3).map((age: string) => (
            <span key={age} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-50 text-[#345c72] border border-gray-100">
              {age}
            </span>
          ))}
          {t.gender && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-50 text-[#345c72] border border-gray-100 capitalize">
              {t.gender}
            </span>
          )}
          {t.comp_levels?.slice(0, 1).map((level: string) => (
            <span key={level} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-50 text-[#345c72] border border-gray-100 capitalize">
              {level}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a 
          href={`/teams/${t.slug}`} 
          className="block w-full text-center px-4 py-2.5 bg-[#e87a00] text-white font-semibold rounded-xl hover:bg-[#e87a00]/90 transition-all shadow-md shadow-[#e87a00]/20 hover:shadow-lg hover:shadow-[#e87a00]/30"
        >
          View Details
        </a>
      </div>
    </article>
  )
}