import Link from 'next/link'
import { Game } from '@/data/games'

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`} className="block group">
      <div className="arcade-card flex h-full flex-col gap-3 bg-gray-900/30 p-2.5 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-cyan-400/60 group-hover:shadow-xl group-hover:shadow-cyan-400/20 sm:gap-4 sm:p-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-800 sm:aspect-video">
          <img
            src={game.thumbnail}
            alt={game.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute left-3 top-3 inline-flex min-h-8 items-center rounded-full border border-cyan-400/30 bg-cyan-500/20 px-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
            {game.categories[0]}
          </div>
          <div className="absolute bottom-3 right-3 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
            <div className="rounded-full bg-cyan-400/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black sm:text-xs">
              PLAY
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-2 px-1">
          <div className="space-y-2">
            <h3 className="line-clamp-2 text-base font-bold leading-tight transition-colors group-hover:text-cyan-300 sm:text-lg">
              {game.title}
            </h3>
            <p className="line-clamp-2 text-xs leading-5 text-gray-400 sm:text-sm">
              {game.hook}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="hidden flex-wrap gap-1 sm:flex">
              {game.categories.slice(0, 2).map(category => (
                <span
                  key={category}
                  className="rounded-md border border-cyan-500/30 bg-cyan-500/20 px-2 py-1 text-xs font-medium text-cyan-400"
                >
                  {category}
                </span>
              ))}
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Tap to play
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
