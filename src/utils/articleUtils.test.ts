import { describe, it, expect } from 'vitest';
import { hashString, lcg, getRelatedArticles } from './articleUtils';

describe('articleUtils', () => {
  it('hashString produces consistent positive integer', () => {
    expect(hashString('test-slug')).toBe(hashString('test-slug'));
    expect(hashString('test-slug')).not.toBe(hashString('other-slug'));
  });

  it('lcg produces pseudo-random numbers between 0 and 1', () => {
    const random = lcg(12345);
    const val1 = random();
    const val2 = random();
    expect(val1).toBeGreaterThanOrEqual(0);
    expect(val1).toBeLessThan(1);
    expect(val1).not.toBe(val2);
  });

  it('getRelatedArticles returns exact count of unique items excluding current', () => {
    const allArticles = [
      { slug: 'a' }, { slug: 'b' }, { slug: 'c' }, { slug: 'd' }, { slug: 'e' }
    ] as any[];
    
    const result = getRelatedArticles('c', allArticles, 3);
    
    expect(result).toHaveLength(3);
    expect(result.map(r => r.slug)).not.toContain('c');
    
    // Should be deterministic
    const result2 = getRelatedArticles('c', allArticles, 3);
    expect(result).toEqual(result2);
  });
});
