import type { Member } from '../types';

const TOKEN_CONTRACT_ID = process.env.NEXT_PUBLIC_VOTE_TOKEN_CONTRACT_ID ?? '';
const STORAGE_KEY = 'ct_runtime_members';

const initialMembers: Member[] = [];

export function getVoteTokenContractId(): string {
  return TOKEN_CONTRACT_ID;
}

function readMembers(): Member[] {
  if (typeof window === 'undefined') return initialMembers;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMembers));
    return initialMembers;
  }
  try {
    return JSON.parse(raw) as Member[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMembers));
    return initialMembers;
  }
}

function writeMembers(members: Member[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export async function fetchMembers(): Promise<Member[]> {
  return readMembers();
}

export function hasVotingPower(address: string): boolean {
  const members = readMembers();
  const match = members.find((m) => m.address === address);
  return !!match && match.tokenBalance > 0;
}

/** Add tokens to an existing member or create a new member entry. */
export async function mintMemberToken(address: string, amount: number): Promise<Member> {
  const members = readMembers();
  const normalized = address.trim();
  const idx = members.findIndex((m) => m.address === normalized);

  if (idx >= 0) {
    const updated: Member = { ...members[idx], tokenBalance: members[idx].tokenBalance + amount };
    members[idx] = updated;
    writeMembers(members);
    return updated;
  }

  const created: Member = { address: normalized, tokenBalance: amount, joinedAt: Math.floor(Date.now() / 1000) };
  members.push(created);
  writeMembers(members);
  return created;
}

/** Overwrite a member's token balance (set, not increment). */
export async function updateMemberBalance(address: string, newBalance: number): Promise<Member> {
  const members = readMembers();
  const idx = members.findIndex((m) => m.address === address);
  if (idx < 0) throw new Error(`Member ${address} not found`);
  const updated: Member = { ...members[idx], tokenBalance: newBalance };
  members[idx] = updated;
  writeMembers(members);
  return updated;
}

/** Remove a member entirely. */
export async function removeMember(address: string): Promise<void> {
  const members = readMembers();
  const filtered = members.filter((m) => m.address !== address);
  if (filtered.length === members.length) throw new Error(`Member ${address} not found`);
  writeMembers(filtered);
}
