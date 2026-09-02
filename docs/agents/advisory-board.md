# Advisory Board Builder

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `advisory-board` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-layout-board-split` |

## Purpose

Creates optimal advisory boards based on topic, geography, expertise diversity, and engagement levels. Produces ranked rosters with selection rationale.

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
| PHI Protection (`privacy`) | Identifies and redacts protected health information, masks identifiers, controls access |
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |
| AI Explainability (`explainability`) | Provides transparency — why an answer was generated, supporting sources, confidence level |

## Reference interaction

**Scenario:** Advisory board design with expert optimization

### Input

_Medical affairs request_

> Design an optimal Global AD Advisory Board. Requirements: 8 US, 4 EU, 2 APAC. Mix of academic and community experts. Must include biomarker expertise. Avoid existing speaker bureau members.

### Processing steps

1. HCP Explorer: querying AD expert profiles across US, EU, APAC...
2. Filtering: biomarker expertise, excluding active speaker bureau...
3. Scoring: publication impact × clinical leadership × geographic diversity...
4. Optimizing: ensuring academic/community balance per region...
5. Cross-checking OneCRM: engagement history and relationship strength...

### Governance review performed

| Governance agent | Result |
|---|---|
| PHI Protection | Pass |
| AI Explainability | Pass |
| Audit Trail | Logged |

### Output

Badge: `ROSTER VERIFIED`

14-member roster optimized across all constraints. Each selection includes data-driven rationale and confidence score. Exportable to advisory board planning system with full audit trail.


## Enterprise integration

**Systems of record**

- Veeva Link
- OneCRM
- Transparency / spend reporting systems

**Data domains**

- HCP master
- Engagement history
- Contracting and payment history

**Scaling behaviour**

Roster optimisation is combinatorial. Constrain the candidate pool by therapeutic area and geography before ranking.

**Residency & access constraints**

Spend and contracting data is highly restricted. Selection rationale must be recorded for transparency reporting.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "advisory-board",
  name: "Advisory Board Builder",
  icon: "layout-board-split",
  desc: "Creates optimal advisory boards based on topic, geography, expertise diversity, and engagement levels. Produces ranked rosters with selection rationale.",
  users: ["Medical Affairs","Home Office"],
  compliancePartners: ["privacy","audit","explainability"],
  hubDependency: ["hcp-explorer"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["advisory-board"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

