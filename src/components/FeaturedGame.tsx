import Link from 'next/link'
import { Game } from '@/data/games'

interface FeaturedGameProps {
  game: Game
}

export default function FeaturedGame({ game }: FeaturedGameProps) {
  return (
    <section className="relative bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-cyan-400 mb-4">
                {game.title}
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                {game.hook}
              </p>
              <p className="text-gray-400 mb-8">
                {game.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {game.categories.map(category => (
                <span
                  key={category}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
            <Link
              href={`/games/${game.slug}`}
              className="inline-block bg-cyan-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-cyan-400 transition-colors"
            >
              Play Now
            </Link>
          </div>
          <div className="relative arcade-card group cursor-pointer">
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="bg-cyan-400/90 text-black px-6 py-3 rounded-lg font-bold text-lg hover:bg-cyan-400 transition-colors">
                  PLAY NOW
                </div>
                <div className="text-white/80 text-sm">
                  Click to start playing
                </div>
              </div>
            </div>
            <Link href={`/games/${game.slug}`} className="absolute inset-0" />
          </div>
        </div>
      </div>
    </section>
  )
}