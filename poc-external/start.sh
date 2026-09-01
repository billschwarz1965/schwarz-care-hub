#!/bin/bash
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "Installing dependencies (first run only)..."
  npm install
fi

echo ""
echo "  MedVerse Scientific Intelligence - External Edition"
echo "  http://localhost:5182"
echo ""
echo "  Press Ctrl+C to stop the server."
echo ""

(sleep 2 && (open "http://localhost:5182" 2>/dev/null || xdg-open "http://localhost:5182" 2>/dev/null)) &

npm run dev
