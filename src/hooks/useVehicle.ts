import { useMemo } from 'react';
import { getVehicleWithBids } from '../lib/vehicles';
import { useBidsStore } from '../store/bids';

export function useVehicle(id: string | undefined) {
  const store = useBidsStore((s) => s.store);
  return useMemo(() => (id ? getVehicleWithBids(id, store) : null), [id, store]);
}
