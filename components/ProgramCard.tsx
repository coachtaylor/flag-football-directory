// components/ProgramCard.tsx
import Link from 'next/link'

type ProgramCardProps = {
  type: 'team' | 'league' | 'clinic' | 'tournament'
  name: string
  location?: string
  state?: string
  details?: string[]
  verified?: boolean
  href: string
  image?: string
}

const cardStyles = {
  team: {
    bg: 'rgb(var(--color-secondary-900))',
    badge: 'rgb(var(--color-secondary-900))',
    text: 'rgb(var(--color-secondary-900))',
    icon: '👥'
  },
  league: {
    bg: 'rgb(var(--color-accent-600))',
    badge: 'rgb(var(--color-accent-600))',
    text: 'rgb(var(--color-accent-600))',
    icon: '🚩'
  },
  clinic: {
    bg: 'rgb(var(--color-primary-600))',
    badge: 'rgb(var(--color-primary-600))',
    text: 'rgb(var(--color-primary-600))',
    icon: '📚'
  },
  tournament: {
    bg: 'rgb(var(--color-secondary-700))',
    badge: 'rgb(var(--color-secondary-700))',
    text: 'rgb(var(--color-secondary-700))',
    icon: '🏆'
  }
}

export default function ProgramCard({ 
  type, 
  name, 
  location, 
  state, 
  details = [], 
  verified = false, 
  href,
  image 
}: ProgramCardProps) {
  const style = cardStyles[type]
  
  return (
    <Link 
      href={href}
      className="group block bg-gradient-to-br from-white to-primary-50/30 rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-primary-200 hover:border-primary-300 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image or colored header with gradient */}
      <div className="relative h-48 overflow-hidden" style={{ background: `linear-gradient(135deg, ${style.bg}, ${style.bg}dd)` }}>
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl opacity-30 group-hover:opacity-40 transition-opacity duration-300">{style.icon}</span>
          </div>
        )}
        
        {/* Enhanced badges with gradients */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <span className="text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg bg-gradient-to-r from-black/20 to-black/40 backdrop-blur-sm" style={{ backgroundColor: style.badge }}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
          {verified && (
            <span className="bg-gradient-to-r from-white to-primary-50 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 text-secondary-800">
              <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Enhanced content with better gradients */}
      <div className="p-6 bg-gradient-to-br from-white via-primary-50/20 to-accent-50/10">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-700 transition-colors duration-300 text-secondary-900">
          {name}
        </h3>
        
        {(location || state) && (
          <div className="flex items-center gap-2 mb-4 text-accent-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="font-medium">{location}{location && state ? ', ' : ''}{state}</span>
          </div>
        )}

        {details.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {details.slice(0, 3).map((detail, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1.5 bg-gradient-to-r from-white to-primary-50 rounded-full text-sm font-medium text-accent-600 border border-primary-200"
              >
                {detail}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-primary-200">
          <span className="font-medium text-accent-600 group-hover:text-primary-600 transition-colors duration-300">View Details</span>
          <svg className="w-5 h-5 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'rgb(var(--color-accent-600))' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}