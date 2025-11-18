# ============================================================================
# Image Downloader Ultimate - Setup Script for Windows PowerShell
# ============================================================================

Write-Host "🚀 Настройка на Image Downloader Ultimate Chrome Extension..." -ForegroundColor Cyan
Write-Host ""

# Create directories if they don't exist
if (-not (Test-Path "lib")) {
    New-Item -ItemType Directory -Path "lib" -Force | Out-Null
}
if (-not (Test-Path "icons")) {
    New-Item -ItemType Directory -Path "icons" -Force | Out-Null
}

# Download JSZip
Write-Host "📦 Свалям JSZip..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js" -OutFile "lib\jszip.min.js"
    Write-Host "✅ JSZip свален успешно" -ForegroundColor Green
} catch {
    Write-Host "❌ Грешка при сваляне на JSZip: $_" -ForegroundColor Red
    exit 1
}

# Download FileSaver
Write-Host "📦 Свалям FileSaver..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js" -OutFile "lib\FileSaver.min.js"
    Write-Host "✅ FileSaver свален успешно" -ForegroundColor Green
} catch {
    Write-Host "❌ Грешка при сваляне на FileSaver: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Всички библиотеки са свалени успешно!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  ВАЖНО: Все още трябва да добавите PNG икони в директорията icons/" -ForegroundColor Yellow
Write-Host "   Прочетете icons\README.md за инструкции." -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Следващи стъпки:" -ForegroundColor Cyan
Write-Host "   1. Добавете икони в icons\ директорията (или временно премахнете 'icons' от manifest.json)"
Write-Host "   2. Отворете Chrome и отидете на chrome://extensions/"
Write-Host "   3. Активирайте 'Developer mode'"
Write-Host "   4. Натиснете 'Load unpacked' и изберете тази директория"
Write-Host "   5. Extension-ът е готов за използване!"
Write-Host ""
Write-Host "Натиснете Enter за да затворите..." -ForegroundColor Gray
Read-Host
