// Meeting Tab Closer — background script for Firefox (v1.1.0)

const DEFAULT_DELAY_SECONDS = 3;
const DEFAULT_PATTERNS = [
  /https?:\/\/(www\.)?teams\.microsoft\.com\/l\/meetup-join.*/i,
  /https?:\/\/(www\.)?teams\.live\.com\/meet.*/i,
  /https?:\/\/([\w-]+\.)?zoom\.us\/wc\/.*/i,
  /https?:\/\/join\.zoom\.us\/.*/i,
  /https?:\/\/([\w-]+\.)?zoom\.us\/j\/.*/i
];

const state = {
  enabled: true,
  delaySeconds: DEFAULT_DELAY_SECONDS,
  customPatterns: [],
};

// Convert user wildcard or /regex/ string to RegExp
function toRegex(patternStr) {
  const trimmed = patternStr.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/") && trimmed.lastIndexOf("/") > 0) {
    const lastSlash = trimmed.lastIndexOf("/");
    const expr = trimmed.slice(1, lastSlash);
    const flags = trimmed.slice(lastSlash + 1) || "i";
    try { return new RegExp(expr, flags); } catch(e) { return null; }
  }
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const wildcard = escaped.replace(/\\\*/g, ".*");
  return new RegExp("^" + wildcard + "$", "i");
}

function getAllRegexes() {
  const custom = (state.customPatterns || []).map(toRegex).filter(Boolean);
  return [...DEFAULT_PATTERNS, ...custom];
}

function matchesMeetingJoin(url) {
  try {
    return getAllRegexes().some(rx => rx.test(url));
  } catch { return false; }
}

// Load settings
function loadSettings() {
  browser.storage.sync.get({
    enabled: true,
    delaySeconds: DEFAULT_DELAY_SECONDS,
    customPatterns: []
  }).then((items) => {
    state.enabled = Boolean(items.enabled);
    state.delaySeconds = Number.isFinite(items.delaySeconds) ? Math.max(0, items.delaySeconds) : DEFAULT_DELAY_SECONDS;
    state.customPatterns = Array.isArray(items.customPatterns) ? items.customPatterns : [];
  });
}

loadSettings();

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  if (changes.enabled) state.enabled = Boolean(changes.enabled.newValue);
  if (changes.delaySeconds) {
    const v = Number(changes.delaySeconds.newValue);
    state.delaySeconds = Number.isFinite(v) ? Math.max(0, v) : DEFAULT_DELAY_SECONDS;
  }
  if (changes.customPatterns) {
    state.customPatterns = Array.isArray(changes.customPatterns.newValue) ? changes.customPatterns.newValue : [];
  }
});

// Track "canceled for this tab" across soft navigations
const canceled = new Set();

// Clean up canceled set when tabs are closed to prevent memory growth
browser.tabs.onRemoved.addListener((tabId) => {
  canceled.delete(tabId);
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!state.enabled) return;
  // Only act when the page is completely loaded
  if (changeInfo.status !== "complete") return;

  const url = tab.url;
  if (!url) return;

  if (matchesMeetingJoin(url)) {
    if (!canceled.has(tabId)) {
      try {
        // Send message to content script (it's already injected via manifest)
        await browser.tabs.sendMessage(tabId, {
          type: "mtc:start",
          delaySeconds: state.delaySeconds
        });
      } catch (error) {
        // Content script not available or tab doesn't allow it
        console.log('Failed to send message to content script:', error);
      }
    }
  } else {
    canceled.delete(tabId);
  }
});

browser.runtime.onMessage.addListener((msg, sender) => {
  return new Promise((resolve) => {
    const tabId = sender?.tab?.id;
    if (!tabId) {
      resolve();
      return;
    }
    
    if (msg.type === "mtc:cancel") {
      canceled.add(tabId);
      resolve({ ok: true });
    }
    
    if (msg.type === "mtc:closeMe") {
      browser.tabs.remove(tabId).catch(() => {});
      resolve();
    }
  });
});
