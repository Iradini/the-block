import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import * as vehiclesLib from '../../src/lib/vehicles';
import { useBidsStore } from '../../src/store/bids';
import { fixtureVehicles, FIXED_NOW, getLiveVehicleWithBids, liveVehicle } from '../fixtures/vehicles';
import { mockAuctionStartFromVehicleField } from '../helpers/mockAuction';

describe('bids store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    mockAuctionStartFromVehicleField();
    useBidsStore.setState({ store: {} });
    vi.spyOn(vehiclesLib, 'getAllVehicles').mockReturnValue(fixtureVehicles);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('updates store after successful bid', () => {
    const vehicle = getLiveVehicleWithBids();
    const result = useBidsStore.getState().placeBid(liveVehicle.id, vehicle.min_next_bid);

    expect(result.ok).toBe(true);
    expect(useBidsStore.getState().store[liveVehicle.id]?.currentBid).toBe(vehicle.min_next_bid);
    expect(useBidsStore.getState().hasMyBid(liveVehicle.id)).toBe(true);
  });

  it('does not update store when bid fails', () => {
    const result = useBidsStore.getState().placeBid('missing', 1000);
    expect(result.ok).toBe(false);
    expect(useBidsStore.getState().store).toEqual({});
  });
});
