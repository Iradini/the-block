import type { VehicleSort } from '../../types/vehicle';

interface SortSelectProps {
  value: VehicleSort;
  onChange: (sort: VehicleSort) => void;
}

const options: { value: VehicleSort; label: string }[] = [
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'year_desc', label: 'Year: Newest' },
  { value: 'year_asc', label: 'Year: Oldest' },
  { value: 'odometer_asc', label: 'Odometer: Low to High' },
  { value: 'condition_desc', label: 'Condition: Best' },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as VehicleSort)}
      aria-label="Sort vehicles"
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-[#1a1a2e]"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
