import type { VehicleFilters } from '../../types/vehicle';

interface FilterOptions {
  makes: string[];
  bodyStyles: string[];
  provinces: string[];
}

interface FilterPanelProps {
  filters: VehicleFilters;
  options: FilterOptions;
  onChange: (filters: VehicleFilters) => void;
  onClear: () => void;
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-sm font-medium text-openlane-navy">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-sm font-medium text-openlane-navy">{label}</label>
      <input
        type="number"
        min={0}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        className="input-field"
      />
    </div>
  );
}

export function FilterPanel({ filters, options, onChange, onClear }: FilterPanelProps) {
  const update = (patch: Partial<VehicleFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Filters</h2>
        <button type="button" onClick={onClear} className="text-sm font-medium text-openlane-blue hover:underline">
          Clear all
        </button>
      </div>

      <SelectField
        label="Make"
        value={filters.make ?? ''}
        options={options.makes}
        onChange={(v) => update({ make: v || undefined })}
      />
      <SelectField
        label="Body style"
        value={filters.bodyStyle ?? ''}
        options={options.bodyStyles}
        onChange={(v) => update({ bodyStyle: v || undefined })}
      />
      <SelectField
        label="Province"
        value={filters.province ?? ''}
        options={options.provinces}
        onChange={(v) => update({ province: v || undefined })}
      />
      <NumberField
        label="Min price (CAD)"
        value={filters.minPrice}
        onChange={(v) => update({ minPrice: v })}
      />
      <NumberField
        label="Max price (CAD)"
        value={filters.maxPrice}
        onChange={(v) => update({ maxPrice: v })}
      />
      <NumberField
        label="Min condition (1–5)"
        value={filters.minCondition}
        onChange={(v) => update({ minCondition: v })}
      />
      <NumberField
        label="Max condition (1–5)"
        value={filters.maxCondition}
        onChange={(v) => update({ maxCondition: v })}
      />
    </div>
  );
}
