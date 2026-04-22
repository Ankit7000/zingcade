import Link from 'next/link'
import type { Game } from '@/data/games'
import { games } from '@/data/games'

type HomeTileProps = {
  game: Game
  className?: string
  compact?: boolean
}

function HomeTile({ game, className = '', compact = false }: HomeTileProps) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className={`portal-card group relative overflow-hidden rounded-[28px] p-3 ${className}`}
    >
      <img
        src={game.thumbnail}
        alt={game.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,24,0.04),rgba(7,10,24,0.18)_42%,rgba(7,10,24,0.88)_100%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <span className="portal-pill w-fit bg-white/18 text-white backdrop-blur">{game.categories[0]}</span>
        <div className="space-y-1">
          <div className={`${compact ? 'text-[1.15rem]' : 'text-[1.85rem]'} font-black uppercase tracking-[-0.05em] text-white`}>
            {game.title}
          </div>
          {!compact && <div className="line-clamp-1 text-sm text-white/86">{game.hook}</div>}
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const gameBySlug = new Map(games.map(game => [game.slug, game]))

  const neonDash = gameBySlug.get('neon-dash')!
  const topRightGames = ['sky-hop', 'dont-stop-ball', 'color-crown', 'merge-monster-2048', 'daily-vault', 'rainball-rush']
    .map(slug => gameBySlug.get(slug))
    .filter((game): game is Game => Boolean(game))
  const arcadeTycoon = gameBySlug.get('arcade-tycoon')!
  const shelfGames = [
    neonDash,
    gameBySlug.get('merge-monster-2048')!,
    gameBySlug.get('dont-stop-ball')!,
    gameBySlug.get('sky-hop')!,
    arcadeTycoon,
    gameBySlug.get('color-crown')!,
    gameBySlug.get('daily-vault')!,
    gameBySlug.get('rainball-rush')!,
  ]

  const categories = ['All Games', 'Runner', 'Puzzle', 'Arcade', 'Daily', 'Control', 'Idle', 'Action']

  return (
    <div className="relative overflow-hidden pb-10 pt-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#f7fbff_0%,#ecf6ff_40%,#e5f1ff_100%)]" />

      <div className="relative mx-auto max-w-[1680px] space-y-5 px-4 sm:px-6">
        <section className="space-y-4">
          <div className="grid auto-rows-[168px] gap-4 xl:grid-cols-[1.02fr_1.36fr_0.72fr_0.72fr_0.72fr]">
            <article className="portal-card relative aspect-square overflow-hidden rounded-[30px] sm:h-full xl:row-span-2">
              <img
                src="/images/branding/zingcade-brand-card.svg"
                alt="Zingcade"
                className="h-full w-full object-cover"
              />
            </article>

            <Link
              href={`/games/${neonDash.slug}`}
              className="portal-card group relative overflow-hidden rounded-[34px] p-6 xl:row-span-2"
            >
              <img
                src={neonDash.thumbnail}
                alt={neonDash.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_18%,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_74%_18%,rgba(217,70,239,0.18),transparent_28%),linear-gradient(90deg,rgba(8,12,24,0.74)_0%,rgba(8,12,24,0.4)_44%,rgba(8,12,24,0.16)_100%),linear-gradient(180deg,rgba(8,12,24,0.04),rgba(8,12,24,0.16)_48%,rgba(8,12,24,0.84)_100%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="space-y-3">
                  <span className="portal-pill w-fit bg-white/18 text-white backdrop-blur">Featured Run</span>
                  <div className="text-[4.15rem] font-black uppercase tracking-[-0.08em] text-white drop-shadow-[0_0_22px_rgba(59,130,246,0.35)]">
                    {neonDash.title}
                  </div>
                  <div className="text-2xl font-semibold text-white/92">Run. Jump. Survive.</div>
                </div>
                <span className="inline-flex min-h-12 w-fit items-center rounded-[18px] bg-[linear-gradient(135deg,#d9ff32,#a8ff14)] px-5 text-lg font-bold text-slate-950 shadow-[0_14px_28px_rgba(163,230,53,0.22)]">
                  Play Now
                </span>
              </div>
            </Link>

            {topRightGames.map(game => (
              <HomeTile key={game.slug} game={game} compact />
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.02fr_0.88fr_1.28fr_1.02fr]">
            <HomeTile game={arcadeTycoon} className="min-h-[250px]" />
            <HomeTile game={gameBySlug.get('merge-monster-2048')!} className="min-h-[250px]" />
            <HomeTile game={gameBySlug.get('dont-stop-ball')!} className="min-h-[250px]" />
            <HomeTile game={gameBySlug.get('rainball-rush')!} className="min-h-[250px]" />
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`portal-chip text-lg ${
                index === 0 ? 'border-violet-300 bg-violet-50 text-violet-700' : 'bg-white/88 text-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-violet-600">Curated Arcade</div>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">All 8 live games</h2>
            </div>
            <Link href="/games" className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900">
              Open games
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {shelfGames.map(game => (
              <HomeTile key={`shelf-${game.slug}`} game={game} className="min-h-[180px]" compact />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
