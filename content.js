// Create the overlay div
let overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.zIndex = "9999"; // Ensure it’s above all other content
overlay.style.pointerEvents = "none"; // Don’t interfere with interactions
document.body.appendChild(overlay);

// Retrieve saved brightness from localStorage or set to default 0
let brightnessValue = parseInt(localStorage.getItem("brightnessValue") || "0", 10);

// Function to update overlay based on brightness value
function updateOverlay() {
    overlay.style.backgroundColor = brightnessValue > 0 ? "white" : "black";
    overlay.style.opacity = Math.abs(brightnessValue) / 100;
    
    // Save the brightnessValue to localStorage
    localStorage.setItem("brightnessValue", brightnessValue.toString());
}

// Apply saved brightness setting on page load
updateOverlay();

// Listen for keydown events to detect Ctrl + Shift + Left/Right
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey) {
        if (event.key === "ArrowRight") {
            // Increase brightness up to a maximum of 100
            brightnessValue = Math.min(100, brightnessValue + 10);
            updateOverlay();
        } else if (event.key === "ArrowLeft") {
            // Decrease brightness down to a minimum of -100
            brightnessValue = Math.max(-100, brightnessValue - 10);
            updateOverlay();
        }
    }
});
