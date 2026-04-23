import { useEffect, useState } from 'react';
import type { FeedEvent } from '../types';

export function useEventStream() {
  const [events, setEvents] = useState<FeedEvent[]>([]);

  useEffect(() => {
    // Real Horizon event stream should be attached here.
    setEvents([]);
  }, []);

  return { events, setEvents };
}
