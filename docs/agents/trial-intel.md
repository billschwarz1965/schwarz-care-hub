# Clinical Trial Intelligence

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `trial-intel` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-flask` |

## Purpose

Identifies investigators with enrollment track records, matches sites to protocols, and monitors trial landscape by therapeutic area

## Audiences served

- Clinical Operations
- MSLs

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
| Scientific Verification (`sci-verify`) | Validates every claim against labels, core data sheets, publications, and approved content |
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |

## Reference interaction

**Scenario:** Clinical trial landscape analysis and investigator matching

### Input

_Clinical operations request_

> We're planning a Phase 3b dupilumab trial in moderate-to-severe AD with a biomarker-stratified enrollment design. I need the competitive trial landscape, top-enrolling sites in the US, and investigator recommendations. Target: 500 patients across 40 sites.

### Processing steps

1. Querying ClinicalTrials.gov: atopic dermatitis, Phase 3/3b, recruiting/planned...
2. Identified 47 active competitor trials in AD (22 recruiting, 25 planned)...
3. Analyzing site-level enrollment velocity: 1,200 US investigator sites with AD experience...
4. Cross-referencing HCP Explorer: investigator publication profiles and KOL status...
5. Mapping enrollment competition: sites shared with active competitor trials...
6. Scoring site readiness: IRB turnaround, screen-fail rates, diversity metrics...

### Governance review performed

| Governance agent | Result |
|---|---|
| PHI Protection | Pass |
| Scientific Verification | Pass |
| Audit Trail | Logged |

### Output

Badge: `LANDSCAPE VERIFIED`

Competitive landscape mapped: 47 active trials across 8 mechanisms. 40-site recommendation stratified by enrollment capacity, competitor overlap, and diversity metrics. 5 highest-risk sites flagged for enrollment competition. Biomarker stratification timeline impact quantified (+3 weeks screening). Report exportable to clinical operations planning system.


## Enterprise integration

**Systems of record**

- ClinicalTrials.gov API
- Internal clinical trial management system
- Veeva Link (investigators)

**Data domains**

- Trial registry
- Investigator performance
- Site and enrolment metrics

**Scaling behaviour**

Registry pulls are the bottleneck. Sync the registry on a schedule into a local index and query that; reserve live calls for detail views.

**Residency & access constraints**

Registry data is public. Internal enrolment performance is confidential — do not expose it externally.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "trial-intel",
  name: "Clinical Trial Intelligence",
  icon: "flask",
  desc: "Identifies investigators with enrollment track records, matches sites to protocols, and monitors trial landscape by therapeutic area",
  users: ["Clinical Operations","MSLs"],
  compliancePartners: ["privacy","sci-verify","audit"],
  hubDependency: ["hcp-explorer"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["trial-intel"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

