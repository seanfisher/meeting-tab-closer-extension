
# Meeting Tab Closer (Edge/Chrome) — v1.1.0

Auto-closes Teams & Zoom "join meeting" tabs after a configurable (and cancelable) timeout. Allows adding custom regex/wildcards for additional sites.

## Files
- `manifest.json` — MV3 manifest
- `background.js` — detects matches, coordinates countdown and closes tab
- `content.js` — draws the overlay + cancel button using a Shadow DOM
- `popup.html`, `popup.js`, `styles.css` — settings UI
- `icons/` — favicons

## Permissions
- `"tabs"`, `"storage"`, `"scripting"`
- `host_permissions` for Zoom & Teams pages

## How to Install (Side-load)
1. Download and extract `meeting-tab-closer-overlay.zip`.
2. Open `edge://extensions`, enable **Developer mode**.
3. Click **Load unpacked** and select the folder.
