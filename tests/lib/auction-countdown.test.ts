import { describe, expect, it } from 'vitest';
import { getAuctionCountdown } from '../../src/lib/auction';

describe('getAuctionCountdown', () => {
  it('formats live auction as HH:MM:SS', () => {
    const start = new Date(Date.now() - 30 * 60 * 1000);
    const label = getAuctionCountdown('live', start);
    expect(label).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('formats upcoming as days when far out', () => {
    const start = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    expect(getAuctionCountdown('upcoming', start)).toBe('3 Days');
  });
});
