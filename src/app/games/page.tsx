'use client'

import { useState } from 'react'
import GameCard from '@/components/GameCard'
import CategoryPills from '@/components/CategoryPills'
import { games } from '@/data/games'

export const dynamic = 'force-dynamic'

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categories = Array.from(new Set(games.flatMap(game => game.categories)))

  const filteredGames = selectedCategory
    ? games.filter(game => game.categories.includes(selectedCategory))
    : games

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Games</h1>

      <div className="mb-6">
        <CategoryPills
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map(game => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </div>
  )
}