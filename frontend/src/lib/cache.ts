import type { FeedEvent, Proposal } from '../types';

const PROPOSALS_KEY = (contractId: string) => `ct_proposals_${contractId}`;
const FEED_KEY = 'ct_feed';
const USER_VOTES_KEY = (address: string) => `ct_votes_${address}`;

export function getCachedProposals(contractId: string): Proposal[] | null {
  try {
    const raw = localStorage.getItem(PROPOSALS_KEY(contractId));
    return raw ? (JSON.parse(raw) as Proposal[]) : null;
  } catch {
    return null;
  }
}

export function setCachedProposals(contractId: string, proposals: Proposal[]): void {
  try {
    localStorage.setItem(PROPOSALS_KEY(contractId), JSON.stringify(proposals));
  } catch {}
}

export function getCachedFeed(): FeedEvent[] {
  try {
    const raw = localStorage.getItem(FEED_KEY);
    return raw ? (JSON.parse(raw) as FeedEvent[]) : [];
  } catch {
    return [];
  }
}

export function appendFeedEvent(event: FeedEvent): void {
  try {
    const feed = getCachedFeed();
    feed.unshift(event);
    localStorage.setItem(FEED_KEY, JSON.stringify(feed.slice(0, 100)));
  } catch {}
}

export function getUserVotes(address: string): Record<number, 'yes' | 'no'> {
  try {
    const raw = localStorage.getItem(USER_VOTES_KEY(address));
    return raw ? (JSON.parse(raw) as Record<number, 'yes' | 'no'>) : {};
  } catch {
    return {};
  }
}

export function recordUserVote(address: string, proposalId: number, vote: 'yes' | 'no'): void {
  try {
    const votes = getUserVotes(address);
    votes[proposalId] = vote;
    localStorage.setItem(USER_VOTES_KEY(address), JSON.stringify(votes));
  } catch {}
}
