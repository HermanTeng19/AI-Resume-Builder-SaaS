export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Linear Congruential Generator (LCG)
export function lcg(seed: number) {
  return function() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function getRelatedArticles<T extends { slug: string }>(
  currentSlug: string, 
  allArticles: T[], 
  count: number
): T[] {
  const candidates = allArticles.filter(a => a.slug !== currentSlug);
  if (candidates.length <= count) return candidates;

  const seed = hashString(currentSlug);
  const random = lcg(seed);
  
  // Fisher-Yates shuffle with seeded PRNG
  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}
