import type { Proposal } from '../types';

const CONTRACT_ID = process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ID ?? '';

export function getTreasuryContractId(): string {
  return CONTRACT_ID;
}

export async function fetchProposals(): Promise<Proposal[]> {
  // TODO: wire to Soroban RPC invocation for get_all_proposals.
  return [];
}

export async function submitVote(_proposalId: number, _approve: boolean): Promise<void> {
  // TODO: wire to Soroban RPC invocation for vote.
}

export async function createProposal(_proposal: {
  title: string;
  description: string;
  recipient: string;
  amount: number;
}): Promise<void> {
  // TODO: wire to Soroban RPC invocation for create_proposal.
}
