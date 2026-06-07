import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useVehicle } from '../hooks/useVehicle';
import { DetailHeader } from '../components/vehicle/DetailHeader';
import { DetailActions } from '../components/vehicle/DetailActions';
import { AuctionActionBar } from '../components/vehicle/AuctionActionBar';
import { HighlightsSection } from '../components/vehicle/HighlightsSection';
import { PhotoGallery } from '../components/vehicle/PhotoGallery';
import { SpecsTable } from '../components/vehicle/SpecsTable';
import { ConditionSection } from '../components/vehicle/ConditionSection';
import { BidPanel } from '../components/vehicle/BidPanel';
import { EndingSoonSidebar } from '../components/vehicle/EndingSoonSidebar';
import { RelatedVehicles } from '../components/vehicle/RelatedVehicles';
import { NotFoundPage } from './NotFoundPage';

function scrollToBidPanel() {
  document.getElementById('bid-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const vehicle = useVehicle(id);
  const [mobileBidOpen, setMobileBidOpen] = useState(false);

  if (!vehicle) {
    return <NotFoundPage />;
  }

  const openMobileBid = () => setMobileBidOpen(true);

  return (
    <div className="w-full min-w-0 overflow-x-hidden pb-8">
      <div className="page-container pt-4">
        <Link
          to="/"
          className="mb-4 inline-flex text-sm font-medium text-openlane-blue hover:underline"
        >
          ← Back to inventory
        </Link>

        <DetailHeader vehicle={vehicle} />
        <DetailActions />

        <PhotoGallery
          images={vehicle.images}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        />
      </div>

      <div className="sticky top-[53px] z-20 lg:hidden">
        <AuctionActionBar vehicle={vehicle} onPlaceBid={openMobileBid} compact />
      </div>

      <div className="hidden lg:block">
        <div className="page-container">
          <AuctionActionBar vehicle={vehicle} onPlaceBid={scrollToBidPanel} />
        </div>
      </div>

      <div className="page-container pt-6">
        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-5 lg:gap-8">
          <div className="min-w-0 space-y-6 lg:col-span-3 lg:space-y-8">
            <HighlightsSection vehicle={vehicle} />
            <SpecsTable vehicle={vehicle} />
            <ConditionSection vehicle={vehicle} />
            <RelatedVehicles vehicle={vehicle} />
          </div>

          <div className="hidden min-w-0 space-y-6 lg:col-span-2 lg:block">
            <div className="sticky top-24 space-y-6">
              <BidPanel key={vehicle.id} vehicle={vehicle} formOnly />
              <EndingSoonSidebar vehicle={vehicle} />
            </div>
          </div>
        </div>
      </div>

      {mobileBidOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end overflow-hidden lg:hidden">
          <button
            type="button"
            aria-label="Close bid panel"
            className="min-h-0 flex-1 bg-black/60"
            onClick={() => setMobileBidOpen(false)}
          />
          <div className="max-h-[90svh] w-full overflow-y-auto overflow-x-hidden rounded-t-2xl bg-openlane-bg p-4">
            <BidPanel
              key={vehicle.id}
              vehicle={vehicle}
              compact
              formOnly
              onBidSuccess={() => setMobileBidOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
