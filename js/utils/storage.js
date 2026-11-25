/**
 * storage.js — bezpieczna obsługa localStorage (JSON + prefiks kluczy).
 * Safe localStorage wrapper (JSON values, key prefix, no crashes in private mode).
 */
(function (NS) {
  'use strict';

  const PREFIX = 'biztest.';

  function available() {
    try {
      return typeof localStorage !== 'undefined';
    } catch (e) {
      return false;
    }
  }

  function get(key, fallback) {
    if (!available()) return fallback;
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function set(key, value) {
    if (!available()) return false;
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function remove(key) {
    if (!available()) return;
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (e) {
      /* ignore */
    }
  }

  NS.Storage = { get, set, remove, PREFIX };
})(globalThis.BizTest = globalThis.BizTest || {});
