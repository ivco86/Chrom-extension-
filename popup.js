// ============================================================================
// IMAGE DOWNLOADER ULTIMATE - Popup Script
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const helpBtn = document.getElementById('helpBtn');
    const infoPanel = document.getElementById('infoPanel');

    // Start button - activate the downloader on current tab
    startBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'start' }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error:', chrome.runtime.lastError);
                        alert('Моля презаредете страницата и опитайте отново.');
                    } else {
                        // Close popup after starting
                        window.close();
                    }
                });
            }
        });
    });

    // Help button - toggle info panel
    helpBtn.addEventListener('click', () => {
        if (infoPanel.style.display === 'none') {
            infoPanel.style.display = 'block';
            helpBtn.textContent = '✕ Затвори';
        } else {
            infoPanel.style.display = 'none';
            helpBtn.innerHTML = '<span>❓</span> Как работи';
        }
    });

    // Keyboard shortcut info
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            startBtn.click();
        } else if (e.key === 'Escape') {
            window.close();
        }
    });
});
