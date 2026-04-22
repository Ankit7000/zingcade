'use client'

interface CategoryPillsProps {
  categories: string[]
  selected?: string | null
  onSelect?: (category: string | null) => void
}

export default function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 hide-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      <button
        onClick={() => onSelect?.(null)}
        className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-cyan-500 text-black'
            : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
        }`}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelect?.(category)}
          className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-colors ${
            selected === category
              ? 'bg-cyan-500 text-black'
              : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
