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
    return (
      <span className="text-[10px] font-bold uppercase tracking-widest border border-border px-2 py-0.5">
        Ended
      </span>
    );
  }

  return (
    <span className="font-mono text-[10px] md:text-xs">
      {time.days > 0 && <>{time.days}d </>}
      {String(time.hours).padStart(2, '0')}h{' '}
      {String(time.minutes).padStart(2, '0')}m{' '}
      {String(time.seconds).padStart(2, '0')}s
    </span>
  );
}
