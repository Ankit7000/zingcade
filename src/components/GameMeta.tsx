import { Game } from '@/data/games'

interface GameMetaProps {
  game: Game
}

export default function GameMeta({ game }: GameMetaProps) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <a href="/games/" className="hidden text-cyan-400 hover:underline lg:inline-block">
        &larr; Back to Games
      </a>

      <div className="hidden lg:block">
        <div className="arcade-card space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {game.categories.map(category => (
                <span
                  key={category}
                  className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400"
                >
                  {category}
                </span>
              ))}
            </div>
            <div>
              <h2 className="mb-3 text-xl font-bold text-cyan-400">{game.title}</h2>
              <p className="text-gray-300">{game.description}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold">Controls</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-400">
              {game.controls.map(control => (
                <li key={control}>{control}</li>
              ))}
            </ul>
          </div>

          <a
            href={`/raw-games/${game.slug}/index.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-cyan-400 hover:underline"
          >
            Play Fullscreen
          </a>
        </div>
      </div>

      <details className="arcade-card overflow-hidden lg:hidden">
        <summary
          className="flex cursor-pointer items-center justify-between gap-3"
          style={{ listStyle: 'none' }}
        >
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">Game Info</p>
            <h2 className="text-lg font-bold text-white">{game.title}</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-300">
            Expand
          </span>
        </summary>
        <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
          <p className="text-sm leading-6 text-gray-400">{game.description}</p>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white">Controls</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-400">
              {game.controls.map(control => (
                <li key={control}>{control}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {game.categories.map(category => (
              <span
                key={category}
                className="rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 text-xs text-cyan-300"
              >
                {category}
              </span>
            ))}
          </div>

          <a
            href={`/raw-games/${game.slug}/index.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-cyan-400 hover:underline"
          >
            Open standalone fullscreen view
          </a>
        </div>
      </details>
    </div>
  )
}
