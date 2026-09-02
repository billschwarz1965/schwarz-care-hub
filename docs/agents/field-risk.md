# Field Activity Risk

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `field-risk` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-chart-dots-3` |

## Purpose

Analyzes MSL interactions and inquiry trends to detect compliance risks before audits

## Agents supervised

- Insights Agent (`insights-agent`)

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["field-risk"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- Interaction signal store
- OneCRM
- Compliance case management

**Data domains**

- Interaction signals
- Inquiry trends
- Field activity records

**Scaling behaviour**

Trend detection over history rather than per-request. Run on a schedule against aggregates and alert on threshold breach.

**Residency & access constraints**

Analyse at aggregate and trend level. Individual-level risk conclusions require a documented compliance process, not automated inference.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "field-risk",
  name: "Field Activity Risk",
  icon: "chart-dots-3",
  desc: "Analyzes MSL interactions and inquiry trends to detect compliance risks before audits"
}
```

