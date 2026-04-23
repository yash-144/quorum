export const STROOPS_PER_XLM = 10_000_000;
export const VOTE_DEADLINE_SECONDS = 48 * 60 * 60;
export const ADMIN_ADDRESSES: string[] = (process.env.NEXT_PUBLIC_ADMIN_ADDRESSES ?? '')
  .split(',')
  .map((a) => a.trim())
  .filter(Boolean);

export function xlmToStroops(xlm: number): bigint {
  return BigInt(Math.round(xlm * STROOPS_PER_XLM));
}

export function stroopsToXlm(stroops: bigint | number): number {
  return Number(stroops) / STROOPS_PER_XLM;
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function isAdmin(address: string | null): boolean {
  if (!address) return false;
  return ADMIN_ADDRESSES.includes(address);
}

export function getVotingProgress(yes: number, no: number): {
  yesPercent: number;
  noPercent: number;
  isPassing: boolean;
} {
  const total = yes + no;
  if (total === 0) return { yesPercent: 0, noPercent: 0, isPassing: false };
  const yesPercent = Math.round((yes / total) * 100);
  return {
    yesPercent,
    noPercent: 100 - yesPercent,
    isPassing: yes > no,
  };
}

export function getTimeRemaining(deadline: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = deadline - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
    isExpired: false,
  };
}

export function formatXlm(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

export function horizonUrl(path: string): string {
  return `https://horizon-testnet.stellar.org${path}`;
}

export function stellarExpertUrl(txHash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${txHash}`;
}
