import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { mergeVehicleWithBids, placeBid } from '../../src/lib/bids';
import {
  endedVehicle,
  fixtureVehicles,
  FIXED_NOW,
  liveVehicle,
} from '../fixtures/vehicles';

import { mockAuctionStartFromVehicleField } from '../helpers/mockAuction';

describe('bids extended', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    mockAuctionStartFromVehicleField();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rejects bid when vehicle id is not found', () => {
    const result = placeBid('missing-id', 25000, fixtureVehicles, {});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('NOT_FOUND');
  });

  it('rejects zero and negative bid amounts', () => {
    const merged = mergeVehicleWithBids(liveVehicle, {}, fixtureVehicles);
    expect(placeBid(liveVehicle.id, 0, fixtureVehicles, {}).ok).toBe(false);
    expect(placeBid(liveVehicle.id, -100, fixtureVehicles, {}).ok).toBe(false);
    expect(placeBid(liveVehicle.id, merged.min_next_bid, fixtureVehicles, {}).ok).toBe(true);
  });

  it('rejects NaN and Infinity amounts', () => {
    expect(placeBid(liveVehicle.id, Number.NaN, fixtureVehicles, {}).ok).toBe(false);
    expect(placeBid(liveVehicle.id, Number.POSITIVE_INFINITY, fixtureVehicles, {}).ok).toBe(false);
  });

  it('rejects bids when auction has ended', () => {
    const merged = mergeVehicleWithBids(endedVehicle, {}, fixtureVehicles);
    const result = placeBid(endedVehicle.id, merged.min_next_bid, fixtureVehicles, {});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('AUCTION_ENDED');
  });

  it('accepts bid equal to minimum next bid on live auction', () => {
    const merged = mergeVehicleWithBids(liveVehicle, {}, fixtureVehicles);
    const result = placeBid(liveVehicle.id, merged.min_next_bid, fixtureVehicles, {});
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.vehicle.effective_bid).toBe(merged.min_next_bid);
      expect(result.vehicle.bid_count).toBe(1);
      expect(result.vehicle.my_bids).toEqual([merged.min_next_bid]);
    }
  });

  it('accumulates bid state across multiple valid bids', () => {
    const first = mergeVehicleWithBids(liveVehicle, {}, fixtureVehicles);
    const firstBid = placeBid(liveVehicle.id, first.min_next_bid, fixtureVehicles, {});
    expect(firstBid.ok).toBe(true);
    if (!firstBid.ok) return;

    const store = {
      [liveVehicle.id]: {
        currentBid: firstBid.vehicle.effective_bid,
        bidCount: firstBid.vehicle.bid_count,
        myBids: firstBid.vehicle.my_bids,
      },
    };

    const second = mergeVehicleWithBids(liveVehicle, store, fixtureVehicles);
    const secondBid = placeBid(liveVehicle.id, second.min_next_bid, fixtureVehicles, store);
    expect(secondBid.ok).toBe(true);
    if (secondBid.ok) {
      expect(secondBid.vehicle.bid_count).toBe(2);
      expect(secondBid.vehicle.my_bids).toHaveLength(2);
    }
  });

  it('uses store override for effective bid and next minimum', () => {
    const store = {
      [liveVehicle.id]: { currentBid: 30000, bidCount: 2, myBids: [25000, 30000] },
    };
    const merged = mergeVehicleWithBids(liveVehicle, store, fixtureVehicles);
    expect(merged.effective_bid).toBe(30000);
    expect(merged.min_next_bid).toBe(30500);
  });
});
