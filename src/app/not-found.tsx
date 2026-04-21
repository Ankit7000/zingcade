export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold gradient-text">404</h1>
        <h2 className="text-2xl font-bold">Game Not Found</h2>
        <p className="text-gray-400">The game you're looking for doesn't exist.</p>
        <a href="/games" className="inline-block px-6 py-3 bg-cyan-500 text-black rounded-lg font-medium hover:bg-cyan-400 transition-colors">
          Browse All Games
        </a>
      </div>
    </div>
  )
}