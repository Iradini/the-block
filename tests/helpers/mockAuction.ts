import * as auctionLib from '../../src/lib/auction';
import { vi } from 'vitest';

export function mockAuctionStartFromVehicleField(): void {
  vi.spyOn(auctionLib, 'getNormalizedAuctionStart').mockImplementation(
    (vehicle) => new Date(vehicle.auction_start),
  );
}
