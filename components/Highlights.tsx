'use client'

import Link from 'next/link'

const COLLAGE_ITEMS = [
  {
    title: '7v7 Nationals',
    subtitle: 'Las Vegas, NV',
    accent: '#001f3d',
    background: '#f6f8fb',
    href: '/tournaments',
  },
  {
    title: 'Elite Youth Camp',
    subtitle: 'Atlanta, GA',
    accent: '#e87a00',
    background: '#fff3e5',
    href: '/clinics',
  },
  {
    title: 'Phoenix HS League',
    subtitle: 'Coming Feb 2026',
    accent: '#345c72',
    background: '#eef3f8',
    href: '/leagues',
  },
]

export default function Highlights() {
  return (
    <div className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#001f3d]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#001f3d]">
          <span className="w-2 h-2 rounded-full bg-[#e87a00]"></span>
          Featured Programs
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-[#001f3d] sm:text-4xl">
            Featured Programs
          </h2>
          <p className="text-lg text-[#345c72]/90 max-w-2xl mx-auto">
            Discover top-rated programs, tournaments, and leagues that are making waves in flag football
          </p>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {COLLAGE_ITEMS.map((card, index) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200/60 hover:border-[#001f3d]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full max-w-sm"
          >
            {/* Subtle color accent bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: card.accent }}
            />
            
            <div className="p-6 pt-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#345c72]/70 mb-2">Featured</p>
                  <h3 className="text-xl font-semibold text-[#001f3d] mb-1">{card.title}</h3>
                  <p className="text-sm text-[#345c72]">{card.subtitle}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="w-8 h-8 rounded-full bg-[#001f3d]/10 flex items-center justify-center group-hover:bg-[#e87a00] transition-colors">
                    <span className="text-sm font-medium text-[#001f3d] group-hover:text-white transition-colors">→</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div
                  className="h-32 rounded-xl border-2 border-dashed flex items-center justify-center"
                  style={{ 
                    borderColor: `${card.accent}40`, 
                    backgroundColor: `${card.background}` 
                  }}
                >
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: card.accent }}
                    >
                      <span className="text-white font-semibold text-lg">FF</span>
                    </div>
                    <p className="text-xs font-medium text-[#345c72]/80">Program Preview</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-sm font-medium text-[#345c72]/70 group-hover:text-[#e87a00] transition-colors">
                <span>Explore details</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
