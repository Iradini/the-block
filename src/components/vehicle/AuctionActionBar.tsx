import { useEffect, useState } from 'react';
import type { VehicleWithBids } from '../../types/vehicle';
import { isAuctionEndingSoon } from '../../lib/auction';
import { formatCurrency } from '../../lib/format';
import { AuctionCountdown } from '../ui/AuctionCountdown';

interface AuctionActionBarProps {
  vehicle: VehicleWithBids;
  onPlaceBid: () => void;
  compact?: boolean;
}

export function AuctionActionBar({ vehicle, onPlaceBid, compact = false }: AuctionActionBarProps) {
  const isEnded = vehicle.auction_status === 'ended';
  const isLive = vehicle.auction_status === 'live';
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!isLive) return;

    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [isLive]);

  const urgent =
    isLive && isAuctionEndingSoon(vehicle.auction_status, vehicle.normalized_auction_start);

  return (
    <div className="relative">
      {urgent && (
        <div
          className="absolute inset-x-0 top-0 z-10 h-1 animate-pulse bg-red-500"
          role="status"
          aria-label="Auction ending in less than one minute"
        />
      )}
      <div
        className={`auction-action-bar relative flex min-w-0 items-center gap-3 ${
          compact ? 'px-4 py-3' : 'px-4 py-4 sm:px-6'
        } ${urgent ? 'ring-2 ring-inset ring-red-500/50' : ''}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-5 sm:gap-8">
          <div className="min-w-0 shrink-0">
            <p className="spec-label text-[10px] sm:text-xs">
              {urgent ? 'Ending now' : 'Time left'}
            </p>
            <AuctionCountdown
              status={vehicle.auction_status}
              normalizedStart={vehicle.normalized_auction_start}
              className="text-base font-bold text-openlane-navy sm:text-lg"
              liveClassName="font-mono text-base font-bold text-red-600 sm:text-lg"
              urgent={urgent}
            />
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="spec-label text-[10px] sm:text-xs">High bid</p>
            <p className="text-base font-bold text-openlane-navy sm:text-lg">
              {formatCurrency(vehicle.effective_bid)}
            </p>
          </div>

          <div className="min-w-0 sm:hidden">
            <p className="spec-label text-[10px]">Bid</p>
            <p className="text-base font-bold text-openlane-navy">
              {formatCurrency(vehicle.effective_bid)}
            </p>
          </div>

          {!compact && (
            <div className="hidden min-w-0 md:block">
              <p className="spec-label"># Bids</p>
              <p className="text-lg font-bold text-openlane-navy">{vehicle.bid_count}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onPlaceBid}
          disabled={isEnded}
          className={`btn-primary shrink-0 px-5 py-2.5 text-sm font-bold disabled:opacity-50 sm:px-6 ${
            urgent ? 'animate-pulse' : ''
          }`}
        >
          {isEnded ? 'Ended' : urgent ? 'Bid now' : 'Place bid'}
        </button>
      </div>
    </div>
  );
}
