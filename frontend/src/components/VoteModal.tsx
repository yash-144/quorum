'use client';

type Props = {
  proposalId: number;
  disabled?: boolean;
  onVote: (proposalId: number, approve: boolean) => Promise<void>;
};

export function VoteModal({ proposalId, disabled, onVote }: Props) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-medium">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onVote(proposalId, true)}
        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded bg-passed/10 border border-passed/30 px-3 py-2 text-passed transition-all hover:bg-passed hover:text-white disabled:cursor-not-allowed disabled:bg-passed/5 disabled:text-passed/40 disabled:border-passed/10 focus:ring-2 focus:ring-passed/40"
      >
        <span className="group-hover:scale-110 transition-transform">👍</span> Vote Yes
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onVote(proposalId, false)}
        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded bg-failed/10 border border-failed/30 px-3 py-2 text-failed transition-all hover:bg-failed hover:text-white disabled:cursor-not-allowed disabled:bg-failed/5 disabled:text-failed/40 disabled:border-failed/10 focus:ring-2 focus:ring-failed/40"
      >
        <span className="group-hover:scale-110 transition-transform">👎</span> Vote No
      </button>
    </div>
  );
}
