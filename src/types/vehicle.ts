export type TitleStatus = 'clean' | 'rebuilt' | 'salvage';
export type AuctionStatus = 'live' | 'upcoming' | 'ended';
export type VehicleSort =
  | 'price_asc' | 'price_desc'
  | 'year_desc' | 'year_asc'
  | 'odometer_asc'
  | 'condition_desc';

export interface Vehicle {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  body_style: string;
  exterior_color: string;
  interior_color: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  odometer_km: number;
  fuel_type: string;
  condition_grade: number;
  condition_report: string;
  damage_notes: string[];
  title_status: TitleStatus;
  province: string;
  city: string;
  auction_start: string;
  starting_bid: number;
  reserve_price: number | null;
  buy_now_price: number | null;
  images: string[];
  selling_dealership: string;
  lot: string;
  current_bid: number | null;
  bid_count: number;
}

export interface VehicleFilters {
  make?: string;
  bodyStyle?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  minCondition?: number;
  maxCondition?: number;
}

export interface BidOverride {
  currentBid: number;
  bidCount: number;
  myBids: number[];
}

export type BidStore = Record<string, BidOverride>;

export interface VehicleWithBids extends Vehicle {
  effective_bid: number;
  bid_count: number;
  my_bids: number[];
  min_next_bid: number;
  auction_status: AuctionStatus;
  normalized_auction_start: Date;
}

export type PlaceBidError =
  | 'NOT_FOUND'
  | 'TOO_LOW'
  | 'INVALID_AMOUNT'
  | 'AUCTION_ENDED';

export type PlaceBidResult =
  | { ok: true; vehicle: VehicleWithBids }
  | { ok: false; error: PlaceBidError; message: string };