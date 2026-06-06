import type { AuctionStatus } from '../types/vehicle'
import vehiclesRaw from '../../data/vehicles.json'

const AUCTION_WINDOW_MS = 2 * 60 * 60 * 1000 // 2 hours

// Compute normalization bounds once at module init so all timestamps
// are remapped to [now - 2h, now + 7d], preserving relative ordering.
// The dataset uses synthetic past dates; this makes live/upcoming/ended
// states work correctly in the prototype.
const rawTimestamps = (vehiclesRaw as Array<{ auction_start: string }>).map(
  (v) => new Date(v.auction_start).getTime()
)
const rawMin = Math.min(...rawTimestamps)
const rawMax = Math.max(...rawTimestamps)
const sessionNow = Date.now()
const normalizedMin = sessionNow - AUCTION_WINDOW_MS
const normalizedMax = sessionNow + 7 * 24 * 60 * 60 * 1000

const normalizationCache = new Map<string, number>()

export function normalizeAuctionStart(rawStart: string): Date {
  if (normalizationCache.has(rawStart)) {
    return new Date(normalizationCache.get(rawStart)!)
  }
  const rawTime = new Date(rawStart).getTime()
  const ratio = rawMax === rawMin ? 0.5 : (rawTime - rawMin) / (rawMax - rawMin)
  const normalizedTime = normalizedMin + ratio * (normalizedMax - normalizedMin)
  normalizationCache.set(rawStart, normalizedTime)
  return new Date(normalizedTime)
}

export function getAuctionStatus(normalizedStart: Date): AuctionStatus {
  const now = Date.now()
  const start = normalizedStart.getTime()
  const end = start + AUCTION_WINDOW_MS
  if (now >= start && now < end) return 'live'
  if (now < start) return 'upcoming'
  return 'ended'
}

export function getTimeUntilAuction(normalizedStart: Date): string {
  const status = getAuctionStatus(normalizedStart)
  const now = Date.now()

  if (status === 'live') {
    const remaining = normalizedStart.getTime() + AUCTION_WINDOW_MS - now
    const totalMin = Math.floor(remaining / 60000)
    const hours = Math.floor(totalMin / 60)
    const mins = totalMin % 60
    if (hours > 0) return `Live · ${hours}h ${mins}m left`
    return `Live · ${mins}m left`
  }

  if (status === 'upcoming') {
    const diff = normalizedStart.getTime() - now
    const totalMin = Math.floor(diff / 60000)
    const hours = Math.floor(totalMin / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `In ${days}d ${hours % 24}h`
    if (hours > 0) return `In ${hours}h ${totalMin % 60}m`
    return `In ${totalMin}m`
  }

  const diff = now - normalizedStart.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(hours / 24)
  if (days > 0) return `Ended ${days}d ago`
  if (hours > 0) return `Ended ${hours}h ago`
  return 'Ended'
}
