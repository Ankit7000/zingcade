import GameCard from './GameCard'
import { Game } from '@/data/games'

interface RelatedGamesProps {
  games: Game[]
}

export default function RelatedGames({ games }: RelatedGamesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {games.map(game => (
        <GameCard key={game.slug} game={game} />
      ))}
    </div>
  )
}