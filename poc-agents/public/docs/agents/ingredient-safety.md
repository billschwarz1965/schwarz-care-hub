# Ingredient Safety Agent

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `ingredient-safety` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-flask` |

## Purpose

AI-powered excipient and ingredient intelligence. Cross-references product formulations with patient allergy profiles, dietary restrictions, and religious considerations to flag safety concerns before prescribing.

## Audiences served

- HCPs
- Pharmacists

## Data dependencies

### Literature Intelligence (`literature-intel`)

Indexes, synthesizes, and monitors the global scientific literature. Powers the Literature Scout agent and feeds evidence into every MedVerse response.

- PubMed indexed: **36M+**
- Internal approved: **12K**
- Congress abstracts: **84K**

## Governance pairings

Every output is reviewed by these governance agents before delivery.

| Governance agent | What it checks |
|---|---|
| Scientific Verification (`sci-verify`) | Validates every claim against labels, core data sheets, publications, and approved content |
| AE Detection (`ae-detect`) | Monitors all interactions for adverse event signals, auto-creates pharmacovigilance cases |
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |

## Reference interaction

**Scenario:** Excipient safety check with allergy cross-reference

### Input

_HCP prescribing query_

> I'm about to prescribe Dupixent (dupilumab) for a 34-year-old patient with moderate-to-severe AD. She has a documented severe allergy to polysorbate 80 and is also lactose intolerant (religious dietary restriction — halal observant). Can you check the full ingredient profile and flag any concerns before I prescribe?

### Processing steps

1. Loading Dupixent (dupilumab) product formulation from Sanofi Ingredient Database...
2. Extracting full excipient list: active + inactive ingredients...
3. Cross-referencing patient allergy profile: polysorbate 80 (severe)...
4. Checking dietary/religious compatibility: halal certification status...
5. Literature Intelligence: scanning excipient cross-reactivity publications...
6. Querying FDA Inactive Ingredient Database for alternative formulations...
7. Generating safety assessment with clinical recommendation...

### Governance review performed

| Governance agent | Result |
|---|---|
| AE Detection | Flagged |

### Output

Badge: `SAFETY ALERT ISSUED`

⚠️ Dupixent contains polysorbate 80 — patient has documented severe allergy. Allergist referral recommended for skin-prick testing before initiation. Halal dietary assessment: COMPLIANT — all excipients are synthetic or plant-derived. Full ingredient analysis with literature evidence and alternative options delivered. Pharmacovigilance team notified.


## Enterprise integration

**Systems of record**

- Product formulation / excipient master
- Approved prescribing information
- Pharmacovigilance intake

**Data domains**

- Product formulation
- Excipients
- Allergen and dietary classifications
- Label content

**Scaling behaviour**

Formulation data is small and stable. Load it in memory; the constraint is keeping it synchronised with label updates.

**Residency & access constraints**

Patient allergy input is health data — process in-session, do not retain. Every flag must cite the label.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "ingredient-safety",
  name: "Ingredient Safety Agent",
  icon: "flask",
  desc: "AI-powered excipient and ingredient intelligence. Cross-references product formulations with patient allergy profiles, dietary restrictions, and religious considerations to flag safety concerns before prescribing.",
  users: ["HCPs","Pharmacists"],
  compliancePartners: ["sci-verify","ae-detect","audit"],
  hubDependency: ["literature-intel"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["ingredient-safety"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

