import type { VehicleWithBids } from '../../types/vehicle';
import { VehicleCard } from './VehicleCard';

interface FeaturedRowProps {
  vehicles: VehicleWithBids[];
}

export function FeaturedRow({ vehicles }: FeaturedRowProps) {
  if (vehicles.length === 0) return null;

  return (
    <section className="border-b border-openlane-border bg-white py-5">
      <div className="page-container mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-openlane-navy">Featured</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:px-6 lg:mx-auto lg:max-w-7xl">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="w-56 shrink-0 sm:w-64">
            <VehicleCard vehicle={vehicle} compact />
          </div>
        ))}
      </div>
    </section>
  );
}
