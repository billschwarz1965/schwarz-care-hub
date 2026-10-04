# MedVerse demo journeys and scripts

Standalone HTML pages built from the POC demo code in `poc/src/` (the `run-demo` handlers in `concierge-app.js`, `patient-app.js`, `msl-copilot-app.js` and `medical-app.js`) and from `poc/user-journeys.html`. Open any file directly in a browser.

| File | What it shows |
|------|---------------|
| `MedVerse-Demo-Journeys.html` | End-to-end journey diagram for each persona (HCP, Patient, MSL, Medical Affairs): need, agent, output or hand-off |
| `MedVerse-Demo-Scripts.html` | Narrated demo script for each persona, scene by scene, with the use case, inputs and narration |
| `HCP-Demo-Scripts.html` | HCP-only version of the scripts, plus suggested demo questions and the Orion deck use cases |
| `HCP-Concierge-Journey.html` | The 12-agent HCP journey as listed on `poc/user-journeys.html` |

The one-line use cases on each scene are summaries, not text from the demo code. If a demo script in `poc/src/` changes, regenerate these pages.
