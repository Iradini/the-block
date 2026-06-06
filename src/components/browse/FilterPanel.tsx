import type { VehicleFilters } from '../../types/vehicle'
import type { FilterOptions } from '../../lib/vehicles'
import { capitalize } from '../../lib/format'

interface FilterPanelProps {
  filters: VehicleFilters
  options: FilterOptions
  onChange: (filters: VehicleFilters) => void
  onClear: () => void
}

const selectClass =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900'

const labelClass =
  'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'

function hasActiveFilters(f: VehicleFilters): boolean {
  return Object.values(f).some((v) => v !== undefined && v !== '')
}

export function FilterPanel({ filters, options, onChange, onClear }: FilterPanelProps) {
  return (
    <div className="space-y-5">
      {hasActiveFilters(filters) && (
        <button
          onClick={onClear}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
        >
          Clear all filters
        </button>
      )}

      {/* Make */}
      <div>
        <label htmlFor="filter-make" className={labelClass}>
          Make
        </label>
        <select
          id="filter-make"
          value={filters.make ?? ''}
          onChange={(e) => onChange({ ...filters, make: e.target.value || undefined })}
          className={selectClass}
        >
          <option value="">All Makes</option>
          {options.makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>

      {/* Body Style */}
      <div>
        <label htmlFor="filter-body" className={labelClass}>
          Body Style
        </label>
        <select
          id="filter-body"
          value={filters.bodyStyle ?? ''}
          onChange={(e) => onChange({ ...filters, bodyStyle: e.target.value || undefined })}
          className={selectClass}
        >
          <option value="">All Body Styles</option>
          {options.bodyStyles.map((style) => (
            <option key={style} value={style}>
              {capitalize(style)}
            </option>
          ))}
        </select>
      </div>

      {/* Province */}
      <div>
        <label htmlFor="filter-province" className={labelClass}>
          Province
        </label>
        <select
          id="filter-province"
          value={filters.province ?? ''}
          onChange={(e) => onChange({ ...filters, province: e.target.value || undefined })}
          className={selectClass}
        >
          <option value="">All Provinces</option>
          {options.provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <span className={labelClass}>Price Range (CAD)</span>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className={selectClass}
            min={0}
            step={1000}
            aria-label="Minimum price"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className={selectClass}
            min={0}
            step={1000}
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Condition Grade */}
      <div>
        <span className={labelClass}>Condition Grade</span>
        <div className="flex gap-2">
          <select
            value={filters.minCondition ?? ''}
            onChange={(e) =>
              onChange({ ...filters, minCondition: e.target.value ? Number(e.target.value) : undefined })
            }
            className={selectClass}
            aria-label="Minimum condition grade"
          >
            <option value="">Min</option>
            <option value="1">1.0+</option>
            <option value="2">2.0+</option>
            <option value="3">3.0+</option>
            <option value="4">4.0+</option>
          </select>
          <select
            value={filters.maxCondition ?? ''}
            onChange={(e) =>
              onChange({ ...filters, maxCondition: e.target.value ? Number(e.target.value) : undefined })
            }
            className={selectClass}
            aria-label="Maximum condition grade"
          >
            <option value="">Max</option>
            <option value="2">2.0</option>
            <option value="3">3.0</option>
            <option value="4">4.0</option>
            <option value="5">5.0</option>
          </select>
        </div>
      </div>
    </div>
  )
}
