// ============================================================================
// IMAGE DOWNLOADER ULTIMATE - Background Service Worker
// ============================================================================

// Handle download requests from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'download') {
        // Download file using Chrome downloads API
        chrome.downloads.download({
            url: request.url,
            filename: request.filename,
            saveAs: false
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error('Download failed:', chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
                sendResponse({ success: true, downloadId: downloadId });
            }
        });

        // Return true to indicate async response
        return true;
    }

    if (request.action === 'activate') {
        // Send message to content script to start the app
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'start' }, (response) => {
                    sendResponse(response || { success: true });
                });
            }
        });
        return true;
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Send message to content script to toggle the UI
    chrome.tabs.sendMessage(tab.id, { action: 'start' });
});

console.log('✅ Image Downloader Ultimate background service worker loaded');
