import { useState, useMemo } from 'react'
import type { VehicleFilters, SortOption } from '../types/vehicle'
import { searchVehicles, getFilterOptions } from '../lib/vehicles'
import { Header } from '../components/layout/Header'
import { FilterPanel } from '../components/browse/FilterPanel'
import { SortSelect } from '../components/browse/SortSelect'
import { VehicleGrid } from '../components/browse/VehicleGrid'
import { EmptyState } from '../components/ui/EmptyState'

const EMPTY_FILTERS: VehicleFilters = {}
const filterOptions = getFilterOptions()

function activeFilterCount(filters: VehicleFilters): number {
  return Object.values(filters).filter((v) => v !== undefined && v !== '').length
}

export function BrowsePage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<VehicleFilters>(EMPTY_FILTERS)
  const [sort, setSort] = useState<SortOption>('price_desc')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const vehicles = useMemo(
    () => searchVehicles(query, filters, sort),
    [query, filters, sort]
  )

  const activeCount = activeFilterCount(filters)

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
    setQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header>
        {/* Search bar */}
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search make, model, year, dealer…"
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-800 text-white placeholder-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            aria-label="Search vehicles"
          />
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setFiltersOpen(true)}
          className="lg:hidden flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Open filters${activeCount > 0 ? `, ${activeCount} active` : ''}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zM6 10a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zM9 16a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {activeCount}
            </span>
          )}
        </button>
      </Header>

      <main>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar — desktop */}
            <aside className="hidden lg:block w-52 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sticky top-20">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Filters</h2>
                <FilterPanel
                  filters={filters}
                  options={filterOptions}
                  onChange={setFilters}
                  onClear={clearFilters}
                />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <SortSelect value={sort} onChange={setSort} resultCount={vehicles.length} />

              <div className="mt-4">
                {vehicles.length === 0 ? (
                  <EmptyState
                    title="No vehicles found"
                    description="Try adjusting your search or clearing some filters."
                    action={{ label: 'Clear filters', onClick: clearFilters }}
                  />
                ) : (
                  <VehicleGrid vehicles={vehicles} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 lg:hidden overflow-y-auto shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close filters"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <FilterPanel
                filters={filters}
                options={filterOptions}
                onChange={(f) => { setFilters(f) }}
                onClear={() => { setFilters(EMPTY_FILTERS); setFiltersOpen(false) }}
              />
            </div>
            <div className="px-4 pb-6">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Show {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
