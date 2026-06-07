import vehiclesData from '../data/vehicles.json';
import type { Vehicle, VehicleFilters, VehicleSort, VehicleWithBids, BidStore } from '../types/vehicle';
import { mergeVehicleWithBids } from './bids';
import { getEffectiveBid } from './format';

const vehicles = vehiclesData as Vehicle[];

export function getAllVehicles(): Vehicle[] {
  return vehicles;
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function getFilterOptions() {
  const makes = [...new Set(vehicles.map((v) => v.make))].sort();
  const bodyStyles = [...new Set(vehicles.map((v) => v.body_style))].sort();
  const provinces = [...new Set(vehicles.map((v) => v.province))].sort();
  return { makes, bodyStyles, provinces };
}

const knownMakes = [...new Set(vehicles.map((v) => v.make))];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function searchFields(v: Vehicle): string[] {
  return [
    String(v.year),
    v.model,
    v.trim,
    v.lot,
    v.selling_dealership,
    v.city,
    v.province,
  ];
}

function fieldMatchesTerm(field: string, term: string): boolean {
  const lower = field.toLowerCase();
  if (lower === term) return true;
  return new RegExp(`\\b${escapeRegExp(term)}`, 'i').test(field);
}

function matchesSearchQuery(v: Vehicle, query: string): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  return terms.every((term) => {
    const matchedMake = knownMakes.find((make) => make.toLowerCase() === term);
    if (matchedMake) {
      return v.make === matchedMake;
    }
    return searchFields(v).some((field) => fieldMatchesTerm(field, term));
  });
}

export function searchVehicles(
  query: string,
  filters: VehicleFilters,
  sort: VehicleSort,
  store: BidStore = {},
): VehicleWithBids[] {
  const q = query.trim().toLowerCase();

  let results = vehicles.filter((v) => {
    if (q && !matchesSearchQuery(v, q)) return false;
    if (filters.make && v.make !== filters.make) return false;
    if (filters.bodyStyle && v.body_style !== filters.bodyStyle) return false;
    if (filters.province && v.province !== filters.province) return false;

    const price = store[v.id]?.currentBid ?? getEffectiveBid(v);
    if (filters.minPrice !== undefined && price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
    if (filters.minCondition !== undefined && v.condition_grade < filters.minCondition) return false;
    if (filters.maxCondition !== undefined && v.condition_grade > filters.maxCondition) return false;

    return true;
  });

  results = [...results].sort((a, b) => {
    const aPrice = store[a.id]?.currentBid ?? getEffectiveBid(a);
    const bPrice = store[b.id]?.currentBid ?? getEffectiveBid(b);
    switch (sort) {
      case 'price_asc': return aPrice - bPrice;
      case 'price_desc': return bPrice - aPrice;
      case 'year_desc': return b.year - a.year;
      case 'year_asc': return a.year - b.year;
      case 'odometer_asc': return a.odometer_km - b.odometer_km;
      case 'condition_desc': return b.condition_grade - a.condition_grade;
      default: return 0;
    }
  });

  return results.map((v) => mergeVehicleWithBids(v, store, vehicles));
}

export function getVehicleWithBids(id: string, store: BidStore): VehicleWithBids | null {
  const v = getVehicleById(id);
  if (!v) return null;
  return mergeVehicleWithBids(v, store, vehicles);
}

export function getRelatedVehicles(
  vehicleId: string,
  store: BidStore = {},
  limit = 4,
): VehicleWithBids[] {
  const current = getVehicleById(vehicleId);
  if (!current) return [];

  const currentPrice = store[current.id]?.currentBid ?? getEffectiveBid(current);

  const scored = vehicles
    .filter((v) => v.id !== vehicleId)
    .map((v) => {
      let score = 0;
      if (v.make === current.make) score += 3;
      if (v.body_style === current.body_style) score += 2;
      if (v.province === current.province) score += 1;
      const price = store[v.id]?.currentBid ?? getEffectiveBid(v);
      const priceDiff = Math.abs(price - currentPrice);
      return { v, score, priceDiff };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.priceDiff - b.priceDiff)
    .slice(0, limit);

  return scored.map(({ v }) => mergeVehicleWithBids(v, store, vehicles));
}

export function getFeaturedVehicles(store: BidStore = {}, limit = 8): VehicleWithBids[] {
  const all = vehicles.map((v) => mergeVehicleWithBids(v, store, vehicles));

  const priority = (v: VehicleWithBids) => {
    if (v.auction_status === 'live') return 0;
    if (v.auction_status === 'upcoming') return 1;
    return 2;
  };

  return [...all]
    .sort((a, b) => {
      const pa = priority(a);
      const pb = priority(b);
      if (pa !== pb) return pa - pb;
      return a.normalized_auction_start.getTime() - b.normalized_auction_start.getTime();
    })
    .slice(0, limit);
}