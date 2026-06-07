import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { VehicleWithBids } from '../../types/vehicle';
import { formatCurrency, getVehicleHighlightLine } from '../../lib/format';
import { AuctionCountdown } from '../ui/AuctionCountdown';
import { useBidsStore } from '../../store/bids';

interface VehicleCardProps {
  vehicle: VehicleWithBids;
  compact?: boolean;
}

export function VehicleCard({ vehicle, compact = false }: VehicleCardProps) {
  const hasMyBid = useBidsStore((s) => s.hasMyBid(vehicle.id));
  const [imgError, setImgError] = useState(false);
  const imageSrc = vehicle.images[0];
  const noReserve = vehicle.reserve_price === null;

  return (
    <article className="card group transition hover:shadow-md">
      <Link
        to={`/vehicles/${vehicle.id}`}
        className="block min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-openlane-blue"
      >
        <div className={`relative max-w-full bg-slate-200 ${compact ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
          {!imgError && imageSrc ? (
            <img
              src={imageSrc}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full max-w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">No image</div>
          )}
          <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-1">
            {noReserve && (
              <span className="rounded bg-auction-green px-2 py-0.5 text-xs font-bold uppercase text-white">
                No Reserve
              </span>
            )}
            {hasMyBid && (
              <span className="rounded bg-openlane-blue px-2 py-0.5 text-xs font-bold text-white">
                You bid
              </span>
            )}
            {vehicle.auction_status === 'live' && (
              <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold uppercase text-white">
                Live
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-1 p-3 sm:p-4">
          <h3 className={`min-w-0 break-words font-bold text-openlane-navy ${compact ? 'text-sm' : 'text-base'}`}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {!compact && (
            <p className="line-clamp-2 text-sm text-slate-600">{getVehicleHighlightLine(vehicle)}</p>
          )}
          <p className="truncate text-xs text-slate-500">
            {vehicle.city}, {vehicle.province} · Lot {vehicle.lot}
          </p>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-2 bg-auction-dark px-3 py-2.5 text-white sm:px-4">
          <AuctionCountdown
            status={vehicle.auction_status}
            normalizedStart={vehicle.normalized_auction_start}
            className="text-xs sm:text-sm"
            liveClassName="font-mono text-sm font-bold text-red-400 sm:text-base"
          />
          <div className="shrink-0 text-right">
            <span className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-xs">Bid</span>
            <p className="text-sm font-bold sm:text-base">{formatCurrency(vehicle.effective_bid)}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
