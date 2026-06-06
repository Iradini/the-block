import type { ConditionDisplay } from '../types/vehicle'

export function formatCurrency(amount: number | null, fallback = '—'): string {
  if (amount === null || amount === undefined) return fallback
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatKm(km: number): string {
  return new Intl.NumberFormat('en-CA').format(km) + ' km'
}

export function formatConditionGrade(grade: number): ConditionDisplay {
  if (grade >= 4.0) {
    return {
      label: 'Excellent',
      tier: 'excellent',
      badgeClass: 'bg-green-100 text-green-800',
    }
  }
  if (grade >= 3.0) {
    return {
      label: 'Good',
      tier: 'good',
      badgeClass: 'bg-yellow-100 text-yellow-800',
    }
  }
  if (grade >= 2.0) {
    return {
      label: 'Fair',
      tier: 'fair',
      badgeClass: 'bg-orange-100 text-orange-800',
    }
  }
  return {
    label: 'Poor',
    tier: 'poor',
    badgeClass: 'bg-red-100 text-red-800',
  }
}

export function getMinimumNextBid(currentBid: number | null, startingBid: number): number {
  const base = currentBid ?? startingBid
  return Math.ceil((base + 500) / 500) * 500
}

export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}
