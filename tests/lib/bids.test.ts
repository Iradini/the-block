import { describe, expect, it } from 'vitest';
import { mergeVehicleWithBids, placeBid } from '../../src/lib/bids';
import { getAllVehicles } from '../../src/lib/vehicles';

describe('bids', () => {
  const vehicles = getAllVehicles();

  it('rejects bids below minimum increment', () => {
    const vehicle = vehicles.find((v) => v.auction_start)!;
    const merged = mergeVehicleWithBids(vehicle, {}, vehicles);
    const result = placeBid(vehicle.id, merged.min_next_bid - 1, vehicles, {});

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('TOO_LOW');
    }
  });

  it('rejects non-integer bid amounts', () => {
    const vehicle = vehicles[0];
    const result = placeBid(vehicle.id, 100.5, vehicles, {});

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('INVALID_AMOUNT');
    }
  });

  it('updates bid state on valid bid', () => {
    const vehicle = vehicles.find((v) => v.current_bid !== null) ?? vehicles[0];
    const merged = mergeVehicleWithBids(vehicle, {}, vehicles);
    if (merged.auction_status === 'ended') return;

    const result = placeBid(vehicle.id, merged.min_next_bid, vehicles, {});
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.vehicle.effective_bid).toBe(merged.min_next_bid);
      expect(result.vehicle.bid_count).toBe(vehicle.bid_count + 1);
      expect(result.vehicle.my_bids).toContain(merged.min_next_bid);
    }
  });
});
