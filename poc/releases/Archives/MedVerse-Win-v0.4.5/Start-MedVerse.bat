@echo off
title MedVerse Scientific Intelligence Ecosystem — v0.4.5
color 0F
echo.
echo   ================================================
echo     MedVerse Scientific Intelligence Ecosystem
echo     POC v0.4.5 — Sanofi
echo   ================================================
echo.
echo   Starting MedVerse...
echo   Your browser will open automatically.
echo.
echo   To stop: close this window or press Ctrl+C
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
