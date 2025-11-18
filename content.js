// ============================================================================
// IMAGE DOWNLOADER ULTIMATE - Content Script
// ============================================================================

(function() {
    'use strict';

    // ============================================================================
    // AUTO BIG IMAGE - Автоматично увеличаване на качеството
    // ============================================================================
    class ImageEnhancer {
        constructor() {
            this.rules = [
                {
                    name: 'Weibo',
                    test: /sinaimg\.(cn|com)/,
                    replace: (url) => url.replace(/\/(thumbnail|mw\d+)\//, '/large/')
                },
                {
                    name: 'Alibaba/Taobao',
                    test: /alicdn\.(cn|com)/,
                    replace: (url) => url.replace(/_.+\.(jpg|jpeg|png|webp)/i, '.$1')
                },
                {
                    name: 'JD.com',
                    test: /360buyimg\.(cn|com)/,
                    replace: (url) => url.replace(/\/n\d+\//, '/n0/')
                },
                {
                    name: 'Bilibili',
                    test: /hdslb\.(cn|com)/,
                    replace: (url) => url.replace(/@.+$/, '')
                },
                {
                    name: 'Twitter',
                    test: /twimg\.com/,
                    replace: (url) => url.replace(/(\?|&)name=.*$/, '$1name=orig')
                },
                {
                    name: 'Pinterest',
                    test: /pinimg\.com/,
                    replace: (url) => url.replace(/\/\d+x\//, '/originals/')
                },
                {
                    name: 'Instagram',
                    test: /cdninstagram\.com|instagram\.com/,
                    replace: (url) => url.replace(/\/[svt]\d+x\d+\//, '/')
                },
                {
                    name: 'Pixiv',
                    test: /pximg\.net/,
                    replace: (url) => url.replace(/\/c\/\d+x\d+_\d+_\w+\//, '/img-original/')
                                         .replace(/_master\d+/, '')
                },
                {
                    name: 'DeviantArt',
                    test: /deviantart\.net/,
                    replace: (url) => url.replace(/\/v1\/fill\/.*?\//, '/intermediary/f/')
                },
                {
                    name: 'ArtStation',
                    test: /artstation\.com/,
                    replace: (url) => url.replace(/\/small\//, '/large/')
                                         .replace(/\/medium\//, '/large/')
                }
            ];
        }

        enhance(url) {
            const result = [url];

            for (const rule of this.rules) {
                if (rule.test.test(url)) {
                    const bigUrl = rule.replace(url);
                    if (bigUrl !== url) {
                        result.push(bigUrl);
                        console.log(`📈 Enhanced (${rule.name})`);
                    }
                }
            }

            return result;
        }

        enhanceAll(images) {
            const result = [];
            const seen = new Set();

            images.forEach(img => {
                const enhanced = this.enhance(img.url);

                enhanced.forEach(url => {
                    if (!seen.has(url)) {
                        seen.add(url);
                        result.push({
                            ...img,
                            url: url,
                            originalUrl: img.url,
                            isEnhanced: url !== img.url
                        });
                    }
                });
            });

            return result;
        }
    }

    // ============================================================================
    // IMAGE COLLECTOR - Събира изображения от всички източници
    // ============================================================================
    class ImageCollector {
        constructor() {
            this.enhancer = new ImageEnhancer();
            this.images = [];
            this.seen = new Set();
            this.observer = null;
        }

        async collect(options = {}) {
            const {
                includeCanvas = true,
                includeLazyLoad = true,
                autoEnhance = true
            } = options;

            this.images = [];
            this.seen = new Set();

            console.log('🔍 Започва събиране на изображения...');

            // 1. IMG tags
            this.collectFromImgTags();

            // 2. Background images
            this.collectFromBackgrounds();

            // 3. Srcset (responsive images)
            this.collectFromSrcset();

            // 4. Lazy load attributes
            if (includeLazyLoad) {
                this.collectFromLazyLoad();
            }

            // 5. Canvas elements
            if (includeCanvas) {
                await this.collectFromCanvas();
            }

            // 6. Picture tags
            this.collectFromPicture();

            // 7. SVG images
            this.collectFromSVG();

            console.log(`✅ Намерени ${this.images.length} изображения`);

            // Auto enhance
            if (autoEnhance) {
                this.images = this.enhancer.enhanceAll(this.images);
                console.log(`🔍 След enhance: ${this.images.length} изображения`);
            }

            return this.images;
        }

        collectFromImgTags() {
            document.querySelectorAll('img').forEach(img => {
                const src = img.currentSrc || img.src;
                this.addImage(src, {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    alt: img.alt || '',
                    source: 'img'
                });
            });
        }

        collectFromBackgrounds() {
            document.querySelectorAll('*').forEach(el => {
                const bg = window.getComputedStyle(el).backgroundImage;
                if (bg && bg !== 'none') {
                    const matches = bg.matchAll(/url\(['"]?([^'")]+)['"]?\)/g);
                    for (const match of matches) {
                        this.addImage(match[1], {
                            width: 0,
                            height: 0,
                            source: 'background'
                        });
                    }
                }
            });
        }

        collectFromSrcset() {
            document.querySelectorAll('[srcset]').forEach(el => {
                const srcset = el.srcset;
                if (!srcset) return;

                // Parse srcset - взима най-голямата версия
                const sources = srcset.split(',').map(s => s.trim());
                let bestUrl = '';
                let bestSize = 0;

                sources.forEach(source => {
                    const parts = source.split(/\s+/);
                    const url = parts[0];
                    const descriptor = parts[1] || '1x';

                    // Извлича размера
                    let size = 1;
                    if (descriptor.endsWith('w')) {
                        size = parseInt(descriptor);
                    } else if (descriptor.endsWith('x')) {
                        size = parseFloat(descriptor) * 1000;
                    }

                    if (size > bestSize) {
                        bestSize = size;
                        bestUrl = url;
                    }
                });

                if (bestUrl) {
                    this.addImage(bestUrl, {
                        source: 'srcset',
                        descriptor: bestSize + 'w'
                    });
                }
            });
        }

        collectFromLazyLoad() {
            // Често срещани lazy load атрибути
            const lazyAttrs = [
                'data-src', 'data-lazy', 'data-original',
                'data-echo', 'data-lazy-src', 'data-img',
                'data-background-image'
            ];

            const selector = lazyAttrs.map(attr => `[${attr}]`).join(',');

            document.querySelectorAll(selector).forEach(el => {
                lazyAttrs.forEach(attr => {
                    const src = el.getAttribute(attr);
                    if (src) {
                        this.addImage(src, {
                            source: 'lazy-load',
                            attr: attr
                        });
                    }
                });
            });
        }

        async collectFromCanvas() {
            const canvases = document.querySelectorAll('canvas');
            console.log(`🎨 Намерени ${canvases.length} canvas елемента`);

            const promises = Array.from(canvases).map((canvas, index) => {
                return new Promise((resolve) => {
                    try {
                        canvas.toBlob(blob => {
                            if (blob) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    this.addImage(reader.result, {
                                        width: canvas.width,
                                        height: canvas.height,
                                        source: 'canvas',
                                        index: index
                                    });
                                    resolve();
                                };
                                reader.readAsDataURL(blob);
                            } else {
                                resolve();
                            }
                        }, 'image/png');
                    } catch (e) {
                        console.warn('Canvas extraction failed:', e);
                        resolve();
                    }
                });
            });

            await Promise.all(promises);
        }

        collectFromPicture() {
            document.querySelectorAll('picture').forEach(picture => {
                const sources = picture.querySelectorAll('source');
                sources.forEach(source => {
                    if (source.srcset) {
                        const srcset = source.srcset;
                        const sources = srcset.split(',').map(s => s.trim());
                        let bestUrl = '';
                        let bestSize = 0;

                        sources.forEach(source => {
                            const parts = source.split(/\s+/);
                            const url = parts[0];
                            const descriptor = parts[1] || '1x';

                            let size = 1;
                            if (descriptor.endsWith('w')) {
                                size = parseInt(descriptor);
                            } else if (descriptor.endsWith('x')) {
                                size = parseFloat(descriptor) * 1000;
                            }

                            if (size > bestSize) {
                                bestSize = size;
                                bestUrl = url;
                            }
                        });

                        if (bestUrl) {
                            this.addImage(bestUrl, {
                                source: 'picture',
                            });
                        }
                    }
                });

                // Fallback img
                const img = picture.querySelector('img');
                if (img && img.src) {
                    this.addImage(img.src, {
                        source: 'picture',
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    });
                }
            });
        }

        collectFromSVG() {
            document.querySelectorAll('svg image').forEach(img => {
                const href = img.getAttribute('href') || img.getAttribute('xlink:href');
                if (href) {
                    this.addImage(href, {
                        source: 'svg'
                    });
                }
            });
        }

        addImage(url, metadata = {}) {
            if (!url || this.seen.has(url)) return;

            // Clean URL
            url = this.cleanUrl(url);

            if (!this.isValidImageUrl(url)) return;

            this.seen.add(url);
            this.images.push({
                url: url,
                width: metadata.width || 0,
                height: metadata.height || 0,
                alt: metadata.alt || '',
                source: metadata.source || 'unknown',
                ...metadata
            });
        }

        cleanUrl(url) {
            if (url.startsWith('//')) {
                url = window.location.protocol + url;
            } else if (url.startsWith('/')) {
                url = window.location.origin + url;
            }

            return url.replace(/['"]/g, '').trim();
        }

        isValidImageUrl(url) {
            if (!url) return false;
            if (url.startsWith('data:image/')) return true;

            const imagePattern = /\.(jpe?g|png|gif|webp|svg|bmp)($|\?|#)/i;
            const hasImageExt = imagePattern.test(url);
            const hasImageIndicator = url.includes('/image') ||
                                     url.includes('/img') ||
                                     url.includes('/photo');

            return hasImageExt || hasImageIndicator;
        }

        // Динамично следене за нови изображения
        startObserving(callback) {
            this.observer = new MutationObserver((mutations) => {
                let hasNewImages = false;

                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'IMG') {
                                const src = node.currentSrc || node.src;
                                if (src && !this.seen.has(src)) {
                                    this.addImage(src, {
                                        width: node.naturalWidth,
                                        height: node.naturalHeight,
                                        source: 'dynamic'
                                    });
                                    hasNewImages = true;
                                }
                            }

                            const imgs = node.querySelectorAll?.('img');
                            imgs?.forEach(img => {
                                const src = img.currentSrc || img.src;
                                if (src && !this.seen.has(src)) {
                                    this.addImage(src, {
                                        width: img.naturalWidth,
                                        height: img.naturalHeight,
                                        source: 'dynamic'
                                    });
                                    hasNewImages = true;
                                }
                            });
                        }
                    });
                });

                if (hasNewImages && callback) {
                    callback(this.images);
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            console.log('👁️ Динамично следене активирано');
        }

        stopObserving() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
                console.log('👁️ Динамично следене спряно');
            }
        }
    }

    // ============================================================================
    // DOWNLOAD MANAGER - Сваля файлове
    // ============================================================================
    class DownloadManager {
        constructor() {
            this.queue = [];
            this.downloading = false;
        }

        async downloadSingle(url, filename) {
            try {
                if (url.startsWith('data:')) {
                    // Data URL - преобразува и сваля
                    this.saveDataUrl(url, filename);
                    return true;
                }

                // Regular URL - използва Chrome downloads API
                return new Promise((resolve) => {
                    chrome.runtime.sendMessage({
                        action: 'download',
                        url: url,
                        filename: filename
                    }, (response) => {
                        resolve(response && response.success);
                    });
                });
            } catch (error) {
                console.error('Download error:', url, error);
                return false;
            }
        }

        async downloadBatch(images, prefix = 'image', onProgress = null) {
            let success = 0;
            let failed = 0;
            const total = images.length;

            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const ext = this.getExtension(img.url);
                const filename = `${prefix}_${String(i + 1).padStart(4, '0')}.${ext}`;

                const ok = await this.downloadSingle(img.url, filename);
                if (ok) success++;
                else failed++;

                if (onProgress) {
                    onProgress({
                        current: i + 1,
                        total: total,
                        success: success,
                        failed: failed,
                        percent: Math.round(((i + 1) / total) * 100)
                    });
                }

                // Малка пауза между downloads
                await new Promise(r => setTimeout(r, 200));
            }

            return { success, failed, total };
        }

        async createZip(images, filename = 'images', onProgress = null) {
            const zip = new JSZip();
            const folder = zip.folder('images');

            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const url = img.url;

                try {
                    let blob;

                    if (url.startsWith('data:')) {
                        // Convert data URL to blob
                        blob = this.dataUrlToBlob(url);
                    } else {
                        // Fetch the image
                        const response = await fetch(url);
                        blob = await response.blob();
                    }

                    const ext = this.getExtension(url, blob.type);
                    const name = `image_${String(i + 1).padStart(4, '0')}.${ext}`;
                    folder.file(name, blob);

                    if (onProgress) {
                        onProgress({
                            current: i + 1,
                            total: images.length,
                            percent: Math.round(((i + 1) / images.length) * 100)
                        });
                    }
                } catch (error) {
                    console.error('Failed to add to ZIP:', url, error);
                }
            }

            console.log('📦 Генериране на ZIP файл...');
            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });

            saveAs(content, `${filename}.zip`);
            console.log('✅ ZIP файлът е готов!');
        }

        dataUrlToBlob(dataUrl) {
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new Blob([u8arr], { type: mime });
        }

        saveDataUrl(dataUrl, filename) {
            const blob = this.dataUrlToBlob(dataUrl);
            saveAs(blob, filename);
        }

        getExtension(url, mimeType = null) {
            // From MIME type
            if (mimeType) {
                const map = {
                    'image/jpeg': 'jpg',
                    'image/png': 'png',
                    'image/gif': 'gif',
                    'image/webp': 'webp',
                    'image/svg+xml': 'svg',
                    'image/bmp': 'bmp'
                };
                if (map[mimeType]) return map[mimeType];
            }

            // From URL
            const match = url.match(/\.([a-z0-9]+)(?:[\?#]|$)/i);
            return match ? match[1].toLowerCase() : 'jpg';
        }
    }

    // ============================================================================
    // UI MANAGER - Интерфейс
    // ============================================================================
    class UI {
        constructor() {
            this.container = null;
            this.images = [];
            this.filteredImages = [];
            this.selected = new Set();
            this.settings = {
                autoEnhance: true,
                includeCanvas: true,
                includeLazyLoad: true,
                minWidth: 0,
                maxWidth: 10000,
                minHeight: 0,
                maxHeight: 10000
            };
            this.loadSettings();
        }

        async loadSettings() {
            try {
                const result = await chrome.storage.local.get([
                    'autoEnhance', 'includeCanvas', 'includeLazyLoad',
                    'minWidth', 'maxWidth', 'minHeight', 'maxHeight'
                ]);

                if (result.autoEnhance !== undefined) this.settings.autoEnhance = result.autoEnhance;
                if (result.includeCanvas !== undefined) this.settings.includeCanvas = result.includeCanvas;
                if (result.includeLazyLoad !== undefined) this.settings.includeLazyLoad = result.includeLazyLoad;
                if (result.minWidth !== undefined) this.settings.minWidth = result.minWidth;
                if (result.maxWidth !== undefined) this.settings.maxWidth = result.maxWidth;
                if (result.minHeight !== undefined) this.settings.minHeight = result.minHeight;
                if (result.maxHeight !== undefined) this.settings.maxHeight = result.maxHeight;
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        }

        async saveSettings() {
            try {
                await chrome.storage.local.set(this.settings);
            } catch (error) {
                console.error('Failed to save settings:', error);
            }
        }

        show(images) {
            this.images = images;
            this.filteredImages = images;
            this.selected.clear();

            if (this.container) {
                this.container.remove();
            }

            this.createUI();
            this.applyFilters();
        }

        createUI() {
            this.injectStyles();

            this.container = document.createElement('div');
            this.container.id = 'img-dl-container';
            this.container.innerHTML = `
                <div class="img-dl-header">
                    <h2>📥 Image Downloader Ultimate</h2>
                    <div class="img-dl-stats">
                        <span>Всички: <strong id="img-dl-total">${this.images.length}</strong></span>
                        <span>Показани: <strong id="img-dl-filtered">${this.filteredImages.length}</strong></span>
                        <span>Избрани: <strong id="img-dl-selected">0</strong></span>
                    </div>
                    <div class="img-dl-controls">
                        <button id="img-dl-toggle-filters">⚙️ Филтри</button>
                        <button id="img-dl-select-all">Избери всички</button>
                        <button id="img-dl-download" class="primary">⬇️ Свали</button>
                        <button id="img-dl-download-zip" class="primary">📦 ZIP</button>
                        <button id="img-dl-close" class="danger">✕</button>
                    </div>
                </div>

                <div class="img-dl-filters" id="img-dl-filters" style="display: none;">
                    <div class="img-dl-filter-row">
                        <label>
                            <input type="checkbox" id="filter-auto-enhance" ${this.settings.autoEnhance ? 'checked' : ''}>
                            🔍 Auto Big Image
                        </label>
                        <label>
                            <input type="checkbox" id="filter-canvas" ${this.settings.includeCanvas ? 'checked' : ''}>
                            🎨 Canvas
                        </label>
                        <label>
                            <input type="checkbox" id="filter-lazy" ${this.settings.includeLazyLoad ? 'checked' : ''}>
                            ⏳ Lazy Load
                        </label>
                    </div>
                    <div class="img-dl-filter-row">
                        <div class="img-dl-filter-group">
                            <label>Ширина:</label>
                            <input type="number" id="filter-min-width" value="${this.settings.minWidth}" min="0" placeholder="Min">
                            <span>-</span>
                            <input type="number" id="filter-max-width" value="${this.settings.maxWidth}" min="0" placeholder="Max">
                        </div>
                        <div class="img-dl-filter-group">
                            <label>Височина:</label>
                            <input type="number" id="filter-min-height" value="${this.settings.minHeight}" min="0" placeholder="Min">
                            <span>-</span>
                            <input type="number" id="filter-max-height" value="${this.settings.maxHeight}" min="0" placeholder="Max">
                        </div>
                        <button id="img-dl-apply-filters" class="primary">Приложи</button>
                    </div>
                </div>

                <div class="img-dl-gallery" id="img-dl-gallery">
                    <div class="img-dl-loading">Зареждане...</div>
                </div>

                <div class="img-dl-progress" id="img-dl-progress" style="display: none;">
                    <div class="img-dl-progress-bar">
                        <div class="img-dl-progress-fill" id="img-dl-progress-fill"></div>
                    </div>
                    <div class="img-dl-progress-text" id="img-dl-progress-text">0%</div>
                </div>
            `;

            document.body.appendChild(this.container);
            this.attachEvents();
        }

        renderImages() {
            const gallery = document.getElementById('img-dl-gallery');
            gallery.innerHTML = '';

            if (this.filteredImages.length === 0) {
                gallery.innerHTML = '<div class="img-dl-empty">Няма изображения с тези филтри</div>';
                return;
            }

            this.filteredImages.forEach((img, index) => {
                const card = document.createElement('div');
                card.className = 'img-dl-card';
                card.dataset.index = index;

                const enhancedBadge = img.isEnhanced ?
                    '<span class="img-dl-badge enhanced">🔍</span>' : '';

                const sourceBadge = img.source === 'canvas' ?
                    '<span class="img-dl-badge canvas">🎨</span>' :
                    img.source === 'lazy-load' ?
                    '<span class="img-dl-badge lazy">⏳</span>' : '';

                card.innerHTML = `
                    <img src="${img.url}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23333%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23666%22%3EError%3C/text%3E%3C/svg%3E'">
                    <div class="img-dl-overlay">
                        <div class="img-dl-badges">
                            ${enhancedBadge}
                            ${sourceBadge}
                        </div>
                        <div class="img-dl-checkbox"></div>
                    </div>
                    <div class="img-dl-info">
                        ${img.width} × ${img.height}
                    </div>
                `;

                card.addEventListener('click', () => this.toggleImage(index));
                gallery.appendChild(card);
            });
        }

        toggleImage(index) {
            if (this.selected.has(index)) {
                this.selected.delete(index);
            } else {
                this.selected.add(index);
            }
            this.updateUI();
        }

        selectAll() {
            if (this.selected.size === this.filteredImages.length) {
                this.selected.clear();
            } else {
                this.filteredImages.forEach((_, i) => this.selected.add(i));
            }
            this.updateUI();
        }

        updateUI() {
            document.getElementById('img-dl-selected').textContent = this.selected.size;

            this.container.querySelectorAll('.img-dl-card').forEach((card, index) => {
                if (this.selected.has(index)) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });
        }

        applyFilters() {
            const minWidth = parseInt(document.getElementById('filter-min-width')?.value || this.settings.minWidth);
            const maxWidth = parseInt(document.getElementById('filter-max-width')?.value || this.settings.maxWidth);
            const minHeight = parseInt(document.getElementById('filter-min-height')?.value || this.settings.minHeight);
            const maxHeight = parseInt(document.getElementById('filter-max-height')?.value || this.settings.maxHeight);

            this.filteredImages = this.images.filter(img => {
                const w = img.width || 0;
                const h = img.height || 0;
                return w >= minWidth && w <= maxWidth && h >= minHeight && h <= maxHeight;
            });

            document.getElementById('img-dl-filtered').textContent = this.filteredImages.length;
            this.selected.clear();
            this.renderImages();
        }

        async downloadSelected() {
            if (this.selected.size === 0) {
                alert('Моля избери поне едно изображение!');
                return;
            }

            const selectedImages = Array.from(this.selected).map(i => this.filteredImages[i]);
            const prefix = prompt('Име на файловете:', 'image') || 'image';

            this.showProgress();
            const manager = new DownloadManager();

            const result = await manager.downloadBatch(selectedImages, prefix, (progress) => {
                this.updateProgress(progress.percent, `${progress.current}/${progress.total}`);
            });

            this.hideProgress();
            alert(`Готово!\n✅ Успешни: ${result.success}\n❌ Грешки: ${result.failed}`);
        }

        async downloadZip() {
            if (this.selected.size === 0) {
                alert('Моля избери поне едно изображение!');
                return;
            }

            const selectedImages = Array.from(this.selected).map(i => this.filteredImages[i]);
            const filename = prompt('Име на ZIP файла:', 'images') || 'images';

            this.showProgress();
            const manager = new DownloadManager();

            await manager.createZip(selectedImages, filename, (progress) => {
                this.updateProgress(progress.percent, `${progress.current}/${progress.total}`);
            });

            this.hideProgress();
        }

        showProgress() {
            document.getElementById('img-dl-progress').style.display = 'block';
        }

        hideProgress() {
            document.getElementById('img-dl-progress').style.display = 'none';
        }

        updateProgress(percent, text) {
            document.getElementById('img-dl-progress-fill').style.width = percent + '%';
            document.getElementById('img-dl-progress-text').textContent = text;
        }

        attachEvents() {
            document.getElementById('img-dl-close').addEventListener('click', () => {
                this.container.remove();
            });

            document.getElementById('img-dl-select-all').addEventListener('click', () => {
                this.selectAll();
            });

            document.getElementById('img-dl-download').addEventListener('click', () => {
                this.downloadSelected();
            });

            document.getElementById('img-dl-download-zip').addEventListener('click', () => {
                this.downloadZip();
            });

            document.getElementById('img-dl-toggle-filters').addEventListener('click', () => {
                const filters = document.getElementById('img-dl-filters');
                filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
            });

            document.getElementById('img-dl-apply-filters').addEventListener('click', () => {
                this.applyFilters();
            });

            // Settings change
            ['filter-auto-enhance', 'filter-canvas', 'filter-lazy'].forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.addEventListener('change', (e) => {
                        const key = id.replace('filter-', '');
                        const settingKey = key === 'auto-enhance' ? 'autoEnhance' :
                                          key === 'canvas' ? 'includeCanvas' : 'includeLazyLoad';
                        this.settings[settingKey] = e.target.checked;
                        this.saveSettings();
                    });
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.container) {
                    this.container.remove();
                }
            });
        }

        injectStyles() {
            if (document.getElementById('img-dl-styles')) return;

            const style = document.createElement('style');
            style.id = 'img-dl-styles';
            style.textContent = `
                #img-dl-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 999999;
                    display: flex;
                    flex-direction: column;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                .img-dl-header {
                    background: #1a1a1a;
                    color: white;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    border-bottom: 2px solid #333;
                    flex-wrap: wrap;
                }

                .img-dl-header h2 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                }

                .img-dl-stats {
                    display: flex;
                    gap: 15px;
                    color: #aaa;
                    font-size: 13px;
                }

                .img-dl-stats strong {
                    color: #4CAF50;
                    font-weight: 600;
                }

                .img-dl-controls {
                    margin-left: auto;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .img-dl-controls button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    background: #333;
                    color: white;
                    transition: all 0.2s;
                    font-weight: 500;
                }

                .img-dl-controls button:hover {
                    background: #444;
                    transform: translateY(-1px);
                }

                .img-dl-controls button.primary {
                    background: #4CAF50;
                }

                .img-dl-controls button.primary:hover {
                    background: #45a049;
                }

                .img-dl-controls button.danger {
                    background: #f44336;
                }

                .img-dl-controls button.danger:hover {
                    background: #da190b;
                }

                .img-dl-filters {
                    background: #222;
                    padding: 15px 20px;
                    border-bottom: 1px solid #333;
                }

                .img-dl-filter-row {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    margin-bottom: 10px;
                    flex-wrap: wrap;
                }

                .img-dl-filter-row:last-child {
                    margin-bottom: 0;
                }

                .img-dl-filter-row label {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #ccc;
                    font-size: 13px;
                    cursor: pointer;
                }

                .img-dl-filter-row input[type="checkbox"] {
                    cursor: pointer;
                }

                .img-dl-filter-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #ccc;
                    font-size: 13px;
                }

                .img-dl-filter-group input[type="number"] {
                    width: 80px;
                    padding: 6px 8px;
                    background: #333;
                    border: 1px solid #444;
                    border-radius: 4px;
                    color: white;
                    font-size: 13px;
                }

                .img-dl-gallery {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 15px;
                    align-content: start;
                }

                .img-dl-loading,
                .img-dl-empty {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px;
                    color: #666;
                    font-size: 16px;
                }

                .img-dl-card {
                    background: #222;
                    border: 2px solid #333;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }

                .img-dl-card:hover {
                    border-color: #4CAF50;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }

                .img-dl-card.selected {
                    border-color: #4CAF50;
                    box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
                }

                .img-dl-card img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    display: block;
                }

                .img-dl-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 200px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    padding: 10px;
                    opacity: 0;
                    transition: opacity 0.2s;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 50%);
                }

                .img-dl-card:hover .img-dl-overlay,
                .img-dl-card.selected .img-dl-overlay {
                    opacity: 1;
                }

                .img-dl-badges {
                    display: flex;
                    gap: 5px;
                }

                .img-dl-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                }

                .img-dl-badge.enhanced {
                    background: #FF9800;
                    color: white;
                }

                .img-dl-badge.canvas {
                    background: #9C27B0;
                    color: white;
                }

                .img-dl-badge.lazy {
                    background: #2196F3;
                    color: white;
                }

                .img-dl-checkbox {
                    width: 24px;
                    height: 24px;
                    border: 2px solid white;
                    border-radius: 4px;
                    background: rgba(0, 0, 0, 0.7);
                    position: relative;
                    flex-shrink: 0;
                }

                .img-dl-card.selected .img-dl-checkbox {
                    background: #4CAF50;
                    border-color: #4CAF50;
                }

                .img-dl-card.selected .img-dl-checkbox::after {
                    content: '✓';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                }

                .img-dl-info {
                    padding: 10px;
                    background: #1a1a1a;
                    color: #4CAF50;
                    font-size: 12px;
                    text-align: center;
                    font-weight: 600;
                }

                .img-dl-progress {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #1a1a1a;
                    padding: 20px 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                    min-width: 300px;
                }

                .img-dl-progress-bar {
                    height: 8px;
                    background: #333;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 10px;
                }

                .img-dl-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4CAF50, #45a049);
                    transition: width 0.3s;
                    border-radius: 4px;
                }

                .img-dl-progress-text {
                    text-align: center;
                    color: #4CAF50;
                    font-size: 14px;
                    font-weight: 600;
                }

                /* Scrollbar */
                .img-dl-gallery::-webkit-scrollbar {
                    width: 10px;
                }

                .img-dl-gallery::-webkit-scrollbar-track {
                    background: #1a1a1a;
                }

                .img-dl-gallery::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 5px;
                }

                .img-dl-gallery::-webkit-scrollbar-thumb:hover {
                    background: #444;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ============================================================================
    // APP - Главно приложение
    // ============================================================================
    class App {
        constructor() {
            this.collector = new ImageCollector();
            this.ui = new UI();
            this.isOpen = false;
        }

        async start() {
            if (this.isOpen) {
                this.ui.container?.remove();
                this.isOpen = false;
                return;
            }

            this.isOpen = true;
            console.log('🚀 Image Downloader Ultimate стартира...');

            const images = await this.collector.collect({
                includeCanvas: this.ui.settings.includeCanvas,
                includeLazyLoad: this.ui.settings.includeLazyLoad,
                autoEnhance: this.ui.settings.autoEnhance
            });

            this.ui.show(images);
        }
    }

    // ============================================================================
    // ИНИЦИАЛИЗАЦИЯ
    // ============================================================================
    const app = new App();

    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'start') {
            app.start();
            sendResponse({ success: true });
        }
        return true;
    });

    // Hotkey - Alt+W
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'w') {
            e.preventDefault();
            app.start();
        }
    });

    console.log('✅ Image Downloader Ultimate зареден!');
    console.log('📌 Натисни Alt+W за да стартираш или използвай extension бутона');
    console.log('🔍 Features: Auto Big Image, Canvas, Lazy Load, ZIP, Filters');
})();
