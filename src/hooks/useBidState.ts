import { useMemo } from 'react';
import type { Vehicle } from '../types/vehicle';
import { mergeVehicleWithBids } from '../lib/bids';
import { getAllVehicles } from '../lib/vehicles';
import { useBidsStore } from '../store/bids';

export function useBidState(vehicle: Vehicle) {
  const store = useBidsStore((s) => s.store);
  return useMemo(
    () => mergeVehicleWithBids(vehicle, store, getAllVehicles()),
    [vehicle, store],
  );
}