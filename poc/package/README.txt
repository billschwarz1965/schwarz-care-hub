===========================================================
  MedVerse Scientific Intelligence Ecosystem — POC v0.4
===========================================================

HOW TO RUN
----------
1. Double-click "Start-MedVerse.bat"
2. Your browser will open automatically to http://localhost:8080
3. To stop: close the terminal window or press Ctrl+C

SHAREPOINT / ONE-CLICK LINK SETUP
----------------------------------
To launch MedVerse from a SharePoint page, Teams message, or email:

1. Run "Install-MedVerse.bat" once (no admin required)
   — This registers the medverse:// URL protocol on your machine

2. Create a link on SharePoint (or anywhere) pointing to:

       medverse://launch

3. Clicking the link opens MedVerse automatically

NOTE: Each user needs their own copy of the package folder
and must run the installer once. The link works from any
browser, SharePoint page, Teams chat, or Outlook email.

REQUIREMENTS
------------
- Windows 10 or 11 (PowerShell is built in)
- No additional software needed

MODULES (10 pages)
------------------
- MSL Copilot — 12-agent field engagement hub for Medical Science Liaisons
- Medical Concierge — 11-agent medical affairs hub
- HCP Concierge — 9-agent clinical hub for healthcare professionals
- Patient Concierge — 10-agent health companion for patients and caregivers
- Orion Signal Intelligence — Real-time HCP engagement signals with cross-module feed
- Disease State Navigator — Cross-TA disease landscape
- Literature Intelligence — Scientific publication search (live PubMed)
- Congress Intelligence — Medical congress coverage with poster overviews
- Agent Ecosystem — AI agent architecture overview with interactive demos
- Power Agents — Platform configuration and diagnostics

WHAT'S NEW IN v0.3
-------------------
- Medical Concierge page with 11 agents including Congress Intelligence
- Patient Concierge page with 10 patient-focused agents
- Interactive demos on all module pages (click "Run Demo" on each hub)
- SharePoint URL protocol launcher (Install-MedVerse.bat)
- Cross-module Orion signal broadcasting — actions in any module generate
  real-time signals on the Orion dashboard via localStorage bridge
- Congress deep linking — poster overview links from concierge pages to
  full congress coverage with hash-based navigation
- UI modernization across all pages:
  - Glassmorphism header and nav with backdrop blur
  - Refined card design with layered shadows and hover lift
  - Gradient accent bars on hub and stat cards
  - Frosted-glass modal overlays
  - Custom scrollbar styling
  - Dark mode shadow and glass variable support
  - Responsive grid breakpoints for stats and card layouts
- Shared enhancement layer (dark mode, toasts, animations) on all pages

NOTES
-----
- This is a self-contained demo. All data is simulated.
- PubMed and ClinicalTrials.gov live search require internet.
- Best viewed in Chrome or Edge.

CONTACT
-------
Bill Schwarz — bill.schwarz@sanofi.com
