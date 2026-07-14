# Related Articles (Keep Reading) Component Design

## 1. Overview
A "Keep Reading" component designed to improve user retention on the Career Insight Labs blog. Modeled after Beehiiv's clean, high-converting horizontal layout, it displays 3 pseudo-randomly selected articles at the end of every blog post, just before the Newsletter subscription section.

## 2. Data & Logic (Deterministic Random Selection)
To maintain a stable internal linking structure (SEO-friendly) while providing variety, we will use a pseudo-random number generator (PRNG) seeded by the current article's slug.

### 2.1 Article Parsing
- We will extract the `modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true })` logic into a shared utility function or custom hook (e.g., `src/utils/articleParser.ts`), avoiding code duplication between `Landing.tsx` and the new component.
- The parsed array will include: `slug`, `title`, `dateStr`, `readingTime`, and `image` (from `imageMap.ts`).

### 2.2 Pseudo-Random Algorithm
- We will hash the `currentSlug` to an integer seed.
- Using a simple Linear Congruential Generator (LCG) seeded by the hash, we will randomly pick 3 unique items from the parsed array (excluding the `currentSlug`).

## 3. UI Component (`src/components/RelatedArticles.tsx`)

### 3.1 Structure
- A container with a top margin and border to separate it from the main content.
- A section heading: `<h3>Keep Reading</h3>`.
- A flexbox list containing 3 anchor links (`<Link>`).

### 3.2 Card Layout (Beehiiv Inspired)
Each article card will be a horizontal row:
- **Left Column**: Thumbnail image (1:1 or 4:3 aspect ratio, fixed width e.g., 100px), with rounded corners (`border-radius: 8px`) and `object-fit: cover`.
- **Right Column**: 
  - **Title**: Bold, dark text (`font-weight: 600`), max 2 lines with standard CSS truncation (`line-clamp`).
  - **Meta Data**: Small gray text (`color: var(--text-muted)`) showing `dateStr • X min read`.
- **Interactions**: Subtle background highlight and image scaling on hover.

## 4. Integration (`src/pages/BlogPost.tsx`)
The `<RelatedArticles currentSlug={slug} />` component will be injected into `BlogPost.tsx` immediately after the `<article>` tag and before the `NewsletterSubscribe` component (which is scheduled to be built in the next step).

## 5. CSS Styling
Will add relevant class structures (e.g. `.related-articles`, `.related-article-card`, `.related-article-image`) to `src/index.css`.

## 6. Error Handling
- If the total number of articles is fewer than 4, the component will gracefully display whatever is available (excluding the current one).
- If an image path is missing, it will fall back to a deterministic default from `imageMap.ts`.
