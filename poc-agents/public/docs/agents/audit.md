# Audit Trail

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `audit` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-clipboard-list` |

## Purpose

Creates immutable compliance records — who asked, what was generated, which checks ran

## Agents supervised

- MSL Copilot (`msl-copilot`)
- KOL Relationship Agent (`kol-agent`)
- Advisory Board Builder (`advisory-board`)
- Insights Agent (`insights-agent`)
- Clinical Trial Intelligence (`trial-intel`)
- Congress Planning Agent (`congress-planning`)
- Expert Segmentation Agent (`expert-segment`)
- Gap-to-Expert Agent (`gap-expert`)
- Trial Matching Agent (`trial-match`)
- MSL Connect (`msl-connect`)
- Ingredient Safety Agent (`ingredient-safety`)
- Temperature Stability Agent (`temp-stability`)
- Disease State Navigator Agent (`disease-navigator`)

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["audit"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- Immutable audit log store (write-once)
- Enterprise SIEM

**Data domains**

- Interaction records
- Governance verdicts
- Data access events

**Scaling behaviour**

Highest write volume in the platform — one record per interaction plus one per check. Append-only storage with time partitioning; never update in place.

**Residency & access constraints**

Records are retained per regulatory retention schedule and must remain tamper-evident. No deletion path.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "audit",
  name: "Audit Trail",
  icon: "clipboard-list",
  desc: "Creates immutable compliance records — who asked, what was generated, which checks ran"
}
```

