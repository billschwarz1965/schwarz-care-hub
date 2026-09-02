# Scientific Verification

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `sci-verify` |
| **Layer** | 4 — Governance Layer |
| **Icon** | `ti-microscope` |

## Purpose

Validates every claim against labels, core data sheets, publications, and approved content

## Agents supervised

- Literature Scout (`literature-scout`)
- Clinical Trial Intelligence (`trial-intel`)
- Medical Strategy Advisor (`strategy-advisor`)
- Trial Matching Agent (`trial-match`)
- Ingredient Safety Agent (`ingredient-safety`)
- Temperature Stability Agent (`temp-stability`)
- Disease State Navigator Agent (`disease-navigator`)

## Reference interaction

_No reference interaction is defined for this agent yet._ Add an `AGENT_DEMOS["sci-verify"]` entry in `poc/src/agents-data.js` to document one — the ecosystem UI will then offer a runnable demo for it.


## Enterprise integration

**Systems of record**

- Product labels and core data sheets
- Literature Intelligence
- Approved content repository

**Data domains**

- Label claims
- Publications
- Approved content

**Scaling behaviour**

Claim extraction then substantiation lookup. Maintain a claim-to-source index so substantiation is a lookup rather than a search.

**Residency & access constraints**

Every substantiation must resolve to a citable source. Unsubstantiated claims are blocked, not softened.


## Recreating this agent

Add the specification below to `COMPLIANCE_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "sci-verify",
  name: "Scientific Verification",
  icon: "microscope",
  desc: "Validates every claim against labels, core data sheets, publications, and approved content"
}
```

