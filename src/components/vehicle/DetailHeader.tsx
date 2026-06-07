import type { VehicleWithBids } from '../../types/vehicle';
import { formatAuctionEndLabel } from '../../lib/auction';
import { getVehicleSubtitle } from '../../lib/format';

interface DetailHeaderProps {
  vehicle: VehicleWithBids;
}

export function DetailHeader({ vehicle }: DetailHeaderProps) {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;
  const endingLabel = formatAuctionEndLabel(
    vehicle.auction_status,
    vehicle.normalized_auction_start,
  );

  return (
    <header className="mb-4 min-w-0">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="break-words text-2xl font-extrabold tracking-tight text-openlane-navy sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-700 sm:text-base">
            {getVehicleSubtitle(vehicle)}
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-600">{endingLabel}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {vehicle.reserve_price === null && (
            <span className="hidden rounded bg-auction-green px-2 py-1 text-xs font-bold uppercase text-white sm:inline">
              No Reserve
            </span>
          )}
          {vehicle.auction_status === 'live' && (
            <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold uppercase text-white">
              Live
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-600">
        {vehicle.city}, {vehicle.province} · Lot {vehicle.lot}
      </p>
    </header>
  );
}
