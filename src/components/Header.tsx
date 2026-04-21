import Link from 'next/link'

export default function Header() {
  return (
    <header className="backdrop-blur-glass border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform">
            ZINGCADE
          </Link>
          <nav className="space-x-8">
            <Link href="/" className="hover:text-cyan-400 transition-colors font-medium">
              Home
            </Link>
            <Link href="/games" className="hover:text-cyan-400 transition-colors font-medium">
              Games
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}