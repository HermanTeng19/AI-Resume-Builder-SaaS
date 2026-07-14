# Newsletter Subscription Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a high-conversion, Beehiiv-style email subscription feature for Career Insight Labs to enhance user retention and engagement.

**Architecture:** A React functional component `<NewsletterSubscribe />` embedded at the bottom of blog posts and on the homepage. It communicates with a Vercel serverless function `/api/subscribe.ts` which proxies the request to the third-party email API using `process.env.MAIL_API_KEY`.

**Tech Stack:** React, Vite, Vercel Serverless Functions, Vitest (for testing).

---

### Task 1: Setup Testing Environment

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Install dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @types/testing-library__jest-dom
```

- [ ] **Step 2: Update vite.config.ts for test environment**

Open `vite.config.ts` and modify it to include the test configuration:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```
*(Note: If TS complains about `test`, make sure to use a triple-slash directive `/// <reference types="vitest" />` at the top of the file, or ignore it as it will work when run via CLI)*

- [ ] **Step 3: Create setup file**

Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/test/setup.ts
git commit -m "chore: setup vitest testing environment"
```

### Task 2: Build the NewsletterSubscribe Component

**Files:**
- Create: `src/components/NewsletterSubscribe.tsx`
- Create: `src/components/NewsletterSubscribe.test.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Write the failing test**

Create `src/components/NewsletterSubscribe.test.tsx`:
```tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewsletterSubscribe from './NewsletterSubscribe';

describe('NewsletterSubscribe', () => {
  it('shows success message after successful subscription', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    
    render(<NewsletterSubscribe />);
    
    const input = screen.getByPlaceholderText(/Enter your email/i);
    const button = screen.getByRole('button', { name: /Subscribe/i });
    
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/Successfully subscribed!/i)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/NewsletterSubscribe.test.tsx`
Expected: FAIL due to missing file.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/NewsletterSubscribe.tsx`:
```tsx
import React, { useState } from 'react';

const NewsletterSubscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <div className="newsletter-container success">
        <h3>✅ Successfully subscribed!</h3>
        <p>Welcome aboard. Keep an eye on your inbox for our latest insights.</p>
      </div>
    );
  }

  return (
    <div className="newsletter-container">
      <h3>Join the Insight Labs Newsletter</h3>
      <p>Get exclusive career strategies and ATS secrets delivered straight to your inbox.</p>
      <form onSubmit={handleSubscribe} className="newsletter-form">
        <input 
          type="email" 
          placeholder="Enter your email address..." 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          required
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && <p className="newsletter-error">{errorMessage}</p>}
    </div>
  );
};

export default NewsletterSubscribe;
```

Append to `src/index.css`:
```css
/* Newsletter Component Styles */
.newsletter-container {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin: 3rem 0;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.newsletter-container.success {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.newsletter-container h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.newsletter-container p {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
  max-width: 400px;
  margin: 0 auto;
}

.newsletter-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-color);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.newsletter-form input:focus {
  border-color: var(--primary-color);
}

.newsletter-form button {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.newsletter-form button:hover:not(:disabled) {
  opacity: 0.9;
}

.newsletter-form button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.newsletter-error {
  color: #ef4444 !important;
  margin-top: 0.75rem !important;
  margin-bottom: 0 !important;
  font-size: 0.875rem;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/NewsletterSubscribe.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/NewsletterSubscribe.tsx src/components/NewsletterSubscribe.test.tsx src/index.css
git commit -m "feat: add NewsletterSubscribe UI component"
```

### Task 3: API Endpoint for Subscription

**Files:**
- Create: `api/subscribe.ts`
- Create: `api/subscribe.test.ts`

- [ ] **Step 1: Write the failing test**

Create `api/subscribe.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import subscribeHandler from './subscribe';

describe('subscribe api', () => {
  it('returns 400 if email is missing', async () => {
    const req = { body: {}, method: 'POST' } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await subscribeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email is required and must be valid' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run api/subscribe.test.ts`
Expected: FAIL due to missing file.

- [ ] **Step 3: Write minimal implementation**

Create `api/subscribe.ts`:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email is required and must be valid' });
  }

  try {
    const apiKey = process.env.MAIL_API_KEY;
    
    if (!apiKey) {
      console.warn('MAIL_API_KEY is not set. Simulating success.');
      return res.status(200).json({ success: true });
    }

    // Proxy implementation assuming Resend API (or adapt for Beehiiv)
    const response = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        email,
        audience_id: 'default',
        unsubscribed: false,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.message || 'Failed to subscribe' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run api/subscribe.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add api/subscribe.ts api/subscribe.test.ts
git commit -m "feat: add subscribe serverless function"
```

### Task 4: Inject Component into Pages

**Files:**
- Modify: `src/pages/BlogPost.tsx`
- Modify: `src/pages/Landing.tsx`

- [ ] **Step 1: Write the test logic**
In this case, we rely on the TypeScript compiler and Vite bundler to test layout correctness. Let's run a test build.
Run: `npm run build`
Expected: PASS. After implementation, it should still pass.

- [ ] **Step 2 & 3: Write minimal implementation**

**Update `src/pages/BlogPost.tsx`:**
1. Add the import near the top (e.g. line 48):
```tsx
import NewsletterSubscribe from '../components/NewsletterSubscribe';
```
2. Inject the component at the end of the article content, inside `blog-reading-container`. Replace lines 180-182:
```tsx
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
          >
            {bodyContent ? bodyContent : content}
          </ReactMarkdown>
        </article>
        
        <NewsletterSubscribe />
      </div>
    </div>
  );
};

export default BlogPost;
```

**Update `src/pages/Landing.tsx`:**
1. Add the import near line 9:
```tsx
import NewsletterSubscribe from '../components/NewsletterSubscribe';
```
2. Inject the component at the bottom of the insights section. Find `</section>` for `#insights` and insert it just before the final wrapper `</div>`:
```tsx
          ))}
        </div>
      </section>
      
      <section style={{ padding: '0 2rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
        <NewsletterSubscribe />
      </section>
      </div>
    </>
  );
};

export default Landing;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: PASS with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/BlogPost.tsx src/pages/Landing.tsx
git commit -m "feat: integrate NewsletterSubscribe into Landing and BlogPost pages"
```
