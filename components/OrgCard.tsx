export default function OrgCard({ o }: { o: any }) {
    return (
      <article className="card hover:shadow">
        <div className="aspect-video bg-gray-100 rounded overflow-hidden">
          {o.cover_url && <img src={o.cover_url} alt={o.name} className="w-full h-full object-cover" />}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="small uppercase text-gray-600">{o.type}</span>
          {o.verified && <span className="small bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>}
        </div>
        <h3 className="font-semibold mt-1">{o.name}</h3>
        <p className="small text-gray-700">{o.city_name ? `${o.city_name} • ${o.state}` : o.state}</p>
        <a className="link mt-1 inline-block" href={`/${o.type.toLowerCase()}s/${o.slug || o.id}`}>View details</a>
      </article>
    )
  }
  