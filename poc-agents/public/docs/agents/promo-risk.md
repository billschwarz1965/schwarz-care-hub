# Promotional Risk

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `promo-risk` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-alert-triangle` |

## Purpose

Detects promotional language patterns: 'best treatment', 'superior efficacy', 'guaranteed benefit'

## Agents supervised

- MSL Copilot (`msl-copilot`)
- KOL Relationship Agent (`kol-agent`)
- Congress Planning Agent (`congress-planning`)
- MSL Connect (`msl-connect`)

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["promo-risk"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- Promotional language policy rules
- Veeva Vault PromoMats

**Data domains**

- Policy rules
- Flagged language patterns
- Review decisions

**Scaling behaviour**

Pattern matching over generated text — cheap and stateless. Scale horizontally; keep the rule set versioned so verdicts stay reproducible.

**Residency & access constraints**

Rule set version must be recorded alongside each verdict for audit reconstruction.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "promo-risk",
  name: "Promotional Risk",
  icon: "alert-triangle",
  desc: "Detects promotional language patterns: 'best treatment', 'superior efficacy', 'guaranteed benefit'"
}
```

