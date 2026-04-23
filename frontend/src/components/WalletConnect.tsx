'use client';

import { useFreighter } from '../hooks/useFreighter';
import { truncateAddress } from '../lib/stellar';

export function WalletConnect() {
  const { wallet, connect } = useFreighter();

  return (
    <div className="rounded border border-border bg-card p-3">
      <button
        onClick={connect}
        className="rounded border border-border px-3 py-2 text-sm hover:border-border-hover"
        type="button"
      >
        {wallet.connecting ? 'Connecting...' : wallet.connected ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      <p className="mt-2 text-xs text-secondary">
        {wallet.address ? truncateAddress(wallet.address) : 'No wallet'}
      </p>
    </div>
  );
}
