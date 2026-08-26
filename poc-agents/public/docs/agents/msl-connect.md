# MSL Connect

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `msl-connect` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-map-pin-heart` |

## Purpose

Helps HCPs identify their assigned MSL(s) by therapeutic area, territory, and institution. Pulls from interaction signal data, OneCRM territory assignments, and MSL profiles.

## Audiences served

- HCPs
- MSLs

## Data dependencies

### Expert Intelligence Hub (`hcp-explorer`)

The foundational expert knowledge graph — single source of truth for all HCP and KOL intelligence. Every downstream MedVerse agent queries this hub before making recommendations.

- HCP profiles: **4.9M**
- Publications: **13.3M**
- Congress participations: **22.5M**
- Clinical trials: **563K**
- Sanofi engagements: **OneCRM**

## Governance pairings

Every output is reviewed by these governance agents before delivery.

| Governance agent | What it checks |
|---|---|
| PHI Protection (`privacy`) | Identifies and redacts protected health information, masks identifiers, controls access |
| Audit Trail (`audit`) | Creates immutable compliance records — who asked, what was generated, which checks ran |
| Promotional Risk (`promo-risk`) | Detects promotional language patterns: 'best treatment', 'superior efficacy', 'guaranteed benefit' |

## Reference interaction

**Scenario:** HCP finds their assigned MSL(s)

### Input

_HCP request_

> I'm Dr. Sarah Chen, a dermatologist at Northwestern Memorial Hospital in Chicago. I have questions about the long-term dupilumab data presented at AAD and would like to connect with someone from your medical team. Who is my MSL?

### Processing steps

1. Verifying HCP identity: Dr. Sarah Chen, NPI #1234567890...
2. HCP Explorer: loading profile — dermatology, Northwestern Memorial, Chicago IL...
3. Territory lookup: Midwest Region → Illinois → Cook County...
4. OneCRM: retrieving MSL territory assignments for Immunology + Dermatology...
5. Matching by therapeutic area alignment and geographic territory...
6. Checking MSL availability and recent engagement history...

### Governance review performed

| Governance agent | Result |
|---|---|
| PHI Protection | Pass |
| Promotional Risk | Pass |
| Audit Trail | Logged |

### Output

Badge: `VERIFIED & NON-PROMOTIONAL`

Your primary MSL is Dr. James Rivera (Immunology & Dermatology, Midwest). A notification has been sent to Dr. Rivera with your request to discuss the AAD 2026 dupilumab long-term data. Expected response within 1 business day. All interactions logged for compliance.


## Enterprise integration

**Systems of record**

- OneCRM (territory assignment)
- MSL profile directory
- Interaction signal store

**Data domains**

- Territory assignment
- MSL profiles
- HCP master
- Interaction signals

**Scaling behaviour**

Low volume, latency-sensitive. Territory data changes infrequently — cache the assignment map and invalidate on CRM change events.

**Residency & access constraints**

HCP identity verified against the public NPI registry. Contact routed only through official Sanofi channels.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "msl-connect",
  name: "MSL Connect",
  icon: "map-pin-heart",
  desc: "Helps HCPs identify their assigned MSL(s) by therapeutic area, territory, and institution. Pulls from interaction signal data, OneCRM territory assignments, and MSL profiles.",
  users: ["HCPs","MSLs"],
  compliancePartners: ["privacy","audit","promo-risk"],
  hubDependency: ["hcp-explorer"],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["msl-connect"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

