'use client'

import { useEffect, useMemo, useState } from 'react'
import GameCard from '@/components/GameCard'
import CategoryPills from '@/components/CategoryPills'
import { games } from '@/data/games'

function readCategoryFromUrl(categories: string[]) {
  if (typeof window === 'undefined') {
    return null
  }

  const params = new URLSearchParams(window.location.search)
  const category = params.get('category')
  return category && categories.includes(category) ? category : null
}

export default function GamesPage() {
  const categories = useMemo(() => Array.from(new Set(games.flatMap(game => game.categories))), [])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const syncCategory = () => {
      setSelectedCategory(readCategoryFromUrl(categories))
    }

    syncCategory()
    window.addEventListener('popstate', syncCategory)

    return () => {
      window.removeEventListener('popstate', syncCategory)
    }
  }, [categories])

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)

    const params = new URLSearchParams(window.location.search)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    const query = params.toString()
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname
    window.history.replaceState({}, '', nextUrl)
  }

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
          onSelect={handleCategorySelect}
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
