'use client';

import { useEffect, useState } from 'react';
import { getTimeRemaining } from '../lib/stellar';

export function CountdownTimer({ deadline }: { deadline: number }) {
  const [time, setTime] = useState(() => getTimeRemaining(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeRemaining(deadline));
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (time.isExpired) {
    return <span className="text-failed">Expired</span>;
  }

  return (
    <span className="font-mono text-xs text-secondary">
      {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
    </span>
  );
}
