import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { VehicleWithBids } from '../../types/vehicle';
import { formatCurrency } from '../../lib/format';
import { AuctionStatus } from '../ui/AuctionStatus';
import { ConditionBadge } from '../ui/ConditionBadge';
import { useBidsStore } from '../../store/bids';

interface VehicleCardProps {
  vehicle: VehicleWithBids;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const hasMyBid = useBidsStore((s) => s.hasMyBid(vehicle.id));
  const [imgError, setImgError] = useState(false);
  const imageSrc = vehicle.images[0];

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/vehicles/${vehicle.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a2e]">
        <div className="relative aspect-[4/3] bg-slate-200">
          {!imgError && imageSrc ? (
            <img
              src={imageSrc}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">No image</div>
          )}
          <div className="absolute left-2 top-2 flex gap-1">
            <AuctionStatus status={vehicle.auction_status} />
            {hasMyBid && (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-800">
                You bid
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 p-4 text-left">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <ConditionBadge grade={vehicle.condition_grade} />
          </div>
          <p className="text-sm text-slate-600">{vehicle.trim}</p>
          <p className="text-xs text-slate-500">
            Lot {vehicle.lot} · {vehicle.city}, {vehicle.province}
          </p>
          <div className="pt-1">
            <p className="text-xs text-slate-500">
              {vehicle.current_bid === null ? 'Starting at' : 'Current bid'}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(vehicle.effective_bid)}
            </p>
            {vehicle.bid_count > 0 && (
              <p className="text-xs text-slate-500">{vehicle.bid_count} bids</p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
