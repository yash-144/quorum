import type { Proposal } from '../types';
import { ProposalCard } from './ProposalCard';

export function ProposalList({ proposals }: { proposals: Proposal[] }) {
  if (proposals.length === 0) {
    return (
      <section className="rounded border border-border bg-card p-4 text-sm text-secondary">
        No proposals yet.
      </section>
    );
  }

  return (
    <section className="grid gap-3 md:grid-cols-2">
      {proposals.map((proposal) => (
        <ProposalCard key={proposal.id} proposal={proposal} />
      ))}
    </section>
  );
}
