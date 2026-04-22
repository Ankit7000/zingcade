import Link from 'next/link'
import { Game } from '@/data/games'

interface HomeGameWallProps {
  games: Game[]
}

export default function HomeGameWall({ games }: HomeGameWallProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {games.map((game) => (
        <Link
          key={game.slug}
          href={`/games/${game.slug}`}
          className="group relative overflow-hidden rounded-[22px] border border-white/8 bg-slate-900/70 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.9)] transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-300/35"
        >
          <div className="aspect-[0.94] w-full overflow-hidden">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
          <div className="absolute left-3 top-3 inline-flex rounded-full border border-white/12 bg-slate-950/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
            {game.categories[0]}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <div className="space-y-1">
              <h3 className="text-base font-bold leading-tight text-white sm:text-lg">
                {game.title}
              </h3>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-100/80">
                Play now
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
