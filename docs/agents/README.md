# MedVerse Agent Specifications

> Generated from `poc/src/agents-data.js` and `poc/tools/agent-enterprise-bindings.js`.
> Regenerate with `npm run docs:agents` from the `poc/` directory.

One document per agent, covering purpose, audiences, data dependencies, governance pairings, a reference interaction, enterprise integration, and the specification needed to recreate it.

## How MedVerse agents are defined

An agent is a **declaration, not a codebase**. Each one is an object in `agents-data.js` naming its audiences, the intelligence hubs it reads, and the governance agents that supervise it. The application derives everything else — the ecosystem grid, architecture layer counts, persona filtering, hub dependency graphs, and governance mappings — from those declarations.

That is what makes the ecosystem scalable: adding an agent is adding a specification. To add one:

1. Add the specification object to the appropriate array in `poc/src/agents-data.js`
2. Point `hubDependency` at the hubs it reads, and `compliancePartners` at its governance agents
3. Optionally add an `AGENT_DEMOS` entry to give it a runnable reference interaction
4. Record its enterprise bindings in `poc/tools/agent-enterprise-bindings.js`
5. Run `npm run docs:agents` to regenerate this documentation

All editions of the application — `poc/`, `poc-external/`, and `poc-agents/` — share `poc/src`, so a new agent appears in every edition at once.

## Layer summary

| Layer | Count |
|---|---|
| 2 — Agent Orchestration (business agents) | 16 |
| 3 — Intelligence Hubs | 2 |
| 4 — Governance | 12 |
| Governance pairings | 45 |
| Connected data sources | 8 |

## 2 — Agent Orchestration Layer

| Agent | Purpose | Reference interaction | Enterprise binding |
|---|---|---|---|
| [MSL Copilot](msl-copilot.md) | Prepares pre-call briefings, real-time scientific guidance, and post-call documentation for MSL field teams | yes | yes |
| [KOL Relationship Agent](kol-agent.md) | Identifies emerging KOLs, tracks influence growth, monitors publication acceleration and conference visibility | yes | yes |
| [Advisory Board Builder](advisory-board.md) | Creates optimal advisory boards based on topic, geography, expertise diversity, and engagement levels. | yes | yes |
| [Literature Scout](literature-scout.md) | Searches, synthesizes, and monitors scientific publications across PubMed, internal databases, and congress libraries | yes | yes |
| [Insights Agent](insights-agent.md) | Analyzes HCP engagement patterns, content performance, and behavioral signals to surface actionable medical insights | yes | yes |
| [Clinical Trial Intelligence](trial-intel.md) | Identifies investigators with enrollment track records, matches sites to protocols, and monitors trial landscape by therapeutic area | yes | yes |
| [Congress Planning Agent](congress-planning.md) | Before major congresses: who to meet, who is presenting, who is publishing, who is increasing visibility in target disease areas | yes | yes |
| [Expert Segmentation Agent](expert-segment.md) | Automatically classifies experts into tiers: Global Thought Leader, National KOL, Rising Star, Community Influencer, Clinical Trialist, Digital Influencer | yes | yes |
| [Medical Strategy Advisor](strategy-advisor.md) | Synthesizes cross-TA intelligence, competitive landscape, and pipeline data to inform medical strategy decisions | yes | yes |
| [Gap-to-Expert Agent](gap-expert.md) | When evidence gaps are identified, automatically finds experts who publish, treat, or might collaborate in that area | yes | yes |
| [Patient Navigator](patient-nav.md) | Guides patients through treatment journeys, connects to support programs, and monitors adherence milestones | yes | yes |
| [Trial Matching Agent](trial-match.md) | Matches patient profiles to active clinical trials based on eligibility criteria, geography, and disease stage | yes | yes |
| [MSL Connect](msl-connect.md) | Helps HCPs identify their assigned MSL(s) by therapeutic area, territory, and institution. | yes | yes |
| [Ingredient Safety Agent](ingredient-safety.md) | AI-powered excipient and ingredient intelligence. | yes | yes |
| [Temperature Stability Agent](temp-stability.md) | Assesses product viability after temperature excursions for insulins and vaccines. | yes | yes |
| [Disease State Navigator Agent](disease-navigator.md) | Maps disease biology to treatment landscape across therapeutic areas. | yes | yes |

## 3 — Intelligence Hub Layer

| Agent | Purpose | Reference interaction | Enterprise binding |
|---|---|---|---|
| [Expert Intelligence Hub](hcp-explorer.md) | The foundational expert knowledge graph — single source of truth for all HCP and KOL intelligence. | yes | yes |
| [Literature Intelligence](literature-intel.md) | Indexes, synthesizes, and monitors the global scientific literature. | — | yes |

## 4 — Governance Layer

| Agent | Purpose | Reference interaction | Enterprise binding |
|---|---|---|---|
| [MLR Review](mlr.md) | Reviews content for on-label language, promotional risk, claim substantiation, and fair balance | yes | yes |
| [Scientific Verification](sci-verify.md) | Validates every claim against labels, core data sheets, publications, and approved content | — | yes |
| [Promotional Risk](promo-risk.md) | Detects promotional language patterns: 'best treatment', 'superior efficacy', 'guaranteed benefit' | — | yes |
| [AE Detection](ae-detect.md) | Monitors all interactions for adverse event signals, auto-creates pharmacovigilance cases | — | yes |
| [PHI Protection](privacy.md) | Identifies and redacts protected health information, masks identifiers, controls access | — | yes |
| [Audit Trail](audit.md) | Creates immutable compliance records — who asked, what was generated, which checks ran | — | yes |
| [Off-Label Monitor](off-label.md) | Real-time detection of off-label discussions, routes to approved reactive responses | — | yes |
| [Fair Balance](fair-balance.md) | Ensures safety context accompanies efficacy claims, checks for appropriate risk language | — | yes |
| [Content Expiration](expiration.md) | Monitors label updates, retires outdated content, re-indexes approved materials | — | yes |
| [AI Explainability](explainability.md) | Provides transparency — why an answer was generated, supporting sources, confidence level | — | yes |
| [Field Activity Risk](field-risk.md) | Analyzes MSL interactions and inquiry trends to detect compliance risks before audits | — | yes |
| [Inspection Readiness](inspection.md) | Continuously prepares documentation, logs, evidence packages for regulatory inspections | — | yes |

