import { useEffect, useMemo, useState } from 'react';
import type { VehicleFilters, VehicleSort } from '../types/vehicle';
import { getFilterOptions, searchVehicles } from '../lib/vehicles';
import { useBidsStore } from '../store/bids';
import { FilterPanel } from '../components/browse/FilterPanel';
import { SortSelect } from '../components/browse/SortSelect';
import { VehicleGrid } from '../components/browse/VehicleGrid';
import { EmptyState } from '../components/ui/EmptyState';

const emptyFilters: VehicleFilters = {};

export function BrowsePage() {
  const store = useBidsStore((s) => s.store);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<VehicleFilters>(emptyFilters);
  const [sort, setSort] = useState<VehicleSort>('price_desc');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filterOptions = useMemo(() => getFilterOptions(), []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const vehicles = useMemo(
    () => searchVehicles(debouncedQuery, filters, sort, store),
    [debouncedQuery, filters, sort, store],
  );

  const clearFilters = () => setFilters(emptyFilters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search vehicles
          </label>
          <input
            id="search"
            type="search"
            placeholder="Search make, model, lot, dealer, city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-[#1a1a2e]"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 lg:hidden"
          >
            Filters
          </button>
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-4">
            <FilterPanel
              filters={filters}
              options={filterOptions}
              onChange={setFilters}
              onClear={clearFilters}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="mb-4 text-sm text-slate-600">
            {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
          </p>
          {vehicles.length === 0 ? (
            <EmptyState
              title="No vehicles match your search"
              description="Try adjusting your filters or search terms."
            />
          ) : (
            <VehicleGrid vehicles={vehicles} />
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85svh] overflow-y-auto rounded-t-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                className="rounded-lg px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
              >
                Done
              </button>
            </div>
            <FilterPanel
              filters={filters}
              options={filterOptions}
              onChange={setFilters}
              onClear={clearFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
