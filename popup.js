document.addEventListener("DOMContentLoaded", function () {
    const brightnessSlider = document.getElementById("brightness");
    let brightnessValue = localStorage.getItem("brightness") || 0;
    function getBrightnessFromContent() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tabId = tabs[0].id;

            chrome.tabs.sendMessage(tabId, { action: "getBrightness" }, function (response) {
                if (chrome.runtime.lastError) {
                    // Handle error (e.g., content script not loaded)
                    console.error("Error getting brightness:", chrome.runtime.lastError);
                } else {
                    brightnessSlider.value = response.brightness || 0; // Update slider
                }
            });
        });
    }
    getBrightnessFromContent();
    brightnessSlider.addEventListener("input", function () {
        brightnessValue = parseInt(brightnessSlider.value, 10);
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
