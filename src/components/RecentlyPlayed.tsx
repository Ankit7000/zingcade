'use client'

import { useState, useEffect } from 'react'
import GameCard from './GameCard'
import { Game, games } from '@/data/games'

export default function RecentlyPlayed() {
  const [recentGames, setRecentGames] = useState<Game[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('zingcade-recent')
    if (stored) {
      const slugs = JSON.parse(stored) as string[]
      const recent = slugs
        .map(slug => games.find(g => g.slug === slug))
        .filter(Boolean) as Game[]
      setRecentGames(recent.slice(0, 4))
    }
  }, [])

  if (recentGames.length === 0) {
    return (
      <div className="arcade-card p-4">
        <p className="text-gray-400">No recently played games. Start playing!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {recentGames.map(game => (
        <GameCard key={game.slug} game={game} />
      ))}
    </div>
  )
}
