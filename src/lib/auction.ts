import type { AuctionStatus, Vehicle } from '../types/vehicle';

const AUCTION_DURATION_MS = 2 * 60 * 60 * 1000;
export { AUCTION_DURATION_MS };
const WINDOW_START_OFFSET_MS = 2 * 60 * 60 * 1000;
const WINDOW_END_OFFSET_MS = 7 * 24 * 60 * 60 * 1000;

let normalizedMap: Map<string, Date> | null = null;

function buildNormalizedMap(vehicles: Vehicle[]): Map<string, Date> {
  const dates = vehicles
    .map((v) => new Date(v.auction_start).getTime())
    .filter((t) => !Number.isNaN(t));
  const min = Math.min(...dates);
  const max = Math.max(...dates);
  const now = Date.now();
  const targetStart = now - WINDOW_START_OFFSET_MS;
  const targetEnd = now + WINDOW_END_OFFSET_MS;

  const map = new Map<string, Date>();
  for (const v of vehicles) {
    const raw = new Date(v.auction_start).getTime();
    const ratio = max === min ? 0.5 : (raw - min) / (max - min);
    const normalized = targetStart + ratio * (targetEnd - targetStart);
    map.set(v.id, new Date(normalized));
  }
  return map;
}

export function getNormalizedAuctionStart(vehicle: Vehicle, allVehicles: Vehicle[]): Date {
  if (!normalizedMap) normalizedMap = buildNormalizedMap(allVehicles);
  return normalizedMap.get(vehicle.id) ?? new Date(vehicle.auction_start);
}

export function resetNormalizedAuctionCache(): void {
  normalizedMap = null;
}

export function getAuctionStatus(normalizedStart: Date, now = new Date()): AuctionStatus {
  const start = normalizedStart.getTime();
  const end = start + AUCTION_DURATION_MS;
  const t = now.getTime();
  if (t < start) return 'upcoming';
  if (t >= start && t < end) return 'live';
  return 'ended';
}

export function getTimeUntilAuctionLabel(status: AuctionStatus, normalizedStart: Date): string {
  const now = Date.now();
  if (status === 'live') return 'Live now';
  if (status === 'ended') return 'Ended';
  const diff = normalizedStart.getTime() - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days >= 1) return `Starts in ${days} day${days === 1 ? '' : 's'}`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `Starts in ${hours}h ${mins}m`;
}

export function getAuctionCountdown(
  status: AuctionStatus,
  normalizedStart: Date,
  now = Date.now(),
): string {
  if (status === 'ended') return 'Ended';

  if (status === 'live') {
    const end = normalizedStart.getTime() + AUCTION_DURATION_MS;
    const diff = Math.max(0, end - now);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days} Day${days === 1 ? '' : 's'}`;
    }
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  const diff = normalizedStart.getTime() - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days >= 1) return `${days} Day${days === 1 ? '' : 's'}`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m`;
}

export function getAuctionEndDate(normalizedStart: Date): Date {
  return new Date(normalizedStart.getTime() + AUCTION_DURATION_MS);
}

export function formatAuctionEndLabel(status: AuctionStatus, normalizedStart: Date): string {
  if (status === 'ended') return 'Auction ended';

  const end = getAuctionEndDate(normalizedStart);
  const formatted = new Intl.DateTimeFormat('en-CA', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(end);

  return status === 'live' ? `Ends ${formatted}` : `Ending ${formatted}`;
}

export function getRemainingAuctionMs(
  status: AuctionStatus,
  normalizedStart: Date,
  now = Date.now(),
): number | null {
  if (status === 'ended') return 0;
  if (status === 'live') {
    const end = normalizedStart.getTime() + AUCTION_DURATION_MS;
    return Math.max(0, end - now);
  }
  return null;
}

export function isAuctionEndingSoon(
  status: AuctionStatus,
  normalizedStart: Date,
  thresholdMs = 60_000,
  now = Date.now(),
): boolean {
  const remaining = getRemainingAuctionMs(status, normalizedStart, now);
  return remaining !== null && remaining > 0 && remaining <= thresholdMs;
}