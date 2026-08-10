#!/bin/bash
# MedVerse Scientific Intelligence Ecosystem — Mac/Linux Launcher
# No installation required. Python 3 is pre-installed on macOS.

PORT=8080
DIR="$(cd "$(dirname "$0")/www" && pwd)"

# Check if port is in use
if lsof -i :$PORT >/dev/null 2>&1; then
    PORT=8081
    echo "  Port 8080 in use, trying $PORT..."
fi

echo ""
echo "  ========================================"
echo "    MedVerse Scientific Intelligence"
echo "    Ecosystem — POC v0.4"
echo "  ========================================"
echo ""
echo "    Running at: http://localhost:$PORT"
echo ""
echo "    Press Ctrl+C to stop the server"
echo ""

# Open browser after a short delay
(sleep 1 && open "http://localhost:$PORT" 2>/dev/null || xdg-open "http://localhost:$PORT" 2>/dev/null) &

# Start Python HTTP server
cd "$DIR"
python3 -m http.server $PORT 2>/dev/null || python -m http.server $PORT
