/**
 * skin.js — przełącznik stylu graficznego (same ikony):
 *   ledger    — A „Zeszyt ekonomisty”
 *   market    — B „Parkiet giełdowy”
 *   classroom — C „Tablica w klasie”
 * Każdy styl ma wersję jasną i ciemną (niezależny przełącznik theme.js).
 * Buttons: [data-skin-value="ledger|market|classroom"]. Styles: css/skins/*.css
 */
(function (NS) {
  'use strict';

  const STORAGE_KEY = 'skin';
  const SKINS = ['ledger', 'market', 'classroom'];
  const DEFAULT_SKIN = 'ledger';

  function current() {
    const s = document.documentElement.getAttribute('data-skin');
    return SKINS.indexOf(s) === -1 ? DEFAULT_SKIN : s;
  }

  function apply(skin) {
    document.documentElement.setAttribute('data-skin', skin);
    document.querySelectorAll('[data-skin-value]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-skin-value') === skin));
    });
  }

  function set(skin) {
    if (SKINS.indexOf(skin) === -1) return;
    NS.Storage.set(STORAGE_KEY, skin);
    apply(skin);
  }

  function init() {
    const stored = NS.Storage.get(STORAGE_KEY, null);
    apply(SKINS.indexOf(stored) === -1 ? DEFAULT_SKIN : stored);
    document.querySelectorAll('[data-skin-value]').forEach((btn) => {
      btn.addEventListener('click', () => set(btn.getAttribute('data-skin-value')));
    });
  }

  NS.Skin = { init, set, current, SKINS };
})(globalThis.BizTest = globalThis.BizTest || {});
