/**
 * toast.js — krótkie powiadomienia na dole ekranu.
 * Non-blocking toast notifications.
 */
(function (NS) {
  'use strict';

  function show(message, kind, ms) {
    const region = document.getElementById('toast-region');
    if (!region) return;
    const el = document.createElement('div');
    el.className = 'toast toast--' + (kind || 'info');
    el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    el.textContent = message;
    region.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-visible'));
    setTimeout(() => {
      el.classList.remove('is-visible');
      setTimeout(() => el.remove(), 300);
    }, ms || 3200);
  }

  NS.Toast = { show };
})(globalThis.BizTest = globalThis.BizTest || {});
