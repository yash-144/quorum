import type { Member } from '../types';

const TOKEN_CONTRACT_ID = process.env.NEXT_PUBLIC_VOTE_TOKEN_CONTRACT_ID ?? '';

export function getVoteTokenContractId(): string {
  return TOKEN_CONTRACT_ID;
}

export async function fetchMembers(): Promise<Member[]> {
  // TODO: wire to Soroban RPC invocation for members and balances.
  return [];
}
