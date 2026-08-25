# MedVerse POC — External Edition

An external-stakeholder build of the MedVerse POC, for demos to healthcare
professionals, patients and caregivers, partners, and advocacy groups.

## What's different from `../poc`

**Excluded modules** — MSL Copilot, Medical Concierge, Interaction Signals, and
Power Agents. These are internal Sanofi field-medical and administration tools;
the Interaction Signals dashboard in particular shows engagement signals against
named HCPs.

**Included modules** — HCP Concierge, Patient Concierge, Disease State Navigator,
Literature Intelligence, Congress Intelligence, Agent Ecosystem, plus Demo and About.

**Rewritten framing** — the home page, demo page, and about page are written for an
audience outside Sanofi: cited answers, plain-language explanations, and "who this
is for" rather than "how our field teams use it".

## Shared code

There is no `src/` directory here. Every page references `/src/...`, which
`vite.config.js` aliases to `../poc/src` — so both builds run on one copy of the
application logic and a bug fixed in either place is fixed in both.

The tradeoff: the HTML pages **are** copies. A change to a shared page in `../poc`
(e.g. `concierge.html`) does not propagate here. Re-copy the page and re-apply the
nav block if you change one.

## Running

```
npm install
npm run dev      # http://localhost:5182
npm run build    # -> dist/
```

Both editions can run at once — `../poc` uses port 5180, this uses 5182.

## Notes

- Interaction signals are still emitted in the background by the concierge modules
  (`broadcastSignal` in `../poc/src/orion-bridge.js` — filename unchanged — writes
  to `localStorage`). There is simply no page here that displays them. The demo
  page's "Interaction Signals" card describes them as being incorporated into
  other data used for medical insights and analytics — **have legal and privacy
  review that wording before showing it externally.**
- The `medical.html` / `msl-copilot.html` entries in the shared
  `chatPages` allowlist in `../poc/src/enhancements.js` are inert here, since
  neither page exists in this build.
