import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BidStoreMap, PlaceBidResult } from '../types/vehicle'
import { getVehicleById } from '../lib/vehicles'
import { getMinimumNextBid } from '../lib/format'
import { formatCurrency } from '../lib/format'

interface BidsState {
  bids: BidStoreMap
  placeBid: (vehicleId: string, amount: number) => PlaceBidResult
  clearBids: () => void
}

export const useBidStore = create<BidsState>()(
  persist(
    (set, get) => ({
      bids: {},

      placeBid: (vehicleId, amount): PlaceBidResult => {
        if (!Number.isFinite(amount) || amount <= 0) {
          return { ok: false, error: 'INVALID_AMOUNT', message: 'Please enter a valid bid amount.' }
        }

        const vehicle = getVehicleById(vehicleId)
        if (!vehicle) {
          return { ok: false, error: 'NOT_FOUND', message: 'Vehicle not found.' }
        }

        const existing = get().bids[vehicleId]
        const currentBid = existing?.currentBid ?? vehicle.current_bid
        const minimumNextBid = getMinimumNextBid(currentBid, vehicle.starting_bid)

        if (amount < minimumNextBid) {
          return {
            ok: false,
            error: 'TOO_LOW',
            message: `Bid must be at least ${formatCurrency(minimumNextBid)}.`,
          }
        }

        const prevBidCount = existing?.bidCount ?? vehicle.bid_count
        const prevMyBids = existing?.myBids ?? []

        set((state) => ({
          bids: {
            ...state.bids,
            [vehicleId]: {
              currentBid: amount,
              bidCount: prevBidCount + 1,
              myBids: [...prevMyBids, amount],
              lastUpdatedAt: new Date().toISOString(),
            },
          },
        }))

        return { ok: true, currentBid: amount, bidCount: prevBidCount + 1 }
      },

      clearBids: () => set({ bids: {} }),
    }),
    { name: 'the-block-bids-v1' }
  )
)
