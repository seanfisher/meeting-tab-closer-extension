// content-firefox.js — injects a small overlay with a cancelable countdown
(() => {
  // Prevent multiple instances if script is injected multiple times
  if (window.mtcInjected) return;
  window.mtcInjected = true;

  let overlayRoot, intervalId, secondsLeft, running = false;
  let messageListener; // Store listener reference for cleanup

  function ensureUI() {
    if (overlayRoot) return overlayRoot;

    const host = document.createElement('div');
    host.id = 'mtc-host';
    host.style.position = 'fixed';
    host.style.inset = '12px 12px auto auto';
    host.style.zIndex = 2147483647;
    host.style.pointerEvents = 'none';
    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({mode:'open'});
    const wrap = document.createElement('div');
    wrap.setAttribute('role','dialog');
    wrap.setAttribute('aria-live','polite');
    wrap.style.pointerEvents = 'auto';
    wrap.style.fontFamily = 'system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif';
    wrap.style.background = 'rgba(0,0,0,.8)';
    wrap.style.color = '#fff';
    wrap.style.padding = '10px 12px';
    wrap.style.borderRadius = '10px';
    wrap.style.boxShadow = '0 6px 20px rgba(0,0,0,.25)';
    wrap.style.minWidth = '240px';
    wrap.style.maxWidth = '320px';
    wrap.style.lineHeight = '1.35';
    wrap.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <div style="font-weight:600">Auto-close in <span id="mtc-count">–</span>s</div>
        <button id="mtc-cancel" style="margin-left:auto;padding:6px 10px;border-radius:8px;border:0;background:#ff5252;color:#fff;cursor:pointer;">Cancel</button>
      </div>
      <div style="font-size:12px;margin-top:6px;opacity:.9">
        This looks like a meeting join tab. Adjust or disable in the extension settings.
      </div>
    `;
    shadow.appendChild(wrap);

    shadow.getElementById('mtc-cancel').addEventListener('click', () => {
      stop();
      try { browser.runtime.sendMessage({type:'mtc:cancel'}); } catch {}
      destroy();
    });

    overlayRoot = { host, shadow, countEl: shadow.getElementById('mtc-count') };
    return overlayRoot;
  }

  function destroy() {
    stop(); // Ensure interval is cleared first
    if (overlayRoot?.host?.isConnected) overlayRoot.host.remove();
    overlayRoot = null;
  }

  function start(sec) {
    if (running) stop();
    running = true;
    ensureUI();
    secondsLeft = Math.max(0, parseInt(sec, 10) || 0);
    overlayRoot.countEl.textContent = secondsLeft;

    if (secondsLeft === 0) {
      stop();
      try { browser.runtime.sendMessage({type:'mtc:closeMe'}); } catch {}
      return;
    }

    intervalId = setInterval(() => {
      secondsLeft -= 1;
      if (overlayRoot?.countEl) overlayRoot.countEl.textContent = secondsLeft;
      if (secondsLeft <= 0) {
        stop();
        try { browser.runtime.sendMessage({type:'mtc:closeMe'}); } catch {}
      }
    }, 1000);
  }

  function stop() {
    running = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function cleanup() {
    stop();
    destroy();
    if (messageListener) {
      browser.runtime.onMessage.removeListener(messageListener);
      messageListener = null;
    }
  }

  // Store listener reference for cleanup
  messageListener = (msg) => {
    if (msg?.type === 'mtc:start') start(msg.delaySeconds);
  };
  browser.runtime.onMessage.addListener(messageListener);

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  window.addEventListener('pagehide', cleanup);
})();
