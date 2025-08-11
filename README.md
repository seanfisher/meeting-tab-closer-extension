
# Meeting Tab Closer (Edge/Chrome extension)

Auto-closes Microsoft Teams and Zoom "join meeting" pages after a configurable delay.

## Files
- `manifest.json` — MV3 manifest (minimal permissions: `tabs`, `storage`)
- `background.js` — service worker that detects matching URLs and closes the tab after the delay
- `popup.html`, `popup.js`, `styles.css` — lightweight UI to enable/disable, set delay, and add custom URL patterns

## Default detection
- `https://teams.microsoft.com/l/meetup-join*`
- `https://teams.live.com/meet*`
- `https://*.zoom.us/wc/*`
- `https://join.zoom.us/*`
- `https://*.zoom.us/j/*`

You can add your own URLs using wildcards (`*`) or raw regexes (wrap in `/slashes/`).

## Build & install (side-load)
1. Download and extract `meeting-tab-closer.zip`.
2. In Edge, open `edge://extensions`.
3. Toggle **Developer mode** (upper-left).
4. Click **Load unpacked** and select the extracted folder.
5. The extension's puzzle-piece icon appears; click it to open settings.

## Share with co‑workers
- **Quick/shareable**: Send the folder or ZIP; co‑workers can also use **Load unpacked**.
- **Private/org listing (recommended)**: Create a Microsoft Partner Center account and submit to the **Microsoft Edge Add-ons** store. Choose visibility as **Private (organization only)** or **Unlisted** so only people with the link or within your org can install.
- **Enterprise managed**: IT can deploy via group policy (ExtensionInstallForcelist) after publishing to the store.

## Notes
- The extension waits the number of seconds you set, then re-checks the tab's URL before closing (so it won't close a tab that navigated away).
- All settings sync via your browser profile (using `chrome.storage.sync`).
