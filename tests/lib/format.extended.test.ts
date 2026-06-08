import { describe, expect, it } from 'vitest';
import {
  formatConditionGrade,
  formatCurrency,
  getVehicleHighlightLine,
} from '../../src/lib/format';

const vehicle = {
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
  damage_notes: [] as string[],
  title_status: 'clean' as const,
  province: 'Ontario',
  city: 'Toronto',
  auction_start: '2026-04-05T14:00:00',
  starting_bid: 20000,
  reserve_price: null,
  buy_now_price: null,
  images: [] as string[],
  selling_dealership: 'Test Dealer',
  lot: 'A-0001',
  current_bid: null,
  bid_count: 0,
};

describe('format extended', () => {
  it('formats currency in CAD without decimals', () => {
    expect(formatCurrency(13500)).toMatch(/\$13,500/);
  });

  it('returns fallback for null currency', () => {
    expect(formatCurrency(null)).toBe('—');
  });

  it('maps condition grades to tiers', () => {
    expect(formatConditionGrade(4.2).tier).toBe('excellent');
    expect(formatConditionGrade(3.1).tier).toBe('good');
    expect(formatConditionGrade(2.5).tier).toBe('fair');
    expect(formatConditionGrade(1.5).tier).toBe('poor');
  });

  it('builds highlight line with reserve status', () => {
    expect(getVehicleHighlightLine(vehicle)).toContain('No Reserve');
    expect(
      getVehicleHighlightLine({ ...vehicle, reserve_price: 25000 }),
    ).toContain('Reserve auction');
  });
});
