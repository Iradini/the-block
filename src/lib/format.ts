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

export function getVehicleHighlightLine(vehicle: Vehicle): string {
  const parts = [
    formatKm(vehicle.odometer_km),
    `Grade ${vehicle.condition_grade.toFixed(1)}`,
    vehicle.reserve_price === null ? 'No Reserve' : 'Reserve auction',
    vehicle.engine,
  ];
  return parts.join(' · ');
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getVehicleSubtitle(vehicle: Vehicle): string {
  return [
    vehicle.engine,
    capitalize(vehicle.transmission),
    vehicle.drivetrain,
    formatKm(vehicle.odometer_km),
    vehicle.reserve_price === null ? 'No Reserve' : 'Reserve auction',
  ].join(' · ');
}

export function getVehicleHighlights(vehicle: Vehicle): string[] {
  const bullets: string[] = [];

  if (vehicle.reserve_price === null) {
    bullets.push('No reserve — highest bid wins');
  }

  const sentences = vehicle.condition_report
    .split(/(?<=[.!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  bullets.push(...sentences.slice(0, 2));
  bullets.push(...vehicle.damage_notes.slice(0, 3));

  if (bullets.length === 0) {
    bullets.push('Condition report available below');
  }

  return [...new Set(bullets)].slice(0, 6);
}