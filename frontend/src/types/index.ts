export type ProposalStatus = 'active' | 'passed' | 'failed' | 'executed' | 'expired';

export interface Proposal {
  id: number;
  title: string;
  description: string;
  recipient: string;
  amount: number;
  yesVotes: number;
  noVotes: number;
  totalVoters: number;
  deadline: number;
  status: ProposalStatus;
  proposer: string;
  createdAt: number;
  txHash?: string;
}

export interface Member {
  address: string;
  tokenBalance: number;
  joinedAt?: number;
}

export interface TreasuryStats {
  balance: number;
  totalProposals: number;
  passedProposals: number;
  totalMembers: number;
}

export interface FeedEvent {
  id: string;
  type: 'vote' | 'proposal_created' | 'proposal_executed' | 'proposal_expired' | 'token_minted';
  actor: string;
  proposalId?: number;
  proposalTitle?: string;
  amount?: number;
  timestamp: number;
}

export type WalletState = {
  address: string | null;
  connected: boolean;
  connecting: boolean;
  isAdmin: boolean;
};
