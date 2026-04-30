import { useEffect, useState } from 'react';
import type { Proposal } from '../types';
import { appendFeedEvent } from '../lib/cache';
import {
  createProposal,
  executeProposal,
  fetchProposals,
  getTreasuryBalance,
  submitVote,
} from '../lib/treasury-contract';

export function useProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async (): Promise<Proposal[]> => {
    const [data, nextBalance] = await Promise.all([fetchProposals(), getTreasuryBalance()]);
    setProposals(data);
    setBalance(nextBalance);
    return data;
  };

  useEffect(() => {
    let active = true;
    load()
      .then((data) => {
        if (active) setProposals(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const createNewProposal = async (payload: {
    title: string;
    description: string;
    recipient: string;
    amount: number;
    proposer?: string;
    durationHours?: number;
  }) => {
    const created = await createProposal(payload);
    await load();

    appendFeedEvent({
      id: `proposal-${created.id}-${Date.now()}`,
      type: 'proposal_created',
      actor: created.proposer,
      proposalId: created.id,
      proposalTitle: created.title,
      amount: created.amount,
      timestamp: Date.now(),
    });
  };

  const voteOnProposal = async (proposalId: number, approve: boolean, voterAddress: string) => {
    const updated = await submitVote(proposalId, approve, voterAddress);
    await load();

    appendFeedEvent({
      id: `vote-${proposalId}-${Date.now()}`,
      type: 'vote',
      actor: voterAddress || 'guest',
      proposalId,
      proposalTitle: updated.title,
      timestamp: Date.now(),
    });
  };

  const executeProposalByAdmin = async (proposalId: number, adminAddress: string) => {
    const updated = await executeProposal(proposalId, adminAddress);
    await load();

    appendFeedEvent({
      id: `exec-${proposalId}-${Date.now()}`,
      type: 'proposal_executed',
      actor: adminAddress,
      proposalId,
      proposalTitle: updated.title,
      amount: updated.amount,
      timestamp: Date.now(),
    });
  };

  return {
    proposals,
    balance,
    loading,
    refresh: load,
    createNewProposal,
    voteOnProposal,
    executeProposalByAdmin,
  };
}
