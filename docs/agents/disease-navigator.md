# Disease State Navigator Agent

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `disease-navigator` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-dna` |

## Purpose

Maps disease biology to treatment landscape across therapeutic areas. Traces shared inflammatory pathways to surface cross-TA connections — where one mechanism explains comorbidity in another organ system — and grounds every claim in pathophysiology, biomarkers, and the competitive landscape.

## Audiences served

- MSLs
- HCPs
- Medical Affairs
- Patients

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
| Fair Balance (`fair-balance`) | Ensures safety context accompanies efficacy claims, checks for appropriate risk language |
| Off-Label Monitor (`off-label`) | Real-time detection of off-label discussions, routes to approved reactive responses |
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |

## Reference interaction

**Scenario:** Cross-TA pathway mapping from a single presenting condition

### Input

_HCP question_

> I have a 34-year-old atopic dermatitis patient on topicals who has now developed adult-onset asthma and chronic nasal congestion with polyps. Three specialists, three diagnoses. Is this one disease or three? What does the biology say, and what are the treatment implications?

### Processing steps

1. Resolving presenting conditions: atopic dermatitis, type 2 asthma, CRSwNP...
2. Pathway lookup: all three map to type 2 inflammation (IL-4, IL-13, IL-5)...
3. Tracing shared mediators: TSLP, IL-33, IL-25 upstream alarmins...
4. Cross-referencing biomarker overlap: IgE, eosinophils, FeNO, periostin, TARC...
5. Literature Intelligence: retrieving atopic march and unified airway evidence...
6. Mapping treatment landscape across all three indications...
7. Checking label scope for each candidate therapy...

### Governance review performed

| Governance agent | Result |
|---|---|
| Scientific Verification | Pass |
| Fair Balance | Pass |
| Off-Label Monitor | Correction applied |
| Audit Trail | Logged |

### Output

Badge: `VERIFIED & FAIR-BALANCED`

Three diagnoses resolved to one shared mechanism — type 2 inflammation across skin, lower airway, and upper airway. Cross-TA map delivered with shared biomarkers, atopic march context, two adjacent conditions to monitor, and a fair-balanced comparison of four therapy classes with label scope. One off-label implication was caught and corrected by the governance layer before delivery.


## Enterprise integration

**Systems of record**

- Disease and pathway knowledge base
- Literature Intelligence
- Approved prescribing information
- Competitive landscape sources

**Data domains**

- Disease pathophysiology
- Inflammatory pathways
- Biomarkers
- Treatment landscape
- Label indications by region

**Scaling behaviour**

The pathway graph is small and read-mostly — hold it in memory. Cost grows with literature enrichment, so cache synthesis per disease and refresh when new evidence lands. Adding a therapeutic area means adding pathway and disease records, not new code.

**Residency & access constraints**

Label indications are region-specific: bind to the local label for the user's market before presenting any therapy comparison. Cross-TA discussion must not become an off-label recommendation.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "disease-navigator",
  name: "Disease State Navigator Agent",
  icon: "dna",
  desc: "Maps disease biology to treatment landscape across therapeutic areas. Traces shared inflammatory pathways to surface cross-TA connections — where one mechanism explains comorbidity in another organ system — and grounds every claim in pathophysiology, biomarkers, and the competitive landscape.",
  users: ["MSLs","HCPs","Medical Affairs","Patients"],
  compliancePartners: ["sci-verify","fair-balance","off-label","audit"],
  hubDependency: ["literature-intel"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["disease-navigator"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

