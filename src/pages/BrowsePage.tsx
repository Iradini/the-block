import { useEffect, useMemo, useState } from 'react';
import type { VehicleFilters, VehicleSort } from '../types/vehicle';
import { getFeaturedVehicles, getFilterOptions, searchVehicles } from '../lib/vehicles';
import { useBidsStore } from '../store/bids';
import { FeaturedRow } from '../components/browse/FeaturedRow';
import { FilterChips } from '../components/browse/FilterChips';
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

  const featured = useMemo(() => getFeaturedVehicles(store, 8), [store]);

  const clearFilters = () => setFilters(emptyFilters);

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-openlane-bg">
      <div className="page-container py-4 sm:py-5">
        <h1 className="text-2xl font-bold text-openlane-navy">Auctions</h1>
        <p className="mt-1 text-sm text-slate-600">
          Wholesale inventory · {vehicles.length} listing{vehicles.length !== 1 ? 's' : ''}
        </p>

        <div className="mt-4 flex w-full min-w-0 flex-col gap-3">
          <label htmlFor="search" className="sr-only">
            Search vehicles
          </label>
          <input
            id="search"
            type="search"
            placeholder="Search make, model, lot, dealer, city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field"
          />
          <div className="flex w-full min-w-0 justify-end">
            <SortSelect value={sort} onChange={setSort} className="w-full max-w-xs" />
          </div>
          <FilterChips
            filters={filters}
            options={filterOptions}
            onChange={setFilters}
            onMoreFilters={() => setFiltersOpen(true)}
          />
        </div>
      </div>

      <FeaturedRow vehicles={featured} />

      <div className="page-container py-6">
        {vehicles.length === 0 ? (
          <EmptyState
            title="No vehicles match your search"
            description="Try adjusting your filters or search terms."
          />
        ) : (
          <VehicleGrid vehicles={vehicles} />
        )}
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85svh] overflow-y-auto overflow-x-hidden rounded-t-2xl bg-white p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title">Filters</h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                className="btn-secondary px-3 py-1.5"
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
