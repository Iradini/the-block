import { describe, expect, it } from 'vitest';
import {
  getFeaturedVehicles,
  getFilterOptions,
  getVehicleWithBids,
  searchVehicles,
} from '../../src/lib/vehicles';

describe('vehicles search and filters', () => {
  it('returns all vehicles for empty search', () => {
    expect(searchVehicles('', {}, 'price_desc')).toHaveLength(200);
  });

  it('returns no vehicles for gibberish search', () => {
    expect(searchVehicles('xyznomatch123', {}, 'price_desc')).toHaveLength(0);
  });

  it('searches ford case-insensitively as make only', () => {
    const lower = searchVehicles('ford', {}, 'price_desc');
    const upper = searchVehicles('FORD', {}, 'price_desc');
    expect(lower.length).toBeGreaterThan(0);
    expect(lower.every((v) => v.make === 'Ford')).toBe(true);
    expect(upper.map((v) => v.id)).toEqual(lower.map((v) => v.id));
  });

  it('searches toronto as city only and excludes other ontario cities', () => {
    const results = searchVehicles('Toronto', {}, 'price_desc');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((v) => v.city === 'Toronto')).toBe(true);
    expect(results.some((v) => v.city === 'Hamilton')).toBe(false);
  });

  it('does not match toronto inside dealership names in other cities', () => {
    const results = searchVehicles('Toronto', {}, 'price_desc');
    expect(results.every((v) => v.selling_dealership === 'AutoPark Toronto' ? v.city === 'Toronto' : true)).toBe(
      true,
    );
  });

  it('searches ontario as province only', () => {
    const results = searchVehicles('Ontario', {}, 'price_desc');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((v) => v.province === 'Ontario')).toBe(true);
  });

  it('filters by make', () => {
    const results = searchVehicles('', { make: 'Ford' }, 'price_desc');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((v) => v.make === 'Ford')).toBe(true);
  });

  it('filters by price range using effective bid', () => {
    const results = searchVehicles('', { minPrice: 50000, maxPrice: 60000 }, 'price_desc');
    expect(results.every((v) => v.effective_bid >= 50000 && v.effective_bid <= 60000)).toBe(true);
  });

  it('sorts by price ascending', () => {
    const results = searchVehicles('', {}, 'price_asc');
    for (let i = 1; i < results.length; i += 1) {
      expect(results[i].effective_bid).toBeGreaterThanOrEqual(results[i - 1].effective_bid);
    }
  });

  it('applies store bid overrides when filtering by price', () => {
    const vehicle = searchVehicles('', {}, 'price_desc')[0];
    const store = {
      [vehicle.id]: { currentBid: 999999, bidCount: 1, myBids: [999999] },
    };
    const results = searchVehicles('', { minPrice: 990000 }, 'price_desc', store);
    expect(results.some((v) => v.id === vehicle.id)).toBe(true);
  });

  it('returns null from getVehicleWithBids for unknown id', () => {
    expect(getVehicleWithBids('not-real', {})).toBeNull();
  });

  it('returns featured vehicles preferring live auctions', () => {
    const featured = getFeaturedVehicles({}, 8);
    expect(featured.length).toBeLessThanOrEqual(8);
    const firstLiveIndex = featured.findIndex((v) => v.auction_status === 'live');
    const firstEndedIndex = featured.findIndex((v) => v.auction_status === 'ended');
    if (firstLiveIndex >= 0 && firstEndedIndex >= 0) {
      expect(firstLiveIndex).toBeLessThan(firstEndedIndex);
    }
  });

  it('returns sorted filter options', () => {
    const options = getFilterOptions();
    expect(options.makes).toEqual([...options.makes].sort());
    expect(options.bodyStyles).toEqual([...options.bodyStyles].sort());
    expect(options.provinces).toEqual([...options.provinces].sort());
  });
});
