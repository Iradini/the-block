import type { AuctionStatus as AuctionStatusType } from '../../types/vehicle'

interface AuctionStatusProps {
  status: AuctionStatusType
  timeLabel: string
  className?: string
}

const config: Record<AuctionStatusType, { dot: string; pill: string }> = {
  live: {
    dot: 'bg-green-400 animate-pulse',
    pill: 'bg-green-900/80 text-green-200',
  },
  upcoming: {
    dot: 'bg-blue-400',
    pill: 'bg-blue-900/80 text-blue-200',
  },
  ended: {
    dot: 'bg-gray-400',
    pill: 'bg-gray-800/80 text-gray-300',
  },
}

export function AuctionStatus({ status, timeLabel, className = '' }: AuctionStatusProps) {
  const { dot, pill } = config[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${pill} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} aria-hidden="true" />
      {timeLabel}
    </span>
  )
}
