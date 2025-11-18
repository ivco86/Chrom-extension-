# Libraries Directory

Тази директория трябва да съдържа необходимите JavaScript библиотеки за работата на extension-а.

## Необходими файлове:

### 1. JSZip (за създаване на ZIP архиви)
**Файл:** `jszip.min.js`

**Как да свалите:**
```bash
# Опция 1: Използвайте curl
curl -o lib/jszip.min.js https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js

# Опция 2: Използвайте wget
wget -O lib/jszip.min.js https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
```

Или отидете на: https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
Запазете файла като `jszip.min.js` в тази директория.

### 2. FileSaver.js (за сваляне на файлове)
**Файл:** `FileSaver.min.js`

**Как да свалите:**
```bash
# Опция 1: Използвайте curl
curl -o lib/FileSaver.min.js https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js

# Опция 2: Използвайте wget
wget -O lib/FileSaver.min.js https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
```

Или отидете на: https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
Запазете файла като `FileSaver.min.js` в тази директория.

## Автоматично сваляне

Можете да изпълните следните команди от главната директория на проекта:

```bash
# Свалете двете библиотеки наведнъж
curl -o lib/jszip.min.js https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
curl -o lib/FileSaver.min.js https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
```

## Проверка

След като свалите файловете, структурата трябва да изглежда така:
```
lib/
├── README.md
├── jszip.min.js
└── FileSaver.min.js
```

Можете да проверите с:
```bash
ls -la lib/
```
