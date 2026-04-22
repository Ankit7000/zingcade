import Link from 'next/link'
import { games } from '@/data/games'

type Tile = {
  title: string
  href: string
  label?: string
  image?: string
  artClass?: string
  className?: string
  titleClassName?: string
  small?: boolean
}

function PortalTile({ tile }: { tile: Tile }) {
  return (
    <Link href={tile.href} className={`portal-card group relative overflow-hidden rounded-[28px] p-3 ${tile.className ?? ''}`}>
      {tile.image ? (
        <img
          src={tile.image}
          alt={tile.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      ) : (
        <div className={`absolute inset-0 ${tile.artClass}`} />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,24,0.03),rgba(7,10,24,0.14)_40%,rgba(7,10,24,0.9)_100%)]" />
      <div className="relative flex h-full flex-col justify-between">
        {tile.label ? <span className="portal-pill w-fit bg-white/18 text-white backdrop-blur">{tile.label}</span> : <span />}
        <div className="space-y-1">
          <div
            className={`${tile.small ? 'text-[1.1rem]' : 'text-[1.85rem]'} font-black uppercase tracking-[-0.05em] text-white ${tile.titleClassName ?? ''}`}
          >
            {tile.title}
          </div>
        </div>
      </div>
    </Link>
  )
}

function ThumbTile({ tile }: { tile: Tile }) {
  return (
    <Link href={tile.href} className="portal-card group relative aspect-square overflow-hidden rounded-[18px] p-0">
      {tile.image ? (
        <img
          src={tile.image}
          alt={tile.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
        />
      ) : (
        <div className={`h-full w-full ${tile.artClass}`} />
      )}
    </Link>
  )
}

export default function Home() {
  const bySlug = new Map(games.map(game => [game.slug, game]))

  const neonDash = bySlug.get('neon-dash')!
  const skyHop = bySlug.get('sky-hop')!
  const dontStopBall = bySlug.get('dont-stop-ball')!
  const colorCrown = bySlug.get('color-crown')!
  const mergeMonster = bySlug.get('merge-monster-2048')!
  const rainballRush = bySlug.get('rainball-rush')!
  const dailyVault = bySlug.get('daily-vault')!
  const arcadeTycoon = bySlug.get('arcade-tycoon')!

  const topRightTiles: Tile[] = [
    { title: 'Sky Hop', href: `/games/${skyHop.slug}`, image: skyHop.thumbnail, small: true },
    { title: 'Dont Stop Ball', href: `/games/${dontStopBall.slug}`, image: dontStopBall.thumbnail, small: true, titleClassName: 'leading-none' },
    { title: 'Color Crown', href: `/games/${colorCrown.slug}`, image: colorCrown.thumbnail, small: true },
    { title: 'Flip Tiles', href: '/games', artClass: 'mock-art-flip-tiles', small: true },
    { title: 'Rocket Rush', href: '/games', artClass: 'mock-art-rocket-rush', small: true },
    { title: 'Basket Fever', href: '/games', artClass: 'mock-art-basket-fever', small: true },
  ]

  const lowerTiles: Tile[] = [
    { title: 'Gravity Swap', href: '/games', artClass: 'mock-art-gravity-swap', className: 'min-h-[265px]' },
    { title: 'Word Blitz', href: '/games', artClass: 'mock-art-word-blitz', className: 'min-h-[265px]' },
    { title: 'Drift Rush', href: '/games', artClass: 'mock-art-drift-rush', className: 'min-h-[265px]' },
    { title: 'Ninja Run', href: '/games', artClass: 'mock-art-ninja-run', className: 'min-h-[124px]', small: true },
    { title: 'Stack Jump', href: '/games', artClass: 'mock-art-stack-jump', className: 'min-h-[124px]', small: true },
    { title: 'Bounce Up', href: '/games', artClass: 'mock-art-bounce-up', className: 'min-h-[124px]', small: true },
    { title: 'Tiny Archer', href: '/games', artClass: 'mock-art-tiny-archer', className: 'min-h-[124px]', small: true },
    { title: 'UFO Invaders', href: '/games', artClass: 'mock-art-ufo-invaders', className: 'min-h-[124px]', small: true },
    { title: 'Merge Blox', href: '/games', artClass: 'mock-art-merge-blox', className: 'min-h-[124px]', small: true },
  ]

  const popularThumbs: Tile[] = [
    { title: 'Drift Rush', href: '/games', artClass: 'mock-art-drift-rush' },
    { title: 'Arcade Tycoon', href: `/games/${arcadeTycoon.slug}`, image: arcadeTycoon.thumbnail },
    { title: 'Sky Hop', href: `/games/${skyHop.slug}`, image: skyHop.thumbnail },
    { title: 'Dont Stop Ball', href: `/games/${dontStopBall.slug}`, image: dontStopBall.thumbnail },
    { title: 'Basket Fever', href: '/games', artClass: 'mock-art-basket-fever' },
    { title: 'Daily Vault', href: `/games/${dailyVault.slug}`, image: dailyVault.thumbnail },
    { title: 'Color Crown', href: `/games/${colorCrown.slug}`, image: colorCrown.thumbnail },
    { title: 'Rainball Rush', href: `/games/${rainballRush.slug}`, image: rainballRush.thumbnail },
    { title: 'Merge Monster', href: `/games/${mergeMonster.slug}`, image: mergeMonster.thumbnail },
    { title: 'Neon Dash', href: `/games/${neonDash.slug}`, image: neonDash.thumbnail },
  ]

  const categories = ['New', 'Popular', 'Runner', 'Driving', 'Puzzle', 'Skill', 'Multiplayer', '.io Games', 'More']

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
              <div className="absolute inset-0 mock-art-neon-dash-home" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,24,0.04),rgba(7,10,24,0.18)_48%,rgba(7,10,24,0.84)_100%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-[4.3rem] font-black uppercase tracking-[-0.08em] text-white drop-shadow-[0_0_22px_rgba(59,130,246,0.35)]">
                    Neon Dash
                  </div>
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

            {topRightTiles.map(tile => (
              <PortalTile key={tile.title} tile={tile} />
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.04fr_0.88fr_1.28fr_0.56fr_0.56fr_0.56fr]">
            <PortalTile tile={lowerTiles[0]} />
            <PortalTile tile={lowerTiles[1]} />
            <PortalTile tile={lowerTiles[2]} />
            <div className="grid gap-4">
              <PortalTile tile={lowerTiles[3]} />
              <PortalTile tile={lowerTiles[6]} />
            </div>
            <div className="grid gap-4">
              <PortalTile tile={lowerTiles[4]} />
              <PortalTile tile={lowerTiles[7]} />
            </div>
            <div className="grid gap-4">
              <PortalTile tile={lowerTiles[5]} />
              <PortalTile tile={lowerTiles[8]} />
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

        <section className="portal-surface rounded-[30px] p-4">
          <div className="grid items-center gap-4 xl:grid-cols-[260px_minmax(0,1fr)_76px]">
            <div className="rounded-[22px] bg-white/88 px-5 py-5 shadow-[0_12px_22px_rgba(71,85,105,0.06)]">
              <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-violet-600">Popular this week</div>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8 xl:grid-cols-10">
              {popularThumbs.map(tile => (
                <ThumbTile key={`thumb-${tile.title}`} tile={tile} />
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
      </div>
    </div>
  )
}
