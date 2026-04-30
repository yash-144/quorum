'use client';
import { Header } from '../components/Header';
import { WalletConnect } from '../components/WalletConnect';
import { CreateProposalModal } from '../components/CreateProposalModal';
import { ProposalList } from '../components/ProposalList';
import { TreasuryStats } from '../components/TreasuryStats';
import { EventFeed } from '../components/EventFeed';
import { MemberList } from '../components/MemberList';
import { AdminPanel } from '../components/AdminPanel';
import { useFreighter } from '../hooks/useFreighter';
import { useProposals } from '../hooks/useProposals';
import { useMembers } from '../hooks/useMembers';
import { useEventStream } from '../hooks/useEventStream';

export default function Home() {
  const { wallet, connect, connectError } = useFreighter();
  const { proposals, balance, createNewProposal, voteOnProposal, executeProposalByAdmin } = useProposals();
  const { members, addMemberByAdmin, updateMemberByAdmin, removeMemberByAdmin } = useMembers();
  const { events } = useEventStream();

  const handleCreate = async (p: { title: string; description: string; recipient: string; amount: number; durationHours: number }) => {
    if (!wallet.address) throw new Error('Connect your wallet first');
    await createNewProposal({ ...p, proposer: wallet.address });
  };

  const handleVote = async (proposalId: number, approve: boolean) => {
    if (!wallet.address) throw new Error('Connect your wallet to vote');
    await voteOnProposal(proposalId, approve, wallet.address);
  };

  const handleExecute = async (proposalId: number) => {
    if (!wallet.address) throw new Error('Connect wallet first');
    await executeProposalByAdmin(proposalId, wallet.address);
  };

  const handleAddMember = async (memberAddress: string, amount: number) => {
    if (!wallet.address) throw new Error('Connect wallet first');
    await addMemberByAdmin(wallet.address, memberAddress, amount);
  };

  const handleUpdateMember = async (memberAddress: string, newBalance: number) => {
    if (!wallet.address) throw new Error('Connect wallet first');
    await updateMemberByAdmin(wallet.address, memberAddress, newBalance);
  };

  const handleRemoveMember = async (memberAddress: string) => {
    if (!wallet.address) throw new Error('Connect wallet first');
    await removeMemberByAdmin(wallet.address, memberAddress);
  };

  const stats = {
    balance,
    totalProposals:  proposals.length,
    passedProposals: proposals.filter((p) => p.status === 'passed' || p.status === 'executed').length,
    totalMembers:    members.length,
  };

  return (
    <main className="min-h-screen bg-bg">
      <Header />
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8 flex flex-col gap-6">

        {/* Top bar: wallet + create */}
        <div className="bg-card border border-border rounded-lg px-5 py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <WalletConnect wallet={wallet} connect={connect} connectError={connectError} />
          <CreateProposalModal onSubmit={handleCreate} disabled={!wallet.address} />
        </div>

        {/* Stats */}
        <TreasuryStats stats={stats} />

        {/* Main split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Proposals */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">Proposals</h2>
              <span className="text-xs font-mono text-muted">{proposals.length} total</span>
            </div>
            <ProposalList
              proposals={proposals}
              onVote={handleVote}
              onExecute={handleExecute}
              canVote={!!wallet.address}
              canExecute={wallet.isAdmin}
              walletAddress={wallet.address}
            />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Admin panel gets members list for inline management */}
            <AdminPanel
              enabled={wallet.isAdmin}
              members={members}
              onAddMember={handleAddMember}
              onUpdateMember={handleUpdateMember}
              onRemoveMember={handleRemoveMember}
            />
            <EventFeed events={events} />
            {/* Non-admin public member list */}
            {!wallet.isAdmin && <MemberList members={members} />}
          </div>
        </div>
      </div>
    </main>
  );
}
