import { getTimeRemaining } from '../lib/stellar';

describe('countdown helpers', () => {
  it('returns expired for past deadline', () => {
    const result = getTimeRemaining(Math.floor(Date.now() / 1000) - 2);
    expect(result.isExpired).toBe(true);
  });

  it('returns active for future deadline', () => {
    const result = getTimeRemaining(Math.floor(Date.now() / 1000) + 1000);
    expect(result.isExpired).toBe(false);
  });
});
