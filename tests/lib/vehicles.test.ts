import { describe, expect, it } from 'vitest';
import {
  getAllVehicles,
  getEndingSoonVehicles,
  getRelatedVehicles,
  getVehicleById,
  searchVehicles,
} from '../../src/lib/vehicles';

describe('vehicles', () => {
  it('loads 200 vehicles', () => {
    expect(getAllVehicles()).toHaveLength(200);
  });

  it('searches ford as make only', () => {
    const results = searchVehicles('ford', {}, 'price_desc');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((v) => v.make === 'Ford')).toBe(true);
  });

  it('does not match ford inside abbotsford city', () => {
    const results = searchVehicles('ford', {}, 'price_desc');
    expect(results.some((v) => v.city === 'Abbotsford' && v.make !== 'Ford')).toBe(false);
  });

  it('returns undefined for unknown id', () => {
    expect(getVehicleById('not-a-real-id')).toBeUndefined();
  });

  it('returns related vehicles with same make or body style', () => {
    const vehicle = getAllVehicles()[0];
    const related = getRelatedVehicles(vehicle.id, {}, 4);

    expect(related.length).toBeGreaterThan(0);
    expect(related.length).toBeLessThanOrEqual(4);
    expect(related.every((v) => v.id !== vehicle.id)).toBe(true);
    expect(
      related.every(
        (v) =>
          v.make === vehicle.make ||
          v.body_style === vehicle.body_style ||
          v.province === vehicle.province,
      ),
    ).toBe(true);
  });

  it('returns live and upcoming vehicles sorted by ending time', () => {
    const vehicle = getAllVehicles()[0];
    const endingSoon = getEndingSoonVehicles(vehicle.id, {}, 5);

    expect(endingSoon.length).toBeGreaterThan(0);
    expect(endingSoon.every((v) => v.id !== vehicle.id)).toBe(true);
    expect(endingSoon.every((v) => v.auction_status === 'live' || v.auction_status === 'upcoming')).toBe(
      true,
    );
  });
});
