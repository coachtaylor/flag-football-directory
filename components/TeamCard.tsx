export default function TeamCard({ t }: { t: any }) {
    return (
      <article className="card hover:shadow">
        <div className="aspect-video bg-gray-100 rounded overflow-hidden">
          {t.cover_url && <img src={t.cover_url} alt={t.name} className="w-full h-full object-cover" />}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="small uppercase text-gray-600">Team</span>
          {t.verified && <span className="small bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>}
        </div>
        <h3 className="font-semibold mt-1">{t.name}</h3>
        <p className="small text-gray-700">{t.city_name} • {t.state}</p>
        <p className="small text-gray-700">
          {t.age_groups?.join(' / ')} · {t.gender} · {t.comp_levels?.join('/')}
        </p>
        <a className="link mt-1 inline-block" href={`/teams/${t.slug}`}>View details</a>
      </article>
    )
  }
  