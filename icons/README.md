# Icons Directory

За да работи extension-а правилно, трябва да добавите PNG икони в следните размери:

## Необходими икони:
- `icon16.png` - 16x16 px
- `icon32.png` - 32x32 px
- `icon48.png` - 48x48 px
- `icon128.png` - 128x128 px

## Как да създадете икони:

### Опция 1: Използвайте онлайн tool
1. Отидете на https://www.favicon-generator.org/ или https://realfavicongenerator.net/
2. Качете `icon.svg` файла
3. Генерирайте иконите в нужните размери
4. Запазете ги в тази директория

### Опция 2: Използвайте ImageMagick (ако имате инсталиран)
```bash
# От директорията на extension-а
convert icons/icon.svg -resize 16x16 icons/icon16.png
convert icons/icon.svg -resize 32x32 icons/icon32.png
convert icons/icon.svg -resize 48x48 icons/icon48.png
convert icons/icon.svg -resize 128x128 icons/icon128.png
```

### Опция 3: Използвайте онлайн SVG to PNG converter
1. Отидете на https://cloudconvert.com/svg-to-png
2. Конвертирайте icon.svg в различните размери
3. Запазете файловете тук

## Временно решение (placeholder)
Ако искате да тествате extension-а бързо без икони, можете временно да коментирате или премахнете "icons" секциите в `manifest.json`.
