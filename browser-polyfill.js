// browser-polyfill.js - Unified API for Chrome and Firefox

// Create a unified browser API that works in both Chrome and Firefox
if (typeof browser === 'undefined') {
  // Chrome/Chromium - wrap chrome APIs to match Firefox's promise-based APIs
  window.browser = {
    runtime: {
      sendMessage: (message) => {
        return new Promise((resolve, reject) => {
          chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          });
        });
      },
      onMessage: {
        addListener: (listener) => {
          chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            // Convert to promise-based handler
            const result = listener(message, sender);
            if (result instanceof Promise) {
              result.then(sendResponse);
              return true; // Will respond asynchronously
            } else {
              sendResponse(result);
            }
          });
        },
        removeListener: chrome.runtime.onMessage.removeListener.bind(chrome.runtime.onMessage)
      }
    },
    storage: {
      sync: {
        get: (keys) => {
          return new Promise((resolve) => {
            chrome.storage.sync.get(keys, resolve);
          });
        },
        set: (items) => {
          return new Promise((resolve) => {
            chrome.storage.sync.set(items, resolve);
          });
        }
      },
      onChanged: chrome.storage.onChanged
    },
    tabs: {
      query: (queryInfo) => {
        return new Promise((resolve) => {
          chrome.tabs.query(queryInfo, resolve);
        });
      },
      sendMessage: (tabId, message) => {
        return new Promise((resolve, reject) => {
          chrome.tabs.sendMessage(tabId, message, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          });
        });
      },
      remove: (tabId) => {
        return new Promise((resolve) => {
          chrome.tabs.remove(tabId, resolve);
        });
      },
      onUpdated: chrome.tabs.onUpdated,
      onRemoved: chrome.tabs.onRemoved
    },
    scripting: chrome.scripting ? {
      executeScript: (injection) => {
        return new Promise((resolve, reject) => {
          chrome.scripting.executeScript(injection, (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(result);
            }
          });
        });
      }
    } : undefined
  };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = browser;
}
