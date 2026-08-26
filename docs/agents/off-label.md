# Off-Label Monitor

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `off-label` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-eye` |

## Purpose

Real-time detection of off-label discussions, routes to approved reactive responses

## Agents supervised

- MSL Copilot (`msl-copilot`)
- KOL Relationship Agent (`kol-agent`)
- Disease State Navigator Agent (`disease-navigator`)

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["off-label"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- Approved indication registry (by region)
- Reactive response library
- Medical information workflow

**Data domains**

- Label indications by region
- Approved reactive responses
- Routed inquiries

**Scaling behaviour**

Requires the correct regional label per user. Cache the indication registry per market and invalidate on label change events.

**Residency & access constraints**

Indication scope differs by market. A response approved in one region may be off-label in another — resolve by the user's market, not the global label.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "off-label",
  name: "Off-Label Monitor",
  icon: "eye",
  desc: "Real-time detection of off-label discussions, routes to approved reactive responses"
}
```

