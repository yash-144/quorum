'use client';
import type { Proposal } from '../types';
import { ProposalCard } from './ProposalCard';

type Props = {
  proposals: Proposal[];
  onVote: (proposalId: number, approve: boolean) => Promise<void>;
  onExecute: (proposalId: number) => Promise<void>;
  canVote: boolean;
  canExecute: boolean;
  walletAddress?: string | null;
};

export function ProposalList({ proposals, onVote, onExecute, canVote, canExecute, walletAddress }: Props) {
  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-lg">
        <span className="text-3xl mb-3 opacity-30">≡</span>
        <p className="text-sm font-medium text-secondary">No proposals yet</p>
        <p className="text-xs text-muted mt-1">Create a proposal to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          onVote={onVote}
          onExecute={onExecute}
          canVote={canVote}
          canExecute={canExecute}
          walletAddress={walletAddress}
        />
      ))}
    </div>
  );
}
