import Link from 'next/link'
import { Game } from '@/data/games'

interface HomeTopWallProps {
  featuredGame: Game
  games: Game[]
}

function Tile({
  game,
  className,
  titleClassName,
}: {
  game: Game
  className: string
  titleClassName: string
}) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className={`group relative block overflow-hidden rounded-[18px] border border-white/8 bg-slate-900/70 ${className}`}
    >
      <div className="absolute inset-0">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      <div className="absolute left-2 top-2 inline-flex rounded-full border border-white/12 bg-slate-950/75 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-cyan-100 sm:left-2.5 sm:top-2.5 sm:px-2 sm:text-[9px]">
        {game.categories[0]}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5">
        <h2 className={`${titleClassName} font-bold leading-tight text-white`}>
          {game.title}
        </h2>
      </div>
    </Link>
  )
}

export default function HomeTopWall({ featuredGame, games }: HomeTopWallProps) {
  return (
    <section className="space-y-2.5">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3 lg:grid-cols-8">
        <div className="relative col-span-2 aspect-square overflow-hidden rounded-[20px] border border-white/8 bg-[linear-gradient(145deg,#132038_0%,#0b1020_58%,#08111d_100%)] p-3 shadow-[0_24px_60px_-42px_rgba(15,23,42,1)] sm:p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.18),transparent_24%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <span className="inline-flex w-fit rounded-full border border-cyan-300/25 bg-slate-950/65 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-100 sm:text-[10px]">
              8 Live
            </span>
            <div className="space-y-1">
              <p className="text-2xl font-black tracking-[-0.06em] text-white sm:text-3xl">
                ZINGCADE
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80 sm:text-[11px]">
                Pick fast. Play fast.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-3">
          <Tile
            game={featuredGame}
            className="aspect-square sm:aspect-[1.52]"
            titleClassName="text-sm sm:text-base lg:text-lg"
          />
        </div>

        {games.map((game) => (
          <Tile
            key={game.slug}
            game={game}
            className="col-span-1 aspect-square"
            titleClassName="text-[10px] sm:text-[11px] lg:text-sm"
          />
        ))}
      </div>
    </section>
  )
}
