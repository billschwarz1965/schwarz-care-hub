# MedVerse POC — Patient Concierge (standalone)

A standalone build containing only the Patient Concierge module, for
conversations where the patient/caregiver experience is the subject on its own.

## Pages

- `index.html` — Patient Concierge itself (medications, symptom checker,
  treatment explorer, clinical trial finder, insurance & access, appointment
  prep, side effect tracker, condition library, caregiver resources, wellness
  journal, plus a runnable demo)
- `about.html` — rewritten for this build: what the module does, the agent
  inventory, and a short note that a wider MedVerse platform exists beyond
  this build

The nav is two tabs. There are no links out to other modules — the one
cross-module reference (Trial Matching Agent, which lives in HCP Concierge)
is shown as a non-interactive card noting it's part of the full platform.

## Shared code

There is no `src/` directory. Both pages reference `/src/...`, which
`vite.config.js` aliases to `../poc/src` — the same arrangement `poc-agents/`
and `poc-external/` use. All editions run on one copy of the application
logic, so a change to `patient-app.js` appears here automatically.

## Running

```
npm install
npm run dev      # http://localhost:5185
npm run build    # -> dist/
```

Ports are distinct across editions: `poc` 5180, `poc-external` 5182,
`poc-agents` 5183, `poc-internal` 5184, `poc-patient` 5185 — all five can
run at once.
