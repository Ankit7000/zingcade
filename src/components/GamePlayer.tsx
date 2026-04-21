'use client'

import { useEffect, useState } from 'react'
import { Game } from '@/data/games'

interface GamePlayerProps {
  game: Game
}

export default function GamePlayer({ game }: GamePlayerProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Track recently played
    const recent = JSON.parse(localStorage.getItem('zingcade-recent') || '[]')
    const filtered = recent.filter((slug: string) => slug !== game.slug)
    filtered.unshift(game.slug)
    localStorage.setItem('zingcade-recent', JSON.stringify(filtered.slice(0, 10)))
  }, [game.slug])

  return (
    <div className="arcade-card relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg z-10">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="text-cyan-400 font-medium">Loading {game.title}...</p>
          </div>
        </div>
      )}
      <iframe
        src={`/raw-games/${game.slug}/index.html`}
        className="w-full h-96 lg:h-[600px] rounded-lg"
        title={game.title}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}