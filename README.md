# 📥 Image Downloader Ultimate - Chrome Extension

Мощен Chrome extension за сваляне на изображения с автоматично подобряване на качеството, поддръжка на Canvas, Lazy Load, ZIP архивиране и филтри.

## ✨ Функции

- 🔍 **Auto Big Image** - Автоматично увеличаване на качеството на изображения от популярни сайтове:
  - Weibo, Alibaba/Taobao, JD.com
  - Bilibili, Twitter, Pinterest
  - Instagram, Pixiv, DeviantArt
  - ArtStation и други

- 🎨 **Canvas Support** - Извличане на изображения от Canvas елементи
- ⏳ **Lazy Load Detection** - Откриване на lazy-loaded изображения
- 📦 **ZIP Download** - Сваляне на множество изображения в ZIP архив
- 🔧 **Филтри** - Филтриране по размер (ширина/височина)
- 📊 **Batch Download** - Масово сваляне с прогрес индикатор
- 🎯 **Множество източници**:
  - IMG tags
  - Background images
  - Srcset (responsive images)
  - Picture tags
  - SVG images
  - Canvas elements

## 🚀 Инсталация

### Стъпка 1: Подготовка

Клонирайте или свалете този проект:

```bash
git clone <repo-url>
cd Chrom-extension-
```

### Стъпка 2: Инсталирайте зависимостите

Изпълнете setup скрипта за автоматично сваляне на библиотеките:

```bash
chmod +x setup.sh
./setup.sh
```

Или свалете библиотеките ръчно:

```bash
curl -o lib/jszip.min.js https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
curl -o lib/FileSaver.min.js https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
```

### Стъпка 3: Добавете икони (опционално)

За да работи extension-ът с икони, трябва да генерирате PNG файлове:

**Опция 1: Онлайн конвертор**
1. Отидете на https://cloudconvert.com/svg-to-png
2. Качете `icons/icon.svg`
3. Генерирайте в размери: 16x16, 32x32, 48x48, 128x128
4. Запазете като `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png` в `icons/`

**Опция 2: ImageMagick (ако е инсталиран)**
```bash
convert icons/icon.svg -resize 16x16 icons/icon16.png
convert icons/icon.svg -resize 32x32 icons/icon32.png
convert icons/icon.svg -resize 48x48 icons/icon48.png
convert icons/icon.svg -resize 128x128 icons/icon128.png
```

**Временно решение:**
За тестване можете да премахнете или коментирате секциите с `"icons"` в `manifest.json`.

### Стъпка 4: Заредете extension-а в Chrome

1. Отворете Chrome/Chromium браузър
2. Отидете на `chrome://extensions/`
3. Активирайте **Developer mode** (горе вдясно)
4. Натиснете **Load unpacked**
5. Изберете директорията на проекта (`Chrom-extension-`)
6. Extension-ът е зареден и готов за употреба!

## 📖 Как се използва

### Метод 1: Extension бутон
1. Кликнете на иконата на extension-а в toolbar-а
2. В popup-а натиснете **"Стартирай Downloader"**
3. Ще се отвори интерфейсът за сваляне на изображения

### Метод 2: Keyboard Shortcut
Натиснете `Alt + W` на всяка страница за да стартирате downloader-а директно.

### Използване на интерфейса

1. **Преглед на изображения** - Всички намерени изображения се показват в галерия
2. **Филтриране** - Натиснете ⚙️ "Филтри" за да филтрирате по размер
3. **Избор** - Кликнете на изображения за да ги изберете
4. **Свали** - Използвайте бутоните:
   - ⬇️ **Свали** - Сваля избраните изображения поединично
   - 📦 **ZIP** - Сваля избраните изображения в ZIP архив

## ⚙️ Настройки

В панела с филтри можете да конфигурирате:

- 🔍 **Auto Big Image** - Автоматично подобряване на качеството
- 🎨 **Canvas** - Включване на Canvas изображения
- ⏳ **Lazy Load** - Откриване на lazy-loaded изображения
- 📏 **Размери** - Филтриране по минимална/максимална ширина и височина

Настройките се запазват автоматично.

## 🛠️ Структура на проекта

```
Chrom-extension-/
├── manifest.json          # Extension manifest (Manifest V3)
├── background.js          # Background service worker
├── content.js            # Main content script
├── popup.html            # Popup UI
├── popup.js              # Popup logic
├── setup.sh              # Setup script
├── README.md             # Тази документация
├── icons/
│   ├── icon.svg          # Source SVG icon
│   ├── icon16.png        # 16x16 icon
│   ├── icon32.png        # 32x32 icon
│   ├── icon48.png        # 48x48 icon
│   ├── icon128.png       # 128x128 icon
│   └── README.md         # Icon instructions
└── lib/
    ├── jszip.min.js      # JSZip library
    ├── FileSaver.min.js  # FileSaver library
    └── README.md         # Library instructions
```

## 🎯 Поддържани сайтове (Auto Big Image)

Extension-ът автоматично подобрява качеството на изображения от:

| Сайт | Подобрение |
|------|------------|
| Weibo | thumbnail → large |
| Alibaba/Taobao | Премахва suffixes |
| JD.com | Максимално качество |
| Bilibili | Премахва resize параметри |
| Twitter | name=orig качество |
| Pinterest | originals версия |
| Instagram | Пълен размер |
| Pixiv | img-original |
| DeviantArt | intermediary качество |
| ArtStation | large версия |

## 🔧 Технологии

- **Manifest V3** - Най-новата версия на Chrome Extension API
- **JSZip** - Създаване на ZIP архиви
- **FileSaver.js** - Сваляне на файлове
- **Chrome Downloads API** - Нативно сваляне
- **Chrome Storage API** - Запазване на настройки
- **MutationObserver** - Динамично следене за нови изображения

## 📝 Permissions

Extension-ът изисква следните разрешения:

- `activeTab` - Достъп до текущия таб
- `downloads` - Сваляне на файлове
- `storage` - Запазване на настройки
- `<all_urls>` - Работа на всички сайтове

## 🐛 Troubleshooting

### Extension-ът не се зарежда
- Проверете дали сте свалили библиотеките в `lib/` директорията
- Проверете дали `manifest.json` е валиден JSON
- Проверете конзолата за грешки в `chrome://extensions/`

### Иконите не се показват
- Добавете PNG икони или премахнете `"icons"` секциите от `manifest.json`
- Вижте `icons/README.md` за инструкции

### Не се намират изображения
- Презаредете страницата и опитайте отново
- Проверете дали сайтът не блокира JavaScript
- Някои изображения може да са динамично заредени - скролнете страницата

### Canvas изображенията не се извличат
- Някои Canvas елементи са защитени от CORS
- Деактивирайте "Canvas" опцията ако създава проблеми

## 📄 Лиценз

MIT License

## 🤝 Принос

Contributions are welcome!

1. Fork проекта
2. Създайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit промените (`git commit -m 'Add some AmazingFeature'`)
4. Push към branch-а (`git push origin feature/AmazingFeature`)
5. Отворете Pull Request

## 👨‍💻 Автор

Ivelin

## 🌟 Благодарности

- JSZip за ZIP функционалност
- FileSaver.js за download функционалност
- Базиран на Tampermonkey скрипт "Image Downloader Ultimate"

---

**Забележка:** Този extension е създаден за образователни цели. Моля използвайте отговорно и спазвайте copyright и terms of service на сайтовете които посещавате.
