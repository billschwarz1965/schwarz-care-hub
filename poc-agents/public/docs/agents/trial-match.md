# Trial Matching Agent

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `trial-match` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-stethoscope` |

## Purpose

Matches patient profiles to active clinical trials based on eligibility criteria, geography, and disease stage

## Audiences served

- HCPs
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

**Scenario:** Patient-trial matching with live Sanofi portfolio

### Input

_HCP request_

> I have a patient — Maria Garcia, DOB June 12, 1975, lives in Philadelphia. She has moderate-to-severe Crohn's disease, failed anti-TNF and vedolizumab. Are there any Sanofi trials she might qualify for?

### Processing steps

1. Patient de-identified → Patient_CD_4182
2. Parsing: Crohn's Disease, moderate-to-severe, anti-TNF-refractory, vedolizumab-refractory...
3. Querying Sanofi US Clinical Studies portfolio: 91 active studies across 13 TAs...
4. Filtering: Gastroenterology → Crohn's Disease → Recruiting status...
5. Cross-referencing eligibility: biologic-experienced, age 51, Northeast US...
6. 3 recruiting Sanofi Crohn's trials identified — checking site proximity to Philadelphia...

### Governance review performed

| Governance agent | Result |
|---|---|
| PHI Protection | Flagged |

### Output

Badge: `PHI-SAFE & PORTFOLIO-MATCHED`

3 Sanofi trial matches identified from live portfolio (91 studies). Best match: Duvakitug Crohn's Disease Induction (NCT07184931) — novel anti-TL1A mechanism, actively recruiting, Philadelphia sites available. MSL notified for site referral coordination.


## Enterprise integration

**Systems of record**

- ClinicalTrials.gov API
- Internal trial management system

**Data domains**

- Trial registry
- Eligibility criteria
- Site geography

**Scaling behaviour**

Eligibility parsing is the expensive step. Pre-parse criteria into a structured index per trial and match against the index.

**Residency & access constraints**

Never persist the patient profile used for matching beyond the session unless consent is captured. Match, return, discard.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "trial-match",
  name: "Trial Matching Agent",
  icon: "stethoscope",
  desc: "Matches patient profiles to active clinical trials based on eligibility criteria, geography, and disease stage",
  users: ["HCPs","MSLs"],
  compliancePartners: ["privacy","sci-verify","audit"],
  hubDependency: ["hcp-explorer"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["trial-match"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

