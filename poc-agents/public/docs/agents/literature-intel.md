# Literature Intelligence

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `literature-intel` |
| **Layer** | 3 — Intelligence Hub Layer |
| **Subtitle** | Scientific knowledge graph |
| **Icon** | `ti-book-2` |

## Purpose

Indexes, synthesizes, and monitors the global scientific literature. Powers the Literature Scout agent and feeds evidence into every MedVerse response.

## Data sources

| Source | Volume |
|---|---|
| PubMed indexed | 36M+ |
| Internal approved | 12K |
| Congress abstracts | 84K |

## Capabilities

- Real-time publication monitoring & alerting
- Evidence synthesis across disease areas
- Citation verification & claim substantiation
- Competitive publication landscape analysis

## Agents that depend on this hub

- Literature Scout (`literature-scout`)
- Medical Strategy Advisor (`strategy-advisor`)
- MSL Copilot (`msl-copilot`)
- Disease State Navigator Agent (`disease-navigator`)

## Governance pairings

Every output is reviewed by these governance agents before delivery.

| Governance agent | What it checks |
|---|---|
| Scientific Verification (`sci-verify`) | Validates every claim against labels, core data sheets, publications, and approved content |
| Content Expiration (`expiration`) | Monitors label updates, retires outdated content, re-indexes approved materials |
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["literature-intel"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- PubMed E-utilities
- NEJM / publisher feeds
- Internal approved content repository
- Congress abstract libraries

**Data domains**

- Publications
- Approved medical content
- Congress abstracts
- Citation graph

**Scaling behaviour**

Bound by external API rate limits, not internal compute. Cache query results, honour publisher rate limits, and pre-index high-traffic therapeutic areas rather than searching live on every request.

**Residency & access constraints**

Respect publisher licensing for full-text. Internal approved content carries expiry — re-check status before reuse.


## Recreating this agent

Add the specification below to `SYSTEM_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "literature-intel",
  name: "Literature Intelligence",
  subtitle: "Scientific knowledge graph",
  icon: "book-2",
  desc: "Indexes, synthesizes, and monitors the global scientific literature. Powers the Literature Scout agent and feeds evidence into every MedVerse response.",
  dataSources: [{"label":"PubMed indexed","value":"36M+","icon":"database"},{"label":"Internal approved","value":"12K","icon":"file-check"},{"label":"Congress abstracts","value":"84K","icon":"notes"}],
  capabilities: [
    "Real-time publication monitoring & alerting",
    "Evidence synthesis across disease areas",
    "Citation verification & claim substantiation",
    "Competitive publication landscape analysis"
  ],
  consumers: ["literature-scout","strategy-advisor","msl-copilot","disease-navigator"],
  compliancePartners: ["sci-verify","expiration","audit"]
}
```

