import { describe, expect, it } from 'vitest';
import {
  getEffectiveBid,
  getMinNextBid,
  getVehicleHighlights,
  getVehicleSubtitle,
  roundUpToIncrement,
} from '../../src/lib/format';
import type { Vehicle } from '../../src/types/vehicle';

const baseVehicle = {
  id: '1',
  vin: 'VIN',
  year: 2023,
  make: 'Ford',
  model: 'Bronco',
  trim: 'Base',
  body_style: 'SUV',
  exterior_color: 'Black',
  interior_color: 'Grey',
  engine: '2.3L',
  transmission: 'automatic',
  drivetrain: '4WD',
  odometer_km: 10000,
  fuel_type: 'gasoline',
  condition_grade: 4,
  condition_report: 'Good',
  damage_notes: [],
  title_status: 'clean' as const,
  province: 'Ontario',
  city: 'Toronto',
  auction_start: '2026-04-05T14:00:00',
  starting_bid: 20000,
  reserve_price: null,
  buy_now_price: null,
  images: [],
  selling_dealership: 'Test Dealer',
  lot: 'A-0001',
  current_bid: null,
  bid_count: 0,
} satisfies Vehicle;

describe('format', () => {
  it('uses starting_bid when current_bid is null', () => {
    expect(getEffectiveBid(baseVehicle)).toBe(20000);
  });

  it('rounds minimum next bid up to nearest $500', () => {
    expect(roundUpToIncrement(20501)).toBe(21000);
    expect(getMinNextBid(21000)).toBe(21500);
  });

  it('builds vehicle subtitle with key specs', () => {
    expect(getVehicleSubtitle(baseVehicle)).toContain('2.3L');
    expect(getVehicleSubtitle(baseVehicle)).toContain('No Reserve');
  });

  it('builds highlight bullets from condition and damage notes', () => {
    const vehicle = {
      ...baseVehicle,
      damage_notes: ['Minor scratch on rear bumper'],
    };
    const highlights = getVehicleHighlights(vehicle);
    expect(highlights[0]).toBe('No reserve — highest bid wins');
    expect(highlights.some((h) => h.includes('scratch'))).toBe(true);
  });
});
