import Link from 'next/link'
import type { Game } from '@/data/games'
import { games } from '@/data/games'

type TileProps = {
  game: Game
  className?: string
  compact?: boolean
}

function GameTile({ game, className = '', compact = false }: TileProps) {
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
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,20,0.04),rgba(5,9,20,0.22)_50%,rgba(5,9,20,0.9)_100%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <span className="portal-pill w-fit bg-slate-950/55 text-slate-100">{game.categories[0]}</span>
        <div className="space-y-1">
          <div className={`${compact ? 'text-lg' : 'text-xl'} font-black tracking-[-0.04em] text-white`}>
            {game.title}
          </div>
          <div className="line-clamp-1 text-sm text-slate-200/90">{game.hook}</div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const gameBySlug = new Map(games.map(game => [game.slug, game]))

  const neonDash = gameBySlug.get('neon-dash') ?? games[0]
  const topSideTiles = ['sky-hop', 'merge-monster-2048', 'color-crown', 'rainball-rush']
    .map(slug => gameBySlug.get(slug))
    .filter((game): game is Game => Boolean(game))
  const midRowTiles = ['daily-vault', 'arcade-tycoon', 'dont-stop-ball', 'sky-hop', 'color-crown']
    .map(slug => gameBySlug.get(slug))
    .filter((game): game is Game => Boolean(game))
  const categories = ['All Games', 'Runner', 'Driving', 'Action', 'Puzzle', 'Skill', 'Adventure', '.io Games', 'More']
  const lowerRowTiles = ['neon-dash', 'merge-monster-2048', 'daily-vault', 'rainball-rush', 'arcade-tycoon', 'dont-stop-ball', 'sky-hop']
    .map(slug => gameBySlug.get(slug))
    .filter((game): game is Game => Boolean(game))
  const trustItems = [
    ['Instant Play', 'No downloads, ever.'],
    ['100% Free', 'All games are free to play.'],
    ['New Games Daily', 'Fresh games every day.'],
    ['Safe & Secure', 'Family friendly games.'],
    ['Play Anywhere', 'On desktop or mobile.'],
  ]

  return (
    <div className="relative overflow-hidden pb-10 pt-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#7fd3ff_0%,#bce7ff_42%,#dff3ff_100%)]" />
      <div className="pointer-events-none absolute left-[-120px] top-[-90px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(111,80,255,0.16)_0%,rgba(111,80,255,0)_70%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-100px] top-[120px] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(34,197,255,0.16)_0%,rgba(34,197,255,0)_70%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1520px] space-y-5 px-4 sm:px-6">
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200/70 bg-white/75 px-4 text-sm font-semibold text-slate-700 shadow-[0_14px_28px_rgba(71,85,105,0.12)] backdrop-blur transition-colors hover:bg-white"
          >
            <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(132,204,22,0.9)]" />
            Sign in
          </button>
        </div>

        <section className="space-y-4">
          <div className="grid auto-rows-[168px] gap-4 xl:grid-cols-[150px_minmax(0,2fr)_repeat(2,minmax(170px,1fr))]">
            <article className="portal-card flex aspect-square flex-col justify-between rounded-[30px] bg-[linear-gradient(180deg,rgba(114,63,255,0.92),rgba(82,130,255,0.86))] p-5 text-white shadow-[0_20px_40px_rgba(80,90,190,0.2)] sm:h-full xl:row-span-2">
              <div className="grid h-16 w-16 place-items-center rounded-[20px] bg-white/18 text-4xl font-black shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                Z
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-black uppercase tracking-[-0.05em]">Zingcade</div>
                <div className="text-sm font-medium text-white/90">Play instantly.</div>
              </div>
            </article>

            <Link
              href={`/games/${neonDash.slug}`}
              className="portal-card group relative overflow-hidden rounded-[34px] p-5 xl:row-span-2"
            >
              <img
                src={neonDash.thumbnail}
                alt={neonDash.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(119,190,255,0.2),transparent_24%),radial-gradient(circle_at_76%_22%,rgba(190,24,255,0.18),transparent_26%),linear-gradient(90deg,rgba(7,10,24,0.9)_0%,rgba(7,10,24,0.68)_38%,rgba(7,10,24,0.18)_70%,rgba(7,10,24,0.4)_100%),linear-gradient(180deg,rgba(7,10,24,0.06),rgba(7,10,24,0.54)_54%,rgba(7,10,24,0.94)_100%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="space-y-4">
                  <span className="portal-pill w-fit bg-violet-700/80 text-white">Featured</span>
                  <div className="max-w-[360px] space-y-3">
                    <h1 className="text-[3rem] font-black uppercase tracking-[-0.07em] text-white sm:text-[4.25rem]">
                      {neonDash.title}
                    </h1>
                    <p className="text-base font-semibold text-white/92">Run. Jump. Survive.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex min-h-12 items-center rounded-[18px] bg-[linear-gradient(135deg,#d9ff32,#a8ff14)] px-5 text-base font-bold text-slate-950 shadow-[0_16px_30px_rgba(163,230,53,0.28)]">
                    Play Now
                  </span>
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-lime-300" />
                    <span className="h-3 w-3 rounded-full bg-white/70" />
                    <span className="h-3 w-3 rounded-full bg-white/70" />
                  </div>
                </div>
              </div>
            </Link>

            {topSideTiles.map(game => (
              <GameTile key={game.slug} game={game} compact />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1.15fr_0.82fr_0.82fr_0.92fr]">
            {midRowTiles.map(game => (
              <GameTile key={game.slug} game={game} compact className="min-h-[180px]" />
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3 xl:grid-cols-9">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`inline-flex min-h-14 items-center justify-center rounded-[18px] border px-4 text-lg font-semibold shadow-[0_14px_24px_rgba(71,85,105,0.08)] transition-transform hover:-translate-y-0.5 ${
                index === 0
                  ? 'border-violet-500/30 bg-[linear-gradient(135deg,#6e43ff,#4f86ff)] text-white'
                  : 'border-sky-100/80 bg-white/80 text-slate-700 backdrop-blur'
              }`}
            >
              {category}
            </button>
          ))}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-slate-700">New Games</div>
            <Link href="/games" className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900">
              View all
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
            {lowerRowTiles.map((game, index) => (
              <Link
                key={`${game.slug}-${index}`}
                href={`/games/${game.slug}`}
                className="portal-card group relative overflow-hidden rounded-[24px] p-3"
              >
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,20,0.08),rgba(5,9,20,0.3)_48%,rgba(5,9,20,0.92)_100%)]" />
                <div className="relative flex h-full min-h-[138px] flex-col justify-between">
                  <span className="portal-pill w-fit bg-lime-300 text-slate-950">New</span>
                  <div className="space-y-1">
                    <div className="text-[1.65rem] font-black uppercase tracking-[-0.05em] text-white">{game.title}</div>
                    <div className="text-sm text-white/85">{game.categories[0]}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-3 rounded-[28px] border border-white/50 bg-white/75 p-4 shadow-[0_18px_34px_rgba(71,85,105,0.08)] backdrop-blur md:grid-cols-5">
          {trustItems.map(([title, copy]) => (
            <div key={title} className="flex items-start gap-3 rounded-[18px] px-2 py-1">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-sky-100 text-lg font-black text-violet-600">
                ✦
              </div>
              <div>
                <div className="text-base font-bold text-slate-800">{title}</div>
                <div className="text-sm text-slate-600">{copy}</div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
