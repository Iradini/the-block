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
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-[#1a1a2e]"
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
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="number"
        min={0}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-[#1a1a2e]"
      />
    </div>
  );
}

export function FilterPanel({ filters, options, onChange, onClear }: FilterPanelProps) {
  const update = (patch: Partial<VehicleFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-[#1a1a2e] hover:underline"
        >
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
