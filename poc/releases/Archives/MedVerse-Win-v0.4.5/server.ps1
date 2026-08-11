$port = 8080
$root = Join-Path $PSScriptRoot "www"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".map"  = "application/json"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
} catch {
    Write-Host ""
    Write-Host "  Port $port is in use. Trying 8081..." -ForegroundColor Yellow
    $port = 8081
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    try {
        $listener.Start()
    } catch {
        Write-Host "  Port 8081 also in use. Trying 8082..." -ForegroundColor Yellow
        $port = 8082
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://localhost:$port/")
        $listener.Start()
    }
}

Write-Host ""
Write-Host "  ================================================" -ForegroundColor Magenta
Write-Host "    MedVerse Scientific Intelligence Ecosystem" -ForegroundColor White
Write-Host "    POC v0.4.5 - Sanofi" -ForegroundColor White
Write-Host "  ================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "    Running at: " -NoNewline
Write-Host "http://localhost:$port" -ForegroundColor Cyan
Write-Host ""
Write-Host "    Press Ctrl+C to stop the server" -ForegroundColor DarkGray
Write-Host ""

Start-Process "http://localhost:$port"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        $query = $request.Url.Query

        # API proxy: forward /api/pubmed/* to PubMed E-Utilities
        if ($urlPath.StartsWith("/api/pubmed/")) {
            $apiPath = $urlPath -replace "^/api/pubmed/", ""
            $targetUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/$apiPath$query"
            try {
                $wc = New-Object System.Net.WebClient
                $wc.Headers.Add("User-Agent", "MedVerse-POC/0.4")
                $apiBytes = $wc.DownloadData($targetUrl)
                $response.StatusCode = 200
                if ($apiPath -match "retmode=text" -or $apiPath -match "efetch") {
                    $response.ContentType = "text/plain; charset=utf-8"
                } else {
                    $response.ContentType = "application/json; charset=utf-8"
                }
                $response.ContentLength64 = $apiBytes.Length
                $response.OutputStream.Write($apiBytes, 0, $apiBytes.Length)
            } catch {
                $response.StatusCode = 502
                $errMsg = [System.Text.Encoding]::UTF8.GetBytes("API proxy error: $_")
                $response.ContentLength64 = $errMsg.Length
                $response.OutputStream.Write($errMsg, 0, $errMsg.Length)
            }
            $response.OutputStream.Close()
            $ts = Get-Date -Format "HH:mm:ss"
            Write-Host "  $ts  $($response.StatusCode)  PROXY $urlPath" -ForegroundColor DarkCyan
            continue
        }

        # API proxy: forward /api/trials/* to ClinicalTrials.gov
        if ($urlPath.StartsWith("/api/trials/")) {
            $apiPath = $urlPath -replace "^/api/trials/", ""
            $targetUrl = "https://clinicaltrials.gov/api/v2/$apiPath$query"
            try {
                $wc = New-Object System.Net.WebClient
                $wc.Headers.Add("User-Agent", "MedVerse-POC/0.4")
                $apiBytes = $wc.DownloadData($targetUrl)
                $response.StatusCode = 200
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $apiBytes.Length
                $response.OutputStream.Write($apiBytes, 0, $apiBytes.Length)
            } catch {
                $response.StatusCode = 502
                $errMsg = [System.Text.Encoding]::UTF8.GetBytes("API proxy error: $_")
                $response.ContentLength64 = $errMsg.Length
                $response.OutputStream.Write($errMsg, 0, $errMsg.Length)
            }
            $response.OutputStream.Close()
            $ts = Get-Date -Format "HH:mm:ss"
            Write-Host "  $ts  $($response.StatusCode)  PROXY $urlPath" -ForegroundColor DarkCyan
            continue
        }

        if ($urlPath -eq "/") { $urlPath = "/index.html" }

        $filePath = Join-Path $root ($urlPath -replace "/", "\")

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

            $response.ContentType = $contentType
            $response.StatusCode = 200

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $indexPath = Join-Path $root "index.html"
            if (Test-Path $indexPath) {
                $response.ContentType = "text/html; charset=utf-8"
                $response.StatusCode = 200
                $bytes = [System.IO.File]::ReadAllBytes($indexPath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
                $response.ContentLength64 = $msg.Length
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
        }
        $response.OutputStream.Close()

        $status = $response.StatusCode
        $ts = Get-Date -Format "HH:mm:ss"
        if ($status -eq 200) {
            Write-Host "  $ts  $status  $urlPath" -ForegroundColor DarkGray
        } else {
            Write-Host "  $ts  $status  $urlPath" -ForegroundColor Yellow
        }
    } catch [System.Net.HttpListenerException] {
        break
    } catch {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

$listener.Stop()
Write-Host "`n  Server stopped." -ForegroundColor DarkGray
