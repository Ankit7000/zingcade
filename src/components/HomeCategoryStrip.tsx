import Link from 'next/link'
import { games } from '@/data/games'

type CategoryLane = {
  label: string
  href: string
  thumbnail: string
  accent: string
}

const lanes: CategoryLane[] = [
  {
    label: 'Fast Runs',
    href: '/games?category=Action',
    thumbnail: games.find(game => game.slug === 'neon-dash')?.thumbnail ?? '',
    accent: 'from-cyan-400/45 via-cyan-300/10 to-transparent',
  },
  {
    label: 'Merge & Puzzle',
    href: '/games?category=Puzzle',
    thumbnail: games.find(game => game.slug === 'merge-monster-2048')?.thumbnail ?? '',
    accent: 'from-emerald-400/45 via-emerald-300/10 to-transparent',
  },
  {
    label: 'Daily Brain',
    href: '/games?category=Daily%20Challenge',
    thumbnail: games.find(game => game.slug === 'daily-vault')?.thumbnail ?? '',
    accent: 'from-amber-400/45 via-amber-300/10 to-transparent',
  },
  {
    label: 'Claim Territory',
    href: '/games?category=Control',
    thumbnail: games.find(game => game.slug === 'color-crown')?.thumbnail ?? '',
    accent: 'from-fuchsia-400/45 via-fuchsia-300/10 to-transparent',
  },
  {
    label: 'Idle Growth',
    href: '/games?category=Idle',
    thumbnail: games.find(game => game.slug === 'arcade-tycoon')?.thumbnail ?? '',
    accent: 'from-violet-400/45 via-violet-300/10 to-transparent',
  },
  {
    label: 'Arcade Survival',
    href: '/games?category=Arcade%20Survival',
    thumbnail: games.find(game => game.slug === 'dont-stop-ball')?.thumbnail ?? '',
    accent: 'from-orange-400/45 via-orange-300/10 to-transparent',
  },
]

export default function HomeCategoryStrip() {
  return (
    <div className="hide-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {lanes.map((lane) => (
        <Link
          key={lane.label}
          href={lane.href}
          className="group relative block min-w-[11.25rem] overflow-hidden rounded-[18px] border border-white/8 bg-slate-900/70 sm:min-w-[13rem] lg:min-w-[14rem]"
        >
          <div className="aspect-[2.15] w-full overflow-hidden">
            <img
              src={lane.thumbnail}
              alt={lane.label}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className={`absolute inset-0 bg-gradient-to-br ${lane.accent}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
            <span className="max-w-[8rem] text-sm font-bold leading-tight text-white sm:text-base">
              {lane.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
