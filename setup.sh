#!/bin/bash

# ============================================================================
# Image Downloader Ultimate - Setup Script
# ============================================================================

echo "🚀 Настройка на Image Downloader Ultimate Chrome Extension..."
echo ""

# Create directories if they don't exist
mkdir -p lib icons

# Download JSZip
echo "📦 Свалям JSZip..."
if curl -f -o lib/jszip.min.js https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js; then
    echo "✅ JSZip свален успешно"
else
    echo "❌ Грешка при сваляне на JSZip"
    exit 1
fi

# Download FileSaver
echo "📦 Свалям FileSaver..."
if curl -f -o lib/FileSaver.min.js https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js; then
    echo "✅ FileSaver свален успешно"
else
    echo "❌ Грешка при сваляне на FileSaver"
    exit 1
fi

echo ""
echo "✅ Всички библиотеки са свалени успешно!"
echo ""
echo "⚠️  ВАЖНО: Все още трябва да добавите PNG икони в директорията icons/"
echo "   Прочетете icons/README.md за инструкции."
echo ""
echo "📋 Следващи стъпки:"
echo "   1. Добавете икони в icons/ директорията (или временно премахнете 'icons' от manifest.json)"
echo "   2. Отворете Chrome и отидете на chrome://extensions/"
echo "   3. Активирайте 'Developer mode'"
echo "   4. Натиснете 'Load unpacked' и изберете тази директория"
echo "   5. Extension-ът е готов за използване!"
echo ""
