/**
 * languageSwitch.js — przełącznik języka PL | EN w nagłówku.
 * PL | EN language switch. Buttons: [data-lang="pl|en"].
 */
(function (NS) {
  'use strict';

  function sync() {
    const lang = NS.I18n.getLang();
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });
  }

  function init() {
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => NS.I18n.setLang(btn.getAttribute('data-lang')));
    });
    NS.Bus.on('lang:changed', sync);
    sync();
  }

  NS.LanguageSwitch = { init };
})(globalThis.BizTest = globalThis.BizTest || {});
