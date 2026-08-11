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
    $listener.Start()
}

Write-Host ""
Write-Host "  ========================================" -ForegroundColor Magenta
Write-Host "    Sanofi MedVerse POC v0.1" -ForegroundColor White
Write-Host "  ========================================" -ForegroundColor Magenta
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
