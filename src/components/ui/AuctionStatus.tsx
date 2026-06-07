import type { AuctionStatus as AuctionStatusType } from '../../types/vehicle';

const styles: Record<AuctionStatusType, string> = {
  live: 'bg-emerald-100 text-emerald-800',
  upcoming: 'bg-blue-100 text-blue-800',
  ended: 'bg-slate-200 text-slate-600',
};

const labels: Record<AuctionStatusType, string> = {
  live: 'Live',
  upcoming: 'Upcoming',
  ended: 'Ended',
};

interface AuctionStatusProps {
  status: AuctionStatusType;
}

export function AuctionStatus({ status }: AuctionStatusProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
