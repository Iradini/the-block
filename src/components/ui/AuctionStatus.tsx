import type { AuctionStatus as AuctionStatusType } from '../../types/vehicle';

const styles: Record<AuctionStatusType, string> = {
  live: 'bg-red-600 text-white',
  upcoming: 'bg-openlane-blue text-white',
  ended: 'bg-slate-500 text-white',
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
      className={`inline-flex shrink-0 rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
