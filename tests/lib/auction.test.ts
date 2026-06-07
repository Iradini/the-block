import { describe, expect, it } from 'vitest';
import { getAuctionStatus } from '../../src/lib/auction';

describe('auction', () => {
  it('returns upcoming before auction start', () => {
    const start = new Date(Date.now() + 60 * 60 * 1000);
    expect(getAuctionStatus(start)).toBe('upcoming');
  });

  it('returns live during the two-hour window', () => {
    const start = new Date(Date.now() - 30 * 60 * 1000);
    expect(getAuctionStatus(start)).toBe('live');
  });

  it('returns ended after the auction window', () => {
    const start = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(getAuctionStatus(start)).toBe('ended');
  });
});
