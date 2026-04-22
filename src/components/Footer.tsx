'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  if (pathname === '/') {
    return null
  }

  return (
    <footer className="px-4 pb-6 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-[1380px] flex-col gap-4 rounded-[26px] border border-white/10 bg-slate-950/70 px-5 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-400">Zingcade. Premium instant-play browser arcade.</div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <Link href="/games" className="transition-colors hover:text-white">
            Games
          </Link>
          <Link href="/about.html" className="transition-colors hover:text-white">
            About
          </Link>
          <Link href="/contact.html" className="transition-colors hover:text-white">
            Contact
          </Link>
          <Link href="/privacy.html" className="transition-colors hover:text-white">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
