import { getVotingProgress } from '../lib/stellar';

describe('voting math', () => {
  it('returns percentages', () => {
    const result = getVotingProgress(3, 1);
    expect(result.yesPercent).toBe(75);
    expect(result.noPercent).toBe(25);
    expect(result.isPassing).toBe(true);
  });

  it('handles empty votes', () => {
    const result = getVotingProgress(0, 0);
    expect(result.yesPercent).toBe(0);
    expect(result.isPassing).toBe(false);
  });
});
