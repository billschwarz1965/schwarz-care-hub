# MSL Copilot

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `msl-copilot` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-user-star` |

## Purpose

Prepares pre-call briefings, real-time scientific guidance, and post-call documentation for MSL field teams

## Audiences served

- MSLs
- Field Medical

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
| Promotional Risk (`promo-risk`) | Detects promotional language patterns: 'best treatment', 'superior efficacy', 'guaranteed benefit' |
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |
| Off-Label Monitor (`off-label`) | Real-time detection of off-label discussions, routes to approved reactive responses |

## Reference interaction

**Scenario:** Pre-call intelligence briefing (enhanced with HCP Explorer)

### Input

_MSL request_

> Prepare me for my meeting with Dr. Sarah Chen tomorrow. She's a community dermatologist at Cleveland Clinic.

### Processing steps

1. HCP Explorer: retrieving Dr. Chen 360° profile...
2. Publications: 34 total, 12 in AD, h-index 28...
3. Trial activity: sub-investigator on LIBERTY AD CHRONOS...
4. OneCRM: 6 Sanofi interactions in last 12 months...
5. interaction signals: 3 recent MedVerse queries (last 30 days)...
6. Generating personalized briefing...

### Governance review performed

| Governance agent | Result |
|---|---|
| Promotional Risk | Pass |
| Off-Label Monitor | Pass |
| Audit Trail | Logged |

### Output

Badge: `APPROVED`

360° briefing delivered to MSL mobile app. Pre-call checklist created. Post-call documentation template pre-populated. Expert tier trend noted — recommend flagging Dr. Chen for elevated engagement track.


## Enterprise integration

**Systems of record**

- OneCRM
- Veeva Link
- MedVerse content service

**Data domains**

- HCP master
- Engagement history
- Territory assignment
- Approved content

**Scaling behaviour**

Concurrency peaks in the pre-call window each morning. Pre-generate briefings overnight for scheduled meetings instead of on demand.

**Residency & access constraints**

MSL sees only their assigned territory. Briefing content must be approved-content-derived and non-promotional.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "msl-copilot",
  name: "MSL Copilot",
  icon: "user-star",
  desc: "Prepares pre-call briefings, real-time scientific guidance, and post-call documentation for MSL field teams",
  users: ["MSLs","Field Medical"],
  compliancePartners: ["promo-risk","audit","off-label"],
  hubDependency: ["hcp-explorer","literature-intel"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["msl-copilot"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

