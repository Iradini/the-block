import { useState, type FormEvent } from 'react';
import type { VehicleWithBids } from '../../types/vehicle';
import { formatCurrency } from '../../lib/format';
import { AuctionCountdown } from '../ui/AuctionCountdown';
import { useBidsStore } from '../../store/bids';

interface BidPanelProps {
  vehicle: VehicleWithBids;
  compact?: boolean;
  formOnly?: boolean;
  onBidSuccess?: () => void;
}

export function BidPanel({ vehicle, compact = false, formOnly = false, onBidSuccess }: BidPanelProps) {
  const placeBid = useBidsStore((s) => s.placeBid);
  const [amount, setAmount] = useState(String(vehicle.min_next_bid));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isEnded = vehicle.auction_status === 'ended';
  const reserveMet =
    vehicle.reserve_price !== null && vehicle.effective_bid >= vehicle.reserve_price;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const parsed = Number(amount);
    const result = placeBid(vehicle.id, parsed);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setError(null);
    setSuccess(true);
    setAmount(String(result.vehicle.min_next_bid));
    onBidSuccess?.();
    setTimeout(() => setSuccess(false), 3000);
  };

  const parsedAmount = Number(amount);
  const isInvalidInput = amount !== '' && (!Number.isFinite(parsedAmount) || !Number.isInteger(parsedAmount));
  const isTooLow = Number.isFinite(parsedAmount) && parsedAmount < vehicle.min_next_bid;

  return (
    <div className={`bid-panel-dark min-w-0 ${compact ? 'p-4' : 'p-5'}`} id="bid-panel">
      {!formOnly && (
        <>
          <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {vehicle.auction_status === 'live' ? 'Time left' : 'Auction'}
              </p>
              <AuctionCountdown
                status={vehicle.auction_status}
                normalizedStart={vehicle.normalized_auction_start}
                className="text-lg font-bold text-white"
                liveClassName="font-mono text-2xl font-bold text-red-400"
              />
            </div>
            {vehicle.bid_count > 0 && (
              <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                {vehicle.bid_count} bids
              </span>
            )}
          </div>

          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {vehicle.current_bid === null ? 'Starting at' : 'High bid'}
            </p>
            <p className="text-3xl font-bold text-white">{formatCurrency(vehicle.effective_bid)}</p>
          </div>
        </>
      )}

      {formOnly && (
        <div className="mb-4 rounded-lg bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {vehicle.current_bid === null ? 'Starting at' : 'High bid'}
          </p>
          <p className="text-3xl font-bold text-white">{formatCurrency(vehicle.effective_bid)}</p>
          <p className="mt-1 text-sm font-semibold text-slate-400">
            Min bid: {formatCurrency(vehicle.min_next_bid)}
          </p>
        </div>
      )}

      {vehicle.reserve_price !== null && (
        <p
          className={`mt-3 text-sm font-bold ${reserveMet ? 'text-auction-green' : 'text-amber-400'}`}
        >
          Reserve {reserveMet ? 'met' : 'not met'}
        </p>
      )}

      {vehicle.buy_now_price !== null && (
        <p className="mt-2 text-sm font-medium text-slate-300">
          Buy now:{' '}
          <span className="font-bold text-white">{formatCurrency(vehicle.buy_now_price)}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <div className="min-w-0">
          <label htmlFor={`bid-${vehicle.id}`} className="mb-1 block text-sm font-bold text-slate-200">
            Your bid (CAD)
          </label>
          <input
            id={`bid-${vehicle.id}`}
            type="number"
            min={vehicle.min_next_bid}
            step={500}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError(null);
              setSuccess(false);
            }}
            disabled={isEnded}
            aria-invalid={!!error || isInvalidInput || isTooLow}
            aria-describedby={error ? `bid-error-${vehicle.id}` : undefined}
            className="w-full min-w-0 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm font-semibold text-white placeholder:text-slate-500 focus:border-openlane-blue focus:outline-none focus:ring-2 focus:ring-openlane-blue/30 disabled:opacity-50"
          />
          {!formOnly && (
            <p className="mt-1 text-sm font-medium text-slate-400">
              Min bid: {formatCurrency(vehicle.min_next_bid)}
            </p>
          )}
        </div>

        {error && (
          <p id={`bid-error-${vehicle.id}`} className="break-words text-sm font-semibold text-red-400" role="alert">
            {error}
          </p>
        )}

        <div aria-live="polite" className="min-h-[1.25rem]">
          {success && (
            <p className="text-sm font-bold text-auction-green">Bid placed successfully!</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isEnded || isInvalidInput || isTooLow || amount === ''}
          className="btn-primary w-full font-bold"
        >
          {isEnded ? 'Auction ended' : 'Place bid'}
        </button>
      </form>

      <div className="mt-5 min-w-0 space-y-1.5 break-words border-t border-white/10 pt-4 text-sm">
        <p>
          <span className="font-semibold text-slate-500">Lot:</span>{' '}
          <span className="font-bold text-slate-200">{vehicle.lot}</span>
        </p>
        <p>
          <span className="font-semibold text-slate-500">Dealer:</span>{' '}
          <span className="font-bold text-slate-200">{vehicle.selling_dealership}</span>
        </p>
        <p>
          <span className="font-semibold text-slate-500">Location:</span>{' '}
          <span className="font-bold text-slate-200">
            {vehicle.city}, {vehicle.province}
          </span>
        </p>
        <p className="break-all">
          <span className="font-semibold text-slate-500">VIN:</span>{' '}
          <span className="font-bold text-slate-200">{vehicle.vin}</span>
        </p>
      </div>
    </div>
  );
}
