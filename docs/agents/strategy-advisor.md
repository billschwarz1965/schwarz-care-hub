# Medical Strategy Advisor

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `strategy-advisor` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-bulb` |

## Purpose

Synthesizes cross-TA intelligence, competitive landscape, and pipeline data to inform medical strategy decisions

## Audiences served

- Medical Affairs
- Home Office

## Data dependencies

### Expert Intelligence Hub (`hcp-explorer`)

The foundational expert knowledge graph — single source of truth for all HCP and KOL intelligence. Every downstream MedVerse agent queries this hub before making recommendations.

- HCP profiles: **4.9M**
- Publications: **13.3M**
- Congress participations: **22.5M**
- Clinical trials: **563K**
- Sanofi engagements: **OneCRM**

### Literature Intelligence (`literature-intel`)

Indexes, synthesizes, and monitors the global scientific literature. Powers the Literature Scout agent and feeds evidence into every MedVerse response.

- PubMed indexed: **36M+**
- Internal approved: **12K**
- Congress abstracts: **84K**

## Governance pairings

Every output is reviewed by these governance agents before delivery.

| Governance agent | What it checks |
|---|---|
| AI Explainability (`explainability`) | Provides transparency — why an answer was generated, supporting sources, confidence level |
| Scientific Verification (`sci-verify`) | Validates every claim against labels, core data sheets, publications, and approved content |
| Inspection Readiness (`inspection`) | Continuously prepares documentation, logs, evidence packages for regulatory inspections |

## Reference interaction

**Scenario:** Cross-TA medical strategy synthesis

### Input

_Medical affairs leadership query_

> Give me a strategic landscape assessment for our moderate-to-severe AD franchise. I need competitive positioning, evidence gaps, and recommended priorities for the next 12 months.

### Processing steps

1. Literature Intelligence: scanning 2,400+ AD publications (2024–2026)...
2. HCP Explorer: analyzing expert sentiment and prescribing trends...
3. interaction signals: aggregating field insights from 340 MSL interactions...
4. Competitive pipeline tracker: mapping 18 active AD mechanisms...
5. Congress intelligence: synthesizing AAD 2026 + EADV 2025 themes...
6. Cross-referencing payer landscape and HEOR evidence base...

### Governance review performed

| Governance agent | Result |
|---|---|
| AI Explainability | Pass |
| Scientific Verification | Pass |
| Inspection Readiness | Logged |

### Output

Badge: `EXECUTIVE READY`

AD franchise strategy brief delivered with competitive landscape, 4 prioritized evidence gaps, field intelligence themes, and 4 strategic recommendations. Exportable to medical strategy deck format. Recommended review: Medical Affairs Leadership Team.


## Enterprise integration

**Systems of record**

- Literature Intelligence
- Competitive intelligence sources (public filings)
- Internal pipeline data

**Data domains**

- Publications
- Competitive landscape
- Pipeline
- Interaction signals

**Scaling behaviour**

Synthesis is token-heavy rather than query-heavy. Cache per therapeutic area and refresh on material change, not on every request.

**Residency & access constraints**

Pipeline data is material non-public information. Restrict to authorised internal audiences only.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "strategy-advisor",
  name: "Medical Strategy Advisor",
  icon: "bulb",
  desc: "Synthesizes cross-TA intelligence, competitive landscape, and pipeline data to inform medical strategy decisions",
  users: ["Medical Affairs","Home Office"],
  compliancePartners: ["explainability","sci-verify","inspection"],
  hubDependency: ["hcp-explorer","literature-intel"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["strategy-advisor"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

