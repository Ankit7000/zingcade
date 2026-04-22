import Link from 'next/link'
import { Game } from '@/data/games'

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`} className="block group">
      <div className="arcade-card bg-gray-900/30 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-400/20 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 flex flex-col h-full">
        <div className="aspect-video bg-gray-800 rounded-lg mb-4 overflow-hidden relative">
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-cyan-400/90 text-black px-2 py-1 rounded text-xs font-bold">
              PLAY
            </div>
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
          {game.title}
        </h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {game.hook}
        </p>
        <div className="flex flex-wrap gap-1">
          {game.categories.slice(0, 2).map(category => (
            <span
              key={category}
              className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-md text-xs font-medium border border-cyan-500/30"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}