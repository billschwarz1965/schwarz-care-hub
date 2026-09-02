# Inspection Readiness

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `inspection` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-file-certificate` |

## Purpose

Continuously prepares documentation, logs, evidence packages for regulatory inspections

## Agents supervised

- Medical Strategy Advisor (`strategy-advisor`)

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["inspection"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- Immutable audit log store
- Document management system
- Quality management system

**Data domains**

- Audit records
- Evidence packages
- SOP and training records

**Scaling behaviour**

Read-heavy and bursty — activity concentrates around inspection events. Pre-assemble evidence packages on a schedule so they are ready on request.

**Residency & access constraints**

Evidence packages must be reproducible for the full retention period, including the state of content at the time of each interaction.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "inspection",
  name: "Inspection Readiness",
  icon: "file-certificate",
  desc: "Continuously prepares documentation, logs, evidence packages for regulatory inspections"
}
```

