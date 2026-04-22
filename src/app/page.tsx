import FeaturedGame from '@/components/FeaturedGame'
import HomeCategoryStrip from '@/components/HomeCategoryStrip'
import HomeGameWall from '@/components/HomeGameWall'
import Link from 'next/link'
import { games } from '@/data/games'

export default function Home() {
  const featuredGame = games.find(game => game.featured)
  const wallGames = [...games.filter(game => !game.featured), ...games.filter(game => game.featured)]

  return (
    <div className="pb-12">
      {featuredGame && <FeaturedGame game={featuredGame} />}

      <div className="container mx-auto space-y-4 px-4 pt-3 sm:space-y-5 sm:pt-4">
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Arcade floor</p>
              <h2 className="text-lg font-bold text-white sm:text-xl">Pick a cabinet and jump in</h2>
            </div>
            <Link
              href="/games"
              className="hidden min-h-11 items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 text-sm font-semibold text-cyan-200 transition-colors hover:border-cyan-300/60 hover:bg-cyan-400/15 sm:inline-flex"
            >
              See All Games
            </Link>
          </div>
          <HomeGameWall games={wallGames} />
          <Link
            href="/games"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-300/60 hover:bg-cyan-400/15 sm:hidden"
          >
            See All Games
          </Link>
        </section>

        <section className="space-y-2.5">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Quick lanes</p>
            <h2 className="text-lg font-bold text-white sm:text-xl">Find a lane fast</h2>
          </div>
          <HomeCategoryStrip />
        </section>
      </div>
    </div>
  )
}
