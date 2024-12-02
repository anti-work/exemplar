document.addEventListener("DOMContentLoaded", async () => {
  const anonymizeButton = document.getElementById("anonymize");
  const apiKeyInput = document.getElementById("apiKey");
  const saveKeyButton = document.getElementById("saveKey");
  const statusDiv = document.getElementById("status");

  // Load saved API key if it exists
  try {
    const apiKey = localStorage.getItem("apiKey");
    if (apiKey) {
      apiKeyInput.value = apiKey;
      statusDiv.textContent = "API key loaded";
    }
  } catch (error) {
    console.error("Error loading API key:", error);
  }

  // Save API key
  saveKeyButton.addEventListener("click", async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      statusDiv.textContent = "Please enter an API key";
      return;
    }

    try {
      localStorage.setItem("apiKey", apiKey);
      statusDiv.textContent = "API key saved";
    } catch (error) {
      console.error("Error saving API key:", error);
      statusDiv.textContent = "Error saving API key";
    }
  });

  anonymizeButton.addEventListener("click", async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      statusDiv.textContent = "Please enter an API key first";
      return;
    }

    statusDiv.textContent = "Anonymizing page...";
    console.log("Button clicked");

    try {
      // Get current tab - works in both Chrome and Safari
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      const currentTab = tabs[0];

      if (!currentTab) {
        throw new Error("No active tab found");
      }

      const response = await browser.tabs.sendMessage(currentTab.id, {
        action: "anonymize",
        apiKey: apiKey,
      });

      console.log("Response from content script:", response);
      statusDiv.textContent = "Page anonymized!";
    } catch (error) {
      console.error("Extension error:", error);
      statusDiv.textContent = "Error: " + error.message;
    }
  });
});
