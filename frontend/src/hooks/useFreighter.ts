import { useCallback, useState } from 'react';
import { isConnected, requestAccess, getAddress } from '@stellar/freighter-api';
import { isAdmin } from '../lib/stellar';
import type { WalletState } from '../types';

export function useFreighter() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    connected: false,
    connecting: false,
    isAdmin: false,
  });
  const [connectError, setConnectError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setConnectError(null);
    setWallet((prev) => ({ ...prev, connecting: true }));

    try {
      // 1. Check if Freighter extension is installed
      const connectedResult = await isConnected();
      if (connectedResult.error) {
        throw new Error('Freighter extension not detected. Please install it from freighter.app');
      }

      // 2. Request access (triggers the Freighter popup)
      const accessResult = await requestAccess();
      if (accessResult.error) {
        throw new Error(String(accessResult.error));
      }

      // 3. Get address — try from requestAccess result first, fallback to getAddress()
      let address = accessResult.address || null;
      if (!address) {
        const addrResult = await getAddress();
        if (addrResult.error) throw new Error(String(addrResult.error));
        address = addrResult.address || null;
      }

      if (!address) throw new Error('Could not retrieve wallet address from Freighter');

      setWallet({
        address,
        connected: true,
        connecting: false,
        isAdmin: isAdmin(address),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Wallet connection failed';
      setConnectError(message);
      setWallet((prev) => ({ ...prev, connecting: false, connected: false }));
    }
  }, []);

  return { wallet, connect, connectError };
}
