import Link from 'next/link'
import { Game } from '@/data/games'

interface FeaturedGameProps {
  game: Game
}

export default function FeaturedGame({ game }: FeaturedGameProps) {
  return (
    <section className="relative overflow-hidden border-b border-cyan-500/10 bg-gradient-to-br from-gray-900 via-gray-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_24%)]" />
      <div className="container relative mx-auto px-4 py-6 sm:py-10 lg:py-14">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-8">
          <Link href={`/games/${game.slug}`} className="order-1 group relative block overflow-hidden rounded-[28px] border border-cyan-500/20 bg-gray-950/60 shadow-[0_28px_80px_-30px_rgba(34,211,238,0.55)]">
            <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-video">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
            <div className="absolute left-4 top-4 inline-flex min-h-9 items-center rounded-full border border-cyan-300/35 bg-cyan-300/15 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
              Featured Pick
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Instant browser play</p>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">{game.title}</h2>
                </div>
                <div className="inline-flex min-h-11 items-center rounded-full bg-cyan-400 px-4 text-sm font-bold uppercase tracking-[0.14em] text-black">
                  Play
                </div>
              </div>
            </div>
          </Link>

          <div className="order-2 space-y-5 lg:order-1">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Play Something Fast</p>
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                {game.title}
              </h1>
              <p className="text-base leading-7 text-gray-300 sm:text-lg">
                {game.hook}
              </p>
              <p className="max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
                {game.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {game.categories.map(category => (
                <span
                  key={category}
                  className="rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 text-sm text-cyan-300"
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
                Play Featured Game
              </Link>
              <Link
                href="/games"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-gray-200 transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
              >
                Browse All Games
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
