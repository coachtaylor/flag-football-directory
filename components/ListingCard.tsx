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
        return 'from-accent-600 to-secondary-900'
      case 'tournament':
        return 'from-primary-600 to-accent-600'
      case 'league':
        return 'from-secondary-900 to-accent-600'
      case 'team':
        return 'from-secondary-900 to-accent-600'
      case 'city':
        return 'from-accent-600 to-primary-600'
      default:
        return 'from-secondary-900 to-accent-600'
    }
  }

  const badgeClass = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-900'

  if (view === 'list') {
    return (
      <article className="group bg-surface border-2 border-base rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-secondary-300">
        <div className="flex items-start gap-4 p-5">
          {/* Image */}
          <div className={`w-48 aspect-video bg-gradient-to-br ${getGradientColors()} rounded-xl overflow-hidden flex-shrink-0`}>
            {item.cover_url && <img src={item.cover_url} alt={item.name} className="w-full h-full object-cover" />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className={badgeClass}>
                {item.type}
              </span>
              {item.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-1 group-hover:text-primary-600 transition-colors" style={{ color: 'rgb(var(--color-secondary-900))' }}>
              {item.name}
            </h3>
            <p className="text-sm mb-2" style={{ color: 'rgb(var(--color-accent-600))' }}>
              {item.city_name ? `${item.city_name}, ${item.state}` : item.state}
              {item.location ? ` • ${item.location}` : ''}
              {item.date_str ? ` • ${item.date_str}` : ''}
            </p>
            {item.spec && <p className="text-sm mb-3" style={{ color: 'rgb(var(--color-accent-600) / 0.8)' }}>{item.spec}</p>}
            <div className="flex gap-2">
              {item.detail_href && (
                <a className="text-sm font-medium hover:opacity-80 transition-colors" style={{ color: 'rgb(var(--color-primary-600))' }} href={item.detail_href}>
                  View details →
                </a>
              )}
              {item.signup_url && (
                <a className="text-sm font-medium hover:opacity-80 transition-colors" style={{ color: 'rgb(var(--color-primary-600))' }} target="_blank" href={item.signup_url}>
                  Sign up →
                </a>
              )}
              {item.website && (
                <a className="text-sm font-medium hover:opacity-80 transition-colors" style={{ color: 'rgb(var(--color-primary-600))' }} target="_blank" rel="noopener" href={item.website}>
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
    <article className="group bg-surface border-2 border-base rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-secondary-300 hover:-translate-y-1">
      {/* Image */}
      <div className={`aspect-video bg-gradient-to-br ${getGradientColors()} relative overflow-hidden`}>
        {item.cover_url && (
          <img src={item.cover_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className={badgeClass}>
            {item.type}
          </span>
          {item.verified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors" style={{ color: 'rgb(var(--color-secondary-900))' }}>
          {item.name}
        </h3>
        <div className="flex items-center gap-1.5 text-sm mb-2" style={{ color: 'rgb(var(--color-accent-600))' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>
            {item.city_name ? `${item.city_name}, ${item.state}` : item.state}
            {item.location ? ` • ${item.location}` : ''}
            {item.date_str ? ` • ${item.date_str}` : ''}
          </span>
        </div>
        {item.spec && <p className="text-sm mb-4 line-clamp-2" style={{ color: 'rgb(var(--color-accent-600) / 0.8)' }}>{item.spec}</p>}
        <div className="flex flex-col gap-2">
          {item.detail_href && (
            <a 
              href={item.detail_href}
              className="btn btn-primary w-full justify-center"
            >
              View Details
            </a>
          )}
          {item.signup_url && !item.detail_href && (
            <a 
              href={item.signup_url}
              target="_blank"
              className="btn btn-primary w-full justify-center"
            >
              Sign Up
            </a>
          )}
          {item.website && !item.detail_href && !item.signup_url && (
            <a 
              href={item.website}
              target="_blank"
              rel="noopener"
              className="btn btn-primary w-full justify-center"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
