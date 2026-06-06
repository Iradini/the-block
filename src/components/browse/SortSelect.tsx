import type { SortOption } from '../../types/vehicle'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'year_desc', label: 'Year: Newest First' },
  { value: 'year_asc', label: 'Year: Oldest First' },
  { value: 'odometer_asc', label: 'Mileage: Lowest' },
  { value: 'condition_desc', label: 'Condition: Best First' },
]

interface SortSelectProps {
  value: SortOption
  onChange: (sort: SortOption) => void
  resultCount: number
}

export function SortSelect({ value, onChange, resultCount }: SortSelectProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-900">{resultCount}</span>{' '}
        vehicle{resultCount !== 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-sm text-gray-500 whitespace-nowrap">
          Sort by
        </label>
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
