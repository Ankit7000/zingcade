import Link from 'next/link'
import { games } from '@/data/games'

export default function Home() {
  const gameBySlug = new Map(games.map(game => [game.slug, game]))
  const neonDash = gameBySlug.get('neon-dash') ?? games[0]
  const topWallGames = ['merge-monster-2048', 'color-crown', 'rainball-rush', 'daily-vault', 'sky-hop']
    .map(slug => gameBySlug.get(slug))
    .filter((game): game is NonNullable<typeof game> => Boolean(game))
  const moreGames = ['arcade-tycoon', 'dont-stop-ball']
    .map(slug => gameBySlug.get(slug))
    .filter((game): game is NonNullable<typeof game> => Boolean(game))

  return (
    <div className="relative overflow-hidden pb-10 pt-4">
      <div className="pointer-events-none absolute left-[-140px] top-[-120px] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(141,92,255,0.24)_0%,rgba(141,92,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-[40px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(119,190,255,0.2)_0%,rgba(119,190,255,0)_72%)] blur-3xl" />

      <div className="mx-auto max-w-[1380px] space-y-4 px-4 sm:px-6">
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3.5 text-sm font-medium text-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur transition-colors hover:bg-white/[0.08]"
          >
            <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.85)]" />
            Sign in
          </button>
        </div>

        <section className="grid auto-rows-[170px] gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <article className="tile-shell flex aspect-square flex-col justify-between rounded-[28px] p-5 sm:h-full">
            <div className="grid h-16 w-16 place-items-center rounded-[20px] bg-[linear-gradient(145deg,rgba(184,255,57,0.98),rgba(119,190,255,0.92))] text-3xl font-black text-slate-950 shadow-[0_20px_34px_rgba(23,34,75,0.32)]">
              Z
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-black uppercase tracking-[-0.05em] text-white">Zingcade</div>
              <div className="text-sm text-slate-300">Instant play</div>
            </div>
          </article>

          <Link
            href={`/games/${neonDash.slug}`}
            className="tile-shell group relative overflow-hidden rounded-[30px] p-5 sm:col-span-2 sm:row-span-2"
          >
            <img src={neonDash.thumbnail} alt={neonDash.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(119,190,255,0.18),transparent_24%),radial-gradient(circle_at_76%_20%,rgba(141,92,255,0.24),transparent_28%),linear-gradient(180deg,rgba(5,9,20,0.08),rgba(5,9,20,0.56)_54%,rgba(5,9,20,0.94)_100%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[linear-gradient(135deg,#b8ff39,#d7ff88_56%,#8effcb)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-950">
                  Spotlight
                </span>
                <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                  {neonDash.categories[0]}
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-black uppercase tracking-[-0.06em] text-white sm:text-5xl">{neonDash.title}</div>
                <div className="text-sm font-medium text-slate-200">Run. Dodge. Survive.</div>
              </div>
            </div>
          </Link>

          {topWallGames.map(game => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="tile-shell group relative overflow-hidden rounded-[28px] p-4"
            >
              <img src={game.thumbnail} alt={game.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,23,0.06),rgba(8,12,23,0.26)_52%,rgba(8,12,23,0.9)_100%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="w-fit rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                  {game.categories[0]}
                </span>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-white">{game.title}</div>
                  <div className="line-clamp-1 text-sm text-slate-300">{game.hook}</div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">More Games</div>
            <Link href="/games" className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
              Browse all
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {moreGames.map(game => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="tile-shell group relative overflow-hidden rounded-[28px] p-4"
              >
                <img src={game.thumbnail} alt={game.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,23,0.06),rgba(8,12,23,0.26)_52%,rgba(8,12,23,0.9)_100%)]" />
                <div className="relative flex h-full min-h-[180px] flex-col justify-between">
                  <span className="w-fit rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                    {game.categories[0]}
                  </span>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-white">{game.title}</div>
                    <div className="line-clamp-1 text-sm text-slate-300">{game.hook}</div>
                  </div>
                </div>
              </Link>
            ))}

            <Link
              href="/games"
              className="tile-shell flex min-h-[180px] flex-col justify-between rounded-[28px] p-5 transition-colors hover:bg-white/[0.06]"
            >
              <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                Full catalog
              </span>
              <div className="space-y-2">
                <div className="text-2xl font-black tracking-[-0.04em] text-white">Browse All Games</div>
                <div className="text-sm text-slate-300">Open the full arcade wall.</div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
