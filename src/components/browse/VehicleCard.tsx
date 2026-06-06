import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Vehicle } from '../../types/vehicle'
import { useBidState } from '../../hooks/useBidState'
import { formatCurrency } from '../../lib/format'
import { normalizeAuctionStart, getAuctionStatus, getTimeUntilAuction } from '../../lib/auction'
import { ConditionBadge } from '../ui/ConditionBadge'
import { AuctionStatus } from '../ui/AuctionStatus'

function VehicleImage({ src, alt }: { src: string | null; alt: string }) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <svg
          className="w-12 h-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      onError={() => setErrored(true)}
    />
  )
}

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const bidState = useBidState(vehicle)
  const normalizedStart = normalizeAuctionStart(vehicle.auction_start)
  const status = getAuctionStatus(normalizedStart)
  const timeLabel = getTimeUntilAuction(normalizedStart)

  const displayBid = bidState.currentBid
  const mainImage = vehicle.images[0] ?? null
  const displayTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`

  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`${displayTitle} ${vehicle.trim}, ${displayBid !== null ? `current bid ${formatCurrency(displayBid)}` : `starting at ${formatCurrency(vehicle.starting_bid)}`}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-gray-100">
        <VehicleImage src={mainImage} alt={displayTitle} />

        <div className="absolute top-2 left-2">
          <AuctionStatus status={status} timeLabel={timeLabel} />
        </div>

        {bidState.hasMyBid && (
          <div className="absolute top-2 right-2">
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded shadow">
              My Bid
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">
            {displayTitle}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {vehicle.trim}&ensp;·&ensp;Lot {vehicle.lot}
          </p>
        </div>

        <div className="mb-3">
          <ConditionBadge grade={vehicle.condition_grade} />
        </div>

        <div className="mb-3">
          {displayBid !== null ? (
            <>
              <p className="text-xs text-gray-400">Current Bid</p>
              <p className="text-xl font-bold text-gray-900 leading-tight">
                {formatCurrency(displayBid)}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-400">Starting Bid</p>
              <p className="text-xl font-bold text-gray-900 leading-tight">
                {formatCurrency(vehicle.starting_bid)}
              </p>
            </>
          )}
          {bidState.bidCount > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {bidState.bidCount} bid{bidState.bidCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {vehicle.city}, {vehicle.province}
        </div>
      </div>
    </Link>
  )
}
