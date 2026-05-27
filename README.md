# Merkantis — Supplier Reliability Score

Interactive landing page for Merkantis (merkantis.com), a managed-execution India sourcing operator.

**Core feature:** an instant supplier audit tool that returns a real, framework-grounded preliminary audit using the Merkantis Reliability Score (MRS) when a buyer enters a supplier name or website.

## Stack

- **Next.js 14** (App Router, TypeScript strict)
- **Tailwind CSS** with custom design tokens (Stripe/Linear quality bar)
- **Framer Motion** — subtle scroll fade-ins, no bounce or parallax
- **Geist Sans + Geist Mono** fonts
- Custom Radix UI primitives (Button, Input, Select, Badge, Separator)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

The project deploys with zero configuration. The mock audit works without any environment variables.

## Environment Variables (for production API)

Create a `.env.local` file:

```bash
# Required for production audit (Firecrawl web scraping)
FIRECRAWL_API_KEY=fc-...

# Required for production audit (Anthropic Claude scoring)
ANTHROPIC_API_KEY=sk-ant-...
```

Without these, the app uses the deterministic mock (seeded by supplier name hash).

## Architecture

### `/app/api/audit/route.ts`

The audit API route. Currently returns deterministic mock results seeded by supplier name hash (so the same supplier always gets the same verdict). The file has detailed comments showing exactly where to slot in the production pipeline:

1. **Resolve supplier** — Google/Firecrawl search if no website provided
2. **Scrape via Firecrawl** — homepage, /about, /products, /capabilities, /certifications
3. **Search adjacent signals** — news (12mo), reviews, MCA filings
4. **Call Anthropic Claude** with MRS framework as system prompt
5. **Return structured JSON** matching `AuditResponse` schema

### `/lib/audit-types.ts`

All TypeScript interfaces and the complete MRS framework definition:
- `AuditRequest` — form input
- `AuditResponse` — scorecard output
- `PILLAR_META` — 7 pillar weights, descriptions, and signal lists
- `VERDICT_CONFIG` — tier colors and labels

### `/lib/mock-audit.ts`

Deterministic mock logic. Seeded RNG from supplier name hash -> weighted verdict distribution (35% Strategic, 35% Preferred, 20% Probation, 10% Insufficient Data) -> per-pillar scores and framework-vocabulary findings. Replace `generateMockAudit()` in the route with the real pipeline.

## The MRS Framework

Seven weighted pillars, in scoring order:

| Pillar | Weight | What it measures |
|--------|--------|-----------------|
| Capability | 20% | Process types, materials, tolerance, capacity |
| Quality | 25% | ISO certifications, CMM, inspection rigor |
| Delivery | 20% | On-time rate, lead time discipline |
| Commercial | 15% | MOQ, payment terms, pricing vs median |
| Communication | 10% | English, response time, documentation |
| ESG | 5% | Labor, safety, environmental compliance |
| Improvement | 5% | Investment patterns, cert trajectory |

**Decision hierarchy:** Capability > References > Process > Financial > Longevity > Commercial. Cost is last.

**Verdict tiers:** Strategic (>=80) · Preferred (60-79) · Probation (40-59) · Disqualified (<40) · Insufficient Data

## Page Sections

1. **Hero** - wordmark, value prop, sample verdict card (anonymized Italian OEM data)
2. **Instant Audit** - live scoring tool with loading states and full result card
3. **Case Study** - real Italian industrial OEM engagement (spiral bevel pinion gear)
4. **Methodology** - weighted bar visualization + 7-pillar deep-dive
5. **Tiers** - Strategic / Preferred / Probation tier cards
6. **Positioning** - "We are not a marketplace"
7. **Request Audit** - free audit request form (5 spots/month)
8. **Footer**
