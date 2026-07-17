# MedVerse Operating System

**Authoritative knowledge repository** for MedVerse platform strategy, governance, financials, meeting intelligence, and AI-ready context — built from many sources into one operating model.

| | |
|---|---|
| **Owner** | Bill Schwarz — Product Line Owner, MedVerse Digital Lead |
| **Status** | Active — July 2026 |
| **Canonical knowledge base** | [`knowledge-base/MedVerse_Operating_System.csv`](knowledge-base/MedVerse_Operating_System.csv) |

---

## What this repository is

The **MedVerse Operating System (OS)** is not the live platform code or the workstream portals. It is the **structured intelligence layer** that:

- Consolidates strategy, decisions, risks, roadmap, and cost context
- Registers where authoritative artifacts live (SharePoint, PMO, workshops, research)
- Feeds AI assistants with governed, current MedVerse context
- Connects to operational tools (MedVerse Hub, workstream portals) without duplicating them

Think of it as **orchestration over fragmentation** — one place to orient humans and AI before acting.

---

## Repository map

| Folder | Purpose |
|--------|---------|
| [`knowledge-base/`](knowledge-base/) | **Single source of truth** — structured OS CSV (leadership, financials, roadmap, risks, governance) |
| [`ai-context/`](ai-context/) | Bootstrap and persona files for Claude, Copilot, Cursor, and other AI tools |
| [`sources/`](sources/) | **Master registry** of all intelligence sources and where they live |
| [`strategies/`](strategies/) | Strategy memos, positioning, business case narratives |
| [`meeting-intelligence/`](meeting-intelligence/) | Workshop notes, sprint reviews, decision logs (indexed, not duplicated) |
| [`financials/`](financials/) | Budget summaries, cost plans, vendor/SOW references |
| [`governance/`](governance/) | DAI model, compliance anchors, SharePoint governance links |
| [`workstreams/`](workstreams/) | Links to live workstream portals under MedVerse Hub |
| [`intake/`](intake/) | Drop zone for new intelligence → process → register → update KB |
| [`templates/`](templates/) | Standard formats for adding intelligence to the OS |

---

## Related operational tools (link, do not copy)

| Tool | Location |
|------|----------|
| **MedVerse Platform Hub** | `../Meeting Notes and Agendas/Notes/MedVerse Hub/` |
| **Workstream portals** | `../Meeting Notes and Agendas/Notes/* Workstream/` |
| **July 2026 ADVENT workshop summary** | `../Meeting Notes and Agendas/Notes/MedVerse_Advent_Workshop_2Day_Consolidated_Summary_July_2026.html` |
| **PMO status (P+)** | `../PMO/` |
| **Business requirements** | `../Business Requirements/` (SharePoint links) |

---

## How to use

### For humans

1. Start with [`knowledge-base/MedVerse_Operating_System.csv`](knowledge-base/MedVerse_Operating_System.csv) for current state.
2. Check [`sources/registry.md`](sources/registry.md) for the full intelligence map.
3. Use [`intake/README.md`](intake/README.md) when adding new material.

### For AI (Cursor, Claude, Copilot)

1. Load [`ai-context/bootstrap/MedVerse_AI_Bootstrap_v1.3.3_04_FEB_2026.md`](ai-context/bootstrap/MedVerse_AI_Bootstrap_v1.3.3_04_FEB_2026.md) for minimal context.
2. Reference the OS CSV for authoritative facts.
3. Follow persona files in [`ai-context/personas/`](ai-context/personas/) for tone and guardrails.

### Updating the OS

| Change type | Action |
|-------------|--------|
| **Fact / decision / risk / roadmap** | Edit `knowledge-base/MedVerse_Operating_System.csv` → bump *Last Updated* |
| **New document or source** | Add to `intake/inbox/` → process → register in `sources/registry.md` |
| **Workstream operational data** | Update portal `portal-data.json` + MedVerse Hub — not this repo |

---

## Architecture

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the full model: layers, authority rules, and how intelligence flows from intake to AI context.

---

## Git

This folder is intended as a **standalone git repository** (or submodule within Campus+ Discovery). Initialize with:

```powershell
cd "MedVerse Operating System"
git init
git add .
git commit -m "Initial MedVerse Operating System repository"
```

Push to your enterprise Git remote when ready (Azure DevOps, GitHub Enterprise, etc.).
