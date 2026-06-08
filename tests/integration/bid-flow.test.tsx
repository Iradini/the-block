import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { mergeVehicleWithBids } from '../../src/lib/bids';
import { VehicleDetailPage } from '../../src/pages/VehicleDetailPage';
import { useBidsStore } from '../../src/store/bids';
import * as vehiclesLib from '../../src/lib/vehicles';
import {
  fixtureVehicles,
  FIXED_NOW,
  getLiveVehicleWithBids,
  liveVehicle,
} from '../fixtures/vehicles';
import { mockAuctionStartFromVehicleField } from '../helpers/mockAuction';

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={[`/vehicles/${liveVehicle.id}`]}>
      <Routes>
        <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('bid flow integration', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(FIXED_NOW);
    mockAuctionStartFromVehicleField();
    useBidsStore.setState({ store: {} });
    vi.spyOn(vehiclesLib, 'getAllVehicles').mockReturnValue(fixtureVehicles);
    vi.spyOn(vehiclesLib, 'getVehicleWithBids').mockImplementation((id, store) => {
      const vehicle = fixtureVehicles.find((v) => v.id === id);
      if (!vehicle) return null;
      return mergeVehicleWithBids(vehicle, store, fixtureVehicles);
    });
    vi.spyOn(vehiclesLib, 'getRelatedVehicles').mockReturnValue([]);
    vi.spyOn(vehiclesLib, 'getEndingSoonVehicles').mockReturnValue([]);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('places bid from detail page and updates store', async () => {
    const user = userEvent.setup();
    const vehicle = getLiveVehicleWithBids();
    const { container } = renderDetail();
    const panel = container.querySelector('#bid-panel') as HTMLElement;

    expect(within(panel).getByText(/\$20,000/)).toBeInTheDocument();

    const input = within(panel).getByLabelText(/your bid/i);
    await user.clear(input);
    await user.type(input, String(vehicle.min_next_bid));
    await user.click(within(panel).getByRole('button', { name: /place bid/i }));

    await waitFor(() => {
      expect(within(panel).getByText(/bid placed successfully/i)).toBeInTheDocument();
    });
    expect(useBidsStore.getState().store[liveVehicle.id]?.currentBid).toBe(vehicle.min_next_bid);
  });
});
