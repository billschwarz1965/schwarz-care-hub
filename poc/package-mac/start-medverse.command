#!/bin/bash
# ═══════════════════════════════════════════════════════════
#   MedVerse Scientific Intelligence Ecosystem
#   Mac Launcher — Double-click this file to start
# ═══════════════════════════════════════════════════════════

# Move to the folder this script lives in
cd "$(dirname "$0")"

PORT=8080
DIR="$(pwd)/www"

# Verify www folder exists
if [ ! -d "$DIR" ]; then
    echo ""
    echo "  ERROR: Cannot find the 'www' folder."
    echo "  Make sure start-medverse.command and the www folder"
    echo "  are in the same directory."
    echo ""
    read -p "  Press Enter to close..."
    exit 1
fi

# Check if port is in use, try alternatives
for P in 8080 8081 8082 3000; do
    if ! lsof -i :$P >/dev/null 2>&1; then
        PORT=$P
        break
    fi
done

clear
echo ""
echo "  ┌────────────────────────────────────────────┐"
echo "  │                                            │"
echo "  │   MedVerse Scientific Intelligence         │"
echo "  │   Ecosystem — POC v0.4                     │"
echo "  │                                            │"
echo "  │   Sanofi · Digital Product Innovation       │"
echo "  │                                            │"
echo "  └────────────────────────────────────────────┘"
echo ""
echo "  ✓ Server running at: http://localhost:$PORT"
echo ""
echo "  Your browser will open automatically."
echo "  To stop the server, close this Terminal window"
echo "  or press Control + C."
echo ""
echo "  ────────────────────────────────────────────────"
echo ""

# Open browser after a short delay
(sleep 1.5 && open "http://localhost:$PORT") &

# Start Python HTTP server
cd "$DIR"
python3 -m http.server $PORT 2>/dev/null || python -m http.server $PORT 2>/dev/null

# If Python isn't available
echo ""
echo "  ERROR: Python 3 is required but was not found."
echo "  macOS 12.3+ removed the built-in Python 2."
echo ""
echo "  To install Python 3:"
echo "    1. Open Safari and go to python.org/downloads"
echo "    2. Download and install the latest Python 3"
echo "    3. Restart your Mac"
echo "    4. Double-click this file again"
echo ""
read -p "  Press Enter to close..."
