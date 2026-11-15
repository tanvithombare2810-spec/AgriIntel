# KisanWise 2.0 Smart Launcher
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "   🌱 KisanWise 2.0 (Smart Farm Decision Assistant)       " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# 1. Resolve Python executable with FastAPI / Uvicorn
$pyCandidates = @(
    "C:\Users\saksh\AppData\Local\Python\bin\python.exe",
    "python.exe",
    "py.exe"
)
$pythonExe = $null
foreach ($cand in $pyCandidates) {
    if (Test-Path $cand) {
        $testUvicorn = & $cand -c "import uvicorn; print('OK')" 2>$null
        if ($testUvicorn -eq "OK") {
            $pythonExe = $cand
            break
        }
    } else {
        $cmd = Get-Command $cand -ErrorAction SilentlyContinue
        if ($cmd) {
            $testUvicorn = & $cmd.Source -c "import uvicorn; print('OK')" 2>$null
            if ($testUvicorn -eq "OK") {
                $pythonExe = $cmd.Source
                break
            }
        }
    }
}

if (-not $pythonExe) {
    Write-Host "[ERROR] Could not find a Python installation with uvicorn." -ForegroundColor Red
    Write-Host "Please run: pip install fastapi uvicorn motor pymongo httpx python-dotenv" -ForegroundColor Yellow
    exit 1
}

# 2. Check if Backend is already active on port 8001
$backendConn = Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue
$startedBackendProcess = $null

if ($backendConn) {
    Write-Host "[OK] Backend server is already running at http://localhost:8001" -ForegroundColor Cyan
} else {
    Write-Host "[...] Starting FastAPI Backend on port 8001..." -ForegroundColor Yellow
    $env:PYTHONPATH = "."
    $startedBackendProcess = Start-Process -FilePath $pythonExe -ArgumentList "-m uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload" -PassThru -NoNewWindow
    Start-Sleep -Seconds 2
    Write-Host "[OK] Backend started at http://localhost:8001 (PID: $($startedBackendProcess.Id))" -ForegroundColor Cyan
}

# 3. Check if Frontend is already active on port 5173
$frontendConn = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($frontendConn) {
    Write-Host "[OK] Frontend is already running at http://localhost:5173" -ForegroundColor Green
    Write-Host "Opening KisanWise in your default browser..." -ForegroundColor Green
    Start-Process "http://localhost:5173"
    Write-Host "Done! Application is ready." -ForegroundColor Green
} else {
    Write-Host "[...] Starting Vite Frontend on port 5173..." -ForegroundColor Yellow
    Start-Process "http://localhost:5173"
    Set-Location frontend
    try {
        npm run dev
    } finally {
        if ($startedBackendProcess) {
            Write-Host "Stopping backend process..." -ForegroundColor Yellow
            Stop-Process -Id $startedBackendProcess.Id -Force -ErrorAction SilentlyContinue
        }
    }
}
