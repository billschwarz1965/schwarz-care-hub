# AE Detection

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `ae-detect` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-heartbeat` |

## Purpose

Monitors all interactions for adverse event signals, auto-creates pharmacovigilance cases

## Agents supervised

- Patient Navigator (`patient-nav`)
- Ingredient Safety Agent (`ingredient-safety`)
- Temperature Stability Agent (`temp-stability`)

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["ae-detect"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- Pharmacovigilance case management (safety database)
- AE intake workflow

**Data domains**

- Adverse event signals
- Case records
- Product-event pairs

**Scaling behaviour**

Volume is low but every detection creates a downstream regulatory obligation. Never batch or defer — detection must be synchronous with the interaction.

**Residency & access constraints**

Detected AEs trigger mandatory reporting timelines. Route to the safety database immediately; do not rely on the user to report.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "ae-detect",
  name: "AE Detection",
  icon: "heartbeat",
  desc: "Monitors all interactions for adverse event signals, auto-creates pharmacovigilance cases"
}
```

