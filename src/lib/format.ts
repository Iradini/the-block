import type { Vehicle } from '../types/vehicle';

const BID_INCREMENT = 500;

export function roundUpToIncrement(amount: number, increment = BID_INCREMENT): number {
  return Math.ceil(amount / increment) * increment;
}

export function formatCurrency(amount: number | null, fallback = '—'): string {
  if (amount === null || Number.isNaN(amount)) return fallback;
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatKm(km: number): string {
  return `${new Intl.NumberFormat('en-CA').format(km)} km`;
}

export type ConditionTier = 'excellent' | 'good' | 'fair' | 'poor';

export function formatConditionGrade(grade: number): { label: string; tier: ConditionTier } {
  const label = grade.toFixed(1);
  if (grade >= 4) return { label, tier: 'excellent' };
  if (grade >= 3) return { label, tier: 'good' };
  if (grade >= 2) return { label, tier: 'fair' };
  return { label, tier: 'poor' };
}

export function getEffectiveBid(vehicle: Vehicle): number {
  return vehicle.current_bid ?? vehicle.starting_bid;
}

export function getMinNextBid(effectiveBid: number): number {
  return roundUpToIncrement(effectiveBid + BID_INCREMENT);
}