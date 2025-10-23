import Hero from '@/components/Hero'
import StatesGrid from '@/components/StatesGrid'

export default function HomePage() {
  return (
    <div className="grid gap-12">
      <Hero />
      <StatesGrid />
    </div>
  )
}
