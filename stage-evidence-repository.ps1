<#
.SYNOPSIS
    Stages the MedVerse evidence repository from MedVerse-Evidence-Repository.csv.

.DESCRIPTION
    Copies (never moves) every classified file into a Category\Subcategory tree,
    de-duplicates byte-identical files, disambiguates same-name/different-content
    files, and writes a MANIFEST.csv plus a README index per category.

    Source files are never modified, renamed or deleted.

.PARAMETER Execute
    Perform the copy. Without this switch the script runs as a DRY RUN and only
    reports what it would do.

.PARAMETER LinkOverMB
    Files larger than this are NOT copied; a .link.txt pointer to the original
    path is written instead. Default 100 MB, which keeps the ~1.7 GB of interview
    recordings out of the staged tree while still indexing them.

.PARAMETER CoreOnly
    Stage only categories 01-04 (Benchmarking, HCP Research & User Preferences,
    Advisory & Steering, Stakeholder Interviews) - the leadership evidence core.

.EXAMPLE
    .\stage-evidence-repository.ps1
    Dry run over everything.

.EXAMPLE
    .\stage-evidence-repository.ps1 -CoreOnly -Execute
    Stage just the 78-file evidence core.
#>
[CmdletBinding()]
param(
    [string] $Csv         = "C:\Users\I0412641\Saved Games\Desktop\MedVerse-Evidence-Repository-Final.csv",
    [string] $Dest        = "C:\Users\I0412641\Saved Games\Desktop\MedVerse-Evidence-Repository",
    [int]    $LinkOverMB  = 100,
    [switch] $CoreOnly,
    [switch] $Execute
)

$ErrorActionPreference = 'Stop'
$mode = if ($Execute) { 'EXECUTE' } else { 'DRY RUN' }
Write-Host "=== MedVerse evidence staging [$mode] ===" -ForegroundColor Cyan
Write-Host "  source csv : $Csv"
Write-Host "  destination: $Dest"
Write-Host "  link over  : $LinkOverMB MB`n"

if (-not (Test-Path -LiteralPath $Csv)) { throw "Inventory CSV not found: $Csv" }

# Long-path-safe literal path for .NET calls.
# NOTE: do NOT name this Lp - 'lp' is a built-in alias for Out-Printer and aliases
# outrank functions, so every call silently printed the path and returned nothing.
# Also use StartsWith, not -like '\\?\*': '?' is a wildcard in -like patterns.
function ConvertTo-LongPath([string]$Path) {
    if ([string]::IsNullOrEmpty($Path)) { throw "ConvertTo-LongPath: empty path" }
    if ($Path.StartsWith('\\?\')) { return $Path }
    return ('\\?\' + $Path)
}

# Filesystem-safe folder segment
function Safe([string]$s) {
    $s = $s -replace '[<>:"/\\|?*]', '-'
    $s = $s -replace '\s+', ' '
    $s.Trim().TrimEnd('.')
}

$rows = Import-Csv $Csv -Encoding UTF8
if ($CoreOnly) {
    $rows = $rows | Where-Object { $_.Category -match '^0[1-4]' }
    Write-Host "CoreOnly: restricted to $($rows.Count) files.`n" -ForegroundColor Yellow
}

# ---- pass 1: hash everything so identical files are staged once ---------------
Write-Host "Hashing $($rows.Count) files to find true duplicates..."
$missing = New-Object Collections.ArrayList
$plan    = New-Object Collections.ArrayList
$hashSeen = @{}   # hash -> first staged relative path

$n = 0
foreach ($r in $rows) {
    $n++
    if ($n % 100 -eq 0) { Write-Host "  ..$n / $($rows.Count)" }

    if (-not (Test-Path -LiteralPath $r.FullName)) { [void]$missing.Add($r.FullName); continue }

    $fi   = Get-Item -LiteralPath $r.FullName
    $hash = (Get-FileHash -LiteralPath $r.FullName -Algorithm MD5).Hash

    $catDir = Safe ($r.Category    -replace '^\d+\s+','' )
    $catNum = ($r.Category -split '\s+')[0]
    $subDir = Safe $r.Subcategory
    $relDir = Join-Path ("{0}_{1}" -f $catNum, ($catDir -replace ' ','-')) $subDir

    $action = 'copy'
    $dupOf  = ''
    if ($hashSeen.ContainsKey($hash)) { $action = 'skip-duplicate'; $dupOf = $hashSeen[$hash] }
    elseif ($fi.Length / 1MB -gt $LinkOverMB) { $action = 'link' }

    [void]$plan.Add([pscustomobject]@{
        Action    = $action
        RelDir    = $relDir
        FileName  = $fi.Name
        Hash      = $hash
        SizeMB    = [math]::Round($fi.Length/1MB, 2)
        DuplicateOf = $dupOf
        Category  = $r.Category
        Subcategory = $r.Subcategory
        MatchedBy = $r.MatchedBy
        TermCount = $r.TermCount
        Source    = $r.FullName
    })
    if ($action -ne 'skip-duplicate') { $hashSeen[$hash] = (Join-Path $relDir $fi.Name) }
}

# ---- pass 2: resolve same-name / different-content collisions -----------------
$plan | Where-Object Action -ne 'skip-duplicate' |
        Group-Object RelDir, FileName | Where-Object Count -gt 1 | ForEach-Object {
    $i = 0
    foreach ($p in $_.Group) {
        $i++
        if ($i -eq 1) { continue }   # first keeps the clean name
        $base = [IO.Path]::GetFileNameWithoutExtension($p.FileName)
        $ext  = [IO.Path]::GetExtension($p.FileName)
        $tok  = Safe (Split-Path (Split-Path $p.Source -Parent) -Leaf)
        if ($tok.Length -gt 28) { $tok = $tok.Substring(0,28) }
        $p.FileName = "$base [$tok]$ext"
    }
}

# ---- report ------------------------------------------------------------------
$copy = $plan | Where-Object Action -eq 'copy'
$link = $plan | Where-Object Action -eq 'link'
$dupe = $plan | Where-Object Action -eq 'skip-duplicate'

Write-Host "`n--- plan ---" -ForegroundColor Cyan
Write-Host ("  copy            : {0,4} files  ({1:N0} MB)" -f $copy.Count, (($copy|Measure-Object SizeMB -Sum).Sum))
Write-Host ("  link (too big)  : {0,4} files  ({1:N0} MB left in place)" -f $link.Count, (($link|Measure-Object SizeMB -Sum).Sum))
Write-Host ("  skip duplicate  : {0,4} files" -f $dupe.Count)
Write-Host ("  MISSING source  : {0,4} files" -f $missing.Count)
Write-Host ("  folders         : {0,4}" -f ($plan | Select-Object -Expand RelDir -Unique).Count)

if ($missing.Count) {
    Write-Host "`nMissing sources (first 10):" -ForegroundColor Yellow
    $missing | Select-Object -First 10 | ForEach-Object { Write-Host "  $_" }
}

if (-not $Execute) {
    Write-Host "`nDRY RUN - nothing written. Re-run with -Execute to stage." -ForegroundColor Yellow
    $plan | Export-Csv (Join-Path $env:TEMP 'evidence-staging-plan.csv') -NoTypeInformation
    Write-Host "Full plan: $(Join-Path $env:TEMP 'evidence-staging-plan.csv')"
    return
}

# ---- execute -----------------------------------------------------------------
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
foreach ($d in ($plan | Select-Object -Expand RelDir -Unique)) {
    New-Item -ItemType Directory -Force -Path (Join-Path $Dest $d) | Out-Null
}
New-Item -ItemType Directory -Force -Path (Join-Path $Dest '00_START-HERE') | Out-Null

$done = 0; $failed = New-Object Collections.ArrayList
foreach ($p in ($plan | Where-Object Action -in 'copy','link')) {
    $target = Join-Path (Join-Path $Dest $p.RelDir) $p.FileName
    try {
        if ($p.Action -eq 'copy') {
            [IO.File]::Copy((ConvertTo-LongPath $p.Source), (ConvertTo-LongPath $target), $true)
        } else {
            $txt = @(
                "This file was left in place because it exceeds the ${LinkOverMB} MB staging limit."
                ""
                "Original location:"
                $p.Source
                ""
                ("Size: {0} MB" -f $p.SizeMB)
                ("Category: {0} / {1}" -f $p.Category, $p.Subcategory)
            ) -join "`r`n"
            Set-Content -LiteralPath ($target + '.link.txt') -Value $txt -Encoding utf8
        }
        $done++
    } catch { [void]$failed.Add("$($p.Source) -> $($_.Exception.Message)") }
    if ($done % 50 -eq 0) { Write-Host "  ..staged $done" }
}

# ---- manifest + indexes ------------------------------------------------------
$plan | Select-Object Category, Subcategory, Action, FileName, SizeMB, MatchedBy, TermCount, DuplicateOf, RelDir, Source |
        Sort-Object Category, Subcategory, FileName |
        Export-Csv (Join-Path $Dest '00_START-HERE\MANIFEST.csv') -NoTypeInformation

$readme = New-Object Text.StringBuilder
[void]$readme.AppendLine("# MedVerse Evidence Repository")
[void]$readme.AppendLine("")
[void]$readme.AppendLine("Staged $(Get-Date -Format 'yyyy-MM-dd HH:mm') from ``$Csv``.")
[void]$readme.AppendLine("Source files were copied, never moved - originals are untouched.")
[void]$readme.AppendLine("")
[void]$readme.AppendLine("- Files staged: **$done**")
[void]$readme.AppendLine("- Byte-identical duplicates skipped: **$($dupe.Count)**")
[void]$readme.AppendLine("- Large files left in place with a ``.link.txt`` pointer: **$($link.Count)**")
[void]$readme.AppendLine("")
[void]$readme.AppendLine("Categories 01-04 are the leadership evidence core: external benchmarking,")
[void]$readme.AppendLine("HCP research and stated preferences, advisory input, and stakeholder interviews.")
[void]$readme.AppendLine("Categories 05+ are supporting delivery context.")
[void]$readme.AppendLine("")
[void]$readme.AppendLine("| Category | Subcategory | Files |")
[void]$readme.AppendLine("|---|---|---|")
foreach ($g in ($plan | Where-Object Action -ne 'skip-duplicate' | Group-Object Category, Subcategory | Sort-Object Name)) {
    $parts = $g.Name -split ', '
    [void]$readme.AppendLine("| $($parts[0]) | $($parts[1]) | $($g.Count) |")
}
Set-Content -LiteralPath (Join-Path $Dest '00_START-HERE\README.md') -Value $readme.ToString() -Encoding utf8

# ---- verify: every planned copy must exist on disk at the right size ---------
$bad = New-Object Collections.ArrayList
foreach ($p in $copy) {
    $target = Join-Path (Join-Path $Dest $p.RelDir) $p.FileName
    if (-not (Test-Path -LiteralPath $target)) { [void]$bad.Add("MISSING  $($p.FileName)"); continue }
    $srcLen = (Get-Item -LiteralPath $p.Source).Length
    $dstLen = (Get-Item -LiteralPath $target).Length
    if ($srcLen -ne $dstLen) { [void]$bad.Add("SIZE MISMATCH  $($p.FileName)  $srcLen vs $dstLen") }
}

Write-Host "`n=== done ===" -ForegroundColor Green
Write-Host "  staged        : $done"
Write-Host "  failed        : $($failed.Count)"
Write-Host "  verify errors : $($bad.Count)"
Write-Host "  root          : $Dest"
if ($failed.Count) { $failed | Select-Object -First 10 | ForEach-Object { Write-Host "  FAIL $_" -ForegroundColor Red } }
if ($bad.Count)    { $bad    | Select-Object -First 10 | ForEach-Object { Write-Host "  $_" -ForegroundColor Red } }
if (-not $failed.Count -and -not $bad.Count) {
    Write-Host "  VERIFIED: all $($copy.Count) copies present and byte-size matched." -ForegroundColor Green
}
