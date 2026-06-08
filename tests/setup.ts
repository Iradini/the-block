import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { resetNormalizedAuctionCache } from '../src/lib/auction';
import { useBidsStore } from '../src/store/bids';

beforeEach(() => {
  useBidsStore.setState({ store: {} });
  resetNormalizedAuctionCache();
});

afterEach(() => {
  useBidsStore.setState({ store: {} });
  resetNormalizedAuctionCache();
});
