import type { Proposal } from '../types';
import { formatXlm, getVotingProgress } from '../lib/stellar';

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  const progress = getVotingProgress(proposal.yesVotes, proposal.noVotes);

  return (
    <article className="fade-in rounded border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold">{proposal.title}</h3>
        <span className="text-xs text-secondary">#{proposal.id}</span>
      </div>
      <p className="mt-2 text-sm text-secondary">{proposal.description}</p>
      <p className="mt-3 text-sm">Amount: {formatXlm(proposal.amount)} XLM</p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded bg-surface">
        <div className="h-full bg-passed" style={{ width: `${progress.yesPercent}%` }} />
      </div>
      <p className="mt-2 text-xs text-secondary">
        Yes {proposal.yesVotes} / No {proposal.noVotes}
      </p>
    </article>
  );
}
