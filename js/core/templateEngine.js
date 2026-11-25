/**
 * templateEngine.js — instancjonowanie zadań parametrycznych i podstawianie {{zmiennych}}.
 * Parametric task engine: samples variables, computes derived values, fills {{placeholders}}.
 */
(function (NS) {
  'use strict';

  const PLACEHOLDER = /\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g;
  const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;

  function decimalsOf(num) {
    const s = String(num);
    const dot = s.indexOf('.');
    return dot === -1 ? 0 : Math.min(4, s.length - dot - 1);
  }

  /** Losuje wartość pojedynczej zmiennej: {min,max,step} lub {values:[...]}. */
  function sampleVariable(def, rng) {
    if (Array.isArray(def.values) && def.values.length) return Number(rng.pick(def.values));
    const min = Number(def.min);
    const max = Number(def.max);
    const step = Number(def.step) || 1;
    return rng.stepped(Math.min(min, max), Math.max(min, max), step);
  }

  /**
   * Losuje zmienne i wylicza zmienne wtórne (derived) w kolejności zależności.
   * Zwraca { values, decimals } — decimals określa minimalną liczbę miejsc po przecinku przy wyświetlaniu.
   */
  function instantiate(question, rng) {
    const MP = NS.MathParser;
    const values = {};
    const decimals = {};

    Object.keys(question.variables || {}).forEach((name) => {
      const def = question.variables[name];
      values[name] = sampleVariable(def, rng);
      const ref = Array.isArray(def.values) && def.values.length ? def.values : [def.step || 1, def.min || 0];
      // liczby całkowite bez przecinka; ułamki z dokładnością kroku (np. 4,30 dla kroku 0.01)
      decimals[name] = Number.isInteger(values[name]) ? 0 : Math.max.apply(null, ref.map(decimalsOf));
    });

    const pending = Object.keys(question.derived || {}).map((name) => [name, question.derived[name]]);
    let progress = true;
    while (pending.length && progress) {
      progress = false;
      for (let i = 0; i < pending.length; ) {
        const [name, expr] = pending[i];
        const deps = MP.variablesOf(expr);
        if (deps.every((d) => Object.prototype.hasOwnProperty.call(values, d))) {
          const v = MP.evaluate(expr, values);
          values[name] = v;
          decimals[name] = Math.abs(v - Math.round(v)) < 1e-9 ? 0 : 2;
          pending.splice(i, 1);
          progress = true;
        } else {
          i++;
        }
      }
    }
    if (pending.length) {
      // wskaż pierwszą brakującą zmienną, by komunikat był pomocny
      const missing = MP.variablesOf(pending[0][1]).find(
        (d) => !Object.prototype.hasOwnProperty.call(values, d) && !pending.some((p) => p[0] === d)
      );
      throw new MP.MathError(missing ? 'unknownVariable' : 'circular', missing || pending.map((p) => p[0]).join(', '));
    }
    return { values, decimals };
  }

  /** Formatuje liczbę zgodnie z językiem (pl: 12 000,50 / en: 12,000.50). */
  function formatNumber(n, lang, minDecimals) {
    if (typeof n !== 'number' || !Number.isFinite(n)) return String(n);
    const min = Math.max(0, minDecimals || 0);
    const locale = lang === 'en' ? 'en-GB' : 'pl-PL';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: min,
      maximumFractionDigits: Math.max(2, min),
    }).format(n);
  }

  /** Renderuje szablon do bezpiecznego HTML z podstawionymi liczbami. */
  function render(template, instance, lang) {
    const escape = NS.Dom.escapeHtml;
    const values = (instance && instance.values) || {};
    const decimals = (instance && instance.decimals) || {};
    return escape(template)
      .replace(PLACEHOLDER, (match, name) =>
        Object.prototype.hasOwnProperty.call(values, name)
          ? '<span class="num">' + formatNumber(values[name], lang, decimals[name]) + '</span>'
          : '<span class="tpl-missing">' + match + '</span>'
      )
      .replace(/\n/g, '<br>');
  }

  /** Zwraca nazwy {{zmiennych}} użytych w szablonie. */
  function placeholdersOf(template) {
    const names = new Set();
    String(template || '').replace(PLACEHOLDER, (m, name) => names.add(name));
    return Array.from(names);
  }

  NS.TemplateEngine = { instantiate, render, formatNumber, placeholdersOf, IDENTIFIER, PLACEHOLDER };
})(globalThis.BizTest = globalThis.BizTest || {});
