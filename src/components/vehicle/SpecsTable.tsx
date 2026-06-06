import type { Vehicle } from '../../types/vehicle'
import { formatKm, capitalize } from '../../lib/format'

interface SpecsTableProps {
  vehicle: Vehicle
}

export function SpecsTable({ vehicle }: SpecsTableProps) {
  const rows: { label: string; value: string }[] = [
    { label: 'Year', value: String(vehicle.year) },
    { label: 'Make', value: vehicle.make },
    { label: 'Model', value: vehicle.model },
    { label: 'Trim', value: vehicle.trim },
    { label: 'Body Style', value: capitalize(vehicle.body_style) },
    { label: 'Engine', value: vehicle.engine },
    { label: 'Transmission', value: capitalize(vehicle.transmission) },
    { label: 'Drivetrain', value: vehicle.drivetrain },
    { label: 'Odometer', value: formatKm(vehicle.odometer_km) },
    { label: 'Fuel Type', value: capitalize(vehicle.fuel_type) },
    { label: 'Exterior Color', value: vehicle.exterior_color },
    { label: 'Interior Color', value: vehicle.interior_color },
  ]

  return (
    <dl className="divide-y divide-gray-100">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex py-2.5 gap-4">
          <dt className="w-36 text-sm text-gray-500 flex-shrink-0">{label}</dt>
          <dd className="text-sm font-medium text-gray-900">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
