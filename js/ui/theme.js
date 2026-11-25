/**
 * theme.js — przełącznik motywu jasny / ciemny (same ikony).
 * Light / dark theme switch. Buttons: [data-theme-value="light|dark"].
 * Wstępny motyw ustawia mały skrypt w <head> index.html (bez „mignięcia”).
 */
(function (NS) {
  'use strict';

  const STORAGE_KEY = 'theme';
  const THEMES = ['light', 'dark'];

  function current() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-value]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-theme-value') === theme));
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#14171f' : '#ffffff');
  }

  function set(theme) {
    if (THEMES.indexOf(theme) === -1) return;
    NS.Storage.set(STORAGE_KEY, theme);
    apply(theme);
  }

  function init() {
    let theme = NS.Storage.get(STORAGE_KEY, null);
    if (THEMES.indexOf(theme) === -1) {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    apply(theme);
    document.querySelectorAll('[data-theme-value]').forEach((btn) => {
      btn.addEventListener('click', () => set(btn.getAttribute('data-theme-value')));
    });
  }

  NS.Theme = { init, set, current };
})(globalThis.BizTest = globalThis.BizTest || {});
