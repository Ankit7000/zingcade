import GameCard from './GameCard'
import { Game } from '@/data/games'

interface GameRailProps {
  games: Game[]
}

export default function GameRail({ games }: GameRailProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:hidden">
        <span>Swipe to browse</span>
        <span>{games.length} picks</span>
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scroll-smooth hide-scrollbar sm:mx-0 sm:gap-6 sm:px-0">
        {games.map(game => (
          <div key={game.slug} className="w-[76vw] max-w-[18rem] flex-shrink-0 snap-start sm:w-64">
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  )
}
