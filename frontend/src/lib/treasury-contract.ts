import type { Proposal } from '../types';

const CONTRACT_ID = process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ID ?? '';
const LOCAL_ID = CONTRACT_ID || 'local-dev';
const STORAGE_KEY = `ct_runtime_proposals_${LOCAL_ID}`;
const VOTE_KEY = (proposalId: number, voter: string) => `ct_vote_cast_${proposalId}_${voter}`;
const TREASURY_BALANCE_KEY = `ct_runtime_treasury_balance_${LOCAL_ID}`;
const DEFAULT_TREASURY_BALANCE = 5000;

type ProposalInput = {
  title: string;
  description: string;
  recipient: string;
  amount: number;
  proposer?: string;
  durationHours?: number;
};

function now(): number {
  return Math.floor(Date.now() / 1000);
}

function safeRead(): Proposal[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Proposal[];
  } catch {
    return [];
  }
}

function safeWrite(proposals: Proposal[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
}

function deriveStatus(proposal: Proposal): Proposal {
  if (['executed', 'failed', 'expired'].includes(proposal.status)) return proposal;
  if (proposal.deadline <= now()) {
    if (proposal.yesVotes + proposal.noVotes === 0) return { ...proposal, status: 'expired' };
    return proposal.yesVotes > proposal.noVotes
      ? { ...proposal, status: 'passed' }
      : { ...proposal, status: 'failed' };
  }
  return { ...proposal, status: 'active' };
}

function sortLatest(a: Proposal, b: Proposal): number {
  return b.createdAt - a.createdAt;
}

function readBalance(): number {
  if (typeof window === 'undefined') return DEFAULT_TREASURY_BALANCE;
  const raw = localStorage.getItem(TREASURY_BALANCE_KEY);
  if (!raw) {
    localStorage.setItem(TREASURY_BALANCE_KEY, String(DEFAULT_TREASURY_BALANCE));
    return DEFAULT_TREASURY_BALANCE;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : DEFAULT_TREASURY_BALANCE;
}

function writeBalance(next: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TREASURY_BALANCE_KEY, String(next));
}

export function getTreasuryContractId(): string {
  return CONTRACT_ID;
}

export async function fetchProposals(): Promise<Proposal[]> {
  const proposals = safeRead().map(deriveStatus).sort(sortLatest);
  safeWrite(proposals);
  return proposals;
}

export async function getTreasuryBalance(): Promise<number> {
  return readBalance();
}

export async function createProposal(proposal: ProposalInput): Promise<Proposal> {
  if (!proposal.proposer?.trim()) {
    throw new Error('Wallet not connected — please connect Freighter first');
  }

  const proposals = safeRead();
  const maxId = proposals.reduce((acc, item) => Math.max(acc, item.id), 0);
  const durationSecs = (proposal.durationHours ?? 48) * 60 * 60;

  const created: Proposal = {
    id: maxId + 1,
    title: proposal.title.trim(),
    description: proposal.description.trim(),
    recipient: proposal.recipient.trim(),
    amount: proposal.amount,
    yesVotes: 0,
    noVotes: 0,
    totalVoters: 0,
    deadline: now() + durationSecs,
    status: 'active',
    proposer: proposal.proposer.trim(),
    createdAt: now(),
  };

  proposals.push(created);
  safeWrite(proposals.sort(sortLatest));
  return created;
}

export async function submitVote(
  proposalId: number,
  approve: boolean,
  voterAddress: string,
): Promise<Proposal> {
  if (!voterAddress?.trim()) throw new Error('Connect your wallet to vote');

  const proposals = safeRead();
  const idx = proposals.findIndex((item) => item.id === proposalId);
  if (idx < 0) throw new Error('Proposal not found');

  const current = deriveStatus(proposals[idx]);
  if (current.status !== 'active') throw new Error('This proposal is no longer active');

  const voteStorageKey = VOTE_KEY(proposalId, voterAddress);
  if (typeof window !== 'undefined' && localStorage.getItem(voteStorageKey)) {
    throw new Error('You have already voted on this proposal');
  }

  const updated: Proposal = {
    ...current,
    yesVotes: current.yesVotes + (approve ? 1 : 0),
    noVotes: current.noVotes + (approve ? 0 : 1),
    totalVoters: current.totalVoters + 1,
  };

  proposals[idx] = updated;
  safeWrite(proposals.map(deriveStatus));
  if (typeof window !== 'undefined') {
    localStorage.setItem(voteStorageKey, approve ? 'yes' : 'no');
  }

  return deriveStatus(updated);
}

export async function executeProposal(proposalId: number, callerAddress: string): Promise<Proposal> {
  if (!callerAddress) throw new Error('Only an admin can execute proposals');

  const proposals = safeRead();
  const idx = proposals.findIndex((item) => item.id === proposalId);
  if (idx < 0) throw new Error('Proposal not found');

  const current = deriveStatus(proposals[idx]);
  if (current.status !== 'passed') throw new Error('Only a passed proposal can be executed');

  const balance = readBalance();
  if (balance < current.amount) throw new Error('Insufficient treasury balance');

  const txHash = `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const updated: Proposal = { ...current, status: 'executed', txHash };

  proposals[idx] = updated;
  safeWrite(proposals);
  writeBalance(balance - current.amount);

  return updated;
}
