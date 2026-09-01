@echo off
title MedVerse POC - External Edition
color 0F
echo.
echo   Starting MedVerse POC (External Edition)...
echo   Your browser will open automatically.
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
