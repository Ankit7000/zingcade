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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Player */}
        <div className="lg:col-span-2">
          <GamePlayer game={game} />
        </div>

        {/* Game Meta */}
        <div className="space-y-6">
          <GameMeta game={game} />
        </div>
      </div>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
          <RelatedGames games={relatedGames} />
        </section>
      )}
    </div>
  )
}