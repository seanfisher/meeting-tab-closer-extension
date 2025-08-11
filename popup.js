const enabledEl = document.getElementById('enabled');
const delayEl = document.getElementById('delay');
const patternsEl = document.getElementById('patterns');
const statusEl = document.getElementById('status');

const DEFAULT_DELAY_SECONDS = 3;

function setStatus(text) {
  statusEl.textContent = text;
  setTimeout(() => (statusEl.textContent = ""), 2000);
}

function load() {
  chrome.storage.sync.get({
    enabled: true,
    delaySeconds: DEFAULT_DELAY_SECONDS,
    customPatterns: []
  }, (items) => {
    enabledEl.checked = Boolean(items.enabled);
    delayEl.value = items.delaySeconds;
    patternsEl.value = (items.customPatterns || []).join("\n");
  });
}

document.getElementById('save').addEventListener('click', () => {
  const delay = Math.max(0, parseInt(delayEl.value, 10) || 0);
  const custom = patternsEl.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  chrome.storage.sync.set({
    enabled: enabledEl.checked,
    delaySeconds: delay,
    customPatterns: custom
  }, () => setStatus("Saved"));
});

document.getElementById('reset').addEventListener('click', () => {
  chrome.storage.sync.set({
    enabled: true,
    delaySeconds: DEFAULT_DELAY_SECONDS,
    customPatterns: []
  }, load);
});

document.getElementById('test').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    const delay = Math.max(0, parseInt(delayEl.value, 10) || DEFAULT_DELAY_SECONDS);
    try {
      // Inject the content script first
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      
      // Then send the message
      await chrome.tabs.sendMessage(tab.id, {
        type: "mtc:start",
        delaySeconds: delay
      });
      
      setStatus("Test started!");
    } catch (error) {
      setStatus("Doesn't work on this page.");
    }
  }
});

load();
