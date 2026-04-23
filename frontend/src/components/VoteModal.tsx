'use client';

export function VoteModal({ proposalId }: { proposalId: number }) {
  return (
    <div className="rounded border border-border bg-card p-3 text-xs text-secondary">
      Vote actions for proposal #{proposalId}
    </div>
  );
}
