
# Meeting Tab Closer (Edge/Chrome) — v1.1.0

Auto-closes Teams & Zoom "join meeting" tabs after a configurable (and cancelable) timeout. Allows adding custom regex/wildcards for additional sites.

Unabashedly created through guided AI generation.

## Download & Install

### Option 1: Download Latest Release (Recommended)
1. **[Download the latest release](https://github.com/seanfisher/meeting-tab-closer-extension/releases/latest/download/meeting-tab-closer.zip)** 
2. Extract the zip file to a folder
3. Open `chrome://extensions` or `edge://extensions`
4. Enable **Developer mode** (toggle in top-right)
5. Click **Load unpacked** and select the extracted folder

### Option 2: Manual Installation
1. Download or clone this repository
2. Open `chrome://extensions` or `edge://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the repository folder

## Files
- `manifest.json` — MV3 manifest
- `background.js` — detects matches, coordinates countdown and closes tab
- `content.js` — draws the overlay + cancel button using a Shadow DOM
- `popup.html`, `popup.js`, `styles.css` — settings UI
- `icons/` — favicons

## Permissions
- `"tabs"`, `"storage"`, `"scripting"`
- `host_permissions` for Zoom & Teams pages

## Releases

New releases are automatically built and published when tags are pushed to the repository. Each release includes a ready-to-install zip file.

- **[Latest Release](https://github.com/seanfisher/meeting-tab-closer-extension/releases/latest)** - Download the most recent version
- **[All Releases](https://github.com/seanfisher/meeting-tab-closer-extension/releases)** - View release history and download specific versions

### Creating a New Release

**Option 1: Use the Release Script (Recommended)**
```bash
./release.sh 1.2.0
```
This automatically updates version numbers, commits changes, creates a git tag, and triggers the release workflow.

**Option 2: Manual Release via GitHub Actions**
1. Go to the GitHub repository → Actions tab
2. Select "Create Release" workflow  
3. Click "Run workflow"
4. Enter the version (e.g., `v1.2.0`)

**Option 3: Tag-based Release**
```bash
git tag v1.2.0
git push origin v1.2.0
```
The GitHub Action will automatically detect the new tag and create a release.

