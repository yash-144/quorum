import type { TreasuryStats as Stats } from '../types';
import { formatXlm } from '../lib/stellar';

const ITEMS = (stats: Stats) => [
  { label: 'Treasury Balance', value: `${formatXlm(stats.balance)} XLM`, icon: '◎' },
  { label: 'Total Proposals',  value: String(stats.totalProposals),       icon: '≡' },
  { label: 'Passed / Executed',value: String(stats.passedProposals),      icon: '✓' },
  { label: 'DAO Members',      value: String(stats.totalMembers),         icon: '⊹' },
];

export function TreasuryStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {ITEMS(stats).map((item) => (
        <div key={item.label} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2">
          <span className="text-xl text-secondary">{item.icon}</span>
          <span className="text-xl sm:text-2xl font-semibold font-mono text-primary">{item.value}</span>
          <span className="text-xs text-secondary leading-tight">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
