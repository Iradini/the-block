import { useState, useEffect, useRef, useMemo } from 'react'
import type { Vehicle } from '../../types/vehicle'
import { useBidState } from '../../hooks/useBidState'
import { useBidStore } from '../../store/bids'
import { formatCurrency } from '../../lib/format'
import { normalizeAuctionStart, getAuctionStatus, getTimeUntilAuction } from '../../lib/auction'
import type { AuctionStatus } from '../../types/vehicle'

const AUCTION_DOT: Record<AuctionStatus, string> = {
  live: 'bg-green-500 animate-pulse',
  upcoming: 'bg-blue-400',
  ended: 'bg-gray-400',
}

interface BidFormProps {
  vehicle: Vehicle
  bidAmount: string
  setBidAmount: (v: string) => void
  error: string | null
  success: boolean
  minimumNextBid: number
  currentBid: number | null
  bidCount: number
  hasMyBid: boolean
  reserveStatus: 'met' | 'not_met' | null
  auctionStatus: AuctionStatus
  timeLabel: string
  onSubmit: (e: React.FormEvent) => void
  inputId: string
}

function BidForm({
  vehicle,
  bidAmount,
  setBidAmount,
  error,
  success,
  minimumNextBid,
  currentBid,
  bidCount,
  hasMyBid,
  reserveStatus,
  auctionStatus,
  timeLabel,
  onSubmit,
  inputId,
}: BidFormProps) {
  return (
    <div className="space-y-4">
      {/* Current / Starting bid */}
      <div>
        {currentBid !== null ? (
          <>
            <p className="text-xs text-gray-500 mb-0.5">Current Bid</p>
            <p className="text-3xl font-bold text-gray-900 leading-none">
              {formatCurrency(currentBid)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {bidCount} bid{bidCount !== 1 ? 's' : ''}
              {hasMyBid && (
                <span className="ml-2 font-medium text-blue-600">· You're bidding</span>
              )}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-0.5">Starting Bid</p>
            <p className="text-3xl font-bold text-gray-900 leading-none">
              {formatCurrency(vehicle.starting_bid)}
            </p>
            <p className="text-sm text-gray-400 mt-1">No bids yet — be the first</p>
          </>
        )}
      </div>

      {/* Reserve status */}
      {reserveStatus && (
        <div
          className={`flex items-center gap-1.5 text-sm font-medium ${
            reserveStatus === 'met' ? 'text-green-600' : 'text-amber-600'
          }`}
        >
          <span aria-hidden="true">{reserveStatus === 'met' ? '✓' : '⚠'}</span>
          {reserveStatus === 'met' ? 'Reserve met' : 'Reserve not met'}
        </div>
      )}

      {/* Auction status */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${AUCTION_DOT[auctionStatus]}`} aria-hidden="true" />
        {timeLabel}
      </div>

      {/* Bid form */}
      {success ? (
        <div
          className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium"
          role="status"
          aria-live="polite"
        >
          ✓ Bid placed successfully!
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          <div>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
              Your bid
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none">
                $
              </span>
              <input
                id={inputId}
                type="text"
                inputMode="numeric"
                value={bidAmount}
                onChange={(e) => {
                  setBidAmount(e.target.value.replace(/[^0-9]/g, ''))
                }}
                className={`w-full pl-7 pr-4 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
                }`}
                placeholder={String(minimumNextBid)}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
              />
            </div>
            {error ? (
              <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : (
              <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-gray-400">
                Minimum: {formatCurrency(minimumNextBid)}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Place Bid
          </button>
        </form>
      )}

      {/* Meta details */}
      <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
        {vehicle.buy_now_price && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Buy Now</span>
            <span className="font-semibold text-gray-900">{formatCurrency(vehicle.buy_now_price)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Lot</span>
          <span className="font-medium text-gray-900">{vehicle.lot}</span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-gray-500 flex-shrink-0">Dealer</span>
          <span className="font-medium text-gray-900 text-right">{vehicle.selling_dealership}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">VIN</span>
          <span className="font-mono text-xs text-gray-700">{vehicle.vin}</span>
        </div>
      </div>
    </div>
  )
}

interface BidPanelProps {
  vehicle: Vehicle
}

export function BidPanel({ vehicle }: BidPanelProps) {
  const bidState = useBidState(vehicle)
  const placeBid = useBidStore((state) => state.placeBid)

  const [bidAmount, setBidAmount] = useState(String(bidState.minimumNextBid))
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const normalizedStart = useMemo(
    () => normalizeAuctionStart(vehicle.auction_start),
    [vehicle.auction_start]
  )
  const auctionStatus = getAuctionStatus(normalizedStart)
  const timeLabel = getTimeUntilAuction(normalizedStart)

  // Keep the input in sync with the minimum after a successful bid
  useEffect(() => {
    setBidAmount(String(bidState.minimumNextBid))
    setError(null)
  }, [bidState.minimumNextBid])

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current)
    }
  }, [])

  const reserveStatus: 'met' | 'not_met' | null =
    vehicle.reserve_price !== null
      ? (bidState.currentBid ?? 0) >= vehicle.reserve_price
        ? 'met'
        : 'not_met'
      : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseInt(bidAmount, 10)

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid bid amount.')
      return
    }

    const result = placeBid(vehicle.id, amount)

    if (!result.ok) {
      setError(result.message)
      return
    }

    setError(null)
    setSuccess(true)
    setSheetOpen(false)

    if (successTimer.current) clearTimeout(successTimer.current)
    successTimer.current = setTimeout(() => setSuccess(false), 3000)
  }

  const sharedProps: BidFormProps = {
    vehicle,
    bidAmount,
    setBidAmount: (v) => { setBidAmount(v); setError(null) },
    error,
    success,
    minimumNextBid: bidState.minimumNextBid,
    currentBid: bidState.currentBid,
    bidCount: bidState.bidCount,
    hasMyBid: bidState.hasMyBid,
    reserveStatus,
    auctionStatus,
    timeLabel,
    onSubmit: handleSubmit,
    inputId: '',
  }

  return (
    <>
      {/* ── Desktop: sticky right-rail panel ── */}
      <div className="hidden lg:block sticky top-20">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <BidForm {...sharedProps} inputId="bid-amount-desktop" />
        </div>
      </div>

      {/* ── Mobile: sticky bottom bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">
              {bidState.currentBid !== null ? 'Current Bid' : 'Starting Bid'}
            </p>
            <p className="text-lg font-bold text-gray-900 truncate">
              {formatCurrency(bidState.currentBid ?? vehicle.starting_bid)}
            </p>
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className="flex-shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Place Bid
          </button>
        </div>
      </div>

      {/* ── Mobile: bottom sheet ── */}
      {sheetOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 lg:hidden overflow-y-auto max-h-[85vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Place a bid"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Place a Bid</h2>
              <button
                onClick={() => setSheetOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close bid panel"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-4 pb-8">
              <BidForm {...sharedProps} inputId="bid-amount-mobile" />
            </div>
          </div>
        </>
      )}
    </>
  )
}
