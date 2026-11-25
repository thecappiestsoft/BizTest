/**
 * events.js — minimalna szyna zdarzeń do komunikacji między widokami.
 * Tiny pub/sub bus so views stay decoupled.
 *
 * Zdarzenia / events:
 *   'customBank:changed'  — zmieniono listę własnych zadań nauczyciela
 *   'lang:changed'        — zmieniono język interfejsu
 */
(function (NS) {
  'use strict';

  const handlers = {};

  function on(name, fn) {
    (handlers[name] = handlers[name] || []).push(fn);
    return () => off(name, fn);
  }

  function off(name, fn) {
    handlers[name] = (handlers[name] || []).filter((h) => h !== fn);
  }

  function emit(name, payload) {
    (handlers[name] || []).forEach((fn) => {
      try {
        fn(payload);
      } catch (e) {
        console.error('[Bus]', name, e);
      }
    });
  }

  NS.Bus = { on, off, emit };
})(globalThis.BizTest = globalThis.BizTest || {});
