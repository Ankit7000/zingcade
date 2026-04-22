import Link from 'next/link'
import { Game } from '@/data/games'

interface HomeGameWallProps {
  games: Game[]
}

export default function HomeGameWall({ games }: HomeGameWallProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {games.map((game) => (
        <Link
          key={game.slug}
          href={`/games/${game.slug}`}
          className="group relative overflow-hidden rounded-[18px] border border-white/8 bg-slate-900/70 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.9)] transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-300/35"
        >
          <div className="aspect-[0.95] w-full overflow-hidden">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
          <div className="absolute left-2 top-2 inline-flex rounded-full border border-white/12 bg-slate-950/75 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-cyan-100 sm:left-2.5 sm:top-2.5 sm:px-2 sm:text-[9px]">
            {game.categories[0]}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5">
            <div className="space-y-0.5">
              <h3 className="text-[11px] font-bold leading-tight text-white sm:text-sm lg:text-base">
                {game.title}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
