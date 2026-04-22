import FeaturedGame from '@/components/FeaturedGame'
import GameRail from '@/components/GameRail'
import CategoryPills from '@/components/CategoryPills'
import Link from 'next/link'
import { games } from '@/data/games'

export default function Home() {
  const featuredGame = games.find(game => game.featured)
  const popularGames = games.filter(game => !game.featured).slice(0, 6)
  const categories = Array.from(new Set(games.flatMap(game => game.categories)))

  return (
    <div className="space-y-8 pb-10 sm:space-y-10">
      {/* Hero Section */}
      {featuredGame && <FeaturedGame game={featuredGame} />}

      {/* Categories */}
      <section className="container mx-auto space-y-4 px-4">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Jump Straight In</p>
          <h2 className="text-2xl font-bold">Browse by Category</h2>
        </div>
        <CategoryPills categories={categories} />
      </section>

      {/* Popular Games */}
      <section className="container mx-auto space-y-4 px-4">
        <div className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Popular Right Now</p>
              <h2 className="text-2xl font-bold">Popular Games</h2>
            </div>
            <Link
              href="/games"
              className="hidden min-h-11 items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 text-sm font-semibold text-cyan-200 transition-colors hover:border-cyan-300/60 hover:bg-cyan-400/15 sm:inline-flex"
            >
              See All Games
            </Link>
          </div>
        </div>
        <GameRail games={popularGames} />
        <Link
          href="/games"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-300/60 hover:bg-cyan-400/15 sm:hidden"
        >
          See All Games
        </Link>
      </section>
    </div>
  )
}
