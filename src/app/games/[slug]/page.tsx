import { notFound } from 'next/navigation'
import GamePlayer from '@/components/GamePlayer'
import GameMeta from '@/components/GameMeta'
import RelatedGames from '@/components/RelatedGames'
import { games } from '@/data/games'

interface GamePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }))
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params
  const game = games.find(g => g.slug === slug)

  if (!game) {
    notFound()
  }

  const relatedGames = games
    .filter(g => g.slug !== game.slug && g.categories.some(cat => game.categories.includes(cat)))
    .slice(0, 4)

  return (
    <div className="container mx-auto px-4 pb-10 pt-3 sm:py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Game Player */}
        <div className="min-w-0 lg:col-span-2">
          <GamePlayer game={game} />
        </div>

        {/* Game Meta */}
        <div className="space-y-6 lg:pt-2">
          <GameMeta game={game} />
        </div>
      </div>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <section className="mt-8 space-y-4 sm:mt-12">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Next Up</p>
            <h2 className="text-2xl font-bold">You Might Also Like</h2>
          </div>
          <RelatedGames games={relatedGames} />
        </section>
      )}
    </div>
  )
}
