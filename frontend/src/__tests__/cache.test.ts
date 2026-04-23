import {
  appendFeedEvent,
  getCachedFeed,
  getCachedProposals,
  recordUserVote,
  setCachedProposals,
  getUserVotes,
} from '../lib/cache';

describe('cache helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and reads proposals', () => {
    setCachedProposals('abc', [
      {
        id: 1,
        title: 'a',
        description: 'b',
        recipient: 'GAAA',
        amount: 1,
        yesVotes: 0,
        noVotes: 0,
        totalVoters: 0,
        deadline: 100,
        status: 'active',
        proposer: 'GAAA',
        createdAt: 1,
      },
    ]);

    const result = getCachedProposals('abc');
    expect(result?.length).toBe(1);
    expect(result?.[0].title).toBe('a');
  });

  it('stores feed with cap', () => {
    appendFeedEvent({
      id: '1',
      type: 'proposal_created',
      actor: 'GAAA',
      timestamp: Date.now(),
    });

    expect(getCachedFeed().length).toBe(1);
  });

  it('stores user vote', () => {
    recordUserVote('GAAA', 2, 'yes');
    expect(getUserVotes('GAAA')[2]).toBe('yes');
  });
});
