# MedVerse POC — Agent Ecosystem (standalone)

A standalone build containing only the Agent Ecosystem module, for architecture
and governance conversations where the concierge experiences are not the subject.

## Pages

- `index.html` — the Agent Ecosystem itself (four-layer architecture, agent
  inventory, hub explorer, governance layer, runnable agent demos, Ecosystem AI
  chat, live ClinicalTrials.gov search)
- `about.html` — rewritten for this build: what the module does, the four layers,
  compliance by design, how agents scale onto enterprise data, and a short note
  that a wider MedVerse platform exists beyond this build

The nav is two tabs. There are no links out to other modules.

Note the Agent Ecosystem page is served as `index.html` rather than
`agents.html` — it is the app here, not one module among many, so it lands
directly with no redirect.

## Shared code

There is no `src/` directory. Both pages reference `/src/...`, which
`vite.config.js` aliases to `../poc/src` — the same arrangement `poc-external/`
uses. All three editions run on one copy of the application logic, so an agent
added to `poc/src/agents-data.js` appears here automatically.

## Running

```
npm install
npm run dev      # http://localhost:5183
npm run build    # -> dist/
```

Ports are distinct across editions: `poc` 5180, `poc-external` 5182,
`poc-agents` 5183 — all three can run at once.

## Agent documentation

Written specifications for every agent live in [`../docs/agents/`](../docs/agents/),
generated from the same `agents-data.js` this build reads. Regenerate with
`npm run docs:agents` from the `poc/` directory after adding or changing an agent.
