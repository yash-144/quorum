'use client';
import type { Proposal } from '../types';
import { useState } from 'react';
import { formatXlm, getVotingProgress, truncateAddress, stellarExpertUrl } from '../lib/stellar';
import { CountdownTimer } from './CountdownTimer';

const STATUS_STYLES: Record<string, string> = {
  active:   'bg-active/15 text-accent-light border-active/25',
  passed:   'bg-passed/15 text-passed border-passed/25',
  failed:   'bg-failed/15 text-failed border-failed/25',
  executed: 'bg-passed/15 text-passed border-passed/25',
  expired:  'bg-muted/30 text-secondary border-muted/20',
};

type Props = {
  proposal: Proposal;
  onVote: (proposalId: number, approve: boolean) => Promise<void>;
  onExecute: (proposalId: number) => Promise<void>;
  canVote: boolean;
  canExecute: boolean;
  walletAddress?: string | null;
};

export function ProposalCard({ proposal, onVote, onExecute, canVote, canExecute, walletAddress }: Props) {
  const [voteBusy,    setVoteBusy]    = useState(false);
  const [executeBusy, setExecuteBusy] = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const isClosed   = proposal.status !== 'active';
  const voteKey    = walletAddress ? `ct_vote_cast_${proposal.id}_${walletAddress}` : null;
  const alreadyVoted = !!(voteKey && typeof window !== 'undefined' && localStorage.getItem(voteKey));
  const progress   = getVotingProgress(proposal.yesVotes, proposal.noVotes);

  const handleVote = async (approve: boolean) => {
    try { setVoteBusy(true); setError(null); await onVote(proposal.id, approve); }
    catch (e) { setError(e instanceof Error ? e.message : 'Vote failed'); }
    finally { setVoteBusy(false); }
  };

  const handleExecute = async () => {
    try { setExecuteBusy(true); setError(null); await onExecute(proposal.id); }
    catch (e) { setError(e instanceof Error ? e.message : 'Execution failed'); }
    finally { setExecuteBusy(false); }
  };

  return (
    <article className="fade-in bg-card border border-border rounded-lg overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-border">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-primary leading-snug">{proposal.title}</h3>
          <p className="mt-1 text-xs text-secondary font-mono">
            #{proposal.id} · by {truncateAddress(proposal.proposer)}
          </p>
        </div>
        <span className={`flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider border px-2 py-0.5 rounded ${STATUS_STYLES[proposal.status] ?? STATUS_STYLES.expired}`}>
          {proposal.status}
        </span>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Description */}
        <p className="text-sm text-secondary leading-relaxed">{proposal.description}</p>

        {/* Payment details */}
        <div className="grid grid-cols-2 gap-3 bg-panel border border-border rounded-md p-3">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Recipient</p>
            <p className="text-xs font-mono text-primary break-all">{proposal.recipient}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Amount</p>
            <p className="text-sm font-mono font-semibold text-primary">{formatXlm(proposal.amount)} XLM</p>
          </div>
        </div>

        {/* Vote bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-secondary">Votes</span>
            {!isClosed && <CountdownTimer deadline={proposal.deadline} />}
          </div>
          <div className="h-1.5 w-full bg-panel rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-passed transition-all duration-500 rounded-full"
              style={{ width: `${progress.yesPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-secondary">
            <span className="text-passed">✓ {proposal.yesVotes} yes</span>
            <span className="text-failed">✗ {proposal.noVotes} no</span>
          </div>
        </div>

        {/* Already voted notice */}
        {alreadyVoted && !isClosed && (
          <p className="text-xs text-secondary bg-panel border border-border rounded px-3 py-2 text-center">
            You have already voted on this proposal
          </p>
        )}

        {/* Vote buttons */}
        {!isClosed && !alreadyVoted && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleVote(true)}
              disabled={!canVote || voteBusy}
              className="py-2 rounded-md text-sm font-medium border border-passed/30 text-passed bg-passed/10 hover:bg-passed/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {voteBusy ? '…' : '✓ Yes'}
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={!canVote || voteBusy}
              className="py-2 rounded-md text-sm font-medium border border-failed/30 text-failed bg-failed/10 hover:bg-failed/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {voteBusy ? '…' : '✗ No'}
            </button>
          </div>
        )}

        {/* Execute button */}
        {canExecute && proposal.status === 'passed' && (
          <button
            onClick={handleExecute}
            disabled={executeBusy}
            className="w-full py-2 rounded-md text-sm font-medium bg-accent hover:bg-accent-light text-white transition-colors disabled:opacity-50"
          >
            {executeBusy ? 'Executing…' : 'Execute Proposal'}
          </button>
        )}

        {/* Tx link */}
        {proposal.txHash && (
          <a
            href={stellarExpertUrl(proposal.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent-light hover:underline font-mono text-center"
          >
            View on Stellar Expert ↗
          </a>
        )}

        {/* Error */}
        {error && (
          <p className="text-xs text-failed bg-failed/10 border border-failed/20 rounded px-3 py-2 font-mono">{error}</p>
        )}
      </div>
    </article>
  );
}
