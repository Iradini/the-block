import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useVehicle } from '../hooks/useVehicle';
import { formatCurrency } from '../lib/format';
import { PhotoGallery } from '../components/vehicle/PhotoGallery';
import { SpecsTable } from '../components/vehicle/SpecsTable';
import { ConditionSection } from '../components/vehicle/ConditionSection';
import { BidPanel } from '../components/vehicle/BidPanel';
import { NotFoundPage } from './NotFoundPage';

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const vehicle = useVehicle(id);
  const [mobileBidOpen, setMobileBidOpen] = useState(false);

  if (!vehicle) {
    return <NotFoundPage />;
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:pb-6">
      <Link
        to="/"
        className="mb-4 inline-flex text-sm font-medium text-[#1a1a2e] hover:underline"
      >
        ← Back to inventory
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          <PhotoGallery
            images={vehicle.images}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />
          <SpecsTable vehicle={vehicle} />
          <ConditionSection vehicle={vehicle} />
        </div>

        <div className="hidden lg:col-span-2 lg:block">
          <div className="sticky top-6">
            <BidPanel key={vehicle.id} vehicle={vehicle} />
          </div>
        </div>
      </div>

      {/* Mobile sticky bid bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4 lg:hidden">
        {!mobileBidOpen ? (
          <button
            type="button"
            onClick={() => setMobileBidOpen(true)}
            className="w-full rounded-lg bg-[#1a1a2e] px-4 py-3 text-sm font-medium text-white"
          >
            Place bid — from {formatCurrency(vehicle.min_next_bid)}
          </button>
        ) : (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
            <button
              type="button"
              aria-label="Close bid panel"
              className="flex-1"
              onClick={() => setMobileBidOpen(false)}
            />
            <div className="max-h-[90svh] overflow-y-auto rounded-t-2xl bg-slate-50 p-4">
              <BidPanel key={vehicle.id} vehicle={vehicle} compact />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
