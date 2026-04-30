import { useEffect, useState } from 'react';
import type { Member } from '../types';
import { appendFeedEvent } from '../lib/cache';
import { isAdmin } from '../lib/stellar';
import { fetchMembers, mintMemberToken, updateMemberBalance, removeMember } from '../lib/token-contract';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (): Promise<Member[]> => {
    const data = await fetchMembers();
    setMembers(data);
    return data;
  };

  useEffect(() => {
    let active = true;
    load()
      .then((data) => { if (active) setMembers(data); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const requireAdmin = (adminAddress: string) => {
    if (!isAdmin(adminAddress)) throw new Error('Only admin can manage members');
  };

  const addMemberByAdmin = async (adminAddress: string, memberAddress: string, amount: number) => {
    requireAdmin(adminAddress);
    if (!memberAddress.trim()) throw new Error('Member address is required');
    if (amount <= 0) throw new Error('Token amount must be greater than 0');
    const minted = await mintMemberToken(memberAddress, amount);
    await load();
    appendFeedEvent({ id: `mint-${Date.now()}`, type: 'token_minted', actor: adminAddress, amount, timestamp: Date.now() });
    return minted;
  };

  const updateMemberByAdmin = async (adminAddress: string, memberAddress: string, newBalance: number) => {
    requireAdmin(adminAddress);
    if (newBalance < 0) throw new Error('Balance cannot be negative');
    const updated = await updateMemberBalance(memberAddress, newBalance);
    await load();
    return updated;
  };

  const removeMemberByAdmin = async (adminAddress: string, memberAddress: string) => {
    requireAdmin(adminAddress);
    await removeMember(memberAddress);
    await load();
    appendFeedEvent({ id: `remove-${Date.now()}`, type: 'token_minted', actor: adminAddress, timestamp: Date.now() });
  };

  return { members, loading, refresh: load, addMemberByAdmin, updateMemberByAdmin, removeMemberByAdmin };
}
