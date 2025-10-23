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
  const Wrapper = ({ children }: { children: any }) => (
    <div className={`card hover:shadow ${view === 'list' ? 'flex items-start gap-4' : ''}`}>{children}</div>
  )

  return (
    <Wrapper>
      {/* cover */}
      <div className={`${view === 'list' ? 'w-48' : 'aspect-video'} bg-gray-100 rounded overflow-hidden`}>
        {item.cover_url && <img src={item.cover_url} alt={item.name} className="w-full h-full object-cover" />}
      </div>

      {/* meta */}
      <div className="grid gap-1">
        <div className="flex items-center justify-between">
          <span className="small uppercase tracking-wide text-gray-600">{item.type}</span>
          {item.verified && <span className="small bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>}
        </div>
        <h3 className="font-semibold">{item.name}</h3>
        <p className="small text-gray-700">
          {item.city_name ? `${item.city_name} • ${item.state}` : item.state}
          {item.location ? ` • ${item.location}` : ''}
          {item.date_str ? ` • ${item.date_str}` : ''}
        </p>
        {item.spec && <p className="small text-gray-700">{item.spec}</p>}
        <div className="mt-1">
          {item.detail_href && <a className="link" href={item.detail_href}>View details</a>}
          {item.signup_url && <a className="link ml-2" target="_blank" href={item.signup_url}>Sign up</a>}
          {item.website && <a className="link ml-2" target="_blank" rel="noopener" href={item.website}>Website</a>}
        </div>
      </div>
    </Wrapper>
  )
}
