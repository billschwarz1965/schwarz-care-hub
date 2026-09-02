# Literature Scout

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `literature-scout` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-book-2` |

## Purpose

Searches, synthesizes, and monitors scientific publications across PubMed, internal databases, and congress libraries

## Audiences served

- MSLs
- Medical Affairs
- Home Office

## Data dependencies

### Literature Intelligence (`literature-intel`)

Indexes, synthesizes, and monitors the global scientific literature. Powers the Literature Scout agent and feeds evidence into every MedVerse response.

- PubMed indexed: **36M+**
- Internal approved: **12K**
- Congress abstracts: **84K**

## Governance pairings

Every output is reviewed by these governance agents before delivery.

| Governance agent | What it checks |
|---|---|
| Scientific Verification (`sci-verify`) | Validates every claim against labels, core data sheets, publications, and approved content |
| Content Expiration (`expiration`) | Monitors label updates, retires outdated content, re-indexes approved materials |

## Reference interaction

**Scenario:** Publication search with verification

### Input

_Research request_

> Find recent publications on long-term dupilumab safety in pediatric atopic dermatitis. I need this for a medical education slide deck.

### Processing steps

1. Searching PubMed (2024-2026): dupilumab AND pediatric AND safety...
2. Querying internal approved content library...
3. Cross-referencing congress abstract database...
4. Ranking by impact factor and relevance...

### Governance review performed

| Governance agent | Result |
|---|---|
| Scientific Verification | Correction applied |
| Content Expiration | Pass |
| Audit Trail | Logged |

### Output

Badge: `CORRECTED & APPROVED`

Literature summary delivered with corrected pediatric-specific figure (38% IGA 0/1 at 5 years). Correction annotated for transparency. Sources packaged with DOI links.


## Enterprise integration

**Systems of record**

- PubMed E-utilities
- Publisher feeds
- Internal alerting service

**Data domains**

- Publications
- Approved content
- User watch topics

**Scaling behaviour**

Alerting cost grows with watch topics, not users. Deduplicate overlapping topics into shared queries and fan results out.

**Residency & access constraints**

Alert payloads may quote titles and abstracts only, within publisher licence terms.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "literature-scout",
  name: "Literature Scout",
  icon: "book-2",
  desc: "Searches, synthesizes, and monitors scientific publications across PubMed, internal databases, and congress libraries",
  users: ["MSLs","Medical Affairs","Home Office"],
  compliancePartners: ["sci-verify","expiration"],
  hubDependency: ["literature-intel"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["literature-scout"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

