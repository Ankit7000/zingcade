import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1380px] rounded-full border border-white/10 bg-slate-950/70 px-4 py-3 shadow-[0_20px_44px_rgba(0,0,0,0.24)] backdrop-blur">
        <div className="grid items-center gap-3 xl:grid-cols-[auto_auto_minmax(260px,1fr)_auto]">
          <Link href="/" className="inline-flex min-w-max items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgba(184,255,57,0.94),rgba(119,190,255,0.96))] text-base font-black text-slate-950 shadow-[0_14px_26px_rgba(184,255,57,0.22)]">
              Z
            </span>
            <span className="text-lg font-extrabold uppercase tracking-[0.08em] text-white">Zingcade</span>
          </Link>

          <nav className="flex min-w-max flex-wrap items-center gap-5 text-sm font-medium text-slate-300">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <Link href="/games" className="transition-colors hover:text-white">
              Games
            </Link>
            <Link href="/#new-games" className="transition-colors hover:text-white">
              New
            </Link>
            <Link href="/#popular" className="transition-colors hover:text-white">
              Popular
            </Link>
          </nav>

          <form role="search" className="flex h-12 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4">
            <span className="relative h-4 w-4 rounded-full border-2 border-slate-400">
              <span className="absolute bottom-[-4px] right-[-5px] h-0.5 w-2 rotate-45 rounded-full bg-slate-400" />
            </span>
            <input
              type="search"
              placeholder="Search games"
              aria-label="Search games"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </form>

          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
          >
            Sign in
          </button>
        </div>
      </div>
    </header>
  )
}
