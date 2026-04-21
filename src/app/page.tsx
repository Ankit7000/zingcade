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
    <div className="space-y-8">
      {/* Hero Section */}
      {featuredGame && <FeaturedGame game={featuredGame} />}

      {/* Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
        <CategoryPills categories={categories} />
      </section>

      {/* Popular Games */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Popular Games</h2>
        <GameRail games={popularGames} />
      </section>

      {/* Recently Played */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
        <RecentlyPlayed />
      </section>
    </div>
  )
}