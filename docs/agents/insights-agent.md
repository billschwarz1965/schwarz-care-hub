# Insights Agent

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `insights-agent` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-chart-infographic` |

## Purpose

Analyzes HCP engagement patterns, content performance, and behavioral signals to surface actionable medical insights

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
| Field Activity Risk (`field-risk`) | Analyzes MSL interactions and inquiry trends to detect compliance risks before audits |
| AI Explainability (`explainability`) | Provides transparency — why an answer was generated, supporting sources, confidence level |
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |

## Reference interaction

**Scenario:** Field intelligence with engagement gap analysis

### Input

_Medical affairs request_

> Who are emerging experts in our dermatology portfolio that we currently have no engagement with? I need this for strategic planning.

### Processing steps

1. HCP Explorer: loading dermatology expert universe...
2. Analyzing publication velocity and congress visibility trends...
3. OneCRM: cross-referencing engagement history...
4. Identifying experts with >40% publication growth and <2 interactions...
5. Generating strategic engagement gap report...

### Governance review performed

| Governance agent | Result |
|---|---|
| Field Activity Risk | Pass |
| AI Explainability | Pass |
| Audit Trail | Logged |

### Output

Badge: `REVIEWED & APPROVED`

25 rising experts flagged with engagement gap analysis. Territory-level MSL action items generated. Dr. Okafor flagged as competitive risk for immediate outreach.


## Enterprise integration

**Systems of record**

- Interaction signal store
- OneCRM
- Content analytics

**Data domains**

- Interaction signals
- Content engagement
- Engagement history

**Scaling behaviour**

Aggregation over the signal store grows with history. Roll up to daily and topic-level aggregates; query aggregates, not raw events.

**Residency & access constraints**

Report at aggregate and topic level. Do not surface individual-level behavioural profiles outside the assigned field team.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "insights-agent",
  name: "Insights Agent",
  icon: "chart-infographic",
  desc: "Analyzes HCP engagement patterns, content performance, and behavioral signals to surface actionable medical insights",
  users: ["Medical Affairs","Home Office"],
  compliancePartners: ["field-risk","explainability","audit"],
  hubDependency: ["hcp-explorer"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["insights-agent"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

