# Congress Planning Agent

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `congress-planning` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-calendar-event` |

## Purpose

Before major congresses: who to meet, who is presenting, who is publishing, who is increasing visibility in target disease areas

## Audiences served

- MSLs
- Medical Affairs

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
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |
| Promotional Risk (`promo-risk`) | Detects promotional language patterns: 'best treatment', 'superior efficacy', 'guaranteed benefit' |

## Reference interaction

**Scenario:** Congress expert intelligence for EADV 2026

### Input

_MSL team request_

> EADV 2026 is in September. Who should our dermatology MSL team prioritize meeting? Who is presenting new data? Who are we currently not engaged with?

### Processing steps

1. HCP Explorer: querying EADV 2026 registered presenters...
2. Cross-referencing 22.5M congress participation records...
3. Identifying new data presenters vs. established presence...
4. OneCRM gap analysis: presenters with no MSL relationship...
5. Prioritizing by scientific impact and strategic relevance...

### Governance review performed

| Governance agent | Result |
|---|---|
| Promotional Risk | Pass |
| Audit Trail | Logged |

### Output

Badge: `PLAN APPROVED`

Engagement plan delivered to MSL team with priority-ranked expert list. Calendar integration available for meeting scheduling. Post-congress interaction capture templates pre-loaded in OneCRM.


## Enterprise integration

**Systems of record**

- Congress registries and agendas
- Veeva Link
- OneCRM

**Data domains**

- Congress participation
- HCP master
- Engagement history
- Presentation metadata

**Scaling behaviour**

Highly seasonal — load concentrates in the weeks before each congress. Pre-build congress dossiers when the agenda publishes.

**Residency & access constraints**

Attendance intent is sensitive. Use published agendas rather than inferred attendance where possible.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "congress-planning",
  name: "Congress Planning Agent",
  icon: "calendar-event",
  desc: "Before major congresses: who to meet, who is presenting, who is publishing, who is increasing visibility in target disease areas",
  users: ["MSLs","Medical Affairs"],
  compliancePartners: ["audit","promo-risk"],
  hubDependency: ["hcp-explorer","literature-intel"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["congress-planning"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

