# MedVerse POC — Internal Edition

An internal-audience build of the MedVerse POC, for MSL field teams and Medical
Affairs — the two personas that generate and act on interaction signals.

## What's different from `../poc`

**Included modules** — MSL Copilot, Medical Concierge, Interaction Signals (full
dashboard: queue, timeline, disease-area coverage, live feed), Disease State
Navigator, Literature Intelligence, Congress Intelligence, Agent Ecosystem, plus
Demo and About.

**Excluded modules** — HCP Concierge, Patient Concierge, and Power Agents. The
two concierges are external-facing (see `../poc-external`); Power Agents is a
launcher for modules that are either already in this build's own nav
(Interaction Signals, Disease, Literature, Congress, Agent Ecosystem) or
excluded, so it has nothing to add here.

Unlike `../poc-external`, this edition keeps the **full** Interaction Signals
dashboard — the same one that ships in `../poc`, with no fields hidden. That is
the point of the internal edition: MSL and Medical Affairs are the audience the
signal system exists for.

## Shared code

There is no `src/` directory here. Every page references `/src/...`, which
`vite.config.js` aliases to `../poc/src` — so all three editions
(`poc`, `poc-external`, `poc-internal`) run on one copy of the application logic.
An agent added to `poc/src/agents-data.js` appears here automatically.

The tradeoff: the HTML pages are copies. A change to a shared page in `../poc`
does not propagate here — re-copy the page and re-apply the nav block.

## Running

```
npm install
npm run dev      # http://localhost:5184
npm run build    # -> dist/
```

Ports are distinct across all editions — `poc` 5180, `poc-external` 5182,
`poc-agents` 5183, `poc-internal` 5184 — so any combination can run at once.
