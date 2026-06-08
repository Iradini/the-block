import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { mergeVehicleWithBids, placeBid } from '../../src/lib/bids';
import {
  fixtureVehicles,
  FIXED_NOW,
  liveVehicle,
} from '../fixtures/vehicles';
import { mockAuctionStartFromVehicleField } from '../helpers/mockAuction';

describe('bids', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    mockAuctionStartFromVehicleField();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rejects bids below minimum increment', () => {
    const merged = mergeVehicleWithBids(liveVehicle, {}, fixtureVehicles);
    const result = placeBid(liveVehicle.id, merged.min_next_bid - 1, fixtureVehicles, {});

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('TOO_LOW');
    }
  });

  it('rejects non-integer bid amounts', () => {
    const result = placeBid(liveVehicle.id, 100.5, fixtureVehicles, {});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('INVALID_AMOUNT');
    }
  });

  it('updates bid state on valid bid', () => {
    const merged = mergeVehicleWithBids(liveVehicle, {}, fixtureVehicles);
    expect(merged.auction_status).toBe('live');

    const result = placeBid(liveVehicle.id, merged.min_next_bid, fixtureVehicles, {});
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.vehicle.effective_bid).toBe(merged.min_next_bid);
      expect(result.vehicle.bid_count).toBe(1);
      expect(result.vehicle.my_bids).toContain(merged.min_next_bid);
    }
  });
});
