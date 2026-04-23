'use client';

import { Header } from '../components/Header';
import { WalletConnect } from '../components/WalletConnect';
import { CreateProposalModal } from '../components/CreateProposalModal';
import { ProposalList } from '../components/ProposalList';
import { TreasuryStats } from '../components/TreasuryStats';
import { EventFeed } from '../components/EventFeed';
import { MemberList } from '../components/MemberList';
import { useProposals } from '../hooks/useProposals';
import { useMembers } from '../hooks/useMembers';
import { useEventStream } from '../hooks/useEventStream';

export default function Home() {
  const { proposals } = useProposals();
  const { members } = useMembers();
  const { events } = useEventStream();

  const stats = {
    balance: 0,
    totalProposals: proposals.length,
    passedProposals: proposals.filter((p) => p.status === 'passed' || p.status === 'executed').length,
    totalMembers: members.length,
  };

  return (
    <main className="min-h-screen bg-bg text-primary">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <WalletConnect />
          <CreateProposalModal />
        </div>

        <TreasuryStats stats={stats} />

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <ProposalList proposals={proposals} />
          <div className="space-y-4">
            <EventFeed events={events} />
            <MemberList members={members} />
          </div>
        </div>
      </div>
    </main>
  );
}
