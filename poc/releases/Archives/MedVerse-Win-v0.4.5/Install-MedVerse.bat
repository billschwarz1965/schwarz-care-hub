@echo off
title MedVerse — Install URL Protocol
color 0F
echo.
echo   =============================================
echo     MedVerse — URL Protocol Installer
echo     (Optional — for SharePoint one-click links)
echo   =============================================
echo.
echo   This registers the "medverse://" URL protocol
echo   so you can launch MedVerse from SharePoint or
echo   any browser link.
echo.
echo   No admin rights required.
echo.

:: Get the directory where this script lives
set "MEDVERSE_DIR=%~dp0"
set "LAUNCHER=%MEDVERSE_DIR%Start-MedVerse.bat"

:: Register medverse:// protocol in HKCU (no admin needed)
reg add "HKCU\Software\Classes\medverse" /ve /d "URL:MedVerse Protocol" /f >nul 2>&1
reg add "HKCU\Software\Classes\medverse" /v "URL Protocol" /d "" /f >nul 2>&1
reg add "HKCU\Software\Classes\medverse\DefaultIcon" /ve /d "shell32.dll,14" /f >nul 2>&1
reg add "HKCU\Software\Classes\medverse\shell\open\command" /ve /d "\"%LAUNCHER%\"" /f >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo   [OK] medverse:// protocol registered successfully.
    echo.
    echo   You can now open MedVerse from any link:
    echo.
    echo       medverse://launch
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
