/**
 * dom.js — drobne narzędzia DOM i tekstowe używane w całej aplikacji.
 * Small DOM / text helpers shared across the app.
 */
(function (NS) {
  'use strict';

  const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /** Zabezpiecza tekst przed wstrzyknięciem HTML. */
  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);
  }

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function debounce(fn, ms) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function truncate(text, max) {
    const s = String(text || '').replace(/\s+/g, ' ').trim();
    return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s;
  }

  /** Pobiera plik tekstowy (np. eksport JSON) bez serwera. */
  function downloadText(filename, text, mime) {
    const blob = new Blob([text], { type: (mime || 'application/json') + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file, 'utf-8');
    });
  }

  NS.Dom = { escapeHtml, $, $$, debounce, truncate, downloadText, readFileAsText };
})(globalThis.BizTest = globalThis.BizTest || {});
