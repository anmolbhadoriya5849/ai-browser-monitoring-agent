const BACKEND_API_URL = "http://localhost:5001/api/track";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "BROADCAST_ACTIVITY") {
    const activityData = message.payload;

    // Capture the visible viewport of the active tab as a Base64 encoded PNG string
    chrome.tabs.captureVisibleTab(null, { format: "png", quality: 40 }, (base64ImageString) => {
      if (chrome.runtime.lastError || !base64ImageString) {
        console.warn("Could not capture screen snippet: ", chrome.runtime.lastError);
        return;
      }

      // Combine metadata with visual screen state
      const packedPayload = {
        ...activityData,
        screenshot: base64ImageString
      };

      // Ship payload directly over to the Express backend server
      fetch(BACKEND_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packedPayload)
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Server responded with status ${res.status}: ${errorText}`);
          }
          // CRUCIAL: You MUST return the parsed json here for the next .then() block!
          return res.json();
        })
        .then(data => {
          console.log("Successfully logged to database server:", data);
        })
        .catch(err => {
          console.error("Failed to sync data packet to backend:", err);
        });
    });
  }
});