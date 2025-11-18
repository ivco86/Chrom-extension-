# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024

### Added
- Initial release of Image Downloader Ultimate Chrome Extension
- Auto Big Image enhancement for popular websites (Weibo, Twitter, Instagram, etc.)
- Canvas image extraction support
- Lazy load image detection
- ZIP archive download functionality
- Size filters (width/height)
- Batch download with progress indicator
- Image collection from multiple sources:
  - IMG tags
  - Background images
  - Srcset (responsive images)
  - Picture tags
  - SVG images
  - Canvas elements
- Settings persistence with Chrome Storage API
- Keyboard shortcut (Alt+W) for quick access
- Beautiful UI with dark theme
- Extension popup interface
- Background service worker for downloads
- Manifest V3 compatibility

### Features
- Support for 10+ popular image hosting services
- Dynamic image tracking with MutationObserver
- CORS-friendly download handling
- Automatic URL cleaning and validation
- Enhanced image badge indicators
- Select all/none functionality
- Real-time progress tracking

### Technical
- Manifest V3 implementation
- JSZip integration for archive creation
- FileSaver.js for file downloads
- Chrome Downloads API integration
- Chrome Storage API for settings
- Modern ES6+ JavaScript
- Responsive UI design
- SVG icon support

## Roadmap

### Future Enhancements
- [ ] Image preview modal
- [ ] Custom filename templates
- [ ] Export settings
- [ ] Image duplicate detection
- [ ] Video thumbnail extraction
- [ ] Cloud storage integration
- [ ] Custom site rules editor
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Statistics dashboard

### Bug Fixes
- None reported yet

---

## Version History

- **1.0.0** - Initial release
