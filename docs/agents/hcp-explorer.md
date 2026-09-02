# Expert Intelligence Hub

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `hcp-explorer` |
| **Layer** | 3 — Intelligence Hub Layer |
| **Subtitle** | Powered by HCP Explorer |
| **Icon** | `ti-topology-star-ring-3` |

## Purpose

The foundational expert knowledge graph — single source of truth for all HCP and KOL intelligence. Every downstream MedVerse agent queries this hub before making recommendations.

## Data sources

| Source | Volume |
|---|---|
| HCP profiles | 4.9M |
| Publications | 13.3M |
| Congress participations | 22.5M |
| Clinical trials | 563K |
| Sanofi engagements | OneCRM |

## Capabilities

- Expert discovery by disease, mechanism, geography, practice setting
- Scientific credibility & publication impact assessment
- Engagement history & relationship strength analysis
- Coauthor network mapping & influence pathways
- Investigator track record & enrollment performance
- Emerging KOL identification & growth trajectory

## Agents that depend on this hub

- MSL Copilot (`msl-copilot`)
- KOL Relationship Agent (`kol-agent`)
- Advisory Board Builder (`advisory-board`)
- Congress Planning Agent (`congress-planning`)
- Clinical Trial Intelligence (`trial-intel`)
- Medical Strategy Advisor (`strategy-advisor`)
- Expert Segmentation Agent (`expert-segment`)
- Gap-to-Expert Agent (`gap-expert`)

## Governance pairings

Every output is reviewed by these governance agents before delivery.

| Governance agent | What it checks |
|---|---|
| PHI Protection (`privacy`) | Identifies and redacts protected health information, masks identifiers, controls access |
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |
| AI Explainability (`explainability`) | Provides transparency — why an answer was generated, supporting sources, confidence level |
| MLR Review (`mlr`) | Reviews content for on-label language, promotional risk, claim substantiation, and fair balance |

## Reference interaction

**Scenario:** Expert discovery with 360° intelligence

### Input

_Medical affairs query_

> Find community-based pulmonologists publishing on ILD biomarkers in the Northeast US. I need experts for a potential advisory board on our fibrosis pipeline.

### Processing steps

1. Querying 4.9M HCP profiles: specialty=pulmonology, setting=community...
2. Filtering 13.3M publications: keywords=ILD, biomarkers, interstitial lung disease...
3. Cross-referencing geography: Northeast US (NY, MA, PA, NJ, CT)...
4. Enriching with OneCRM engagement history...
5. Scoring by scientific credibility and publication impact...

### Governance review performed

| Governance agent | Result |
|---|---|
| PHI Protection | Pass |
| AI Explainability | Pass |
| Audit Trail | Logged |

### Output

Badge: `VERIFIED & AUDITABLE`

12 experts profiled with ranking rationale, data provenance, and confidence scores. 3 unengaged experts flagged as strategic opportunities. Results exportable for advisory board planning workflow.


## Enterprise integration

**Systems of record**

- Veeva Link (expert graph)
- OneCRM (Sanofi engagement history)
- Internal HCP master data

**Data domains**

- HCP / KOL master
- Publications
- Congress participation
- Clinical trial investigators
- Engagement history

**Scaling behaviour**

Read volume scales with every downstream agent, since all of them query this hub first. Cache resolved expert profiles per session and batch profile enrichment rather than resolving per request.

**Residency & access constraints**

Professional and public information only. Engagement history is access-controlled by territory; never join to patient-level data.


## Recreating this agent

Add the specification below to `SYSTEM_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "hcp-explorer",
  name: "Expert Intelligence Hub",
  subtitle: "Powered by HCP Explorer",
  icon: "topology-star-ring-3",
  desc: "The foundational expert knowledge graph — single source of truth for all HCP and KOL intelligence. Every downstream MedVerse agent queries this hub before making recommendations.",
  dataSources: [{"label":"HCP profiles","value":"4.9M","icon":"users"},{"label":"Publications","value":"13.3M","icon":"book"},{"label":"Congress participations","value":"22.5M","icon":"calendar-event"},{"label":"Clinical trials","value":"563K","icon":"flask"},{"label":"Sanofi engagements","value":"OneCRM","icon":"building"}],
  capabilities: [
    "Expert discovery by disease, mechanism, geography, practice setting",
    "Scientific credibility & publication impact assessment",
    "Engagement history & relationship strength analysis",
    "Coauthor network mapping & influence pathways",
    "Investigator track record & enrollment performance",
    "Emerging KOL identification & growth trajectory"
  ],
  consumers: ["msl-copilot","kol-agent","advisory-board","congress-planning","trial-intel","strategy-advisor","expert-segment","gap-expert"],
  compliancePartners: ["privacy","audit","explainability","mlr"]
}
```

