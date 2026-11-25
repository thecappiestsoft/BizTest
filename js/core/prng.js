/**
 * prng.js — deterministyczny generator liczb pseudolosowych Mulberry32.
 * Deterministic PRNG (Mulberry32) with seed-code handling.
 *
 * Ten sam kod SEED zawsze daje ten sam zestaw liczb, dzięki czemu
 * nauczyciel może odtworzyć sprawdzian i klucz odpowiedzi w przyszłości.
 */
(function (NS) {
  'use strict';

  /** Klasyczny Mulberry32 — zwraca funkcję dającą liczby z [0, 1). */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Hash FNV-1a — pozwala użyć dowolnego tekstu jako ziarna. */
  function hashString(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  /**
   * Normalizuje kod ziarna. "84920", "seed-84920" → { code: "SEED-84920", value: 84920 }.
   * Dowolny inny tekst jest haszowany. Pusty → null.
   */
  function parseSeed(input) {
    const raw = String(input == null ? '' : input).trim().toUpperCase();
    if (!raw) return null;
    const match = raw.match(/^(?:SEED-?)?(\d{1,9})$/);
    if (match) {
      const value = parseInt(match[1], 10);
      return { code: 'SEED-' + match[1], value };
    }
    return { code: raw, value: hashString(raw) };
  }

  function randomSeedCode() {
    return 'SEED-' + (10000 + Math.floor(Math.random() * 90000));
  }

  /** Usuwa błędy zmiennoprzecinkowe typu 0.30000000000000004. */
  function clean(n) {
    return parseFloat(n.toFixed(10));
  }

  /** Tworzy obiekt RNG z wygodnymi metodami. */
  function createRng(seedValue) {
    const next = mulberry32(seedValue);

    function int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    }

    /** Losuje wartość z przedziału [min, max] z krokiem step. */
    function stepped(min, max, step) {
      const s = step > 0 ? step : 1;
      const count = Math.floor(clean((max - min) / s));
      return clean(min + s * int(0, Math.max(0, count)));
    }

    function pick(list) {
      return list[int(0, list.length - 1)];
    }

    /** Tasowanie Fisher-Yates (zwraca nową tablicę). */
    function shuffle(list) {
      const arr = list.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = int(0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    return { next, int, stepped, pick, shuffle };
  }

  NS.PRNG = { mulberry32, hashString, parseSeed, randomSeedCode, createRng };
})(globalThis.BizTest = globalThis.BizTest || {});
