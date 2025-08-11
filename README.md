
# Meeting Tab Closer (Edge/Chrome) — v1.1.0

Adds an on-page countdown overlay (with Cancel) before auto-closing Teams & Zoom “join meeting” tabs.

## Files
- `manifest.json` — MV3 manifest
- `background.js` — detects matches, coordinates countdown and closes tab
- `content.js` — draws the overlay + cancel button using a Shadow DOM
- `popup.html`, `popup.js`, `styles.css` — settings UI
- `icons/` — minimal placeholders

## Permissions
- `"tabs"`, `"storage"`
- `host_permissions` for Zoom & Teams pages

## Side-load
1. Download and extract `meeting-tab-closer-overlay.zip`.
2. Open `edge://extensions`, enable **Developer mode**.
3. Click **Load unpacked** and select the folder.

## Share with co-workers
- Submit to **Microsoft Edge Add-ons** (Partner Center) as **Private (organization only)** or **Unlisted**.
- Enterprises can deploy via policy after store publication.
