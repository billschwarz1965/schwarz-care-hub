@echo off
setlocal
set "INSTALLER=%USERPROFILE%\Downloads\MedVerse-POC-External-Windows-Installer\medverse-poc-external-installer\install.ps1"
set "SOURCE=C:\Users\I0412641\.claude\worktrees\poc-external-ccfcda\poc"

if not exist "%INSTALLER%" (
    echo Installer not found at "%INSTALLER%".
    pause
    exit /b 1
)

echo Installing/updating POC External from "%SOURCE%" ...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%INSTALLER%" -SourcePath "%SOURCE%"
if errorlevel 1 (
    echo Install/launch failed - see the message above.
    pause
    exit /b 1
)
