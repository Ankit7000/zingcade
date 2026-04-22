import Link from 'next/link'
import type { Game } from '@/data/games'
import { games } from '@/data/games'

type PortalTileProps = {
  game: Game
  className?: string
  compact?: boolean
  badge?: string
}

function PortalTile({ game, className = '', compact = false, badge }: PortalTileProps) {
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
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,24,0.04),rgba(8,12,24,0.2)_48%,rgba(8,12,24,0.9)_100%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <span className="portal-pill w-fit bg-white/20 text-white backdrop-blur">
          {badge ?? game.categories[0]}
        </span>
        <div className="space-y-1">
          <div className={`${compact ? 'text-lg' : 'text-[1.75rem]'} font-black uppercase tracking-[-0.05em] text-white`}>
            {game.title}
          </div>
          {!compact && <div className="line-clamp-1 text-sm text-white/85">{game.hook}</div>}
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const gameBySlug = new Map(games.map(game => [game.slug, game]))

  const neonDash = gameBySlug.get('neon-dash') ?? games[0]
  const topWallTiles = ['sky-hop', 'dont-stop-ball', 'color-crown', 'merge-monster-2048', 'rainball-rush', 'daily-vault']
    .map(slug => gameBySlug.get(slug))
    .filter((game): game is Game => Boolean(game))
  const lowerMixedTiles = ['arcade-tycoon', 'color-crown', 'rainball-rush', 'sky-hop', 'dont-stop-ball', 'merge-monster-2048']
    .map(slug => gameBySlug.get(slug))
    .filter((game): game is Game => Boolean(game))
  const popularStripTiles = ['neon-dash', 'rainball-rush', 'dont-stop-ball', 'merge-monster-2048', 'daily-vault', 'color-crown', 'sky-hop', 'arcade-tycoon']
    .map(slug => gameBySlug.get(slug))
    .filter((game): game is Game => Boolean(game))
  const categories = ['New', 'Popular', 'Runner', 'Driving', 'Puzzle', 'Skill', 'Multiplayer', '.io Games', 'More']

  return (
    <div className="relative overflow-hidden pb-10 pt-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#f7fbff_0%,#ebf5ff_36%,#e4f1ff_100%)]" />
      <div className="pointer-events-none absolute left-[-120px] top-[-90px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(120,87,255,0.18)_0%,rgba(120,87,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-[40px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16)_0%,rgba(56,189,248,0)_72%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1660px] space-y-5 px-4 sm:px-6">
        <section className="portal-surface rounded-[30px] px-4 py-4 sm:px-5">
          <div className="grid items-center gap-4 xl:grid-cols-[340px_minmax(360px,1fr)_auto]">
            <Link href="/" className="inline-flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-[20px] bg-[linear-gradient(145deg,#6d49ff,#3298ff)] text-3xl font-black text-white shadow-[0_16px_28px_rgba(80,90,190,0.22)]">
                Z
              </span>
              <span className="text-[2.1rem] font-black uppercase tracking-[-0.06em] text-transparent bg-[linear-gradient(135deg,#6d49ff,#3298ff)] bg-clip-text">
                Zingcade
              </span>
            </Link>

            <div className="flex min-h-14 items-center gap-3 rounded-full border border-slate-200 bg-white/88 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <span className="h-4 w-4 rounded-full border-2 border-slate-400" />
              <input
                type="search"
                placeholder="Search games..."
                aria-label="Search games"
                className="w-full bg-transparent text-lg text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              {['Home', 'Popular', 'Favorites', 'Leaderboard'].map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={`inline-flex min-h-12 items-center rounded-full px-5 text-lg font-semibold transition-colors ${
                    index === 0
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-transparent text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {item}
                </button>
              ))}
              <button
                type="button"
                className="grid h-14 w-14 place-items-center rounded-full border border-sky-100 bg-[linear-gradient(145deg,#8fd0ff,#6b6dff)] text-lg font-black text-white shadow-[0_14px_24px_rgba(59,130,246,0.16)]"
              >
                U
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="grid auto-rows-[164px] gap-4 xl:grid-cols-[1.08fr_1.42fr_0.7fr_0.7fr_0.7fr]">
            <article className="portal-card flex aspect-square flex-col justify-between rounded-[32px] bg-[linear-gradient(180deg,#5c35ff_0%,#2d73ff_100%)] p-6 text-white shadow-[0_24px_44px_rgba(82,103,255,0.24)] sm:h-full xl:row-span-2">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">Arcade</span>
                <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">Live</span>
              </div>
              <div className="space-y-4">
                <div className="grid h-20 w-20 place-items-center rounded-[24px] bg-white/18 text-5xl font-black shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                  Z
                </div>
                <div className="space-y-2">
                  <div className="text-[2.1rem] font-black uppercase tracking-[-0.06em]">Zingcade</div>
                  <div className="text-base font-medium text-white/92">Play instantly.</div>
                </div>
              </div>
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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_18%,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_74%_18%,rgba(217,70,239,0.18),transparent_28%),linear-gradient(90deg,rgba(8,12,24,0.74)_0%,rgba(8,12,24,0.42)_44%,rgba(8,12,24,0.18)_100%),linear-gradient(180deg,rgba(8,12,24,0.08),rgba(8,12,24,0.36)_56%,rgba(8,12,24,0.92)_100%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="space-y-4">
                  <span className="portal-pill w-fit bg-white/18 text-white">Featured</span>
                  <div className="max-w-[420px] space-y-3">
                    <h1 className="text-[3rem] font-black uppercase tracking-[-0.07em] text-white sm:text-[4.2rem]">
                      {neonDash.title}
                    </h1>
                    <p className="text-xl font-semibold text-white/92">Run. Jump. Survive.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex min-h-12 items-center rounded-[18px] bg-[linear-gradient(135deg,#d9ff32,#a8ff14)] px-5 text-lg font-bold text-slate-950 shadow-[0_14px_28px_rgba(163,230,53,0.24)]">
                    Play Now
                  </span>
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-lime-300" />
                    <span className="h-3 w-3 rounded-full bg-white/72" />
                    <span className="h-3 w-3 rounded-full bg-white/72" />
                  </div>
                </div>
              </div>
            </Link>

            {topWallTiles.map(game => (
              <PortalTile key={game.slug} game={game} compact />
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.08fr_0.96fr_1.36fr_0.62fr_0.62fr]">
            <PortalTile game={lowerMixedTiles[0]} className="min-h-[262px]" />
            <PortalTile game={lowerMixedTiles[1]} className="min-h-[262px]" />
            <PortalTile game={lowerMixedTiles[2]} className="min-h-[262px]" />

            <div className="grid gap-4">
              <PortalTile game={lowerMixedTiles[3]} compact className="min-h-[123px]" />
              <PortalTile game={lowerMixedTiles[4]} compact className="min-h-[123px]" />
            </div>

            <div className="grid gap-4">
              <PortalTile game={lowerMixedTiles[5]} compact className="min-h-[123px]" />
              <Link
                href="/games"
                className="portal-card flex min-h-[123px] flex-col justify-between rounded-[24px] p-4 transition-colors hover:bg-white"
              >
                <span className="portal-pill w-fit bg-violet-100 text-violet-700">Catalog</span>
                <div className="space-y-1">
                  <div className="text-xl font-black uppercase tracking-[-0.05em] text-slate-900">All Games</div>
                  <div className="text-sm text-slate-600">Open the full wall.</div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3 xl:grid-cols-9">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`portal-chip text-lg ${
                index === 0
                  ? 'border-violet-300 bg-violet-50 text-violet-700'
                  : 'bg-white/82 text-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </section>

        <section className="portal-surface rounded-[30px] p-4">
          <div className="grid items-center gap-4 xl:grid-cols-[260px_minmax(0,1fr)_76px]">
            <div className="rounded-[22px] bg-white/88 px-5 py-5 shadow-[0_12px_22px_rgba(71,85,105,0.08)]">
              <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-violet-600">Popular this week</div>
            </div>

            <div className="grid gap-3 grid-cols-4 sm:grid-cols-8">
              {popularStripTiles.map(game => (
                <Link
                  key={`popular-${game.slug}`}
                  href={`/games/${game.slug}`}
                  className="portal-card group relative overflow-hidden rounded-[18px] p-0 aspect-square"
                >
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                  />
                </Link>
              ))}
            </div>

            <button
              type="button"
              className="grid h-[76px] w-[76px] place-items-center rounded-[24px] bg-white text-3xl font-light text-violet-600 shadow-[0_12px_22px_rgba(71,85,105,0.08)]"
            >
              &gt;
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
