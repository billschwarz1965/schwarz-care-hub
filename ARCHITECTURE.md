# MedVerse Operating System — Architecture

## Executive summary

The MedVerse OS is a **four-layer intelligence model** that separates authoritative facts, registered sources, operational execution, and AI context. Each layer has a clear owner and update path so strategy, meeting notes, cost plans, and governance do not drift or duplicate.

---

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│  L4 — AI CONTEXT          ai-context/                       │
│  Bootstrap, personas, paste-ready bundles for assistants    │
└───────────────────────────────┬─────────────────────────────┘
                                │ derived from
┌───────────────────────────────▼─────────────────────────────┐
│  L3 — KNOWLEDGE BASE      knowledge-base/                   │
│  MedVerse_Operating_System.csv (authoritative facts)        │
└───────────────────────────────┬─────────────────────────────┘
                                │ fed by
┌───────────────────────────────▼─────────────────────────────┐
│  L2 — SOURCE REGISTRY     sources/registry.md               │
│  Index of strategies, notes, financials, SharePoint links   │
└───────────────────────────────┬─────────────────────────────┘
                                │ populated via
┌───────────────────────────────▼─────────────────────────────┐
│  L1 — INTAKE              intake/inbox → processed          │
│  New intelligence enters here before registration           │
└─────────────────────────────────────────────────────────────┘

        OPERATIONAL (parallel, not duplicated)
┌─────────────────────────────────────────────────────────────┐
│  MedVerse Hub + workstream portals — live actions, meetings │
│  ../Meeting Notes and Agendas/Notes/MedVerse Hub/           │
└─────────────────────────────────────────────────────────────┘
```

---

## Authority rules

| Question | Authoritative source |
|----------|---------------------|
| Who leads MedVerse? Roadmap dates? Risks? | `knowledge-base/MedVerse_Operating_System.csv` |
| Where is the business case / budget detail? | `sources/registry.md` → PMO / SharePoint paths |
| What did the July workshop decide? | Registry → workshop HTML + Day 1/2 notes |
| What actions are in flight for ADVENT? | MedVerse Hub → ADVENT workstream portal |
| What can AI assume as true? | OS CSV + bootstrap; never invent beyond registered sources |
| Governance / MLR / compliance? | Registry → Governance SharePoint links + bootstrap guardrails |

When sources conflict, **update the OS CSV** after human review — do not let AI context files diverge as separate truths.

---

## Intelligence categories

| Category | Typical content | Primary location |
|----------|-----------------|------------------|
| **Strategy** | Vision, positioning, four pillars, ecosystem model | OS CSV + `strategies/` + P+ reports |
| **Meeting intelligence** | Workshops, sprint reviews, steering updates | `meeting-intelligence/` (indexed) |
| **Financials** | FY budget, vendor costs, RIDES savings | `financials/` + PMO |
| **Governance** | DAI, MLR, scientific engagement principles | `governance/` + SharePoint |
| **Requirements** | BRD, migration scope, site inventory | Business Requirements (links) |
| **Research** | HCP knowledge, SEO/GEO/AEO benchmarks | Research & Benchmarking (links) |
| **Workstreams** | Actions, decisions, parking lot per stream | Workstream portals |

---

## Intake → register → knowledge base flow

1. **Capture** — Drop raw file or note in `intake/inbox/` (or create directly in the right folder).
2. **Classify** — Strategy | Meeting | Financial | Governance | Research | Workstream.
3. **Register** — Add row to `sources/registry.md` with path, date, owner, summary.
4. **Extract** — Pull durable facts (decisions, dates, risks) into OS CSV if authoritative.
5. **Derive** — Refresh AI bootstrap snapshot when material change (optional quarterly).
6. **Archive** — Move processed intake to `intake/processed/YYYY-MM/`.

---

## What does not belong in this repo

- Live HTML portals (stay in MedVerse Hub — link only)
- Large binaries (video, full decks) — register path, store in SharePoint/OneDrive
- Credentials, `.env`, personal data
- Duplicate copies of every meeting note — **index and link** unless it is a canonical synthesis

---

## Evolution

| Phase | Focus |
|-------|-------|
| **Now** | CSV authority + source registry + intake discipline |
| **Next** | Automated registry from folder watchers; OS CSV validation script |
| **Future** | Structured JSON export for MedVerse AI orchestration layer |

Owner: Bill Schwarz · Review cadence: monthly (or after major workshop / steering)
