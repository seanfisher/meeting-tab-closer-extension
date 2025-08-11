// Meeting Tab Closer — background service worker

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
  customPatterns: [],  // array of strings (wildcards allowed)
};

// Convert a user string with wildcards or /regex/ to RegExp
function toRegex(patternStr) {
  const trimmed = patternStr.trim();
  if (!trimmed) return null;

  // If formatted like /.../i or /.../, treat as regex literal
  if (trimmed.startsWith("/") && trimmed.lastIndexOf("/") > 0) {
    const lastSlash = trimmed.lastIndexOf("/");
    const expr = trimmed.slice(1, lastSlash);
    const flags = trimmed.slice(lastSlash + 1) || "i";
    try { return new RegExp(expr, flags); } catch(e) { return null; }
  }

  // Otherwise treat as wildcard string: * means "anything"
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const wildcard = escaped.replace(/\\\*/g, ".*");
  return new RegExp("^" + wildcard + "$", "i");
}

function getAllRegexes() {
  const custom = (state.customPatterns || [])
    .map(toRegex)
    .filter(Boolean);
  return [...DEFAULT_PATTERNS, ...custom];
}

function matchesMeetingJoin(url) {
  try {
    const regs = getAllRegexes();
    return regs.some(rx => rx.test(url));
  } catch (e) {
    return false;
  }
}

// Load settings
function loadSettings() {
  chrome.storage.sync.get({
    enabled: true,
    delaySeconds: DEFAULT_DELAY_SECONDS,
    customPatterns: []
  }, (items) => {
    state.enabled = Boolean(items.enabled);
    state.delaySeconds = Number.isFinite(items.delaySeconds) ? Math.max(0, items.delaySeconds) : DEFAULT_DELAY_SECONDS;
    state.customPatterns = Array.isArray(items.customPatterns) ? items.customPatterns : [];
  });
}

// Keep settings live when changed
chrome.storage.onChanged.addListener((changes, area) => {
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

loadSettings();

// Track timers per tab to avoid duplicate close actions
const tabTimers = new Map();

function scheduleClose(tabId, url) {
  if (tabTimers.has(tabId)) clearTimeout(tabTimers.get(tabId));

  const ms = (state.delaySeconds || 0) * 1000;
  const timerId = setTimeout(async () => {
    try {
      const tab = await chrome.tabs.get(tabId);
      if (!tab || !tab.url) return;
      if (!state.enabled) return;
      if (matchesMeetingJoin(tab.url)) {
        await chrome.tabs.remove(tabId);
      }
    } catch (e) {
      // tab may be gone already; ignore
    } finally {
      tabTimers.delete(tabId);
    }
  }, ms);

  tabTimers.set(tabId, timerId);
}

function cancelScheduledClose(tabId) {
  if (tabTimers.has(tabId)) {
    clearTimeout(tabTimers.get(tabId));
    tabTimers.delete(tabId);
  }
}

// Listen for URL changes and page loads
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!state.enabled) return;
  const url = changeInfo.url || tab.url;
  if (!url) return;

  if (matchesMeetingJoin(url)) {
    scheduleClose(tabId, url);
  } else {
    cancelScheduledClose(tabId);
  }
});

// Clean up when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  cancelScheduledClose(tabId);
});
