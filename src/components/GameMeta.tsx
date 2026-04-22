import { Game } from '@/data/games'

interface GameMetaProps {
  game: Game
}

export default function GameMeta({ game }: GameMetaProps) {
  return (
    <div className="space-y-6"><a href="/games/" className="inline-block mb-4 text-cyan-400 hover:underline">← Back to Games</a>
      <div className="arcade-card">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">{game.title}</h2>
        <p className="text-gray-300 mb-4">{game.description}</p>

        <div className="space-y-3">
          <div>
            <h3 className="font-bold mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {game.categories.map(category => (
                <span
                  key={category}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
</div>
          <a href={`/raw-games/${game.slug}/index.html`} target="_blank" className="inline-block mt-4 text-cyan-400 hover:underline">Play Fullscreen</a>
          </div>

          <div>
            <h3 className="font-bold mb-2">Controls</h3>
            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
              {game.controls.map(control => (
                <li key={control}>{control}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
