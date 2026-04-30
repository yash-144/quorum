'use client';
import { truncateAddress } from '../lib/stellar';
import type { WalletState } from '../types';

type Props = {
  wallet: WalletState;
  connect: () => Promise<void>;
  connectError?: string | null;
};

export function WalletConnect({ wallet, connect, connectError }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {wallet.connected ? (
          <>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-passed flex-shrink-0" />
              <span className="font-mono text-sm text-primary">{truncateAddress(wallet.address!)}</span>
            </div>
            <span className="text-xs font-medium bg-panel border border-border text-secondary px-2.5 py-0.5 rounded">
              {wallet.isAdmin ? 'Admin' : 'Member'}
            </span>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted flex-shrink-0" />
            <span className="text-sm text-secondary">No wallet connected</span>
          </div>
        )}

        <button
          onClick={connect}
          disabled={wallet.connecting}
          className="ml-auto sm:ml-0 px-4 py-2 rounded-md text-sm font-medium transition-colors
                     bg-accent hover:bg-accent-light text-white
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {wallet.connecting ? 'Connecting…' : wallet.connected ? 'Connected' : 'Connect Freighter'}
        </button>
      </div>

      {connectError && (
        <p className="text-xs text-failed font-mono bg-failed/10 border border-failed/20 px-3 py-2 rounded">
          {connectError}
        </p>
      )}
    </div>
  );
}
