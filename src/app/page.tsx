import Link from 'next/link'
import { games } from '@/data/games'

export default function Home() {
  const featuredGame = games.find(game => game.slug === 'neon-dash') ?? games[0]
  const popularGames = [
    featuredGame,
    ...games.filter(game => ['color-crown', 'merge-monster-2048', 'rainball-rush', 'daily-vault'].includes(game.slug)),
  ].slice(0, 5)
  const topPicks = games.filter(game =>
    ['neon-dash', 'merge-monster-2048', 'color-crown', 'rainball-rush'].includes(game.slug),
  )
  const newGames = games.filter(game => ['sky-hop', 'daily-vault', 'arcade-tycoon', 'dont-stop-ball'].includes(game.slug))
  const categories = ['Arcade', 'Runner', 'Puzzle', 'Reflex', 'Daily', 'Territory', 'Tycoon', 'Platformer']
  const benefits = ['Free to play', 'Instant play', 'No install', 'Quick sessions']

  return (
    <div className="relative overflow-hidden pb-10">
      <div className="pointer-events-none absolute left-[-140px] top-[-120px] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(141,92,255,0.24)_0%,rgba(141,92,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-[40px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(119,190,255,0.2)_0%,rgba(119,190,255,0)_72%)] blur-3xl" />

      <div className="mx-auto max-w-[1380px] space-y-4 px-4 pt-4 sm:px-6">
        <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_280px]">
          <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0)),rgba(9,14,27,0.92)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">
                Browser-first arcade
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_14px_rgba(190,242,100,0.85)]" />
                Live
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid h-24 w-24 place-items-center rounded-[26px] bg-[linear-gradient(145deg,rgba(141,92,255,0.96),rgba(119,190,255,0.9))] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_20px_36px_rgba(23,34,75,0.35)]">
                <span className="text-4xl font-black text-white">Z</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-[2.35rem] font-black tracking-[-0.04em] text-white">Zingcade</h1>
                <p className="text-sm leading-6 text-slate-300">Instant play. Modern arcade. Competitive fun.</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {['Instant play', 'Neon arcade', 'Quick runs'].map(label => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-3 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-slate-200"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {['Browser only', 'No install', 'Fast sessions'].map(tag => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0)),rgba(9,14,27,0.95)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <img
              src={featuredGame.thumbnail}
              alt={featuredGame.title}
              className="absolute inset-0 h-full w-full object-cover opacity-95"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(119,190,255,0.18),transparent_24%),radial-gradient(circle_at_76%_20%,rgba(141,92,255,0.28),transparent_26%),linear-gradient(90deg,rgba(5,9,20,0.92)_0%,rgba(5,9,20,0.76)_38%,rgba(5,9,20,0.28)_68%,rgba(5,9,20,0.72)_100%),linear-gradient(180deg,rgba(5,9,20,0.08),rgba(5,9,20,0.74)_70%,rgba(5,9,20,0.94)_100%)]" />

            <div className="relative flex min-h-[340px] flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[linear-gradient(135deg,#b8ff39,#d7ff88_56%,#8effcb)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-950">
                    Featured
                  </span>
                  <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100">
                    {featuredGame.categories[0]}
                  </span>
                </div>

                <div className="max-w-[390px] space-y-3">
                  <h2 className="text-[3rem] font-black uppercase tracking-[-0.06em] text-white sm:text-[4.5rem]">{featuredGame.title}</h2>
                  <p className="text-base font-medium text-slate-200">Run. Dodge. Survive.</p>
                </div>
              </div>

              <div className="max-w-[420px] space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/games/${featuredGame.slug}`}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b8ff39,#d7ff88_56%,#8effcb)] px-5 text-sm font-bold text-slate-950 shadow-[0_14px_28px_rgba(184,255,57,0.18)] transition-transform hover:-translate-y-0.5"
                  >
                    Play instantly
                  </Link>
                  <Link
                    href="#top-picks"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-slate-950/50 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Explore picks
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['Quick lanes', 'Bright visuals', 'Competitive sessions'].map(item => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <aside id="popular" className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0)),rgba(9,14,27,0.92)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">
                Popular This Week
              </span>
              <Link href="/games" className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                View all
              </Link>
            </div>

            <div className="mt-4 space-y-2">
              {popularGames.map((game, index) => (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  className="grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-2 transition-colors hover:bg-white/[0.06]"
                >
                  <img src={game.thumbnail} alt={game.title} className="h-[52px] w-[52px] rounded-xl object-cover" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">{game.title}</div>
                    <div className="truncate text-xs text-slate-400">{game.categories[0]}</div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-200">
                    #{index + 1}
                  </span>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="rounded-full border border-white/10 bg-slate-950/60 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.25)] backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={`min-h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
                  index === 0
                    ? 'border-lime-300/30 bg-[linear-gradient(135deg,rgba(184,255,57,0.16),rgba(119,190,255,0.16))] text-white'
                    : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section id="top-picks" className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">Top Picks For You</p>
              <h3 className="text-2xl font-black tracking-[-0.03em] text-white">Fast-scan cards, ready in one click.</h3>
            </div>
            <Link href="/games" className="hidden text-sm font-medium text-slate-400 transition-colors hover:text-white sm:inline">
              See collection
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {topPicks.map(game => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0)),rgba(9,14,27,0.96)] p-3 shadow-[0_18px_52px_rgba(0,0,0,0.34)] transition-transform hover:-translate-y-1"
              >
                <div className="relative h-44 overflow-hidden rounded-[22px] border border-white/10">
                  <img src={game.thumbnail} alt={game.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,23,0.04),rgba(8,12,23,0.22)_58%,rgba(8,12,23,0.82)_100%)]" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                    {game.categories[0]}
                  </span>
                </div>
                <div className="space-y-1 px-1 pb-1 pt-3">
                  <div className="text-base font-bold text-white">{game.title}</div>
                  <div className="line-clamp-1 text-sm text-slate-400">{game.hook}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-950/60 px-4 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.25)] backdrop-blur">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Why Zingcade</span>
            {benefits.map(benefit => (
              <span key={benefit} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
                {benefit}
              </span>
            ))}
          </div>
        </section>

        <section id="new-games" className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">New Games</p>
              <h3 className="text-2xl font-black tracking-[-0.03em] text-white">Fresh additions in the same compact lane.</h3>
            </div>
            <Link href="/games" className="hidden text-sm font-medium text-slate-400 transition-colors hover:text-white sm:inline">
              Open queue
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {newGames.map(game => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0)),rgba(9,14,27,0.96)] p-3 shadow-[0_18px_52px_rgba(0,0,0,0.34)] transition-transform hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden rounded-[22px] border border-white/10">
                  <img src={game.thumbnail} alt={game.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,23,0.06),rgba(8,12,23,0.22)_58%,rgba(8,12,23,0.82)_100%)]" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                    {game.categories[0]}
                  </span>
                </div>
                <div className="space-y-1 px-1 pb-1 pt-3">
                  <div className="text-base font-bold text-white">{game.title}</div>
                  <div className="line-clamp-1 text-sm text-slate-400">{game.hook}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
