import Link from 'next/link'
import { Game } from '@/data/games'

interface FeaturedGameProps {
  game: Game
}

export default function FeaturedGame({ game }: FeaturedGameProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/6 bg-[linear-gradient(180deg,#0f172a_0%,#0b1020_52%,#080c16_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_24%),radial-gradient(circle_at_85%_15%,rgba(99,102,241,0.22),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0) 0%,rgba(2,6,23,0.55) 100%)]" />
      <div className="container relative mx-auto px-4 py-5 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)] lg:items-center lg:gap-8">
          <Link href={`/games/${game.slug}`} className="group relative block overflow-hidden rounded-[30px] border border-cyan-300/18 bg-slate-950/70 shadow-[0_34px_90px_-42px_rgba(34,211,238,0.5)]">
            <div className="aspect-[1.05] w-full overflow-hidden sm:aspect-[1.35] lg:aspect-[1.5]">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute left-4 top-4 inline-flex min-h-9 items-center rounded-full border border-cyan-300/25 bg-slate-950/70 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
              Featured cabinet
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Instant browser play</p>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">{game.title}</h2>
                </div>
                <div className="inline-flex min-h-11 items-center rounded-full bg-cyan-400 px-4 text-sm font-bold uppercase tracking-[0.14em] text-black shadow-[0_10px_28px_-10px_rgba(34,211,238,0.7)]">
                  Play Now
                </div>
              </div>
            </div>
          </Link>

          <div className="space-y-4 lg:max-w-[28rem]">
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Start here</p>
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-[4rem]">
                {game.title}
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                {game.hook}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {game.categories.slice(0, 2).map(category => (
                <span
                  key={category}
                  className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm font-medium text-slate-200"
                >
                  {category}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/games/${game.slug}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-400 px-6 text-sm font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-cyan-300"
              >
                Play Now
              </Link>
              <Link
                href="/games"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100 transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
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
