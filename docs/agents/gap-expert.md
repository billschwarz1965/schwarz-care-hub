# Gap-to-Expert Agent

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `gap-expert` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-git-branch` |

## Purpose

When evidence gaps are identified, automatically finds experts who publish, treat, or might collaborate in that area

## Audiences served

- Medical Affairs
- Clinical Operations

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
| AI Explainability (`explainability`) | Provides transparency — why an answer was generated, supporting sources, confidence level |

## Reference interaction

**Scenario:** Evidence gap to expert identification pipeline

### Input

_Medical affairs evidence gap trigger_

> Our HEOR team flagged a critical gap: we have no real-world evidence on dupilumab outcomes in elderly AD patients (≥65 years). Payers are pushing back on coverage for this population. We need to identify researchers who can design and run an observational study — ideally someone with geriatric dermatology expertise, access to an elderly cohort, and registry or claims database experience.

### Processing steps

1. Parsing evidence gap: dupilumab + atopic dermatitis + elderly (≥65) + real-world evidence...
2. Literature Intelligence: scanning 36M PubMed records for geriatric AD + RWE publications...
3. Expert Intelligence Hub: querying 4.9M HCP profiles filtered by geriatric dermatology...
4. Narrowing: investigators with elderly cohort access + registry/database PI experience...
5. Cross-referencing: publication overlap with dupilumab, biologics, or IL-4/IL-13 pathway...
6. OneCRM: checking Sanofi engagement history and collaboration feasibility...
7. Congress footprint: scanning AAD, EADV, SID, AGS for geriatric derm presentations...
8. Scoring 47 candidates across 6 gap-alignment dimensions...

### Governance review performed

| Governance agent | Result |
|---|---|
| Audit Trail | Logged |
| AI Explainability | Pass |

### Output

Badge: `GAP MAPPED & EXPERTS IDENTIFIED`

5 expert matches identified for elderly AD real-world evidence gap. Lead candidate: Dr. Laura Margolis (UPenn) — 87/100 gap-fit score, PI on DERMA-AGING registry with 12,400 elderly patients. 4-phase engagement roadmap generated. MSL Copilot pre-call briefings queued. Medical Strategy Advisor notified to update evidence gap tracker.


## Enterprise integration

**Systems of record**

- Literature Intelligence
- Veeva Link
- Internal evidence gap register

**Data domains**

- Publications
- HCP master
- Evidence gaps

**Scaling behaviour**

Runs on gap creation rather than continuously. Trigger from the evidence gap register instead of polling.

**Residency & access constraints**

Professional publication and treatment activity only.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "gap-expert",
  name: "Gap-to-Expert Agent",
  icon: "git-branch",
  desc: "When evidence gaps are identified, automatically finds experts who publish, treat, or might collaborate in that area",
  users: ["Medical Affairs","Clinical Operations"],
  compliancePartners: ["audit","explainability"],
  hubDependency: ["hcp-explorer","literature-intel"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["gap-expert"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

