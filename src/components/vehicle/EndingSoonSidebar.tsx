import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { VehicleWithBids } from '../../types/vehicle';
import { getEndingSoonVehicles } from '../../lib/vehicles';
import { formatCurrency } from '../../lib/format';
import { AuctionCountdown } from '../ui/AuctionCountdown';
import { useBidsStore } from '../../store/bids';

interface EndingSoonSidebarProps {
  vehicle: VehicleWithBids;
}

export function EndingSoonSidebar({ vehicle }: EndingSoonSidebarProps) {
  const store = useBidsStore((s) => s.store);
  const endingSoon = useMemo(
    () => getEndingSoonVehicles(vehicle.id, store, 5),
    [vehicle.id, store],
  );

  if (endingSoon.length === 0) return null;

  return (
    <section className="min-w-0">
      <h2 className="section-title mb-3 text-base uppercase tracking-wide">Ending soon</h2>
      <ul className="space-y-2">
        {endingSoon.map((item) => (
          <li key={item.id}>
            <Link
              to={`/vehicles/${item.id}`}
              className="card flex min-w-0 gap-3 p-2 transition hover:border-openlane-blue hover:shadow-sm"
            >
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded bg-slate-200">
                {item.images[0] ? (
                  <img
                    src={item.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                    No image
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-openlane-navy">
                  {item.year} {item.make} {item.model}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <AuctionCountdown
                    status={item.auction_status}
                    normalizedStart={item.normalized_auction_start}
                    className="text-xs font-semibold text-slate-600"
                    liveClassName="font-mono text-xs font-bold text-red-600"
                  />
                  <span className="shrink-0 text-sm font-bold text-openlane-navy">
                    {formatCurrency(item.effective_bid)}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
