# Patient Navigator

> Generated from `poc/src/agents-data.js`. Do not edit by hand — run `npm run docs:agents`.

| | |
|---|---|
| **Agent id** | `patient-nav` |
| **Layer** | 2 — Agent Orchestration Layer |
| **Status** | active |
| **Icon** | `ti-heart-handshake` |

## Purpose

Guides patients through treatment journeys, connects to support programs, and monitors adherence milestones

## Audiences served

- Patients
- HCPs

## Data dependencies

This agent depends on no intelligence hub — it is self-contained.

## Governance pairings

Every output is reviewed by these governance agents before delivery.

| Governance agent | What it checks |
|---|---|
| PHI Protection (`privacy`) | Identifies and redacts protected health information, masks identifiers, controls access |
| AE Detection (`ae-detect`) | Monitors all interactions for adverse event signals, auto-creates pharmacovigilance cases |
| Fair Balance (`fair-balance`) | Ensures safety context accompanies efficacy claims, checks for appropriate risk language |

## Reference interaction

**Scenario:** Patient interaction with AE detection

### Input

_Patient message_

> Hi, I started Dupixent 3 weeks ago for my eczema. The itching is getting better which is great, but I've been having really bad eye redness and watering for the past week. My eyes are so irritated I can barely wear my contacts. Should I be worried?

### Processing steps

1. Analyzing patient message for clinical context...
2. Identifying: treatment (Dupixent), timeline (3 weeks), symptom (eye redness/watering)...
3. Retrieving approved patient-facing safety information...
4. Generating supportive response...

### Governance review performed

| Governance agent | Result |
|---|---|
| AE Detection | Flagged |

### Output

Badge: `AE CAPTURED & APPROVED`

Patient receives supportive response. Adverse event auto-captured, PV case created, safety team notified, 15-day timer active. Zero manual effort.


## Enterprise integration

**Systems of record**

- Patient support programme systems
- Approved patient education content
- Pharmacovigilance intake

**Data domains**

- Patient support enrolment
- Approved patient content
- Adverse event intake

**Scaling behaviour**

Sessions are long-lived and stateful. Persist journey state server-side rather than reconstructing context each turn.

**Residency & access constraints**

Handles the most sensitive data in the platform. PHI minimisation, explicit consent, and an AE reporting path are mandatory.


## Recreating this agent

Add the specification below to `BUSINESS_AGENTS` in `poc/src/agents-data.js`. The ecosystem view, architecture counts, persona filters, and governance mappings all derive from it — no UI code changes are required.

```js
{
  id: "patient-nav",
  name: "Patient Navigator",
  icon: "heart-handshake",
  desc: "Guides patients through treatment journeys, connects to support programs, and monitors adherence milestones",
  users: ["Patients","HCPs"],
  compliancePartners: ["privacy","ae-detect","fair-balance"],
  hubDependency: [],
  status: "active"
}
```

Then, optionally, add an `AGENT_DEMOS["patient-nav"]` entry with `input` → `processing` → `draft` → `compliance` → `output` steps to give the agent a runnable demo, and record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`. Finally re-run `npm run docs:agents`.

