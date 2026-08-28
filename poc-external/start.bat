@echo off
title MedVerse - External Edition
cd /d "%~dp0"

if not exist node_modules (
    echo Installing dependencies (first run only)...
    call npm install
)

echo.
echo   MedVerse Scientific Intelligence - External Edition
echo   http://localhost:5182
echo.
echo   Press Ctrl+C to stop the server.
echo.

start "" cmd /c "timeout /t 3 >nul & start http://localhost:5182"
call npm run dev
pause
