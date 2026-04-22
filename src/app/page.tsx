import FeaturedGame from '@/components/FeaturedGame'
import GameRail from '@/components/GameRail'
import CategoryPills from '@/components/CategoryPills'
import RecentlyPlayed from '@/components/RecentlyPlayed'
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
          <p className="max-w-2xl text-sm leading-6 text-gray-400">Pick a mood, tap a cabinet, and get into a run fast.</p>
        </div>
        <CategoryPills categories={categories} />
      </section>

      {/* Popular Games */}
      <section className="container mx-auto space-y-4 px-4">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Popular Right Now</p>
          <h2 className="text-2xl font-bold">Popular Games</h2>
        </div>
        <GameRail games={popularGames} />
      </section>

      {/* Recently Played */}
      <section className="container mx-auto space-y-4 px-4">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Continue Fast</p>
          <h2 className="text-2xl font-bold">Recently Played</h2>
        </div>
        <RecentlyPlayed />
      </section>
    </div>
  )
}
