import type { Member } from '../types';
import { truncateAddress } from '../lib/stellar';

export function MemberList({ members }: { members: Member[] }) {
  return (
    <section className="rounded border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-semibold">Members</h2>
      <ul className="space-y-2 text-xs text-secondary">
        {members.length === 0 ? <li>No members yet</li> : null}
        {members.map((member) => (
          <li key={member.address} className="flex items-center justify-between gap-2">
            <span>{truncateAddress(member.address)}</span>
            <span>{member.tokenBalance} VOTE</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
