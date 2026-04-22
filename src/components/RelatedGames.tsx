import GameCard from './GameCard'
import { Game } from '@/data/games'

interface RelatedGamesProps {
  games: Game[]
}

export default function RelatedGames({ games }: RelatedGamesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {games.map(game => (
        <GameCard key={game.slug} game={game} />
      ))}
    </div>
  )
}
