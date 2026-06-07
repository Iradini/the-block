import { useMemo } from 'react';
import type { VehicleWithBids } from '../../types/vehicle';
import { getRelatedVehicles } from '../../lib/vehicles';
import { useBidsStore } from '../../store/bids';
import { VehicleGrid } from '../browse/VehicleGrid';

interface RelatedVehiclesProps {
  vehicle: VehicleWithBids;
}

export function RelatedVehicles({ vehicle }: RelatedVehiclesProps) {
  const store = useBidsStore((s) => s.store);
  const related = useMemo(
    () => getRelatedVehicles(vehicle.id, store, 4),
    [vehicle.id, store],
  );

  if (related.length === 0) return null;

  return (
    <section className="min-w-0 border-t border-openlane-border pt-8">
      <h2 className="mb-2 text-xl font-bold text-openlane-navy">Related vehicles</h2>
      <p className="mb-6 text-sm text-slate-600">
        Similar listings by make, body style, or region
      </p>
      <VehicleGrid vehicles={related} />
    </section>
  );
}
