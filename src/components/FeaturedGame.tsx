import Link from 'next/link'
import { Game } from '@/data/games'

interface FeaturedGameProps {
  game: Game
}

export default function FeaturedGame({ game }: FeaturedGameProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/6 bg-[linear-gradient(180deg,#0f172a_0%,#0b1020_52%,#080c16_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_24%),radial-gradient(circle_at_85%_15%,rgba(99,102,241,0.22),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0) 0%,rgba(2,6,23,0.55) 100%)]" />
      <div className="container relative mx-auto px-4 py-2.5 sm:py-3">
        <div className="rounded-[24px] border border-white/8 bg-slate-950/42 p-2.5 shadow-[0_22px_60px_-46px_rgba(15,23,42,1)] sm:p-3">
          <div className="grid grid-cols-[7.2rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:gap-4">
          <Link href={`/games/${game.slug}`} className="group relative block overflow-hidden rounded-[18px] border border-cyan-300/18 bg-slate-950/70 shadow-[0_18px_50px_-38px_rgba(34,211,238,0.45)]">
            <div className="aspect-[1.06] w-full overflow-hidden sm:aspect-[1.22]">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
            <div className="absolute left-2 top-2 inline-flex min-h-7 items-center rounded-full border border-cyan-300/25 bg-slate-950/72 px-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-100 sm:left-3 sm:top-3 sm:min-h-8 sm:px-2.5 sm:text-[10px]">
              Featured
            </div>
          </Link>

          <div className="min-w-0 space-y-1.5 sm:space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">Featured run</p>
            <h1 className="text-[1.15rem] font-bold leading-tight text-white sm:text-[1.45rem]">
                {game.title}
              </h1>
              <p className="max-w-md text-xs leading-5 text-slate-300 sm:text-sm">
                {game.hook}
              </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-200">
                {game.categories[0]}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex sm:flex-wrap sm:gap-2">
            <Link
              href={`/games/${game.slug}`}
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-cyan-400 px-4 text-sm font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-cyan-300"
            >
              Play Now
            </Link>
            <Link
              href="/games"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100 transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
            >
              Browse Games
            </Link>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
