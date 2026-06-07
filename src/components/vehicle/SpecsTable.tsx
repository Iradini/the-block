import type { VehicleWithBids } from '../../types/vehicle';
import { formatAuctionEndLabel } from '../../lib/auction';
import { formatCurrency, formatKm } from '../../lib/format';

interface SpecGroup {
  title: string;
  rows: [string, string][];
}

function getSpecGroups(vehicle: VehicleWithBids): SpecGroup[] {
  return [
    {
      title: 'Vehicle',
      rows: [
        ['Year', String(vehicle.year)],
        ['Make / Model', `${vehicle.make} ${vehicle.model}`],
        ['Trim', vehicle.trim],
        ['Body style', vehicle.body_style],
        ['Exterior', vehicle.exterior_color],
        ['Interior', vehicle.interior_color],
        ['Odometer', formatKm(vehicle.odometer_km)],
        ['Title status', vehicle.title_status],
      ],
    },
    {
      title: 'Powertrain',
      rows: [
        ['Engine', vehicle.engine],
        ['Transmission', vehicle.transmission],
        ['Drivetrain', vehicle.drivetrain],
        ['Fuel type', vehicle.fuel_type],
      ],
    },
    {
      title: 'Auction',
      rows: [
        ['Lot', vehicle.lot],
        ['Dealer', vehicle.selling_dealership],
        ['Location', `${vehicle.city}, ${vehicle.province}`],
        ['VIN', vehicle.vin],
        [
          'Reserve',
          vehicle.reserve_price === null ? 'No reserve' : formatCurrency(vehicle.reserve_price),
        ],
        [
          'Schedule',
          formatAuctionEndLabel(vehicle.auction_status, vehicle.normalized_auction_start),
        ],
      ],
    },
  ];
}

interface SpecsTableProps {
  vehicle: VehicleWithBids;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-openlane-border py-3 last:border-b-0 md:border-b-0 md:py-2.5">
      <dt className="spec-label">{label}</dt>
      <dd className="spec-value mt-1 break-words md:mt-1.5">{value}</dd>
    </div>
  );
}

export function SpecsTable({ vehicle }: SpecsTableProps) {
  const groups = getSpecGroups(vehicle);

  return (
    <section id="specifications" className="min-w-0 scroll-mt-24">
      <h2 className="section-title mb-4">Specifications</h2>
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-openlane-blue">
              {group.title}
            </h3>
            <dl className="card divide-y divide-openlane-border p-4 md:divide-y-0 md:p-5">
              <div className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-1">
                {group.rows.map(([label, value]) => (
                  <SpecRow key={`${group.title}-${label}`} label={label} value={value} />
                ))}
              </div>
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
