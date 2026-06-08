import type { Vehicle, VehicleWithBids } from '../../src/types/vehicle';
import { mergeVehicleWithBids } from '../../src/lib/bids';

export const FIXED_NOW = new Date('2026-06-05T14:00:00Z');

function baseVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
  return {
    id: 'vehicle-1',
    vin: '1HGBH41JXMN109186',
    year: 2024,
    make: 'Ford',
    model: 'Bronco',
    trim: 'Outer Banks',
    body_style: 'SUV',
    exterior_color: 'Blue',
    interior_color: 'Black',
    engine: '2.3L Turbo I4',
    transmission: 'automatic',
    drivetrain: '4WD',
    odometer_km: 12000,
    fuel_type: 'gasoline',
    condition_grade: 3.5,
    condition_report: 'Good overall condition.',
    damage_notes: [],
    title_status: 'clean',
    province: 'Ontario',
    city: 'Toronto',
    auction_start: new Date(FIXED_NOW.getTime() - 30 * 60 * 1000).toISOString(),
    starting_bid: 20000,
    reserve_price: 25000,
    buy_now_price: null,
    images: ['https://example.com/photo.jpg'],
    selling_dealership: 'Metro Ford Toronto',
    lot: 'A-0001',
    current_bid: null,
    bid_count: 0,
    ...overrides,
  };
}

export const liveVehicle = baseVehicle({ id: 'live-1' });

export const endedVehicle = baseVehicle({
  id: 'ended-1',
  auction_start: new Date(FIXED_NOW.getTime() - 3 * 60 * 60 * 1000).toISOString(),
  lot: 'A-0002',
});

export const hamiltonDealerTorontoName = baseVehicle({
  id: 'hamilton-1',
  city: 'Hamilton',
  selling_dealership: 'AutoPark Toronto',
  lot: 'A-0003',
  make: 'Toyota',
  model: 'Camry',
});

export const fixtureVehicles: Vehicle[] = [liveVehicle, endedVehicle, hamiltonDealerTorontoName];

export function getVehicleWithBidsFixture(
  vehicle: Vehicle,
  allVehicles: Vehicle[] = fixtureVehicles,
): VehicleWithBids {
  return mergeVehicleWithBids(vehicle, {}, allVehicles);
}

export function getLiveVehicleWithBids(): VehicleWithBids {
  return getVehicleWithBidsFixture(liveVehicle);
}

export function getEndedVehicleWithBids(): VehicleWithBids {
  return getVehicleWithBidsFixture(endedVehicle);
}
