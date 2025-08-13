
# Meeting Tab Closer

A cross-browser extension that automatically closes Microsoft Teams and Zoom "join meeting" tabs after a configurable delay, with a cancelable countdown overlay.

*Unabashedly created through guided AI generation.*

## Features

- **Auto-close meeting tabs**: Detects Teams & Zoom meeting join pages and closes them automatically
- **Configurable delay**: Set how long to wait before closing (default: 3 seconds)
- **Cancelable countdown**: Shows an overlay with countdown that can be canceled
- **Custom URL patterns**: Add your own URL patterns for other meeting platforms
- **Easy toggle**: Enable/disable the extension quickly from the popup
- **Cross-browser support**: Works on both Chrome and Firefox

## Default Supported URLs

- Microsoft Teams: `teams.microsoft.com/l/meetup-join/*` and `teams.live.com/meet/*`
- Zoom: `*.zoom.us/wc/*`, `join.zoom.us/*`, and `*.zoom.us/j/*`

## Installation

### Chrome Web Store
*Coming soon*

### Firefox Add-ons
*Coming soon*

### Manual Installation

#### Chrome/Chromium/Edge
1. Download the latest Chrome release from [releases](https://github.com/seanfisher/meeting-tab-closer-extension/releases)
2. Extract the zip file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extension folder

#### Firefox
1. Download the latest Firefox release from [releases](https://github.com/seanfisher/meeting-tab-closer-extension/releases)
2. Extract the zip file
3. Open Firefox and go to `about:debugging`
4. Click "This Firefox"
5. Click "Load Temporary Add-on"
6. Select the `manifest.json` file from the Firefox build folder

## Configuration

Click the extension icon to open the popup and configure:

- **Enable auto-close**: Toggle the extension on/off
- **Delay**: Set countdown time in seconds (0-300)
- **Custom patterns**: Add URL patterns for other meeting platforms

### Custom URL Patterns

You can add patterns in two formats:
- **Wildcard**: `https://example.com/meeting/*`
- **Regex**: `/https?://custom\.meeting\.site/.*/i`

## How It Works

1. The extension monitors tab URLs when pages finish loading
2. When a matching meeting URL is detected, it shows a countdown overlay
3. After the delay expires, the tab is automatically closed
4. Users can click "Cancel" to prevent closing
5. The extension remembers canceled tabs to avoid re-triggering

## Browser Differences

### Chrome (Manifest V3)
- Uses service worker background script
- Dynamically injects content scripts
- Uses `chrome.*` APIs

### Firefox (Manifest V2)
- Uses persistent background script
- Pre-registers content scripts in manifest
- Uses `browser.*` APIs with promises

## Privacy

- No data is collected or transmitted
- All settings are stored locally in your browser
- No network requests are made by the extension

## Development

### Project Structure
```
meeting-tab-closer/
├── manifest.json           # Chrome extension manifest (MV3)
├── manifest-firefox.json   # Firefox extension manifest (MV2)
├── background.js           # Chrome service worker
├── background-firefox.js   # Firefox background script
├── content.js             # Chrome content script
├── content-firefox.js     # Firefox content script
├── popup.html             # Chrome popup UI
├── popup-firefox.html     # Firefox popup UI
├── popup.js               # Chrome popup functionality
├── popup-firefox.js       # Firefox popup functionality
├── styles.css             # Shared popup styles
├── icons/                 # Extension icons
├── build.sh               # Cross-platform build script
└── README.md              # This file
```

### Building

Build both Chrome and Firefox versions:
```bash
./build.sh
```

This creates:
- `build/meeting-tab-closer-chrome-[version].zip` - Chrome/Chromium/Edge version
- `build/meeting-tab-closer-firefox-[version].zip` - Firefox version

### Testing

1. **Chrome**: Load the `build/chrome-[version]` folder as an unpacked extension
2. **Firefox**: Load the `build/firefox-[version]/manifest.json` as a temporary add-on

## Browser Compatibility

- **Chrome**: Version 88+ (Manifest V3 support)
- **Firefox**: Version 57+ (WebExtensions API)
- **Edge**: Version 88+ (Chromium-based, uses Chrome version)
- **Safari**: Not currently supported (would require additional porting)

## Releases

### Creating a New Release

**Option 1: Use the Build Script**
```bash
./build.sh
```
This creates platform-specific builds in the `build/` directory.

**Option 2: Manual Release via GitHub Actions (Chrome only)**
```bash
./release.sh 1.2.0
```
This automatically updates version numbers, commits changes, creates a git tag, and triggers the release workflow for Chrome.

## License

MIT License - see LICENSE file for details.

