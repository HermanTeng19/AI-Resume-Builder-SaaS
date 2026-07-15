# Related Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a "Keep Reading" component that displays 3 pseudo-randomly selected articles at the end of each blog post, providing a Beehiiv-style horizontal card layout.

**Architecture:** A stateless utility (`articleUtils.ts`) will handle pseudo-random selection based on a slug hash to ensure deterministic recommendations (SEO-friendly). The React component (`RelatedArticles.tsx`) will read markdown files via `import.meta.glob`, parse them, pick 3 using the utility, and render them in a horizontal flex layout.

**Tech Stack:** React, Vite, CSS, Vitest (for testing).

---

### Task 1: PRNG Utility and Selection Logic

**Files:**
- Create: `src/utils/articleUtils.ts`
- Create: `src/utils/articleUtils.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/utils/articleUtils.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/articleUtils.test.ts`
*(Note: If vitest is not installed yet, run `npm install -D vitest` first)*
Expected: FAIL due to missing file.

- [ ] **Step 3: Write minimal implementation**

Create `src/utils/articleUtils.ts`:
```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/articleUtils.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/articleUtils.ts src/utils/articleUtils.test.ts
git commit -m "feat: add deterministic random selection utility for articles"
```

### Task 2: Build the RelatedArticles UI Component

**Files:**
- Create: `src/components/RelatedArticles.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Write the component test/setup**
Since the component relies on `import.meta.glob` (a Vite-specific feature), unit testing it with Vitest requires complex mocking. We will test it functionally via compilation.
Run: `npm run build`
Expected: PASS.

- [ ] **Step 2 & 3: Write implementation**

Create `src/components/RelatedArticles.tsx`:
```tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getRelatedArticles } from '../utils/articleUtils';
import { imageMap } from '../content/imageMap';

const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });
const defaultImages = Object.values(imageMap);

interface RelatedArticlesProps {
  currentSlug: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ currentSlug }) => {
  const relatedArticles = useMemo(() => {
    const allArticles = Object.keys(modules).map((path) => {
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      const content = modules[path] as string;
      const match = content.match(/^#\s+(.*)/m);
      const title = match ? match[1] : slug;
      
      const dateMatch = content.match(/<br\/>(.*?)\*/);
      const dateStr = dateMatch ? dateMatch[1].trim() : 'Unknown';

      const words = content.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(words / 200));

      let image = imageMap[slug];
      if (!image) {
        const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        image = defaultImages[hash % defaultImages.length];
      }
      
      return { slug, title, image, dateStr, readingTime };
    });

    return getRelatedArticles(currentSlug, allArticles, 3);
  }, [currentSlug]);

  if (relatedArticles.length === 0) return null;

  return (
    <div className="related-articles-container">
      <h3 className="related-heading">Keep Reading</h3>
      <div className="related-grid">
        {relatedArticles.map((article) => (
          <Link to={`/blog/${article.slug}`} key={article.slug} className="related-card">
            <img src={article.image} alt={article.title} className="related-img" />
            <div className="related-info">
              <h4 className="related-title">{article.title}</h4>
              <div className="related-meta">
                <span>{article.dateStr}</span> &bull; <span>{article.readingTime} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
```

Append to `src/index.css`:
```css
/* Related Articles (Keep Reading) Styles */
.related-articles-container {
  margin: 4rem 0 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.related-heading {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.related-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.related-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  text-decoration: none;
  background: transparent;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.related-card:hover {
  background-color: var(--bg-secondary);
}

.related-img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
}

.related-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.related-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: PASS without TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/RelatedArticles.tsx src/index.css
git commit -m "feat: add RelatedArticles UI component"
```

### Task 3: Integrate into BlogPost.tsx

**Files:**
- Modify: `src/pages/BlogPost.tsx`

- [ ] **Step 1: Write the test logic**
We'll verify compilation and integration.
Run: `npm run build`
Expected: PASS (currently).

- [ ] **Step 2 & 3: Write minimal implementation**

Modify `src/pages/BlogPost.tsx`:
Add the import near line 48, right after `import { SEO } from '../components/SEO';`:
```tsx
import RelatedArticles from '../components/RelatedArticles';
```

Inject the component immediately after the markdown article finishes rendering, around line 181. Find the closing `</article>` tag and insert `<RelatedArticles currentSlug={slug || ''} />` below it.
```tsx
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
          >
            {bodyContent ? bodyContent : content}
          </ReactMarkdown>
        </article>
        
        <RelatedArticles currentSlug={slug || ''} />
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: PASS with no compilation errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/BlogPost.tsx
git commit -m "feat: display Keep Reading section at bottom of blog posts"
```
