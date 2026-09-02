# KOL Relationship Agent

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `kol-agent` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-users-group` |

## Purpose

Identifies emerging KOLs, tracks influence growth, monitors publication acceleration and conference visibility

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

## Governance pairings

Every output is reviewed by these governance agents before delivery.

| Governance agent | What it checks |
|---|---|
| Promotional Risk (`promo-risk`) | Detects promotional language patterns: 'best treatment', 'superior efficacy', 'guaranteed benefit' |
| Off-Label Monitor (`off-label`) | Real-time detection of off-label discussions, routes to approved reactive responses |
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |

## Reference interaction

**Scenario:** Emerging KOL identification and influence tracking

### Input

_MSL field request_

> I keep hearing about Dr. Kenji Tanaka from Keio University — multiple HCPs in Japan and at international congresses are referencing his AD biomarker work. Is he an emerging KOL we should be tracking? Give me a full influence assessment.

### Processing steps

1. HCP Explorer: loading Dr. Kenji Tanaka profile (Keio Univ, Dermatology)...
2. Publication analysis: 78 indexed publications, 26 in AD/biomarkers...
3. Citation velocity: computing 3-year citation acceleration curve...
4. Congress footprint: scanning EADV, AAD, JSID, SID presentation history...
5. Network mapping: identifying coauthor clusters and institutional reach...
6. OneCRM: checking Sanofi engagement history (1 interaction found)...
7. Competitive intelligence: scanning competitor-sponsored publications...

### Governance review performed

| Governance agent | Result |
|---|---|
| Promotional Risk | Pass |
| Off-Label Monitor | Pass |
| Audit Trail | Logged |

### Output

Badge: `VERIFIED & ACTIONABLE`

Dr. Tanaka confirmed as high-trajectory Rising Star with National KOL projection within 12 months. Engagement gap critical — only 1 Sanofi interaction vs. active competitor engagement. 4-step engagement plan generated. MSL Japan notified with pre-call briefing materials.


## Enterprise integration

**Systems of record**

- Veeva Link
- Publication and citation feeds
- Congress registries

**Data domains**

- HCP master
- Publications
- Citation velocity
- Congress participation

**Scaling behaviour**

Influence scoring is the expensive step. Recompute on a schedule per therapeutic area rather than per query, and serve stored scores.

**Residency & access constraints**

Public scientific output only. Do not infer or store personal attributes beyond professional activity.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "kol-agent",
  name: "KOL Relationship Agent",
  icon: "users-group",
  desc: "Identifies emerging KOLs, tracks influence growth, monitors publication acceleration and conference visibility",
  users: ["MSLs","Medical Affairs"],
  compliancePartners: ["promo-risk","off-label","audit"],
  hubDependency: ["hcp-explorer"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["kol-agent"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

