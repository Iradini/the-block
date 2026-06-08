import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { getAuctionCountdown, getRemainingAuctionMs } from '../../src/lib/auction';
import { FIXED_NOW } from '../fixtures/vehicles';

describe('auction extended', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns Ended for ended auction countdown', () => {
    const start = new Date(FIXED_NOW.getTime() - 3 * 60 * 60 * 1000);
    expect(getAuctionCountdown('ended', start, FIXED_NOW.getTime())).toBe('Ended');
  });

  it('returns zero remaining ms for ended auctions', () => {
    const start = new Date(FIXED_NOW.getTime() - 3 * 60 * 60 * 1000);
    expect(getRemainingAuctionMs('ended', start, FIXED_NOW.getTime())).toBe(0);
  });

  it('returns null remaining ms for upcoming auctions', () => {
    const start = new Date(FIXED_NOW.getTime() + 60 * 60 * 1000);
    expect(getRemainingAuctionMs('upcoming', start, FIXED_NOW.getTime())).toBeNull();
  });
});
