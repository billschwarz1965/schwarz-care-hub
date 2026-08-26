# Expert Segmentation Agent

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `expert-segment` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-category-2` |

## Purpose

Automatically classifies experts into tiers: Global Thought Leader, National KOL, Rising Star, Community Influencer, Clinical Trialist, Digital Influencer

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

## Governance pairings

Every output is reviewed by these governance agents before delivery.

| Governance agent | What it checks |
|---|---|
| AI Explainability (`explainability`) | Provides transparency — why an answer was generated, supporting sources, confidence level |
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |

## Reference interaction

**Scenario:** Automated expert segmentation with growth tracking

### Input

_Medical affairs request_

> Run expert segmentation analysis for our dermatology portfolio. Identify rising stars we currently have no engagement with.

### Processing steps

1. HCP Explorer: loading dermatology expert universe (4,200 profiled)...
2. Applying segmentation model: publication velocity, congress presence, trial activity...
3. Classifying tiers: Global KOL, National KOL, Rising Star, Community Influencer...
4. Cross-referencing OneCRM: engagement gap analysis...
5. Flagging rising stars with >40% publication growth and <2 Sanofi interactions...

### Governance review performed

| Governance agent | Result |
|---|---|
| AI Explainability | Pass |
| Audit Trail | Logged |

### Output

Badge: `ANALYSIS COMPLETE`

677 experts segmented across 6 tiers. 25 rising stars flagged as strategic engagement opportunities. Territory-level MSL action items generated. Full segmentation exportable to CRM for territory planning.


## Enterprise integration

**Systems of record**

- Veeva Link
- Publication feeds
- OneCRM

**Data domains**

- HCP master
- Publications
- Congress participation
- Engagement history

**Scaling behaviour**

Batch classification per therapeutic area on a schedule. Segment membership changes slowly, so nightly is sufficient.

**Residency & access constraints**

Tier assignment must be explainable and reproducible; record the input features behind each classification.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "expert-segment",
  name: "Expert Segmentation Agent",
  icon: "category-2",
  desc: "Automatically classifies experts into tiers: Global Thought Leader, National KOL, Rising Star, Community Influencer, Clinical Trialist, Digital Influencer",
  users: ["Medical Affairs","Home Office"],
  compliancePartners: ["explainability","audit"],
  hubDependency: ["hcp-explorer"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["expert-segment"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

