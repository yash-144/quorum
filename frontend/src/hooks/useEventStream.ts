import { useEffect, useState } from 'react';
import { getCachedFeed } from '../lib/cache';
import type { FeedEvent } from '../types';

export function useEventStream() {
  const [events, setEvents] = useState<FeedEvent[]>([]);

  useEffect(() => {
    const refresh = () => setEvents(getCachedFeed());
    refresh();

    window.addEventListener('ct-feed-updated', refresh);
    return () => {
      window.removeEventListener('ct-feed-updated', refresh);
    };
  }, []);

  return { events, setEvents };
}
