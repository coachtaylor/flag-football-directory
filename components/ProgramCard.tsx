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
    bg: 'bg-[#001f3d]',
    badge: 'bg-[#001f3d]',
    text: 'text-[#001f3d]',
    icon: '👥'
  },
  league: {
    bg: 'bg-[#345c72]',
    badge: 'bg-[#345c72]',
    text: 'text-[#345c72]',
    icon: '🚩'
  },
  clinic: {
    bg: 'bg-[#e87a00]',
    badge: 'bg-[#e87a00]',
    text: 'text-[#e87a00]',
    icon: '📚'
  },
  tournament: {
    bg: 'bg-[#001f3d]',
    badge: 'bg-[#001f3d]',
    text: 'text-[#001f3d]',
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
      className="group block bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100"
    >
      {/* Image or colored header */}
      <div className={`relative h-48 ${style.bg}`}>
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl opacity-20">{style.icon}</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <span className={`${style.badge} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
          {verified && (
            <span className="bg-white text-[#001f3d] px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
              <svg className="w-4 h-4 text-[#e87a00]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-[#f6f6f6]">
        <h3 className="text-xl font-bold text-[#001f3d] mb-2 group-hover:text-[#345c72]">
          {name}
        </h3>
        
        {(location || state) && (
          <div className="flex items-center gap-2 text-[#345c72] mb-4">
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
                className="px-3 py-1.5 bg-white text-[#345c72] rounded-full text-sm font-medium"
              >
                {detail}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-[#345c72] font-medium">View Details</span>
          <svg className="w-5 h-5 text-[#345c72] group-hover:text-[#001f3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}