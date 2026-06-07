import type { VehicleFilters } from '../../types/vehicle';

interface FilterOptions {
  makes: string[];
  bodyStyles: string[];
  provinces: string[];
}

interface FilterChipsProps {
  filters: VehicleFilters;
  options: FilterOptions;
  onChange: (filters: VehicleFilters) => void;
  onMoreFilters: () => void;
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? 'filter-chip filter-chip-active' : 'filter-chip'}
    >
      {label}
    </button>
  );
}

export function FilterChips({ filters, options, onChange, onMoreFilters }: FilterChipsProps) {
  const update = (patch: Partial<VehicleFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex w-full min-w-0 items-center gap-2 overflow-x-auto overscroll-x-contain pb-1">
      <Chip
        label="All makes"
        active={!filters.make}
        onClick={() => update({ make: undefined })}
      />
      {options.makes.slice(0, 6).map((make) => (
        <Chip
          key={make}
          label={make}
          active={filters.make === make}
          onClick={() => update({ make: filters.make === make ? undefined : make })}
        />
      ))}
      <span className="mx-1 h-5 w-px shrink-0 bg-openlane-border" aria-hidden />
      <Chip
        label="All body styles"
        active={!filters.bodyStyle}
        onClick={() => update({ bodyStyle: undefined })}
      />
      {options.bodyStyles.map((body) => (
        <Chip
          key={body}
          label={body}
          active={filters.bodyStyle === body}
          onClick={() => update({ bodyStyle: filters.bodyStyle === body ? undefined : body })}
        />
      ))}
      <button type="button" onClick={onMoreFilters} className="filter-chip shrink-0">
        More filters
      </button>
    </div>
  );
}
