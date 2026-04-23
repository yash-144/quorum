import type { FeedEvent } from '../types';
import { truncateAddress } from '../lib/stellar';

export function EventFeed({ events }: { events: FeedEvent[] }) {
  return (
    <section className="rounded border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-semibold">Live Feed</h2>
      <ul className="space-y-2 text-xs text-secondary">
        {events.length === 0 ? <li>No events yet</li> : null}
        {events.map((event) => (
          <li key={event.id}>
            {event.type} by {truncateAddress(event.actor)}
          </li>
        ))}
      </ul>
    </section>
  );
}
