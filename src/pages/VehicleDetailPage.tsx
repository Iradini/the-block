import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useVehicle } from '../hooks/useVehicle';
import { formatCurrency } from '../lib/format';
import { PhotoGallery } from '../components/vehicle/PhotoGallery';
import { SpecsTable } from '../components/vehicle/SpecsTable';
import { ConditionSection } from '../components/vehicle/ConditionSection';
import { BidPanel } from '../components/vehicle/BidPanel';
import { RelatedVehicles } from '../components/vehicle/RelatedVehicles';
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
    <div className="w-full min-w-0 overflow-x-hidden pb-24 lg:pb-6">
      <div className="page-container">
        <Link
          to="/"
          className="mb-4 inline-flex text-sm font-medium text-openlane-blue hover:underline"
        >
          ← Back to inventory
        </Link>

        <h1 className="mb-6 break-words text-2xl font-bold text-openlane-navy sm:text-3xl">{title}</h1>

        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-5 lg:gap-8">
          <div className="min-w-0 space-y-6 lg:col-span-3 lg:space-y-8">
            <PhotoGallery
              images={vehicle.images}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            />
            <SpecsTable vehicle={vehicle} />
            <ConditionSection vehicle={vehicle} />
            <RelatedVehicles vehicle={vehicle} />
          </div>

          <div className="hidden min-w-0 lg:col-span-2 lg:block">
            <div className="sticky top-20">
              <BidPanel key={vehicle.id} vehicle={vehicle} />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 w-full max-w-[100vw] border-t border-openlane-border bg-white p-4 lg:hidden">
        {!mobileBidOpen ? (
          <button
            type="button"
            onClick={() => setMobileBidOpen(true)}
            className="btn-primary w-full"
          >
            Place bid — from {formatCurrency(vehicle.min_next_bid)}
          </button>
        ) : (
          <div className="fixed inset-0 z-50 flex flex-col justify-end overflow-hidden">
            <button
              type="button"
              aria-label="Close bid panel"
              className="min-h-0 flex-1 bg-black/40"
              onClick={() => setMobileBidOpen(false)}
            />
            <div className="max-h-[90svh] w-full overflow-y-auto overflow-x-hidden rounded-t-2xl bg-openlane-bg p-4">
              <BidPanel
                key={vehicle.id}
                vehicle={vehicle}
                compact
                onBidSuccess={() => setMobileBidOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
