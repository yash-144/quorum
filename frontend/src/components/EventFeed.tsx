import type { FeedEvent } from '../types';
import { truncateAddress } from '../lib/stellar';

const EVENT_LABELS: Record<FeedEvent['type'], { label: string; dot: string }> = {
  proposal_created:  { label: 'Proposal created',  dot: 'bg-accent' },
  vote:              { label: 'Vote cast',          dot: 'bg-passed' },
  proposal_executed: { label: 'Proposal executed', dot: 'bg-passed' },
  proposal_expired:  { label: 'Proposal expired',  dot: 'bg-pending' },
  token_minted:      { label: 'Token minted',      dot: 'bg-accent' },
};

function relativeTime(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

export function EventFeed({ events }: { events: FeedEvent[] }) {
  return (
    <section className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        <h2 className="text-sm font-semibold text-primary">Activity</h2>
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-muted text-center py-6">No activity yet</p>
      ) : (
        <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {events.map((ev) => {
            const cfg = EVENT_LABELS[ev.type] ?? { label: ev.type, dot: 'bg-muted' };
            const actor = ev.actor.length > 20 ? truncateAddress(ev.actor) : ev.actor;
            return (
              <li key={ev.id} className="flex items-start gap-2.5 text-xs">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-secondary">{cfg.label}</span>
                  <span className="text-muted font-mono"> · {actor}</span>
                  {ev.proposalTitle && (
                    <span className="text-muted"> · "{ev.proposalTitle}"</span>
                  )}
                </div>
                <span className="text-muted flex-shrink-0 font-mono">{relativeTime(ev.timestamp)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
