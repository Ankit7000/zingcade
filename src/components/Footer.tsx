import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="backdrop-blur-glass border-t border-cyan-500/20 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold gradient-text mb-4">ZINGCADE</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium browser arcade games. Play anywhere, anytime.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Games</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/games" className="hover:text-cyan-400 transition-colors">All Games</Link></li>
              <li><Link href="/games?category=Action" className="hover:text-cyan-400 transition-colors">Action</Link></li>
              <li><Link href="/games?category=Puzzle" className="hover:text-cyan-400 transition-colors">Puzzle</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about.html" className="hover:text-cyan-400 transition-colors">About</Link></li>
              <li><Link href="/contact.html" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
              <li><Link href="/privacy.html" className="hover:text-cyan-400 transition-colors">Privacy</Link></li>
              <li><Link href="/terms.html" className="hover:text-cyan-400 transition-colors">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Connect</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Follow us for the latest games and updates.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700/50 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Zingcade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
