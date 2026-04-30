import type { Member } from '../types';
import { truncateAddress } from '../lib/stellar';

export function MemberList({ members }: { members: Member[] }) {
  return (
    <section className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-primary">Members</h2>
        <span className="text-xs font-mono text-muted bg-panel border border-border px-2 py-0.5 rounded">
          {members.length}
        </span>
      </div>

      {members.length === 0 ? (
        <p className="text-xs text-muted text-center py-6">No members yet</p>
      ) : (
        <ul className="flex flex-col gap-1.5 max-h-56 overflow-y-auto">
          {members.map((m) => (
            <li key={m.address} className="flex items-center justify-between gap-2 px-3 py-2 bg-panel border border-border rounded text-xs">
              <span className="font-mono text-secondary truncate" title={m.address}>
                {truncateAddress(m.address)}
              </span>
              <span className="font-mono font-medium text-primary flex-shrink-0">
                {m.tokenBalance} <span className="text-muted">VOTE</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
