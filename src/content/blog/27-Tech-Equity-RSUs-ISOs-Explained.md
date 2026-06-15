# Tech Equity 101 for Engineers: RSUs, ISOs, NSOs, and How to Negotiate What You Don't Understand

> *Senior Tech Recruiter @ Career Insight Labs<br/>Apr 25, 2026*

---

I've sat across the table from an engineer who negotiated an extra $15K in base salary — and left $180K in equity on the table because they didn't understand what they were looking at.

I've also sat across from an engineer who asked three specific questions about their option grant that immediately told me "this person understands equity" — and I mentally adjusted their negotiation ceiling upward by $40K because I knew they'd find the gaps.

The gap between these two candidates wasn't intelligence. It was literacy. Equity compensation is deliberately opaque, and most engineers receive zero training on how to evaluate it. This article fixes that — covering the five equity instruments you'll encounter, the four numbers that actually matter on an offer letter, the questions that signal "equity-aware candidate" to recruiters, and a framework for comparing offers when the equity structures are apples-to-oranges.

---

## 1. The Five Equity Instruments (and What They Actually Mean)

### RSUs (Restricted Stock Units)

**What they are**: Company stock granted to you on a vesting schedule. Each RSU = one share of company stock. When they vest, you own the shares. For public companies, you can sell immediately. For private companies, you own shares you can't easily sell.

**Typical vesting**: 4-year schedule with a 1-year cliff. Example: 400 RSUs → 100 vest at year 1, then 25 per quarter for the next 3 years.

**Tax treatment (US)**: Taxed as ordinary income at vest (the value of the shares on the vest date is added to your W-2). If you hold and sell later, the gain/loss from the vest price is capital gains. Some companies offer "sell-to-cover" — they automatically sell a portion of your vested shares to cover the tax bill.

**What to ask**: "What's the current stock price, and what's the 52-week range? Do you offer sell-to-cover at vest? What's the refresher policy — do I get additional RSU grants annually, and at what level?"

**The RSU trap**: RSU value is tied to stock price. If the stock drops 40% during your vesting period, your compensation dropped 40% with it. (This happened to roughly every Meta employee who joined in late 2021.) Factor in stock volatility when comparing RSU-heavy offers to cash-heavy offers.

### ISOs (Incentive Stock Options)

**What they are**: The right to buy company stock at a fixed price (the "strike price" or "exercise price") at some point in the future. If the company's value goes up, you buy at the lower strike price and the difference is your gain.

**Typical terms**: 10-year expiration from grant date. 4-year vest with 1-year cliff. You can only exercise vested options.

**Tax treatment (US)**: More favorable than NSOs. No tax at exercise (for regular income tax — AMT is a different story). If you hold the shares for >1 year after exercise AND >2 years after grant, the gain is taxed as long-term capital gains (lower rate than ordinary income). Early exercise (83(b) election) can further optimize this — but requires paying cash for unvested shares, which most startup employees can't afford.

**The ISO trap**: The $100K limit. In any calendar year, only $100K worth of ISOs (based on grant-date fair market value) can become exercisable for the first time. Above that, they're automatically treated as NSOs. If you're a Senior+ engineer at a later-stage startup, your grant likely exceeds this. Ask: "Will any portion of my options be treated as NSOs?"

### NSOs (Non-Qualified Stock Options)

**What they are**: Same concept as ISOs — the right to buy stock at a strike price — but with less favorable tax treatment. These are typically given to contractors, advisors, or as the portion of an employee grant that exceeds the ISO $100K limit.

**Tax treatment (US)**: Taxed as ordinary income at exercise on the spread between strike price and fair market value. This is worse than ISOs. If you exercise NSOs when the spread is $200K, you owe ordinary income tax on $200K — even if you haven't sold a single share.

**What to ask**: "Are these ISOs or NSOs? If ISOs, is the full grant within the $100K/year limit?"

### SARs (Stock Appreciation Rights)

**What they are**: A phantom stock plan. You don't own shares — you get the cash equivalent of the stock price appreciation above a base price. Common at companies that don't want to dilute equity (or can't issue options because of their corporate structure).

**What to ask**: "What's the settlement mechanism — cash or shares? What triggers a payout — is it only on a liquidity event, or is there periodic settlement?"

### Profits Interest Units (PIUs)

**What they are**: An LLC version of equity, common at LLC-structured startups. You receive a percentage of future profits and appreciation. Tax-advantaged if structured correctly — the grant itself is typically not a taxable event.

**What to ask**: "What's the distribution threshold (the value the company has to reach before my units have value)? Is this a profits interest or a capital interest?"

---

## 2. The Four Numbers That Actually Matter on an Offer Letter

When you get a startup offer, you'll see a number of options. Most candidates look at the number of options and the strike price, nod, and move on. Those are the wrong numbers. Here are the four that matter:

### Number 1: Percentage of Fully Diluted Ownership

The company says: "We're granting you 50,000 options."

You say: "How many fully diluted shares are outstanding?"

If the answer is 10 million shares, your 50,000 options = 0.5% of the company. If the answer is 100 million shares, your 50,000 options = 0.05% of the company. Same number of options. 10× difference in economic value.

**Why "fully diluted" matters**: This includes all outstanding shares PLUS all options, warrants, and convertible securities. Without the fully diluted number, you're comparing fractions with an unknown denominator.

**The number to benchmark**: For a non-founding engineer at a Series A startup (10-30 people), typical equity is 0.2%–0.8%. At Series B (30-80 people), 0.1%–0.4%. At Series C (80-200 people), 0.05%–0.2%. At Series D and beyond, it's typically stated as a dollar value, not a percentage.

### Number 2: The 409A Valuation

The company says: "The strike price is $1.20 per share."

You say: "What's the current 409A valuation, and when was it last updated?"

The 409A is an independent appraisal of the company's common stock fair market value. Your strike price equals the 409A price at the time of grant (for ISOs/NSOs). The gap between the 409A and the preferred price (what investors paid in the last round) is the "spread" — and it tells you how much the stock has appreciated since the last 409A.

If the preferred price from the last round is $8.00 and the 409A is $1.20, the spread is $6.80 — meaning your options already have embedded value. If the preferred price and the 409A are both $1.20, the stock hasn't appreciated and your options are at-the-money.

**The number to care about**: The preferred-to-409A ratio. A ratio above 4:1 means investors have marked the stock significantly higher than the 409A — your options likely have real value already. A ratio near 1:1 means you're betting on future appreciation. Both are valid structures — but you should know which one you're accepting.

### Number 3: The Post-Money Valuation

The company says: "We just closed our Series B at a $200M valuation."

You say: "Is that pre-money or post-money? And what was the amount raised?"

Pre-money = valuation before the new investment. Post-money = valuation after the new investment. A $200M pre-money valuation with a $50M raise = $250M post-money. A $200M post-money valuation with a $50M raise = $150M pre-money. The difference matters — it's how much the company is actually worth after the cash hit the balance sheet.

Your percentage ownership times the post-money valuation gives you a rough upper bound on the value of your equity if the company exited today at that valuation. But — and this "but" is critical — your common stock is junior to investor preferred stock. In a downside exit, investor liquidation preferences can wipe out common shareholders entirely.

### Number 4: The Liquidation Preference Stack

This is the number almost no engineer asks about — and it's the most important number for evaluating equity in a venture-backed company.

**What it is**: Investors typically have a "1× participating preferred" or "1× non-participating" liquidation preference. This means that in an exit, investors get their money back first (1×), and in a "participating" structure, they also participate pro-rata in the remaining proceeds.

**Why it matters**: If the company raised $80M and has a 1× participating preferred stack, the first $80M of any exit goes to investors. If you own 0.5% of the company and the exit is $100M, common shareholders split $20M — your 0.5% is worth $100K, not the $500K a simple 0.5% × $100M calculation would suggest. If the exit is below the total capital raised, common shareholders get nothing.

**What to ask**: "What's the total amount of preferred capital raised, and what's the liquidation preference structure — participating or non-participating, any multiples above 1×?" The recruiter may not know. Ask to speak with the CFO or Head of Finance. If nobody will answer — that's a signal.

---

## 3. The Questions That Signal "Equity-Aware Candidate"

Here's what happens when a candidate asks informed equity questions: the recruiter mentally reclassifies them from "will accept whatever we offer" to "will find the gaps in our offer." That reclassification changes the negotiation dynamic. The recruiter is now anticipating pushback, which means they're more likely to preemptively offer a stronger package.

**Level 1 — Basic literacy (ask these for any role with equity)**:
- "Is this grant in options or RSUs? If options, ISOs or NSOs?"
- "What's the vesting schedule — standard 4-year with 1-year cliff?"
- "How many fully diluted shares are outstanding?"

**Level 2 — Value consciousness (ask these if you're evaluating a startup)**:
- "What's the 409A valuation and when was it last set?"
- "What was the post-money valuation of the last round?"
- "What's the company's refresher policy — do employees receive additional grants over time?"

**Level 3 — Sophisticated (ask these if the equity is a significant portion of your comp)**:
- "What's the total preferred capital raised and the liquidation preference structure?"
- "Does the company allow early exercise with an 83(b) election?"
- "What's the post-termination exercise window? Is it the standard 90 days, or have you extended it?" (90 days is the IRS rule for ISOs to retain tax treatment. Many companies now offer extended windows — 5-10 years — which is enormously valuable.)
- "For RSUs: do you allow deferral of settlement, and what's the double-trigger acceleration policy on a change of control?"

You don't need to ask all of these. But asking 2-3 Level-2 questions signals that you're not going to miss the equity gaps — which means the offer needs to be competitive on equity, not just base.

---

## 4. Comparing Apples-to-Oranges Offers

You have two offers. One is a public company with RSUs. One is a Series B startup with ISOs. How do you compare them?

**The framework: Expected Value × Risk Discount**

Step 1: Calculate the annualized equity value for each offer.
- Public RSUs: annual grant value / 4 (since it vests over 4 years). If the grant is $200K in RSUs, annual equity value = $50K.
- Startup ISOs: (percentage ownership × post-money valuation) / 4. If 0.3% × $120M = $360K, annual = $90K. But then apply a risk discount.

Step 2: Apply a risk discount to startup equity.
- Series A startup: 70-90% discount (most Series A companies don't exit)
- Series B: 50-70% discount
- Series C: 30-50% discount
- Series D+ / pre-IPO: 15-30% discount
- Public company: 0% discount, but account for stock volatility

A Series B offer with $90K in annual paper equity at a 60% risk discount = $36K expected annual equity value. That's less than the public company's $50K in RSUs. But — the upside scenario (company IPOs at $2B instead of $120M) isn't captured in expected value. This is why equity evaluation is part math and part belief.

Step 3: Compare total compensation (base + bonus + expected equity value + benefits).

Step 4: Factor in the intangibles — growth trajectory, role scope, team quality, company stage preference.

---

## 5. CTA: Know What Your Equity Is Worth Before You Sign

Most engineers spend more time researching a $2,000 laptop purchase than evaluating a $200,000 equity grant. The asymmetry is staggering — and it's exactly what companies count on.

At **AI-Resume-Builder**, we built an **Equity Offer Evaluator** that:

- Ingests your offer letter and translates the equity terms into plain English — RSUs, ISOs, NSOs, vesting schedules, strike prices, 409A valuations
- Calculates your percentage ownership (from option count + fully diluted shares), expected annual equity value, and risk-adjusted comparisons between multiple offers
- Flags red flags: abnormally low equity for your level/stage, unfavorable liquidation preference stacks, ISO $100K limit violations, short post-termination exercise windows
- Generates the 3-5 equity-specific negotiation questions that are appropriate for your offer — so you can signal "equity-aware" without revealing what you don't know
- Benchmarks your offer against market data for your role, level, stage, and geography so you know if you're in-band or being lowballed

The equity section of your offer letter is written to be confusing. The fix is knowing what to ask.

👉 [Evaluate your equity offer — free](#)

---

## SEO Tags (Technical SEO Output)

### HTML `<title>` tag
```html
<title>Startup Equity Explained: RSUs vs ISOs vs NSOs for Engineers</title>
```

### `<meta description>`
```html
<meta name="description" content="Tech equity 101: A Senior Recruiter explains RSUs, ISOs, NSOs, SARs, and PIUs — plus the 4 numbers that matter on an offer letter, the questions that signal 'equity-aware candidate,' and a framework for comparing apples-to-oranges offers.">
```

### Schema.org JSON-LD
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Tech Equity 101 for Engineers: RSUs, ISOs, NSOs, and How to Negotiate What You Don't Understand",
  "description": "A comprehensive guide to equity compensation for software engineers — covering the five equity instruments (RSUs, ISOs, NSOs, SARs, PIUs), the four numbers that actually determine equity value (fully diluted ownership, 409A, post-money valuation, liquidation preferences), the negotiation questions that signal sophistication, and a framework for comparing offers with different equity structures.",
  "image": "https://ai-resume-builder.com/og/tech-equity-101.png",
  "author": {
    "@type": "Person",
    "name": "Senior Tech Recruiter",
    "url": "https://ai-resume-builder.com/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "AI-Resume-Builder",
    "logo": {
      "@type": "ImageObject",
      "url": "https://ai-resume-builder.com/logo.png"
    }
  },
  "datePublished": "2026-06-13",
  "dateModified": "2026-06-13",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://ai-resume-builder.com/blog/tech-equity-rsus-isos-explained"
  },
  "keywords": "startup equity explained, RSU vs ISO, stock options for engineers, 409A valuation, how to negotiate equity, equity compensation startup, ISO NSO difference, liquidation preference"
}
```
