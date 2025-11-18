# 🪟 Инсталация за Windows

## Метод 1: PowerShell скрипт (Препоръчително)

### Стъпка 1: Отворете PowerShell в директорията на проекта

```powershell
cd H:\Cex\Chrom-extension--claude-chrome-image-downloader-01RiZeQrhB7KVaPpGXEadYhx
```

### Стъпка 2: Разрешете изпълнение на PowerShell скриптове (еднократно)

Ако получите грешка за execution policy, изпълнете:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Стъпка 3: Изпълнете setup скрипта

```powershell
.\setup.ps1
```

## Метод 2: Ръчни PowerShell команди

Ако не искате да пускате скрипт, можете да свалите библиотеките ръчно:

```powershell
# Създайте директориите (ако не съществуват)
New-Item -ItemType Directory -Path "lib" -Force
New-Item -ItemType Directory -Path "icons" -Force

# Свалете JSZip
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js" -OutFile "lib\jszip.min.js"

# Свалете FileSaver
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js" -OutFile "lib\FileSaver.min.js"

# Проверете дали файловете са свалени
dir lib
```

## Метод 3: Git Bash (ако имате Git)

Ако имате Git инсталиран, можете да използвате Git Bash:

```bash
# Отворете Git Bash в директорията
./setup.sh
```

## Метод 4: Ръчно сваляне през браузър

1. Отворете в браузър:
   - https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
   - https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js

2. За всеки файл:
   - Натиснете `Ctrl+S` за да запазите
   - Запазете в `lib\` директорията с имена:
     - `jszip.min.js`
     - `FileSaver.min.js`

## Следващи стъпки

### 1. Икони (Опционално)

За да добавите икони, можете да:

**Опция A: Онлайн конвертор**
1. Отидете на https://cloudconvert.com/svg-to-png
2. Качете `icons\icon.svg`
3. Конвертирайте в размери: 16x16, 32x32, 48x48, 128x128
4. Запазете в `icons\` като:
   - `icon16.png`
   - `icon32.png`
   - `icon48.png`
   - `icon128.png`

**Опция B: Пропуснете иконите за тестване**
- Отворете `manifest.json`
- Изтрийте или коментирайте секциите `"icons"` и `"default_icon"`
- Extension-ът ще работи с default Chrome икона

### 2. Заредете Extension-а в Chrome

1. Отворете Chrome
2. Отидете на `chrome://extensions/`
3. Включете **Developer mode** (бутон горе вдясно)
4. Натиснете **Load unpacked**
5. Изберете директорията: `H:\Cex\Chrom-extension--claude-chrome-image-downloader-01RiZeQrhB7KVaPpGXEadYhx`
6. Готово! 🎉

### 3. Как да използвате

- Кликнете на иконата на extension-а в Chrome
- Или натиснете `Alt + W` на всяка страница
- Изберете изображения и свалете!

## Troubleshooting

### PowerShell execution policy грешка

Ако получите грешка:
```
cannot be loaded because running scripts is disabled on this system
```

Решение:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Файловете не се свалят

Проверете интернет връзката и опитайте отново или използвайте Метод 4 (ръчно сваляне).

### Extension не се зарежда

1. Проверете дали файловете в `lib\` са налични:
   ```powershell
   dir lib
   ```

2. Проверете дали `manifest.json` е валиден JSON файл

3. Проверете конзолата за грешки в `chrome://extensions/` (натиснете "Details" -> "Errors")

## Полезни PowerShell команди

```powershell
# Проверете структурата
dir -Recurse -Depth 1

# Проверете дали библиотеките са налични
dir lib

# Проверете размера на файловете
dir lib | Select-Object Name, Length

# Отворете директорията в Explorer
explorer .
```

---

**Забележка:** Всички команди трябва да се изпълняват от директорията на проекта.
