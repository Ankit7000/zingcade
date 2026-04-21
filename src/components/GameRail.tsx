import GameCard from './GameCard'
import { Game } from '@/data/games'

interface GameRailProps {
  games: Game[]
}

export default function GameRail({ games }: GameRailProps) {
  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {games.map(game => (
        <div key={game.slug} className="flex-shrink-0 w-64">
          <GameCard game={game} />
        </div>
      ))}
    </div>
  )
}