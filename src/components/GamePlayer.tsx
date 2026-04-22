'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Game } from '@/data/games'

interface GamePlayerProps {
  game: Game
}

const DEFAULT_FRAME_HEIGHT = 720

function clampFrameHeight(height: number, viewportHeight: number) {
  const minHeight = viewportHeight > 0 && viewportHeight < 720
    ? Math.max(500, viewportHeight - 112)
    : 560
  const maxHeight = viewportHeight > 0
    ? Math.min(940, Math.max(580, viewportHeight - (viewportHeight < 720 ? 76 : 120)))
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
    <div className="relative space-y-4 sm:space-y-5">
      <div className="space-y-3 sm:hidden">
        <div className="flex items-center justify-between gap-3 px-1 text-sm">
          <Link href="/games" className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-gray-900/70 px-3 py-2 text-cyan-300">
            <span aria-hidden="true">&larr;</span>
            <span>Games</span>
          </Link>
          <a
            href={`/raw-games/${game.slug}/index.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-300"
          >
            Fullscreen
          </a>
        </div>
        <div className="space-y-3 px-1">
          <div className="flex flex-wrap gap-2">
            {game.categories.slice(0, 2).map(category => (
              <span
                key={category}
                className="inline-flex min-h-8 items-center rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold leading-tight text-white">{game.title}</h1>
            <p className="text-sm leading-6 text-gray-400">{game.hook}</p>
          </div>
        </div>
      </div>

      <div className="relative sm:arcade-card sm:p-3 lg:p-4">
        <div className="-mx-4 sm:mx-auto sm:w-full sm:max-w-[860px]">
          <div className="relative overflow-hidden border-y border-cyan-500/10 bg-black shadow-[0_24px_70px_-26px_rgba(34,211,238,0.45)] sm:rounded-[28px] sm:border sm:border-cyan-500/20">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm">
                <div className="space-y-4 px-6 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400"></div>
                  <p className="font-medium text-cyan-300">Loading {game.title}...</p>
                </div>
              </div>
            )}
            <iframe
              src={`/raw-games/${game.slug}/index.html?embed=1`}
              className="block w-full border-0 bg-transparent transition-[height] duration-300 sm:rounded-[28px]"
              style={{ height: `${frameHeight}px` }}
              title={game.title}
              onLoad={() => setIsLoading(false)}
              allowFullScreen
            />
          </div>
        </div>
        <p className="mt-3 px-1 text-center text-xs leading-5 text-gray-500 sm:hidden">
          Tap the game surface to start. Fullscreen is optional now, not required.
        </p>
      </div>
    </div>
  )
}
