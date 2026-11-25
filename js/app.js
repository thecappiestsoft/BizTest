/**
 * app.js — punkt wejścia aplikacji: inicjalizacja języka, motywu, zakładek i widoków.
 * App entry point: boots i18n, theme, tab routing (#generator / #builder) and views.
 */
(function (NS) {
  'use strict';

  const VIEWS = ['generator', 'builder'];

  function showView(name) {
    const view = VIEWS.indexOf(name) === -1 ? VIEWS[0] : name;
    VIEWS.forEach((v) => {
      const panel = document.getElementById('view-' + v);
      const tab = document.getElementById('tab-' + v);
      const active = v === view;
      panel.hidden = !active;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    syncHash(view);
  }

  /**
   * Zapisuje widok w adresie (#generator / #builder). W ramkach z ograniczeniami
   * (np. podgląd about:srcdoc) zmiana adresu jest zabroniona — wtedy ją pomijamy.
   */
  function syncHash(view) {
    try {
      if (location.hash !== '#' + view) history.replaceState(null, '', '#' + view);
    } catch (e) {
      /* adres nie może być zmieniony w tym środowisku — aplikacja działa dalej */
    }
  }

  function currentHash() {
    try {
      return location.hash.slice(1);
    } catch (e) {
      return '';
    }
  }

  function initTabs() {
    const tabs = Array.from(document.querySelectorAll('.tab[data-view]'));
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => showView(tab.getAttribute('data-view')));
      // nawigacja strzałkami zgodnie z wzorcem WAI-ARIA Tabs
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        showView(next.getAttribute('data-view'));
      });
    });
    window.addEventListener('hashchange', () => showView(currentHash()));
    showView(currentHash());
  }

  function boot() {
    NS.I18n.init();
    NS.I18n.apply();
    NS.Theme.init();
    NS.Skin.init();
    NS.Decorations.init();
    NS.LanguageSwitch.init();
    initTabs();
    NS.GeneratorView.init();
    NS.BuilderView.init();

    NS.Bus.on('lang:changed', () => {
      NS.GeneratorView.refresh();
      NS.BuilderView.refresh();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(globalThis.BizTest = globalThis.BizTest || {});
