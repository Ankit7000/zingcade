'use client'

import { useEffect, useState } from 'react'
import { Game } from '@/data/games'

interface GamePlayerProps {
  game: Game
}

const DEFAULT_FRAME_HEIGHT = 720

function clampFrameHeight(height: number, viewportHeight: number) {
  const minHeight = viewportHeight > 0 && viewportHeight < 720 ? 480 : 560
  const maxHeight = viewportHeight > 0
    ? Math.min(940, Math.max(620, viewportHeight - 120))
    : 900

  return Math.max(minHeight, Math.min(Math.ceil(height), maxHeight))
}

export default function GamePlayer({ game }: GamePlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [frameHeight, setFrameHeight] = useState(DEFAULT_FRAME_HEIGHT)

  useEffect(() => {
    setIsLoading(true)
    setFrameHeight(DEFAULT_FRAME_HEIGHT)
  }, [game.slug])

  useEffect(() => {
    // Track recently played
    const recent = JSON.parse(localStorage.getItem('zingcade-recent') || '[]')
    const filtered = recent.filter((slug: string) => slug !== game.slug)
    filtered.unshift(game.slug)
    localStorage.setItem('zingcade-recent', JSON.stringify(filtered.slice(0, 10)))
  }, [game.slug])

  useEffect(() => {
    const handleEmbedSize = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return
      }

      const data = event.data
      if (!data || data.type !== 'zingcade:embed-size' || data.slug !== game.slug) {
        return
      }

      if (typeof data.height !== 'number' || Number.isNaN(data.height)) {
        return
      }

      setFrameHeight(clampFrameHeight(data.height, window.innerHeight))
    }

    const handleResize = () => {
      setFrameHeight((currentHeight) => clampFrameHeight(currentHeight, window.innerHeight))
    }

    handleResize()
    window.addEventListener('message', handleEmbedSize)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('message', handleEmbedSize)
      window.removeEventListener('resize', handleResize)
    }
  }, [game.slug])

  return (
    <div className="arcade-card relative p-3 sm:p-4 lg:p-5">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg z-10">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="text-cyan-400 font-medium">Loading {game.title}...</p>
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-[720px]">
        <iframe
          src={`/raw-games/${game.slug}/index.html?embed=1`}
          className="block w-full rounded-xl border-0 bg-transparent transition-[height] duration-300"
          style={{ height: `${frameHeight}px` }}
          title={game.title}
          onLoad={() => setIsLoading(false)}
          allowFullScreen
        />
      </div>
    </div>
  )
}
