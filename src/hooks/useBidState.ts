import type { Vehicle } from '../types/vehicle'
import { useBidStore } from '../store/bids'
import { getMinimumNextBid } from '../lib/format'

export interface BidState {
  currentBid: number | null
  bidCount: number
  myBids: number[]
  hasMyBid: boolean
  minimumNextBid: number
  lastUpdatedAt: string | null
}

export function useBidState(vehicle: Vehicle): BidState {
  const entry = useBidStore((state) => state.bids[vehicle.id])

  const currentBid = entry?.currentBid ?? vehicle.current_bid
  const bidCount = entry?.bidCount ?? vehicle.bid_count

  return {
    currentBid,
    bidCount,
    myBids: entry?.myBids ?? [],
    hasMyBid: (entry?.myBids?.length ?? 0) > 0,
    minimumNextBid: getMinimumNextBid(currentBid, vehicle.starting_bid),
    lastUpdatedAt: entry?.lastUpdatedAt ?? null,
  }
}
