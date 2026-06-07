import type { VehicleWithBids } from '../../types/vehicle';
import { formatKm } from '../../lib/format';

interface SpecsTableProps {
  vehicle: VehicleWithBids;
}

const rows = (vehicle: VehicleWithBids) => [
  ['Year', String(vehicle.year)],
  ['Make / Model', `${vehicle.make} ${vehicle.model}`],
  ['Trim', vehicle.trim],
  ['Body style', vehicle.body_style],
  ['Engine', vehicle.engine],
  ['Transmission', vehicle.transmission],
  ['Drivetrain', vehicle.drivetrain],
  ['Odometer', formatKm(vehicle.odometer_km)],
  ['Fuel type', vehicle.fuel_type],
  ['Exterior', vehicle.exterior_color],
  ['Interior', vehicle.interior_color],
  ['Title status', vehicle.title_status],
];

export function SpecsTable({ vehicle }: SpecsTableProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Specifications</h2>
      <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {rows(vehicle).map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 px-4 py-3 text-sm">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-right font-medium capitalize text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
