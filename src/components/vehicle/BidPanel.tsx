import { useState, type FormEvent } from 'react';
import type { VehicleWithBids } from '../../types/vehicle';
import { formatCurrency } from '../../lib/format';
import { getTimeUntilAuctionLabel } from '../../lib/auction';
import { AuctionStatus } from '../ui/AuctionStatus';
import { useBidsStore } from '../../store/bids';

interface BidPanelProps {
  vehicle: VehicleWithBids;
  compact?: boolean;
}

export function BidPanel({ vehicle, compact = false }: BidPanelProps) {
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
    setTimeout(() => setSuccess(false), 3000);
  };

  const parsedAmount = Number(amount);
  const isInvalidInput = amount !== '' && (!Number.isFinite(parsedAmount) || !Number.isInteger(parsedAmount));
  const isTooLow = Number.isFinite(parsedAmount) && parsedAmount < vehicle.min_next_bid;

  return (
    <div className={`rounded-xl border border-slate-200 bg-white ${compact ? 'p-4' : 'p-5 shadow-sm'}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Place a bid</h2>
        <AuctionStatus status={vehicle.auction_status} />
      </div>

      <div className="space-y-1">
        <p className="text-sm text-slate-500">
          {vehicle.current_bid === null ? 'Starting at' : 'Current bid'}
        </p>
        <p className="text-2xl font-bold text-slate-900">{formatCurrency(vehicle.effective_bid)}</p>
        {vehicle.bid_count > 0 && (
          <p className="text-sm text-slate-500">{vehicle.bid_count} bids</p>
        )}
      </div>

      <p className="mt-3 text-sm text-slate-600">
        {getTimeUntilAuctionLabel(vehicle.auction_status, vehicle.normalized_auction_start)}
      </p>

      {vehicle.reserve_price !== null && (
        <p
          className={`mt-2 text-sm font-medium ${reserveMet ? 'text-emerald-700' : 'text-amber-700'}`}
        >
          Reserve {reserveMet ? 'met' : 'not met'}
        </p>
      )}

      {vehicle.buy_now_price !== null && (
        <p className="mt-2 text-sm text-slate-600">
          Buy now: <span className="font-semibold">{formatCurrency(vehicle.buy_now_price)}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <div>
          <label htmlFor={`bid-${vehicle.id}`} className="mb-1 block text-sm font-medium text-slate-700">
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
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-[#1a1a2e] disabled:bg-slate-100"
          />
          <p className="mt-1 text-xs text-slate-500">
            Minimum bid: {formatCurrency(vehicle.min_next_bid)}
          </p>
        </div>

        {error && (
          <p id={`bid-error-${vehicle.id}`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div aria-live="polite" className="min-h-[1.25rem]">
          {success && (
            <p className="text-sm font-medium text-emerald-700">Bid placed successfully!</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isEnded || isInvalidInput || isTooLow || amount === ''}
          className="w-full rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEnded ? 'Auction ended' : 'Place bid'}
        </button>
      </form>

      <div className="mt-5 space-y-1 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <p>
          <span className="text-slate-500">Lot:</span> {vehicle.lot}
        </p>
        <p>
          <span className="text-slate-500">Dealer:</span> {vehicle.selling_dealership}
        </p>
        <p>
          <span className="text-slate-500">Location:</span> {vehicle.city}, {vehicle.province}
        </p>
        <p>
          <span className="text-slate-500">VIN:</span> {vehicle.vin}
        </p>
      </div>
    </div>
  );
}
