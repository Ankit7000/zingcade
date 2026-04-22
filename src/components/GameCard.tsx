import Link from 'next/link'
import { Game } from '@/data/games'

interface GameCardProps {
  game: Game
  compact?: boolean
}

export default function GameCard({ game, compact = false }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`} className="block group">
      <div className={`arcade-card flex h-full flex-col bg-gray-900/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-cyan-400/60 group-hover:shadow-xl group-hover:shadow-cyan-400/20 ${compact ? 'gap-2 p-2' : 'gap-3 p-2.5 sm:gap-4 sm:p-4'}`}>
        <div className={`relative overflow-hidden rounded-xl bg-gray-800 ${compact ? 'aspect-[0.95]' : 'aspect-[4/3] sm:aspect-video'}`}>
          <img
            src={game.thumbnail}
            alt={game.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
          <div className={`absolute inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/20 font-semibold uppercase tracking-[0.18em] text-cyan-200 ${compact ? 'left-2 top-2 min-h-6 px-1.5 text-[8px]' : 'left-3 top-3 min-h-8 px-2.5 text-[10px]'}`}>
            {game.categories[0]}
          </div>
        </div>
        <div className={`flex flex-1 flex-col justify-between ${compact ? 'gap-1 px-0.5' : 'gap-2 px-1'}`}>
          <div className={compact ? 'space-y-1' : 'space-y-2'}>
            <h3 className={`line-clamp-2 font-bold leading-tight transition-colors group-hover:text-cyan-300 ${compact ? 'text-[11px] sm:text-sm lg:text-base' : 'text-base sm:text-lg'}`}>
              {game.title}
            </h3>
            {!compact && (
              <p className="line-clamp-2 text-xs leading-5 text-gray-400 sm:text-sm">
                {game.hook}
              </p>
            )}
          </div>
          {!compact && (
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
          )}
        </div>
      </div>
    </Link>
  )
}
