# MedVerse Scientific Intelligence Ecosystem — Release Notes
## POC v0.4.0 – v0.4.6 | August 2026

| Metric | Value |
|--------|-------|
| Pages | 11 |
| AI Agents | 53 |
| Lines of Code | 20,881 |
| Commits | 28 |

---

### v0.4.6 — Voice Search Demo Integration
- Voice search added as the first demo step on all 4 module pages
- Simulated mic animation with character-by-character typing and auto-route to matching agent
- Updated agent counts: MSL 15, Medical 14, HCP 12, Patient 12

### v0.4.5 — Voice Search & Searchable Dropdowns
- Voice search mic buttons on all search inputs (Web Speech API)
- Dropdown selects with 4+ options replaced by searchable/filterable wrappers
- Shared enhancements layer (enhancements.js/css) loaded on all pages

### v0.4.4 — Mac Support & Build Economics
- Mac portable launcher (Python 3 HTTP server, auto-opens browser)
- Interactive build economics dashboard (standalone HTML)
- Updated README with Mac/Windows/Electron install instructions

### v0.4.3 — Demo Narration Alignment
- Updated all 4 demo scripts with Trial Matching Agent steps
- HCP Concierge demo includes chat assistant interaction
- Acronyms spoken as letters for natural TTS (H-C-P, M-S-L, K-O-L)

### v0.4.2 — Chat Widget & Trial Matching
- HCP Concierge chat assistant widget with medical Q&A
- Trial Matching Agent card on MSL Copilot, Medical, and Patient pages
- Chat widget system with module-specific configuration

### v0.4.1 — Rebrand & Dark Mode
- Renamed to MedVerse Scientific Intelligence Ecosystem
- Light/dark mode toggle on all pages (shared localStorage)
- Master Demo page with Play All mode and one-click narrated walkthroughs
- Fixed narrator pacing and voice quality

### v0.4.0 — Power Agents & Desktop App
- Power Agents hub (renamed from System Tools) with platform diagnostics
- AI chat assistant sidebars on all module pages
- Narrated demo sequences with Web Speech API synthesis and closed captions
- Electron desktop app — Windows portable edition (no install required)

---

## Modules (11 pages)

| Module | Agents | Description |
|--------|--------|-------------|
| MSL Copilot | 15 | Field engagement hub for MSLs |
| Medical Concierge | 14 | Medical affairs hub |
| HCP Concierge | 12 | Clinical hub for HCPs |
| Patient Concierge | 12 | Patient health companion |
| Orion Signal Intelligence | — | Real-time HCP engagement signals |
| Disease State Navigator | — | Cross-TA disease landscape |
| Literature Intelligence | — | Live PubMed search |
| Congress Intelligence | — | Medical congress coverage |
| Agent Ecosystem | — | AI agent architecture + demos |
| Power Agents | — | Platform config & diagnostics |
| Demo | — | Master demo page with Play All |

## Platform & Distribution
- **Web:** Vite-built SPA, deployable to Azure Static Web Apps
- **Windows Desktop:** Electron portable app (no admin, no install)
- **Mac/Linux:** Python 3 HTTP server with auto-launch script
- **SharePoint:** Custom protocol handler for one-click launch (medverse://launch)

## Key Capabilities
- Voice search on all inputs — Web Speech API with mic animation and auto-submit
- Searchable/filterable dropdowns replacing native selects
- Light/dark mode with system preference detection
- Narrated demos with TTS, closed captions, and demo navigation overlay
- Chat assistants with module-specific Q&A and suggested prompts
- Live PubMed and ClinicalTrials.gov search (with CORS proxy)
- Orion signal generation from cross-module interactions

---

*Bill Schwarz — bill.schwarz@sanofi.com*
