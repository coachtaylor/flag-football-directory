// components/Breadcrumbs.tsx
'use client'
import Link from 'next/link'

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav 
      className={`flex items-center gap-3 text-sm text-[#345c72]/80 py-4 ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Home Link */}
      <Link 
        href="/" 
        className="flex items-center gap-2 text-[#345c72]/80 hover:text-[#001f3d] transition-colors group"
      >
        <HomeIcon />
        <span className="font-medium group-hover:text-[#001f3d] group-hover:underline">Home</span>
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-3">
            {/* Separator */}
            <div className="text-[#345c72]/40">
              <ChevronRightIcon />
            </div>

            {/* Breadcrumb Item */}
            {isLast || !item.href ? (
              <span className="text-[#001f3d] font-semibold">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href} 
                className="text-[#345c72]/80 hover:text-[#001f3d] transition-colors font-medium hover:underline"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
