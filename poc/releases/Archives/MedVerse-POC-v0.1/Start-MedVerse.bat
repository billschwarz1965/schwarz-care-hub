@echo off
title Sanofi MedVerse POC
color 0F
echo.
echo   Starting Sanofi MedVerse POC...
echo   Your browser will open automatically.
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
