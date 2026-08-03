// Function to format and ship events out of the page context
function broadcastActivity(actionType, extraMetadata = {}) {
  const activityLog = {
    eventType: actionType,
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
    details: extraMetadata
  };

  // Dispatch the message upwards to the Chrome Background Service Worker
  chrome.runtime.sendMessage({ type: "BROADCAST_ACTIVITY", payload: activityLog });
}

// Track mouse clicks
document.addEventListener("click", (event) => {
  broadcastActivity("MOUSE_CLICK", {
    element: event.target.tagName,
    id: event.target.id || null,
    className: event.target.className || null,
    text: event.target.innerText ? event.target.innerText.substring(0, 30) : ""
  });
});

// Track text input fields (Debounced slightly so it doesn't fire on every single keypress)
let inputTimeout;
document.addEventListener("input", (event) => {
  clearTimeout(inputTimeout);
  inputTimeout = setTimeout(() => {
    if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
      broadcastActivity("TEXT_INPUT", {
        element: event.target.tagName,
        name: event.target.name || null,
        type: event.target.type || "text"
      });
    }
  }, 1000); 
});