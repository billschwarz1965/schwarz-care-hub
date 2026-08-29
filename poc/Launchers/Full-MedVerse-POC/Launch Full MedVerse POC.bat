@echo off
setlocal enabledelayedexpansion
set "RELEASES=%USERPROFILE%\poc\releases"
set "LATEST="

for /f "delims=" %%D in ('dir /b /ad /o-n "%RELEASES%\MedVerse-Win-v*" 2^>nul') do (
    if not defined LATEST set "LATEST=%%D"
)

if not defined LATEST (
    echo No MedVerse release folder found in "%RELEASES%".
    pause
    exit /b 1
)

if not exist "%RELEASES%\%LATEST%\MedVerse Operating System.exe" (
    echo Found "%LATEST%" but its exe is missing.
    pause
    exit /b 1
)

echo Launching %LATEST% ...
start "" "%RELEASES%\%LATEST%\MedVerse Operating System.exe"
