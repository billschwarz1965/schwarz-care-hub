# PHI Protection

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `privacy` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-lock` |

## Purpose

Identifies and redacts protected health information, masks identifiers, controls access

## Agents supervised

- Advisory Board Builder (`advisory-board`)
- Clinical Trial Intelligence (`trial-intel`)
- Patient Navigator (`patient-nav`)
- Trial Matching Agent (`trial-match`)
- MSL Connect (`msl-connect`)

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["privacy"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- Enterprise identity and access management
- PHI classification service
- Data loss prevention

**Data domains**

- Access entitlements
- PHI classifications
- Redaction records

**Scaling behaviour**

Runs before any data is returned. Push entitlement filtering into the query rather than redacting after retrieval — cheaper and safer.

**Residency & access constraints**

Enforces the strictest constraint of any data domain in the request. Deny by default when classification is unknown.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "privacy",
  name: "PHI Protection",
  icon: "lock",
  desc: "Identifies and redacts protected health information, masks identifiers, controls access"
}
```

