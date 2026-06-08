import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BidPanel } from '../../src/components/vehicle/BidPanel';
import { useBidsStore } from '../../src/store/bids';
import * as vehiclesLib from '../../src/lib/vehicles';
import {
  fixtureVehicles,
  FIXED_NOW,
  getEndedVehicleWithBids,
  getLiveVehicleWithBids,
  liveVehicle,
} from '../fixtures/vehicles';
import { mockAuctionStartFromVehicleField } from '../helpers/mockAuction';

describe('BidPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(FIXED_NOW);
    mockAuctionStartFromVehicleField();
    useBidsStore.setState({ store: {} });
    vi.spyOn(vehiclesLib, 'getAllVehicles').mockReturnValue(fixtureVehicles);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders high bid and minimum bid for live auction', () => {
    render(<BidPanel vehicle={getLiveVehicleWithBids()} formOnly />);
    expect(screen.getByText(/\$20,000/)).toBeInTheDocument();
    expect(screen.getByText(/min bid/i)).toBeInTheDocument();
  });

  it('disables submit for ended auction', () => {
    render(<BidPanel vehicle={getEndedVehicleWithBids()} formOnly />);
    expect(screen.getByRole('button', { name: /auction ended/i })).toBeDisabled();
  });

  it('prevents submit when bid is below minimum', async () => {
    const user = userEvent.setup();
    const { container } = render(<BidPanel vehicle={getLiveVehicleWithBids()} formOnly />);
    const panel = container.querySelector('#bid-panel') as HTMLElement;

    const input = within(panel).getByLabelText(/your bid/i);
    await user.clear(input);
    await user.type(input, '100');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(within(panel).getByRole('button', { name: /place bid/i })).toBeDisabled();
  });

  it('places valid bid and shows success message', async () => {
    const user = userEvent.setup();
    const { container } = render(<BidPanel vehicle={getLiveVehicleWithBids()} formOnly />);
    const panel = container.querySelector('#bid-panel') as HTMLElement;

    await user.click(within(panel).getByRole('button', { name: /place bid/i }));

    await waitFor(() => {
      expect(within(panel).getByText(/bid placed successfully/i)).toBeInTheDocument();
    });
    expect(useBidsStore.getState().hasMyBid(liveVehicle.id)).toBe(true);
  });

  it('marks input invalid when amount is too low', async () => {
    const user = userEvent.setup();
    const { container } = render(<BidPanel vehicle={getLiveVehicleWithBids()} formOnly />);
    const panel = container.querySelector('#bid-panel') as HTMLElement;

    const input = within(panel).getByLabelText(/your bid/i);
    await user.clear(input);
    await user.type(input, '100');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(within(panel).getByRole('button', { name: /place bid/i })).toBeDisabled();
  });
});
