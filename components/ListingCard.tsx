// components/ListingCard.tsx
type Props = {
  item: {
    type: string
    name: string
    state?: string
    city_name?: string
    location?: string | null
    date_str?: string
    spec?: string
    verified?: boolean
    cover_url?: string
    detail_href?: string
    signup_url?: string
    website?: string
  }
  view?: 'grid' | 'list'
}

export default function ListingCard({ item, view = 'grid' }: Props) {
  const getGradientColors = () => {
    switch(item.type?.toLowerCase()) {
      case 'clinic':
        return 'from-[#345c72] to-[#001f3d]'
      case 'tournament':
        return 'from-[#e87a00] to-[#345c72]'
      case 'league':
        return 'from-[#001f3d] to-[#345c72]'
      case 'team':
        return 'from-[#001f3d] to-[#345c72]'
      case 'city':
        return 'from-[#345c72] to-[#e87a00]'
      default:
        return 'from-[#001f3d] to-[#345c72]'
    }
  }

  const getBadgeColor = () => {
    switch(item.type?.toLowerCase()) {
      case 'clinic':
        return 'bg-[#345c72]/5 text-[#345c72]'
      case 'tournament':
        return 'bg-[#e87a00]/5 text-[#e87a00]'
      case 'league':
        return 'bg-[#001f3d]/5 text-[#001f3d]'
      case 'team':
        return 'bg-[#001f3d]/5 text-[#001f3d]'
      case 'city':
        return 'bg-[#345c72]/5 text-[#345c72]'
      default:
        return 'bg-[#001f3d]/5 text-[#001f3d]'
    }
  }

  if (view === 'list') {
    return (
      <article className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200">
        <div className="flex items-start gap-4 p-5">
          {/* Image */}
          <div className={`w-48 aspect-video bg-gradient-to-br ${getGradientColors()} rounded-xl overflow-hidden flex-shrink-0`}>
            {item.cover_url && <img src={item.cover_url} alt={item.name} className="w-full h-full object-cover" />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
                {item.type}
              </span>
              {item.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-[#001f3d] mb-1 group-hover:text-[#e87a00] transition-colors">
              {item.name}
            </h3>
            <p className="text-sm text-[#345c72] mb-2">
              {item.city_name ? `${item.city_name}, ${item.state}` : item.state}
              {item.location ? ` • ${item.location}` : ''}
              {item.date_str ? ` • ${item.date_str}` : ''}
            </p>
            {item.spec && <p className="text-sm text-[#345c72]/80 mb-3">{item.spec}</p>}
            <div className="flex gap-2">
              {item.detail_href && (
                <a className="text-sm font-medium text-[#e87a00] hover:text-[#e87a00]/80 transition-colors" href={item.detail_href}>
                  View details →
                </a>
              )}
              {item.signup_url && (
                <a className="text-sm font-medium text-[#e87a00] hover:text-[#e87a00]/80 transition-colors" target="_blank" href={item.signup_url}>
                  Sign up →
                </a>
              )}
              {item.website && (
                <a className="text-sm font-medium text-[#e87a00] hover:text-[#e87a00]/80 transition-colors" target="_blank" rel="noopener" href={item.website}>
                  Website →
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    )
  }

  // Grid view
  return (
    <article className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1">
      {/* Image */}
      <div className={`aspect-video bg-gradient-to-br ${getGradientColors()} relative overflow-hidden`}>
        {item.cover_url && (
          <img src={item.cover_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
            {item.type}
          </span>
          {item.verified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-[#001f3d] mb-2 line-clamp-2 group-hover:text-[#e87a00] transition-colors">
          {item.name}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-[#345c72] mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>
            {item.city_name ? `${item.city_name}, ${item.state}` : item.state}
            {item.location ? ` • ${item.location}` : ''}
            {item.date_str ? ` • ${item.date_str}` : ''}
          </span>
        </div>
        {item.spec && <p className="text-sm text-[#345c72]/80 mb-4 line-clamp-2">{item.spec}</p>}
        <div className="flex flex-col gap-2">
          {item.detail_href && (
            <a 
              href={item.detail_href}
              className="block w-full text-center px-4 py-2.5 bg-[#e87a00] text-white font-semibold rounded-xl hover:bg-[#e87a00]/90 transition-all shadow-md shadow-[#e87a00]/20 hover:shadow-lg hover:shadow-[#e87a00]/30"
            >
              View Details
            </a>
          )}
          {item.signup_url && !item.detail_href && (
            <a 
              href={item.signup_url}
              target="_blank"
              className="block w-full text-center px-4 py-2.5 bg-[#e87a00] text-white font-semibold rounded-xl hover:bg-[#e87a00]/90 transition-all shadow-md shadow-[#e87a00]/20 hover:shadow-lg hover:shadow-[#e87a00]/30"
            >
              Sign Up
            </a>
          )}
          {item.website && !item.detail_href && !item.signup_url && (
            <a 
              href={item.website}
              target="_blank"
              rel="noopener"
              className="block w-full text-center px-4 py-2.5 bg-[#e87a00] text-white font-semibold rounded-xl hover:bg-[#e87a00]/90 transition-all shadow-md shadow-[#e87a00]/20 hover:shadow-lg hover:shadow-[#e87a00]/30"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>
    </article>
  )
}