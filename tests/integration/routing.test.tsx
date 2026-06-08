import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { VehicleDetailPage } from '../../src/pages/VehicleDetailPage';
import { NotFoundPage } from '../../src/pages/NotFoundPage';
import { getAllVehicles } from '../../src/lib/vehicles';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('routing', () => {
  it('renders vehicle detail for valid id', () => {
    const vehicle = getAllVehicles()[0];
    renderAt(`/vehicles/${vehicle.id}`);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: new RegExp(`${vehicle.year}\\s+${vehicle.make}`, 'i'),
      }),
    ).toBeInTheDocument();
  });

  it('renders not found for invalid vehicle id', () => {
    renderAt('/vehicles/not-a-real-id');
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
