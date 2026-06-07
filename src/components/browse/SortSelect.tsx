import type { VehicleSort } from '../../types/vehicle';

interface SortSelectProps {
  value: VehicleSort;
  onChange: (sort: VehicleSort) => void;
  className?: string;
}

const options: { value: VehicleSort; label: string }[] = [
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'year_desc', label: 'Year: Newest' },
  { value: 'year_asc', label: 'Year: Oldest' },
  { value: 'odometer_asc', label: 'Odometer: Low to High' },
  { value: 'condition_desc', label: 'Condition: Best' },
];

export function SortSelect({ value, onChange, className = '' }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as VehicleSort)}
      aria-label="Sort vehicles"
      className={`input-field max-w-full ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
