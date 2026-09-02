# AI Explainability

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `explainability` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-brain` |

## Purpose

Provides transparency — why an answer was generated, supporting sources, confidence level

## Agents supervised

- Advisory Board Builder (`advisory-board`)
- Insights Agent (`insights-agent`)
- Expert Segmentation Agent (`expert-segment`)
- Medical Strategy Advisor (`strategy-advisor`)
- Gap-to-Expert Agent (`gap-expert`)

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["explainability"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- Model and prompt version registry
- Retrieval trace store

**Data domains**

- Retrieval traces
- Model versions
- Ranking rationale
- Confidence scores

**Scaling behaviour**

Trace capture adds payload to every request. Store traces separately from the response path and reference them by id.

**Residency & access constraints**

A verdict must be reconstructable later, which means retaining the model and prompt version alongside the trace.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "explainability",
  name: "AI Explainability",
  icon: "brain",
  desc: "Provides transparency — why an answer was generated, supporting sources, confidence level"
}
```

