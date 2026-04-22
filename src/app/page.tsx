import Link from 'next/link'
import type { Game } from '@/data/games'
import { games } from '@/data/games'

type LiveTile = {
  kind: 'live'
  game: Game
  className?: string
  compact?: boolean
  showHook?: boolean
}

type SoonTile = {
  kind: 'soon'
  title: string
  className?: string
  artClass: string
  compact?: boolean
}

type Tile = LiveTile | SoonTile

function GameBoardTile({ tile }: { tile: Tile }) {
  const isLive = tile.kind === 'live'

  return (
    <Link
      href={isLive ? `/games/${tile.game.slug}` : '/games'}
      className={`portal-card group relative overflow-hidden rounded-[28px] p-3 ${tile.className ?? ''}`}
    >
      {isLive ? (
        <img
          src={tile.game.thumbnail}
          alt={tile.game.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      ) : (
        <div className={`absolute inset-0 ${tile.artClass}`} />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,24,0.03),rgba(7,10,24,0.14)_42%,rgba(7,10,24,0.9)_100%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <span
          className={`portal-pill w-fit ${
            isLive ? 'bg-white/18 text-white backdrop-blur' : 'bg-lime-300 text-slate-950'
          }`}
        >
          {isLive ? tile.game.categories[0] : 'Coming Soon'}
        </span>
        <div className="space-y-1">
          <div className={`${tile.compact ? 'text-[1.1rem]' : 'text-[1.85rem]'} font-black uppercase tracking-[-0.05em] text-white`}>
            {isLive ? tile.game.title : tile.title}
          </div>
          {isLive && tile.showHook ? <div className="line-clamp-1 text-sm text-white/86">{tile.game.hook}</div> : null}
        </div>
      </div>
    </Link>
  )
}

function ThumbTile({ tile }: { tile: Tile }) {
  const isLive = tile.kind === 'live'

  return (
    <Link href={isLive ? `/games/${tile.game.slug}` : '/games'} className="portal-card group relative aspect-square overflow-hidden rounded-[18px] p-0">
      {isLive ? (
        <img
          src={tile.game.thumbnail}
          alt={tile.game.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
        />
      ) : (
        <div className={`h-full w-full ${tile.artClass}`} />
      )}
    </Link>
  )
}

export default function Home() {
  const neonDash = games.find(game => game.slug === 'neon-dash') ?? games[0]
  const remainingLiveGames = games.filter(game => game.slug !== 'neon-dash')

  const topRightLiveTiles = remainingLiveGames.slice(0, 6).map(game => ({
    kind: 'live' as const,
    game,
    compact: true,
  }))

  const lowerMixedTiles: Tile[] = [
    {
      kind: 'live',
      game: remainingLiveGames[6],
      className: 'min-h-[265px]',
      showHook: true,
    },
    {
      kind: 'soon',
      title: 'Word Blitz',
      artClass: 'mock-art-word-blitz',
      className: 'min-h-[265px]',
    },
    {
      kind: 'soon',
      title: 'Drift Rush',
      artClass: 'mock-art-drift-rush',
      className: 'min-h-[265px]',
    },
    {
      kind: 'soon',
      title: 'Ninja Run',
      artClass: 'mock-art-ninja-run',
      className: 'min-h-[124px]',
      compact: true,
    },
    {
      kind: 'soon',
      title: 'Stack Jump',
      artClass: 'mock-art-stack-jump',
      className: 'min-h-[124px]',
      compact: true,
    },
    {
      kind: 'soon',
      title: 'Bounce Up',
      artClass: 'mock-art-bounce-up',
      className: 'min-h-[124px]',
      compact: true,
    },
    {
      kind: 'soon',
      title: 'Tiny Archer',
      artClass: 'mock-art-tiny-archer',
      className: 'min-h-[124px]',
      compact: true,
    },
    {
      kind: 'soon',
      title: 'UFO Invaders',
      artClass: 'mock-art-ufo-invaders',
      className: 'min-h-[124px]',
      compact: true,
    },
    {
      kind: 'soon',
      title: 'Merge Blox',
      artClass: 'mock-art-merge-blox',
      className: 'min-h-[124px]',
      compact: true,
    },
  ]

  const popularThumbs: Tile[] = [
    ...games.map(game => ({ kind: 'live' as const, game })),
    {
      kind: 'soon' as const,
      title: 'Drift Rush',
      artClass: 'mock-art-drift-rush',
    },
    {
      kind: 'soon' as const,
      title: 'Basket Fever',
      artClass: 'mock-art-basket-fever',
    },
  ]

  const categories = ['All Games', 'Runner', 'Driving', 'Action', 'Puzzle', 'Skill', 'Adventure', '.io Games', 'More']
  const trustItems = [
    ['Instant Play', 'No downloads, ever.'],
    ['100% Free', 'All games are free to play.'],
    ['New Games Daily', 'Fresh games every day.'],
    ['Safe & Secure', 'Family friendly games.'],
    ['Play Anywhere', 'On desktop or mobile.'],
  ]

  return (
    <div className="relative overflow-hidden pb-10 pt-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_46%,#e6f1ff_100%)]" />

      <div className="relative mx-auto max-w-[1680px] space-y-5 px-4 sm:px-6">
        <section className="portal-surface rounded-[30px] px-4 py-4 sm:px-5">
          <div className="grid items-center gap-4 xl:grid-cols-[340px_minmax(360px,1fr)_auto]">
            <Link href="/" className="inline-flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-[20px] bg-[linear-gradient(145deg,#6f45ff,#2f97ff)] text-3xl font-black text-white shadow-[0_16px_28px_rgba(80,90,190,0.18)]">
                Z
              </span>
              <span className="text-[2.1rem] font-black uppercase tracking-[-0.06em] text-transparent bg-[linear-gradient(135deg,#6f45ff,#2494ff)] bg-clip-text">
                Zingcade
              </span>
            </Link>

            <div className="flex min-h-14 items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
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
                    index === 0 ? 'bg-violet-100 text-violet-700' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {item}
                </button>
              ))}
              <button
                type="button"
                className="grid h-14 w-14 place-items-center rounded-full border border-sky-100 bg-[linear-gradient(145deg,#8ad6ff,#6e6dff)] text-base font-black text-white shadow-[0_14px_24px_rgba(59,130,246,0.14)]"
              >
                U
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="grid auto-rows-[168px] gap-4 xl:grid-cols-[1.04fr_1.36fr_0.72fr_0.72fr_0.72fr]">
            <article className="portal-card relative flex aspect-square flex-col justify-between overflow-hidden rounded-[30px] p-6 text-white sm:h-full xl:row-span-2">
              <div className="absolute inset-0 mock-art-zingcade-brand" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,24,0.06),rgba(7,10,24,0.18)_38%,rgba(7,10,24,0.58)_100%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <span />
                <div className="space-y-2">
                  <div className="text-[3.15rem] font-black uppercase tracking-[-0.07em] text-white">Zingcade</div>
                </div>
              </div>
            </article>

            <Link
              href={`/games/${neonDash.slug}`}
              className="portal-card group relative overflow-hidden rounded-[34px] p-6 xl:row-span-2"
            >
              <img src={neonDash.thumbnail} alt={neonDash.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_18%,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_74%_18%,rgba(217,70,239,0.18),transparent_28%),linear-gradient(90deg,rgba(8,12,24,0.74)_0%,rgba(8,12,24,0.42)_44%,rgba(8,12,24,0.18)_100%),linear-gradient(180deg,rgba(8,12,24,0.04),rgba(8,12,24,0.18)_48%,rgba(8,12,24,0.84)_100%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-[4.3rem] font-black uppercase tracking-[-0.08em] text-white drop-shadow-[0_0_22px_rgba(59,130,246,0.35)]">
                    {neonDash.title}
                  </div>
                  <div className="text-2xl font-semibold text-white/92">Run. Jump. Survive.</div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex min-h-12 items-center rounded-[18px] bg-[linear-gradient(135deg,#d9ff32,#a8ff14)] px-5 text-lg font-bold text-slate-950 shadow-[0_14px_28px_rgba(163,230,53,0.22)]">
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

            {topRightLiveTiles.map(tile => (
              <GameBoardTile key={tile.game.slug} tile={tile} />
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.04fr_0.88fr_1.28fr_0.56fr_0.56fr_0.56fr]">
            <GameBoardTile tile={lowerMixedTiles[0]} />
            <GameBoardTile tile={lowerMixedTiles[1]} />
            <GameBoardTile tile={lowerMixedTiles[2]} />
            <div className="grid gap-4">
              <GameBoardTile tile={lowerMixedTiles[3]} />
              <GameBoardTile tile={lowerMixedTiles[6]} />
            </div>
            <div className="grid gap-4">
              <GameBoardTile tile={lowerMixedTiles[4]} />
              <GameBoardTile tile={lowerMixedTiles[7]} />
            </div>
            <div className="grid gap-4">
              <GameBoardTile tile={lowerMixedTiles[5]} />
              <GameBoardTile tile={lowerMixedTiles[8]} />
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3 xl:grid-cols-9">
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

        <section className="grid gap-4 xl:grid-cols-7">
          {[
            { kind: 'soon' as const, title: 'Neon Climb', artClass: 'mock-art-neon-climb' },
            { kind: 'soon' as const, title: 'Pixel Path', artClass: 'mock-art-pixel-path' },
            { kind: 'soon' as const, title: 'Dashy Run', artClass: 'mock-art-dashy-run' },
            { kind: 'soon' as const, title: 'Cube Flip', artClass: 'mock-art-cube-flip' },
            { kind: 'soon' as const, title: 'Color Switch', artClass: 'mock-art-color-switch' },
            { kind: 'soon' as const, title: 'Space Drift', artClass: 'mock-art-space-drift' },
            { kind: 'soon' as const, title: 'Jump Tower', artClass: 'mock-art-jump-tower' },
          ].map(tile => (
            <GameBoardTile key={tile.title} tile={{ ...tile, className: 'min-h-[152px]', compact: true }} />
          ))}
        </section>

        <section className="portal-surface rounded-[30px] p-4">
          <div className="grid items-center gap-4 xl:grid-cols-[260px_minmax(0,1fr)_76px]">
            <div className="rounded-[22px] bg-white/88 px-5 py-5 shadow-[0_12px_22px_rgba(71,85,105,0.06)]">
              <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-violet-600">Popular this week</div>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8 xl:grid-cols-10">
              {popularThumbs.map((tile, index) => (
                <ThumbTile key={`thumb-${index}`} tile={tile} />
              ))}
            </div>

            <button
              type="button"
              className="grid h-[76px] w-[76px] place-items-center rounded-[24px] bg-white text-3xl font-light text-violet-600 shadow-[0_12px_22px_rgba(71,85,105,0.06)]"
            >
              &gt;
            </button>
          </div>
        </section>

        <section className="grid gap-3 rounded-[28px] border border-white/50 bg-white/75 p-4 shadow-[0_18px_34px_rgba(71,85,105,0.08)] backdrop-blur md:grid-cols-5">
          {trustItems.map(([title, copy]) => (
            <div key={title} className="flex items-start gap-3 rounded-[18px] px-2 py-1">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-sky-100 text-lg font-black text-violet-600">
                *
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
