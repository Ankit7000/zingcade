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
    <div className="container mx-auto space-y-4 px-4 py-4 sm:space-y-5 sm:py-6">
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Arcade Shelf</p>
        <h1 className="text-2xl font-bold sm:text-3xl">All Games</h1>
      </div>

      <div>
        <CategoryPills
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
        <span>{selectedCategory ?? 'All categories'}</span>
        <span>{filteredGames.length} games</span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 xl:grid-cols-6">
        {filteredGames.map(game => (
          <GameCard key={game.slug} game={game} compact />
        ))}
      </div>
    </div>
  )
}
