import { useCallback, useState } from 'react';
import { isConnected, requestAccess } from '@stellar/freighter-api';
import { isAdmin } from '../lib/stellar';
import type { WalletState } from '../types';

export function useFreighter() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    connected: false,
    connecting: false,
    isAdmin: false,
  });

  const connect = useCallback(async () => {
    setWallet((prev) => ({ ...prev, connecting: true }));

    try {
      const status = await isConnected();
      if (!status.isConnected) {
        const result = await requestAccess();
        if (result.error) throw new Error(result.error);
        const address = result.address ?? null;
        setWallet({
          address,
          connected: !!address,
          connecting: false,
          isAdmin: isAdmin(address),
        });
        return;
      }

      const result = await requestAccess();
      if (result.error) throw new Error(result.error);
      const address = result.address ?? null;
      setWallet({
        address,
        connected: !!address,
        connecting: false,
        isAdmin: isAdmin(address),
      });
    } catch {
      setWallet((prev) => ({ ...prev, connecting: false }));
    }
  }, []);

  return { wallet, connect };
}
