# ============================================================================
# Image Downloader Ultimate - Setup Script for Windows PowerShell
# ============================================================================

Write-Host "Setting up Image Downloader Ultimate Chrome Extension..." -ForegroundColor Cyan
Write-Host ""

# Create directories if they don't exist
if (-not (Test-Path "lib")) {
    New-Item -ItemType Directory -Path "lib" -Force | Out-Null
}
if (-not (Test-Path "icons")) {
    New-Item -ItemType Directory -Path "icons" -Force | Out-Null
}

# Download JSZip
Write-Host "Downloading JSZip..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js" -OutFile "lib\jszip.min.js"
    Write-Host "JSZip downloaded successfully" -ForegroundColor Green
} catch {
    Write-Host "Error downloading JSZip: $_" -ForegroundColor Red
    exit 1
}

# Download FileSaver
Write-Host "Downloading FileSaver..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js" -OutFile "lib\FileSaver.min.js"
    Write-Host "FileSaver downloaded successfully" -ForegroundColor Green
} catch {
    Write-Host "Error downloading FileSaver: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "All libraries downloaded successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: You still need to add PNG icons in the icons/ directory" -ForegroundColor Yellow
Write-Host "           Read icons\README.md for instructions." -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Add icons in icons\ directory (or temporarily remove 'icons' from manifest.json)"
Write-Host "   2. Open Chrome and go to chrome://extensions/"
Write-Host "   3. Enable 'Developer mode'"
Write-Host "   4. Click 'Load unpacked' and select this directory"
Write-Host "   5. The extension is ready to use!"
Write-Host ""
Write-Host "Press Enter to close..." -ForegroundColor Gray
Read-Host
