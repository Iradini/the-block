import { describe, expect, it } from 'vitest';
import { formatAuctionEndLabel, getAuctionEndDate, getAuctionStatus, isAuctionEndingSoon } from '../../src/lib/auction';

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

  it('formats auction end label for live auctions', () => {
    const start = new Date(Date.now() - 30 * 60 * 1000);
    const end = getAuctionEndDate(start);
    expect(end.getTime()).toBe(start.getTime() + 2 * 60 * 60 * 1000);
    expect(formatAuctionEndLabel('live', start)).toMatch(/^Ends /);
  });

  it('flags auctions under one minute as ending soon', () => {
    const start = new Date(Date.now() - (2 * 60 * 60 * 1000 - 30_000));
    expect(isAuctionEndingSoon('live', start)).toBe(true);
    expect(isAuctionEndingSoon('live', new Date(Date.now() - 30 * 60 * 1000))).toBe(false);
  });
});
