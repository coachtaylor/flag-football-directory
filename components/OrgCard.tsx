// components/OrgCard.tsx
export default function OrgCard({ o }: { o: any }) {
  // Determine gradient colors based on type
  const getGradientColors = () => {
    switch(o.type?.toLowerCase()) {
      case 'clinic':
        return 'from-[#345c72] to-[#001f3d]'
      case 'tournament':
        return 'from-[#e87a00] to-[#345c72]'
      default:
        return 'from-[#001f3d] to-[#345c72]'
    }
  }

  const getBadgeColor = () => {
    switch(o.type?.toLowerCase()) {
      case 'clinic':
        return 'bg-[#345c72]/5 text-[#345c72]'
      case 'tournament':
        return 'bg-[#e87a00]/5 text-[#e87a00]'
      default:
        return 'bg-[#001f3d]/5 text-[#001f3d]'
    }
  }

  return (
    <article className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1">
      {/* Image */}
      <div className={`aspect-video bg-gradient-to-br ${getGradientColors()} relative overflow-hidden`}>
        {o.cover_url ? (
          <img src={o.cover_url} alt={o.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {o.type === 'Clinic' ? (
              <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            ) : (
              <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header with badges */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
            {o.type}
          </span>
          {o.verified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-[#001f3d] mb-2 line-clamp-2 group-hover:text-[#e87a00] transition-colors">
          {o.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-[#345c72] mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{o.city_name ? `${o.city_name}, ${o.state}` : o.state}</span>
        </div>

        {/* CTA */}
        <a 
          href={`/${o.type.toLowerCase()}s/${o.slug || o.id}`} 
          className="block w-full text-center px-4 py-2.5 bg-[#e87a00] text-white font-semibold rounded-xl hover:bg-[#e87a00]/90 transition-all shadow-md shadow-[#e87a00]/20 hover:shadow-lg hover:shadow-[#e87a00]/30"
        >
          View Details
        </a>
      </div>
    </article>
  )
}