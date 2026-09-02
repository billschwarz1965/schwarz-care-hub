# Content Expiration

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `expiration` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-clock-x` |

## Purpose

Monitors label updates, retires outdated content, re-indexes approved materials

## Agents supervised

- Literature Scout (`literature-scout`)

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["expiration"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- Approved content repository
- Label change notification feed
- Content index

**Data domains**

- Content approval dates
- Label versions
- Retirement records

**Scaling behaviour**

Event-driven rather than per-request. Subscribe to label change events and re-index affected content instead of polling.

**Residency & access constraints**

Expired content must become unreachable, not merely flagged. Re-index on retirement.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "expiration",
  name: "Content Expiration",
  icon: "clock-x",
  desc: "Monitors label updates, retires outdated content, re-indexes approved materials"
}
```

