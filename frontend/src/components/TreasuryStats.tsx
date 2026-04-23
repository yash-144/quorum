import type { TreasuryStats as Stats } from '../types';

export function TreasuryStats({ stats }: { stats: Stats }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded border border-border bg-card p-3">
        <p className="text-xs text-secondary">Balance</p>
        <p className="mt-1 text-lg">{stats.balance.toFixed(2)} XLM</p>
      </div>
      <div className="rounded border border-border bg-card p-3">
        <p className="text-xs text-secondary">Proposals</p>
        <p className="mt-1 text-lg">{stats.totalProposals}</p>
      </div>
      <div className="rounded border border-border bg-card p-3">
        <p className="text-xs text-secondary">Passed</p>
        <p className="mt-1 text-lg">{stats.passedProposals}</p>
      </div>
      <div className="rounded border border-border bg-card p-3">
        <p className="text-xs text-secondary">Members</p>
        <p className="mt-1 text-lg">{stats.totalMembers}</p>
      </div>
    </section>
  );
}
