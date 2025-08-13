# Firefox Extension Development Notes

## Key Differences from Chrome

### Manifest Version
- **Chrome**: Uses Manifest V3
- **Firefox**: Uses Manifest V2 (V3 support is still being developed)

### Background Scripts
- **Chrome**: Service workers (`"service_worker": "background.js"`)
- **Firefox**: Event pages (`"scripts": ["background.js"], "persistent": false`)

### Content Scripts
- **Chrome**: Dynamically injected via `chrome.scripting.executeScript()`
- **Firefox**: Pre-registered in manifest or injected via `browser.tabs.executeScript()`

### API Differences
- **Chrome**: Uses `chrome.*` namespace with callback-based APIs
- **Firefox**: Uses `browser.*` namespace with promise-based APIs

### Browser Action vs Page Action
- **Chrome**: `"action"` (Manifest V3) or `"browser_action"` (Manifest V2)
- **Firefox**: `"browser_action"` (Manifest V2)

## Firefox-Specific Features

### Application ID
Firefox extensions should include an application ID in the manifest:
```json
{
  "applications": {
    "gecko": {
      "id": "your-extension@your-domain.com",
      "strict_min_version": "57.0"
    }
  }
}
```

### Content Security Policy
Firefox has stricter CSP requirements. Avoid inline scripts and use external files.

### Permissions
Firefox requires more explicit permissions. Use `<all_urls>` instead of specific host permissions when possible for Firefox compatibility.

## Testing in Firefox

### Loading Temporary Add-on
1. Open Firefox
2. Go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the manifest.json file

### Using web-ext Tool
Install the web-ext tool for better Firefox development:
```bash
npm install -g web-ext
```

Then use it to run and test:
```bash
web-ext run  # Run in temporary Firefox instance
web-ext build  # Build extension package
web-ext lint  # Lint the extension
```

## Distribution

### Firefox Add-ons (AMO)
- Extensions must be signed by Mozilla
- Submit to addons.mozilla.org
- Review process is required

### Self-Hosting
- Extensions must be signed for distribution
- Use web-ext to build signed packages

## Common Issues

### Promise vs Callback APIs
Chrome uses callbacks, Firefox uses promises. Use the polyfill or handle both:
```javascript
// Chrome style
chrome.storage.sync.get(keys, (result) => {
  // handle result
});

// Firefox style
browser.storage.sync.get(keys).then((result) => {
  // handle result
});
```

### Content Script Injection
Chrome Manifest V3 requires dynamic injection, Firefox pre-registers:
```javascript
// Chrome MV3
await chrome.scripting.executeScript({
  target: { tabId },
  files: ['content.js']
});

// Firefox MV2 (pre-registered in manifest)
// Content scripts are automatically injected
```

### Background Script Lifecycle
- Chrome service workers can be terminated and restarted
- Firefox background scripts are more persistent
- Always handle script initialization properly

## Best Practices

1. **Use the browser polyfill** to maintain one codebase
2. **Test in both browsers** regularly during development
3. **Handle API differences** gracefully with feature detection
4. **Use promises** consistently (easier to polyfill callbacks than promises)
5. **Minimize permissions** to avoid Firefox's stricter security model
