export interface Vehicle {
  id: string
  vin: string
  year: number
  make: string
  model: string
  trim: string
  body_style: string
  exterior_color: string
  interior_color: string
  engine: string
  transmission: string
  drivetrain: string
  odometer_km: number
  fuel_type: string
  condition_grade: number
  condition_report: string
  damage_notes: string[]
  title_status: 'clean' | 'rebuilt' | 'salvage'
  province: string
  city: string
  auction_start: string
  starting_bid: number
  reserve_price: number | null
  buy_now_price: number | null
  images: string[]
  selling_dealership: string
  lot: string
  current_bid: number | null
  bid_count: number
}

export interface VehicleFilters {
  make?: string
  bodyStyle?: string
  province?: string
  minPrice?: number
  maxPrice?: number
  minCondition?: number
  maxCondition?: number
}

export type SortOption =
  | 'price_asc'
  | 'price_desc'
  | 'year_desc'
  | 'year_asc'
  | 'odometer_asc'
  | 'condition_desc'

export type ConditionTier = 'excellent' | 'good' | 'fair' | 'poor'

export interface ConditionDisplay {
  label: string
  tier: ConditionTier
  badgeClass: string
}

export type AuctionStatus = 'live' | 'upcoming' | 'ended'

export interface BidEntry {
  currentBid: number
  bidCount: number
  myBids: number[]
  lastUpdatedAt: string
}

export type BidStoreMap = Record<string, BidEntry>

export type PlaceBidResult =
  | { ok: true; currentBid: number; bidCount: number }
  | { ok: false; error: 'TOO_LOW' | 'NOT_FOUND' | 'INVALID_AMOUNT'; message: string }
