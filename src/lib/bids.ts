import type {
  BidStore,
  PlaceBidResult,
  Vehicle,
  VehicleWithBids,
} from '../types/vehicle';
import { getAuctionStatus, getNormalizedAuctionStart } from './auction';
import { getEffectiveBid, getMinNextBid } from './format';

export function mergeVehicleWithBids(
  vehicle: Vehicle,
  store: BidStore,
  allVehicles: Vehicle[],
): VehicleWithBids {
  const override = store[vehicle.id];
  const effective_bid = override?.currentBid ?? getEffectiveBid(vehicle);
  const bid_count = override?.bidCount ?? vehicle.bid_count;
  const my_bids = override?.myBids ?? [];
  const normalized_auction_start = getNormalizedAuctionStart(vehicle, allVehicles);
  const auction_status = getAuctionStatus(normalized_auction_start);

  return {
    ...vehicle,
    effective_bid,
    bid_count,
    my_bids,
    min_next_bid: getMinNextBid(effective_bid),
    auction_status,
    normalized_auction_start,
  };
}

export function placeBid(
  vehicleId: string,
  amount: number,
  vehicles: Vehicle[],
  store: BidStore,
): PlaceBidResult {
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) {
    return { ok: false, error: 'NOT_FOUND', message: 'Vehicle not found.' };
  }

  if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) {
    return { ok: false, error: 'INVALID_AMOUNT', message: 'Enter a valid whole-dollar amount.' };
  }

  const merged = mergeVehicleWithBids(vehicle, store, vehicles);
  if (merged.auction_status === 'ended') {
    return { ok: false, error: 'AUCTION_ENDED', message: 'This auction has ended.' };
  }

  if (amount < merged.min_next_bid) {
    return {
      ok: false,
      error: 'TOO_LOW',
      message: `Minimum bid is ${merged.min_next_bid.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })}.`,
    };
  }

  const existing = store[vehicleId];
  const nextStore: BidStore = {
    ...store,
    [vehicleId]: {
      currentBid: amount,
      bidCount: (existing?.bidCount ?? vehicle.bid_count) + 1,
      myBids: [...(existing?.myBids ?? []), amount],
    },
  };

  return {
    ok: true,
    vehicle: mergeVehicleWithBids(vehicle, nextStore, vehicles),
  };
}
