import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as vehiclesLib from '../../src/lib/vehicles';
import { BrowsePage } from '../../src/pages/BrowsePage';
import { getLiveVehicleWithBids } from '../fixtures/vehicles';
import { mockAuctionStartFromVehicleField } from '../helpers/mockAuction';

const mockListings = [getLiveVehicleWithBids(), getLiveVehicleWithBids()];

function renderBrowsePage() {
  return render(
    <MemoryRouter>
      <BrowsePage />
    </MemoryRouter>,
  );
}

describe('BrowsePage', () => {
  beforeEach(() => {
    mockAuctionStartFromVehicleField();
    vi.spyOn(vehiclesLib, 'searchVehicles').mockReturnValue(mockListings);
    vi.spyOn(vehiclesLib, 'getFeaturedVehicles').mockReturnValue(mockListings);
    vi.spyOn(vehiclesLib, 'getFilterOptions').mockReturnValue({
      makes: ['Ford'],
      bodyStyles: ['SUV'],
      provinces: ['Ontario'],
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders inventory listing count on load', () => {
    renderBrowsePage();
    expect(screen.getByRole('heading', { name: /auctions/i })).toBeInTheDocument();
    expect(screen.getByText(/2 listings/i)).toBeInTheDocument();
  });

  it('has accessible search input', () => {
    renderBrowsePage();
    expect(screen.getByRole('searchbox', { name: /search vehicles/i })).toBeInTheDocument();
  });

  describe('debounced search', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('shows empty state when search has no matches', async () => {
      vi.mocked(vehiclesLib.searchVehicles).mockReturnValue([]);
      const user = userEvent.setup();
      renderBrowsePage();

      await user.type(screen.getByRole('searchbox'), 'xyznomatch123');
      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(screen.getByText(/no vehicles match your search/i)).toBeInTheDocument();
      });
    });

    it('updates listing count after debounced search', async () => {
      vi.mocked(vehiclesLib.searchVehicles).mockReturnValue([mockListings[0]]);
      const user = userEvent.setup();
      renderBrowsePage();

      await user.type(screen.getByRole('searchbox'), 'Toronto');
      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(screen.getByText(/1 listing(?!s)/i)).toBeInTheDocument();
      });
    });
  });
});
