import { create } from 'zustand';
import type { BidStore, PlaceBidResult } from '../types/vehicle';
import { placeBid as placeBidLib } from '../lib/bids';
import { getAllVehicles } from '../lib/vehicles';

interface BidsState {
  store: BidStore;
  placeBid: (vehicleId: string, amount: number) => PlaceBidResult;
  hasMyBid: (vehicleId: string) => boolean;
}

export const useBidsStore = create<BidsState>((set, get) => ({
  store: {},
  placeBid: (vehicleId, amount) => {
    const vehicles = getAllVehicles();
    const result = placeBidLib(vehicleId, amount, vehicles, get().store);
    if (result.ok) {
      set({
        store: {
          ...get().store,
          [vehicleId]: {
            currentBid: result.vehicle.effective_bid,
            bidCount: result.vehicle.bid_count,
            myBids: result.vehicle.my_bids,
          },
        },
      });
    }
    return result;
  },
  hasMyBid: (vehicleId) => (get().store[vehicleId]?.myBids.length ?? 0) > 0,
}));