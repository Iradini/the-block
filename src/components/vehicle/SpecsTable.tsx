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
    <section className="min-w-0">
      <h2 className="section-title mb-3">Specifications</h2>
      <dl className="card divide-y divide-openlane-border">
        {rows(vehicle).map(([label, value]) => (
          <div key={label} className="flex min-w-0 justify-between gap-3 px-4 py-3 text-sm">
            <dt className="shrink-0 text-slate-500">{label}</dt>
            <dd className="min-w-0 break-words text-right font-medium capitalize text-openlane-navy">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
