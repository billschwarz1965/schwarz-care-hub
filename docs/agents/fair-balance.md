# Fair Balance

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `fair-balance` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-scale` |

## Purpose

Ensures safety context accompanies efficacy claims, checks for appropriate risk language

## Agents supervised

- Patient Navigator (`patient-nav`)
- Disease State Navigator Agent (`disease-navigator`)

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["fair-balance"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- Product labels (safety sections)
- Approved content repository

**Data domains**

- Safety and warning content
- Efficacy claims
- Boxed warnings

**Scaling behaviour**

Pairs each efficacy claim with its required safety context. Maintain a claim-to-safety-context map so pairing is deterministic.

**Residency & access constraints**

Boxed warnings must always accompany the product they belong to, including for competitor products named in comparisons.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "fair-balance",
  name: "Fair Balance",
  icon: "scale",
  desc: "Ensures safety context accompanies efficacy claims, checks for appropriate risk language"
}
```

