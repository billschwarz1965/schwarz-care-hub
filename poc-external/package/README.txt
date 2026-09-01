===========================================================
  MedVerse Scientific Intelligence Ecosystem
  External Edition - POC v0.1.0
===========================================================

This is a self-contained, portable build for demos to
healthcare professionals, patients and caregivers, partners,
and advocacy groups outside Sanofi. It does not include the
internal MSL Copilot, Medical Concierge, or Power Agents
modules.

WINDOWS INSTALLATION
--------------------
1. Unzip the package to any folder
2. Double-click "Start-MedVerse-External.bat"
3. Your browser will open automatically to http://localhost:8082
4. To stop: close the terminal window or press Ctrl+C

SHAREPOINT / ONE-CLICK LINK SETUP (Windows):
   1. Run "Install-MedVerse-External.bat" once (no admin required)
   2. Create a link on SharePoint pointing to: medverse-external://launch
   3. Clicking the link opens MedVerse External automatically

REQUIREMENTS (Windows):
   - Windows 10 or 11 (PowerShell is built in)
   - No additional software needed

MAC / LINUX INSTALLATION
-------------------------
1. Unzip the package to any folder
2. Open Terminal:
   - Press Cmd+Space, type "Terminal", hit Enter
3. Navigate to the folder and run:

       cd ~/Desktop/MedVerse-External   (adjust path to where you unzipped)
       chmod +x start-medverse-external.sh
       ./start-medverse-external.sh

4. Your browser will open automatically to http://localhost:8082
5. To stop: press Ctrl+C in the Terminal window

ALTERNATIVE (no Terminal needed):
   - Open the "www" folder inside the package
   - Right-click "index.html" -> Open With -> Chrome or Safari
   - Note: PubMed and ClinicalTrials.gov live search
     won't work without the server (CORS restrictions)

REQUIREMENTS (Mac):
   - macOS 10.15 or later
   - Python 3 (pre-installed on macOS)
   - No additional software needed


MODULES (8 pages)
------------------
- Home - Entry point, module directory and Ask MedVerse bar
- Ask MedVerse - Unified natural-language search bar
- HCP Concierge - Clinical decision support for healthcare professionals
- Disease State Navigator - Cross-TA disease landscape
- Literature Intelligence - Live PubMed search
- Congress Intelligence - Medical congress coverage
- Demo - Narrated walkthrough
- About - Platform overview and release notes

RELEASE NOTES
-------------
v0.1.0 - August 2026
  Initial external release: HCP Concierge, Disease State Navigator,
  Literature Intelligence, and Congress Intelligence, plus narrated
  demos and the Ask MedVerse search bar.

NOTES
-----
- This is a self-contained demo. All data is simulated.
- PubMed and ClinicalTrials.gov live search require internet
  AND the local server running (for CORS proxy).
- Best viewed in Chrome or Edge.

CONTACT
-------
Bill Schwarz - bill.schwarz@sanofi.com
