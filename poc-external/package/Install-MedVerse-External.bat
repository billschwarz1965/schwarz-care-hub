@echo off
title MedVerse External - Install URL Protocol
color 0F
echo.
echo   =====================================================
echo     MedVerse External Edition - URL Protocol Installer
echo   =====================================================
echo.
echo   This registers the "medverse-external://" URL protocol
echo   so you can launch MedVerse External Edition from
echo   SharePoint or any browser link.
echo.
echo   No admin rights required.
echo.

:: Get the directory where this script lives
set "MEDVERSE_DIR=%~dp0"
set "LAUNCHER=%MEDVERSE_DIR%Start-MedVerse-External.bat"

:: Register medverse-external:// protocol in HKCU (no admin needed)
reg add "HKCU\Software\Classes\medverse-external" /ve /d "URL:MedVerse External Protocol" /f >nul 2>&1
reg add "HKCU\Software\Classes\medverse-external" /v "URL Protocol" /d "" /f >nul 2>&1
reg add "HKCU\Software\Classes\medverse-external\DefaultIcon" /ve /d "shell32.dll,14" /f >nul 2>&1
reg add "HKCU\Software\Classes\medverse-external\shell\open\command" /ve /d "\"%LAUNCHER%\"" /f >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo   [OK] medverse-external:// protocol registered successfully.
    echo.
    echo   You can now open MedVerse External Edition from any link:
    echo.
    echo       medverse-external://launch
    echo.
    echo   Paste this URL into a SharePoint page, Teams
    echo   message, or email to give others one-click access.
    echo.
    echo   NOTE: Each user must run this installer once
    echo   from their local copy of the MedVerse package.
) else (
    echo   [ERROR] Registration failed. Try running as administrator.
)

echo.
pause
