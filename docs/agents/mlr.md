# MLR Review

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `mlr` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-shield-check` |

## Purpose

Reviews content for on-label language, promotional risk, claim substantiation, and fair balance

## Agents supervised

_None currently paired._

## Reference interaction

**Scenario:** Real-time MLR content review with auto-correction

### Input

_Content submitted for MLR review_

> MSL slide deck submitted by Medical Affairs — 'Dupixent in Moderate-to-Severe AD: 5-Year Efficacy & Safety Update.' 14 slides, intended for scientific exchange at upcoming EADV satellite symposium. Requesting expedited MLR clearance.

### Processing steps

1. Ingesting 14-slide deck: parsing text, claims, figures, and references...
2. Cross-referencing all claims against approved FDA label (BLA 761055, Rev. 2025)...
3. Checking against Sanofi Core Data Sheet (CDS) v12.3...
4. Scanning for promotional language patterns (superlatives, unsubstantiated comparisons)...
5. Verifying fair balance: efficacy-to-safety mention ratio analysis...
6. Validating all 23 literature citations against source publications...
7. Checking data currency: flagging any references >24 months old...
8. Running competitive claim review: ensuring no off-label comparisons...

### Governance review performed

| Governance agent | Result |
|---|---|
| Scientific Verification | Correction applied |
| Promotional Risk | Flagged |
| Fair Balance | Correction applied |
| Content Expiration | Pass |
| Audit Trail | Logged |

### Output

Badge: `6 FINDINGS · 4 AUTO-CORRECTIONS`

Automated MLR review complete in 47 seconds (vs. avg 4.2 days manual). 6 issues identified: 2 high-severity (promotional language + fair balance), 3 medium (data currency + accuracy + off-label implication), 1 low (reference format). 4 auto-corrections generated with rationale. Deck routed to 3-person review committee with AI pre-annotations. Estimated time to final approval: <24 hours.


## Enterprise integration

**Systems of record**

- Veeva Vault PromoMats / MLR workflow
- Approved content repository
- Product labels and core data sheets

**Data domains**

- Approved content
- Label claims
- Review decisions

**Scaling behaviour**

Runs on every generated output, so it sits directly in the latency path. Cache claim-level verdicts — the same claim is reviewed repeatedly across interactions.

**Residency & access constraints**

Review decisions are regulated records. Persist the verdict and its rationale, not just the pass/fail.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "mlr",
  name: "MLR Review",
  icon: "shield-check",
  desc: "Reviews content for on-label language, promotional risk, claim substantiation, and fair balance"
}
```

