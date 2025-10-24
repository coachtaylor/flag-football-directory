import Hero from '@/components/Hero'
import Highlights from '@/components/Highlights'
import StatesGrid from '@/components/StatesGrid'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
          <Highlights />
        </div>
      </div>
      <div className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
          <StatesGrid />
        </div>
      </div>
    </div>
  )
}
