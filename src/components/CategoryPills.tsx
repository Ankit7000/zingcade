'use client'

interface CategoryPillsProps {
  categories: string[]
  selected?: string | null
  onSelect?: (category: string | null) => void
}

export default function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect?.(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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