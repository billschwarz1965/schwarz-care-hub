# Temperature Stability Agent

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `temp-stability` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-temperature` |

## Purpose

Assesses product viability after temperature excursions for insulins and vaccines. Wraps the Sanofi Stability Calculator with AI-powered natural language intake, multi-product batch assessment, and cold chain compliance logging.

## Audiences served

- Pharmacists
- HCPs

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
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |
| AE Detection (`ae-detect`) | Monitors all interactions for adverse event signals, auto-creates pharmacovigilance cases |

## Reference interaction

**Scenario:** Cold chain excursion assessment for pharmacy

### Input

_Pharmacy urgent request_

> Our pharmacy refrigerator failed overnight. We discovered it this morning — the temperature logger shows the unit reached 14°C for approximately 6 hours before returning to 4°C. We have the following Sanofi products affected: 8 vials of Lantus (insulin glargine U100) 10 mL (unopened), 3 pens of Toujeo Max (insulin glargine U300), and a case of Beyfortus (nirsevimab) for our pediatric RSV program. None have been administered. Are any of these still usable?

### Processing steps

1. Parsing temperature excursion: peak 14°C (~57°F), duration ~6 hours, returned to 4°C...
2. Classifying excursion range: >8 to ≤30°C — within warm excursion band...
3. Product 1: Lantus U100 10 mL vial — querying Sanofi Stability Calculator (not in use)...
4. Product 2: Toujeo Max U300 3 mL pen — querying Sanofi Stability Calculator (not in use)...
5. Product 3: Beyfortus (nirsevimab) — querying Vaccine Stability Database...
6. Cross-referencing FDA-approved labeling for each product's excursion tolerance...
7. Checking lot expiration dates against excursion stability windows...
8. Generating pharmacy action plan with documentation for state board compliance...

### Governance review performed

| Governance agent | Result |
|---|---|
| Scientific Verification | Pass |
| AE Detection | Pass |
| Audit Trail | Logged |

### Output

Badge: `ASSESSED & DOCUMENTED`

2 of 3 products cleared: Lantus (8 vials) and Toujeo Max (3 pens) are within labeled stability tolerance — return to refrigeration. Beyfortus requires Sanofi Vaccines confirmation (1-800-VACCINE) due to stricter excursion limits. Pharmacy action plan and excursion documentation generated. No products were administered — no AE reporting required.


## Enterprise integration

**Systems of record**

- Sanofi Stability Calculator
- Approved prescribing information
- Cold chain / excursion logging

**Data domains**

- Product stability profiles
- Label storage conditions
- Excursion records

**Scaling behaviour**

Bursty — a single freezer failure generates a batch of assessments at once. Support multi-product batch intake in one request.

**Residency & access constraints**

Excursion records are regulated documentation. Persist them immutably for pharmacy and state board audit.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "temp-stability",
  name: "Temperature Stability Agent",
  icon: "temperature",
  desc: "Assesses product viability after temperature excursions for insulins and vaccines. Wraps the Sanofi Stability Calculator with AI-powered natural language intake, multi-product batch assessment, and cold chain compliance logging.",
  users: ["Pharmacists","HCPs"],
  compliancePartners: ["sci-verify","audit","ae-detect"],
  hubDependency: ["literature-intel"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["temp-stability"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

