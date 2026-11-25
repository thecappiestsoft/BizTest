/**
 * customBank.js — własne zadania nauczyciela (localStorage + import/eksport JSON).
 * Teacher's custom question bank: persistence, validation, import/export.
 */
(function (NS) {
  'use strict';

  const STORAGE_KEY = 'customQuestions.v1';
  const EXPORT_FILENAME = 'moje_zadania.json';
  const TYPES = ['single_choice', 'true_false', 'open_short', 'parametric_math'];

  let cache = null;

  function list() {
    if (!cache) {
      const stored = NS.Storage.get(STORAGE_KEY, []);
      cache = Array.isArray(stored) ? stored : [];
    }
    return cache.slice();
  }

  function persist(items) {
    cache = items;
    NS.Storage.set(STORAGE_KEY, items);
    NS.Bus.emit('customBank:changed', items);
  }

  function get(id) {
    return list().find((q) => q.id === id) || null;
  }

  function newId() {
    return 'CUSTOM_' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
  }

  /** Dodaje lub aktualizuje zadanie. Zwraca zapisane zadanie. */
  function upsert(question) {
    const items = list();
    const q = Object.assign({}, question, { custom: true, updatedAt: new Date().toISOString() });
    if (!q.id || q.id === 'DRAFT') q.id = newId();
    const idx = items.findIndex((x) => x.id === q.id);
    if (idx === -1) items.push(q);
    else items[idx] = q;
    persist(items);
    return q;
  }

  function remove(id) {
    persist(list().filter((q) => q.id !== id));
  }

  /* ---------- Walidacja ---------- */

  function nonEmpty(v) {
    return NS.I18n.pick(v).trim().length > 0;
  }

  /** Zwraca listę przetłumaczonych komunikatów błędów (pusta = poprawne). */
  function validate(q) {
    const t = NS.I18n.t;
    const errors = [];
    if (!q || TYPES.indexOf(q.type) === -1) return [t('validation.type')];
    if (!(Number(q.points) >= 1)) errors.push(t('validation.points'));

    switch (q.type) {
      case 'single_choice': {
        if (!nonEmpty(q.prompt)) errors.push(t('validation.prompt'));
        const opts = q.options || [];
        if (opts.length < 2) errors.push(t('validation.minOptions'));
        if (opts.some((o) => !nonEmpty(o.text))) errors.push(t('validation.emptyOption'));
        if (opts.filter((o) => o.correct).length !== 1) errors.push(t('validation.oneCorrect'));
        break;
      }
      case 'true_false': {
        if (!nonEmpty(q.prompt)) errors.push(t('validation.prompt'));
        const st = q.statements || [];
        if (st.length < 2) errors.push(t('validation.minStatements'));
        if (st.some((s) => !nonEmpty(s.text))) errors.push(t('validation.emptyStatement'));
        break;
      }
      case 'open_short':
        if (!nonEmpty(q.prompt)) errors.push(t('validation.prompt'));
        if (!nonEmpty(q.answer)) errors.push(t('validation.answer'));
        break;
      case 'parametric_math':
        validateParametric(q, errors);
        break;
    }
    return errors;
  }

  function validateParametric(q, errors) {
    const t = NS.I18n.t;
    const TE = NS.TemplateEngine;
    if (!nonEmpty(q.promptTemplate)) errors.push(t('validation.prompt'));
    if (!nonEmpty(q.solutionTemplate)) errors.push(t('validation.solution'));

    const vars = q.variables || {};
    const derived = q.derived || {};
    const names = Object.keys(vars).concat(Object.keys(derived));
    if (!Object.keys(vars).length) errors.push(t('validation.minVariables'));

    names.forEach((n) => {
      if (!TE.IDENTIFIER.test(n)) errors.push(t('validation.badName', { name: n }));
    });
    Object.keys(vars).forEach((n) => {
      const v = vars[n];
      if (Array.isArray(v.values)) {
        if (!v.values.length || v.values.some((x) => !Number.isFinite(Number(x)))) errors.push(t('validation.badValues', { name: n }));
        return;
      }
      if (!Number.isFinite(Number(v.min)) || !Number.isFinite(Number(v.max))) errors.push(t('validation.badRange', { name: n }));
      else if (Number(v.min) > Number(v.max)) errors.push(t('validation.minMax', { name: n }));
      if (!(Number(v.step) > 0)) errors.push(t('validation.step', { name: n }));
    });
    Object.keys(derived).forEach((n) => {
      const err = NS.MathParser.validate(derived[n]);
      if (err) errors.push(t('validation.expr', { name: n, msg: NS.I18n.error(err) }));
    });

    const used = TE.placeholdersOf(NS.I18n.pick(q.promptTemplate)).concat(TE.placeholdersOf(NS.I18n.pick(q.solutionTemplate)));
    used.forEach((p) => {
      if (names.indexOf(p) === -1) errors.push(t('validation.unknownPlaceholder', { name: p }));
    });

    if (!errors.length) {
      // próbne losowanie kilku wariantów — wykrywa np. dzielenie przez zero
      for (let s = 1; s <= 25; s++) {
        try {
          TE.instantiate(q, NS.PRNG.createRng(s));
        } catch (e) {
          errors.push(t('validation.sample', { msg: NS.I18n.error(e) }));
          break;
        }
      }
    }
  }

  /* ---------- Import / eksport ---------- */

  function exportJSON() {
    const payload = { format: 'biztest-gen/questions', version: 1, exportedAt: new Date().toISOString(), questions: list() };
    try {
      NS.Dom.downloadText(EXPORT_FILENAME, JSON.stringify(payload, null, 2));
    } catch (e) {
      console.warn('[CustomBank] Download blocked', e);
    }
  }

  /** Importuje zadania z tekstu JSON (tablica lub obiekt { questions: [...] }). */
  function importJSON(textValue) {
    let data;
    try {
      data = JSON.parse(textValue);
    } catch (e) {
      return { added: 0, updated: 0, skipped: 0, error: NS.I18n.t('library.importInvalid') };
    }
    const incoming = Array.isArray(data) ? data : data && Array.isArray(data.questions) ? data.questions : null;
    if (!incoming) return { added: 0, updated: 0, skipped: 0, error: NS.I18n.t('library.importInvalid') };

    const items = list();
    let added = 0;
    let updated = 0;
    let skipped = 0;
    incoming.forEach((raw) => {
      if (!raw || typeof raw !== 'object' || validate(raw).length) {
        skipped++;
        return;
      }
      const q = Object.assign({}, raw, { custom: true, topic: raw.topic || 'custom', level: raw.level || 'podstawowy' });
      if (!q.id || NS.QuestionsDB.get(q.id)) q.id = newId();
      const idx = items.findIndex((x) => x.id === q.id);
      if (idx === -1) {
        items.push(q);
        added++;
      } else {
        items[idx] = q;
        updated++;
      }
    });
    if (added || updated) persist(items);
    return { added, updated, skipped, error: null };
  }

  NS.CustomBank = { list, get, upsert, remove, validate, exportJSON, importJSON, TYPES };
})(globalThis.BizTest = globalThis.BizTest || {});
