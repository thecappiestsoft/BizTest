/**
 * i18n.js — obsługa języków interfejsu (PL / EN).
 * Lightweight i18n: dictionaries, t(), bilingual field picking, DOM binding.
 *
 * Atrybuty w HTML / HTML attributes:
 *   data-i18n="klucz"              → textContent
 *   data-i18n-html="klucz"         → innerHTML (tylko zaufane teksty ze słowników)
 *   data-i18n-placeholder="klucz"  → placeholder
 *   data-i18n-title="klucz"        → title
 *   data-i18n-aria="klucz"         → aria-label
 *
 * Aby dodać nowy język: utwórz js/i18n/locales/xx.js wywołujący
 * BizTest.I18n.register('xx', {...}) i dodaj 'xx' do SUPPORTED.
 */
(function (NS) {
  'use strict';

  const SUPPORTED = ['pl', 'en'];
  const DEFAULT_LANG = 'pl';
  const STORAGE_KEY = 'lang';

  const dictionaries = {};
  let current = DEFAULT_LANG;

  function register(code, dict) {
    dictionaries[code] = dict;
  }

  function lookup(dict, key) {
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : undefined), dict);
  }

  /** Tłumaczenie klucza; {param} w tekście zastępowane wartościami z params. */
  function t(key, params) {
    let value = lookup(dictionaries[current] || {}, key);
    if (value === undefined) value = lookup(dictionaries[DEFAULT_LANG] || {}, key);
    if (value === undefined) return key;
    if (typeof value === 'function') return value(params || {});
    if (!params) return value;
    return String(value).replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? params[k] : m));
  }

  /** Wybiera wersję językową pola: 'tekst' albo { pl: '...', en: '...' }. */
  function pick(value, lang) {
    if (value == null) return '';
    if (typeof value !== 'object') return String(value);
    const l = lang || current;
    if (value[l] != null) return value[l];
    if (value[DEFAULT_LANG] != null) return value[DEFAULT_LANG];
    const first = Object.keys(value)[0];
    return first ? value[first] : '';
  }

  /** Zwraca czytelny komunikat dla błędów parsera (MathError) i innych. */
  function error(err) {
    if (err && err.code) {
      const key = 'errors.math.' + err.code;
      const msg = t(key, { detail: err.detail });
      return msg === key ? err.message : msg;
    }
    return (err && err.message) || String(err);
  }

  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    scope.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    scope.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    if (!root) {
      document.documentElement.lang = current;
      document.title = t('app.documentTitle');
    }
  }

  function setLang(code) {
    if (SUPPORTED.indexOf(code) === -1 || code === current) return;
    current = code;
    NS.Storage.set(STORAGE_KEY, code);
    apply();
    NS.Bus.emit('lang:changed', code);
  }

  function init() {
    const stored = NS.Storage.get(STORAGE_KEY, null);
    if (SUPPORTED.indexOf(stored) !== -1) {
      current = stored;
    } else {
      const nav = (navigator.language || '').toLowerCase();
      current = nav.indexOf('pl') === 0 ? 'pl' : nav ? 'en' : DEFAULT_LANG;
    }
  }

  NS.I18n = {
    SUPPORTED,
    register,
    t,
    pick,
    error,
    apply,
    setLang,
    init,
    getLang: () => current,
  };
})(globalThis.BizTest = globalThis.BizTest || {});
