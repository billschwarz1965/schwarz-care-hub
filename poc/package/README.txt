===========================================================
  MedVerse Scientific Intelligence Ecosystem — POC v0.4
===========================================================

MAC INSTALLATION
----------------
1. Unzip MedVerse-Mac-Portable-v0.4.zip to any folder
   (Desktop, Documents, Downloads — anywhere you like)

2. Open Terminal:
   - Press Cmd+Space, type "Terminal", hit Enter

3. Navigate to the folder and run:

       cd ~/Desktop/MedVerse    (adjust path to where you unzipped)
       chmod +x start-medverse.sh
       ./start-medverse.sh

4. Your browser will open automatically to http://localhost:8080

5. To stop: press Ctrl+C in the Terminal window

ALTERNATIVE (no Terminal needed):
   - Open the "www" folder inside the package
   - Right-click "index.html" → Open With → Chrome or Safari
   - Note: PubMed and ClinicalTrials.gov live search
     won't work without the server (CORS restrictions)

REQUIREMENTS (Mac):
   - macOS 10.15 or later
   - Python 3 (pre-installed on macOS)
   - No additional software needed


WINDOWS INSTALLATION
--------------------
1. Unzip the package to any folder
2. Double-click "Start-MedVerse.bat"
3. Your browser will open automatically to http://localhost:8080
4. To stop: close the terminal window or press Ctrl+C

SHAREPOINT / ONE-CLICK LINK SETUP (Windows):
   1. Run "Install-MedVerse.bat" once (no admin required)
   2. Create a link on SharePoint pointing to: medverse://launch
   3. Clicking the link opens MedVerse automatically

REQUIREMENTS (Windows):
   - Windows 10 or 11 (PowerShell is built in)
   - No additional software needed


WINDOWS DESKTOP APP (Electron)
------------------------------
For the native desktop experience, use the Windows portable
edition (MedVerse-Portable-v0.4.zip) instead:
   1. Extract the folder
   2. Double-click "Launch MedVerse.bat" or
      "MedVerse Operating System.exe"
   No installation required. No admin rights needed.


MODULES (11 pages)
------------------
- MSL Copilot — 14-agent field engagement hub for MSLs
- Medical Concierge — 13-agent medical affairs hub
- HCP Concierge — 11-agent clinical hub for HCPs
- Patient Concierge — 11-agent health companion
- Orion Signal Intelligence — Real-time HCP engagement signals
- Disease State Navigator — Cross-TA disease landscape
- Literature Intelligence — Scientific publication search (live PubMed)
- Congress Intelligence — Medical congress coverage
- Agent Ecosystem — AI agent architecture with interactive demos
- Power Agents — Platform configuration and diagnostics
- Demo — Master demo page with Play All mode

WHAT'S NEW IN v0.4
-------------------
- Trial Matching Agent on MSL Copilot, Medical, and Patient pages
- HCP Concierge chat assistant widget
- Light/dark mode toggle on all pages
- Master Demo page with one-click Play All
- Narrated demos updated with natural TTS (acronyms spoken as letters)
- Electron desktop app (Windows portable edition)
- Renamed to MedVerse Scientific Intelligence Ecosystem

NOTES
-----
- This is a self-contained demo. All data is simulated.
- PubMed and ClinicalTrials.gov live search require internet
  AND the local server running (for CORS proxy).
- Best viewed in Chrome or Edge.

CONTACT
-------
Bill Schwarz — bill.schwarz@sanofi.com
