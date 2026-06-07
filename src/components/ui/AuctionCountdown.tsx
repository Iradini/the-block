import { useEffect, useState } from 'react';
import type { AuctionStatus } from '../../types/vehicle';
import { getAuctionCountdown } from '../../lib/auction';

interface AuctionCountdownProps {
  status: AuctionStatus;
  normalizedStart: Date;
  className?: string;
  liveClassName?: string;
  urgent?: boolean;
}

export function AuctionCountdown({
  status,
  normalizedStart,
  className = '',
  liveClassName = 'text-red-400 font-mono font-semibold',
  urgent = false,
}: AuctionCountdownProps) {
  const [label, setLabel] = useState(() =>
    getAuctionCountdown(status, normalizedStart),
  );

  useEffect(() => {
    if (status !== 'live' && status !== 'upcoming') return;

    const tick = () => setLabel(getAuctionCountdown(status, normalizedStart));
    tick();
    const id = window.setInterval(tick, 1000);

    return () => window.clearInterval(id);
  }, [status, normalizedStart]);

  const isLive = status === 'live';

  return (
    <span
      className={`${className} ${isLive ? liveClassName : ''} ${urgent && isLive ? 'animate-pulse' : ''}`}
    >
      {label}
    </span>
  );
}
