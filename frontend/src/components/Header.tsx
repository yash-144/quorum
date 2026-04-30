'use client';
import { useState } from 'react';

// ─── Content ─────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      'Install the <strong>Freighter</strong> wallet browser extension from <a href="https://freighter.app" target="_blank" class="text-accent-light underline">freighter.app</a>.',
      'Open Freighter settings and switch the network to <strong>Testnet</strong>.',
      'Click <strong>"Connect Freighter"</strong> in the top bar. Freighter will prompt for approval.',
      'Once connected, your shortened address and role will appear in the top bar.',
    ],
  },
  {
    title: 'Creating a Proposal',
    items: [
      'Click <strong>"+ New Proposal"</strong>. Any connected wallet may submit a proposal.',
      'Provide a title, a description of the intent, the recipient\'s Stellar address, and the XLM amount requested.',
      'On submission the proposal becomes active and is immediately open to votes.',
    ],
  },
  {
    title: 'Voting',
    items: [
      'Any connected wallet may cast a vote on an active proposal.',
      'Each wallet may vote once per proposal. Voted proposals will show a confirmation message in place of the vote buttons.',
      'A proposal passes when Yes votes outnumber No votes before the voting deadline.',
    ],
  },
  {
    title: 'Executing a Proposal',
    items: [
      'Only wallets with the Admin role can execute proposals.',
      'The Execute button appears on proposals with a <em>Passed</em> status.',
      'After execution, the status updates to <em>Executed</em> and a link to the transaction is shown.',
    ],
  },
  {
    title: 'Member Management (Admin)',
    items: [
      'Admins have access to the Member Management panel in the sidebar.',
      'Enter a Stellar address and an amount to mint VOTE tokens and register a new member.',
      'Use the Edit button next to any member to adjust their VOTE token balance directly.',
      'Use the Remove button to revoke a member\'s status. A confirmation will be required.',
    ],
  },
  {
    title: 'Roles',
    items: [
      '<strong>Admin</strong> — defined by the <code class="font-mono bg-panel px-1 rounded text-xs">NEXT_PUBLIC_ADMIN_ADDRESSES</code> environment variable. Can execute proposals and manage members.',
      '<strong>Member</strong> — a connected wallet that holds VOTE tokens minted by an admin.',
      '<strong>Guest</strong> — any connected wallet without VOTE tokens. Can create proposals and vote.',
    ],
  },
];

// ─── Modal ────────────────────────────────────────────────────────────────────
function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="fade-in w-full max-w-md bg-surface border border-border rounded-lg shadow-lg overflow-hidden mt-14 sm:mt-16">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-primary">How to use Community Treasury</h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors text-lg leading-none"
            aria-label="Close help"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto max-h-[70vh] px-5 py-4 flex flex-col gap-6">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">
                {section.title}
              </h3>
              <ol className="flex flex-col gap-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-secondary leading-relaxed">
                    <span className="flex-shrink-0 text-muted font-mono mt-0.5">{i + 1}.</span>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ol>
            </div>
          ))}

          <p className="text-[10px] text-muted border-t border-border pt-4">
            This app runs on <strong className="text-secondary">Stellar Testnet</strong>. No real funds are involved.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export function Header() {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-accent flex items-center justify-center text-sm font-bold text-white">
              T
            </div>
            <span className="text-base font-semibold text-primary tracking-tight">Community Treasury</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:block text-xs font-mono text-secondary bg-panel border border-border px-3 py-1 rounded">
              Stellar Testnet
            </span>
            <button
              onClick={() => setHelpOpen(true)}
              className="h-7 w-7 rounded-full border border-border text-secondary hover:text-primary hover:border-border-focus transition-colors flex items-center justify-center text-xs font-semibold"
              aria-label="Help"
              title="Usage instructions"
            >
              ?
            </button>
          </div>
        </div>
      </header>

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </>
  );
}
