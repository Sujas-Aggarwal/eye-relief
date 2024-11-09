document.addEventListener("DOMContentLoaded", function () {
    const brightnessSlider = document.getElementById("brightness");

    brightnessSlider.addEventListener("input", function () {
        const brightnessValue = parseInt(brightnessSlider.value, 10);

        // Get the current tab and try to send a message to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tabId = tabs[0].id;

            chrome.tabs.sendMessage(tabId, { brightness: brightnessValue }, function (response) {
                // If there's an error, the content script might not be loaded
                if (chrome.runtime.lastError) {
                    // Inject content script if it's not present
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ["content.js"]
                    }, () => {
                        // Retry sending the message after injection
                        chrome.tabs.sendMessage(tabId, { brightness: brightnessValue });
                    });
                }
            });
        });
    });
});
