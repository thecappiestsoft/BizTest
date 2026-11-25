/**
 * builderView.js — „Kreator zadań”: formularz po lewej, podgląd A4 na żywo po prawej,
 * lista własnych zadań z edycją, usuwaniem oraz importem/eksportem JSON.
 *
 * Custom Question Builder: form ↔ draft object ↔ live preview.
 * Pola formularza są powiązane z obiektem `draft` przez atrybuty:
 *   data-field="prompt"                          → draft.prompt
 *   data-list="options" data-index="0" data-prop="text" → draft.options[0].text
 *   data-action="add|remove|insert|save|reset"   → akcje przycisków
 */
(function (NS) {
  'use strict';

  const { $, escapeHtml: esc, debounce } = NS.Dom;
  const I = NS.I18n;
  const Meta = NS.QuestionMeta;

  const DRAFT_KEY = 'builder.draft';
  const LIMITS = { options: [2, 6], statements: [2, 6], variables: [1, 8], derived: [0, 10] };

  let draft = null;
  let previewSeed = 1;
  let lastTemplateField = 'promptTemplate';
  let els = {};

  /* ---------- Model szkicu ---------- */

  function emptyDraft() {
    return {
      id: null,
      type: 'single_choice',
      topic: 'custom',
      level: 'podstawowy',
      points: 1,
      prompt: '',
      options: [
        { text: '', correct: true },
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false },
      ],
      statements: [
        { text: '', correct: true },
        { text: '', correct: false },
        { text: '', correct: true },
      ],
      answer: '',
      lines: 3,
      variables: [
        { name: 'a', min: '100', max: '500', step: '10', values: '' },
        { name: 'b', min: '2', max: '9', step: '1', values: '' },
      ],
      derived: [{ name: 'wynik', expr: 'a * b' }],
      promptTemplate: '',
      solutionTemplate: '',
    };
  }

  /** Szkic formularza → obiekt zadania w formacie bazy (README). */
  function draftToQuestion(d) {
    const q = { id: d.id || 'DRAFT', topic: d.topic, level: d.level, type: d.type, points: Math.max(1, Number(d.points) || 1) };
    switch (d.type) {
      case 'single_choice':
        q.prompt = d.prompt;
        q.options = d.options.map((o) => ({ text: o.text, correct: !!o.correct }));
        break;
      case 'true_false':
        q.prompt = d.prompt;
        q.statements = d.statements.map((s) => ({ text: s.text, correct: !!s.correct }));
        break;
      case 'open_short':
        q.prompt = d.prompt;
        q.answer = d.answer;
        q.lines = Math.max(1, Math.min(15, Number(d.lines) || 3));
        break;
      case 'parametric_math':
        q.variables = {};
        d.variables.forEach((v) => {
          const name = String(v.name || '').trim();
          if (!name) return;
          const list = String(v.values || '')
            .split(/[;,\s]+/)
            .map((x) => x.replace(',', '.'))
            .filter(Boolean)
            .map(Number);
          q.variables[name] = list.length
            ? { values: list }
            : { min: Number(v.min), max: Number(v.max), step: Number(v.step) || 1 };
        });
        q.derived = {};
        d.derived.forEach((dv) => {
          const name = String(dv.name || '').trim();
          if (name) q.derived[name] = String(dv.expr || '').trim();
        });
        q.promptTemplate = d.promptTemplate;
        q.solutionTemplate = d.solutionTemplate;
        break;
    }
    return q;
  }

  /** Obiekt zadania → szkic formularza (do edycji). */
  function questionToDraft(q) {
    const d = emptyDraft();
    Object.assign(d, { id: q.id, type: q.type, topic: q.topic || 'custom', level: q.level || 'podstawowy', points: q.points || 1 });
    const pick = (v) => I.pick(v);
    if (q.prompt !== undefined) d.prompt = pick(q.prompt);
    if (q.options) d.options = q.options.map((o) => ({ text: pick(o.text), correct: !!o.correct }));
    if (q.statements) d.statements = q.statements.map((s) => ({ text: pick(s.text), correct: !!s.correct }));
    if (q.answer !== undefined) d.answer = pick(q.answer);
    if (q.lines) d.lines = q.lines;
    if (q.variables) {
      d.variables = Object.keys(q.variables).map((name) => {
        const v = q.variables[name];
        return Array.isArray(v.values)
          ? { name, min: '', max: '', step: '', values: v.values.join(', ') }
          : { name, min: String(v.min), max: String(v.max), step: String(v.step || 1), values: '' };
      });
    }
    if (q.derived) d.derived = Object.keys(q.derived).map((name) => ({ name, expr: q.derived[name] }));
    if (q.promptTemplate !== undefined) d.promptTemplate = pick(q.promptTemplate);
    if (q.solutionTemplate !== undefined) d.solutionTemplate = pick(q.solutionTemplate);
    return d;
  }

  const saveDraft = debounce(() => NS.Storage.set(DRAFT_KEY, draft), 400);

  /* ---------- Formularz: fragmenty HTML ---------- */

  function field(label, control, extraClass) {
    return '<label class="field' + (extraClass ? ' ' + extraClass : '') + '"><span class="field__label">' + esc(label) + '</span>' + control + '</label>';
  }

  function options(list, selected) {
    return list.map((o) => '<option value="' + esc(o.value) + '"' + (o.value === selected ? ' selected' : '') + '>' + esc(o.label) + '</option>').join('');
  }

  function removeBtn(list, index) {
    const min = LIMITS[list][0];
    const disabled = draft[list].length <= min ? ' disabled' : '';
    return '<button type="button" class="btn btn--icon btn--ghost row__remove" data-action="remove" data-list="' + list + '" data-index="' + index + '" aria-label="' + esc(I.t('builder.remove')) + '" title="' + esc(I.t('builder.remove')) + '"' + disabled + '>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';
  }

  function addBtn(list, labelKey) {
    const max = LIMITS[list][1];
    const disabled = draft[list].length >= max ? ' disabled' : '';
    return '<button type="button" class="btn btn--small btn--dashed" data-action="add" data-list="' + list + '"' + disabled + '>+ ' + esc(I.t(labelKey)) + '</button>';
  }

  function commonFields() {
    const types = NS.CustomBank.TYPES.map((t) => ({ value: t, label: Meta.typeLabel(t) }));
    const topics = NS.QuestionsDB.TOPICS.map((t) => ({ value: t.id, label: I.pick(t.label) }));
    const levels = NS.QuestionsDB.LEVELS.map((l) => ({ value: l, label: Meta.levelLabel(l) }));
    return (
      '<div class="form-grid">' +
      field(I.t('builder.type'), '<select data-field="type">' + options(types, draft.type) + '</select>', 'field--wide') +
      field(I.t('builder.topic'), '<select data-field="topic">' + options(topics, draft.topic) + '</select>') +
      field(I.t('builder.level'), '<select data-field="level">' + options(levels, draft.level) + '</select>') +
      field(I.t('builder.points'), '<input type="number" min="1" max="20" data-field="points" value="' + esc(draft.points) + '">', 'field--narrow') +
      '</div>'
    );
  }

  function promptField(labelKey, placeholderKey) {
    return field(I.t(labelKey), '<textarea rows="3" data-field="prompt" placeholder="' + esc(I.t(placeholderKey)) + '">' + esc(draft.prompt) + '</textarea>');
  }

  const typeForms = {
    single_choice() {
      const rows = draft.options
        .map(
          (o, i) =>
            '<div class="row">' +
            '<label class="row__correct" title="' + esc(I.t('builder.markCorrect')) + '"><input type="radio" name="sc-correct" data-list="options" data-index="' + i + '" data-prop="correct"' + (o.correct ? ' checked' : '') + '><span class="sr-only">' + esc(I.t('builder.markCorrect')) + '</span></label>' +
            '<span class="row__letter">' + String.fromCharCode(65 + i) + '</span>' +
            '<input type="text" data-list="options" data-index="' + i + '" data-prop="text" value="' + esc(o.text) + '" placeholder="' + esc(I.t('builder.optionPlaceholder')) + '">' +
            removeBtn('options', i) +
            '</div>'
        )
        .join('');
      return (
        promptField('builder.prompt', 'builder.promptPlaceholder') +
        '<fieldset class="rows"><legend>' + esc(I.t('builder.options')) + '</legend>' +
        '<p class="hint">' + esc(I.t('builder.optionsHint')) + '</p>' + rows + addBtn('options', 'builder.addOption') + '</fieldset>'
      );
    },

    true_false() {
      const rows = draft.statements
        .map(
          (s, i) =>
            '<div class="row">' +
            '<span class="row__letter">' + (i + 1) + '.</span>' +
            '<input type="text" data-list="statements" data-index="' + i + '" data-prop="text" value="' + esc(s.text) + '" placeholder="' + esc(I.t('builder.statementPlaceholder')) + '">' +
            '<select data-list="statements" data-index="' + i + '" data-prop="correct" aria-label="' + esc(I.t('builder.truth')) + '">' +
            '<option value="true"' + (s.correct ? ' selected' : '') + '>' + esc(I.t('builder.true')) + '</option>' +
            '<option value="false"' + (!s.correct ? ' selected' : '') + '>' + esc(I.t('builder.false')) + '</option></select>' +
            removeBtn('statements', i) +
            '</div>'
        )
        .join('');
      return (
        promptField('builder.tfPrompt', 'builder.tfPromptPlaceholder') +
        '<fieldset class="rows"><legend>' + esc(I.t('builder.statements')) + '</legend>' +
        '<p class="hint">' + esc(I.t('builder.statementsHint')) + '</p>' + rows + addBtn('statements', 'builder.addStatement') + '</fieldset>'
      );
    },

    open_short() {
      return (
        promptField('builder.prompt', 'builder.promptPlaceholder') +
        field(I.t('builder.modelAnswer'), '<textarea rows="3" data-field="answer" placeholder="' + esc(I.t('builder.modelAnswerPlaceholder')) + '">' + esc(draft.answer) + '</textarea>') +
        field(I.t('builder.lines'), '<input type="number" min="1" max="15" data-field="lines" value="' + esc(draft.lines) + '">', 'field--narrow')
      );
    },

    parametric_math() {
      const varRows = draft.variables
        .map(
          (v, i) =>
            '<tr>' +
            '<td><input type="text" data-list="variables" data-index="' + i + '" data-prop="name" value="' + esc(v.name) + '" spellcheck="false" aria-label="' + esc(I.t('builder.varName')) + '"></td>' +
            '<td><input type="text" inputmode="decimal" data-list="variables" data-index="' + i + '" data-prop="min" value="' + esc(v.min) + '" aria-label="min"></td>' +
            '<td><input type="text" inputmode="decimal" data-list="variables" data-index="' + i + '" data-prop="max" value="' + esc(v.max) + '" aria-label="max"></td>' +
            '<td><input type="text" inputmode="decimal" data-list="variables" data-index="' + i + '" data-prop="step" value="' + esc(v.step) + '" aria-label="' + esc(I.t('builder.varStep')) + '"></td>' +
            '<td><input type="text" data-list="variables" data-index="' + i + '" data-prop="values" value="' + esc(v.values) + '" placeholder="5, 8, 23" aria-label="' + esc(I.t('builder.varValues')) + '"></td>' +
            '<td>' + removeBtn('variables', i) + '</td></tr>'
        )
        .join('');
      const derRows = draft.derived
        .map(
          (dv, i) =>
            '<tr>' +
            '<td><input type="text" data-list="derived" data-index="' + i + '" data-prop="name" value="' + esc(dv.name) + '" spellcheck="false" aria-label="' + esc(I.t('builder.varName')) + '"></td>' +
            '<td><input type="text" class="mono" data-list="derived" data-index="' + i + '" data-prop="expr" value="' + esc(dv.expr) + '" spellcheck="false" aria-label="' + esc(I.t('builder.expr')) + '"></td>' +
            '<td class="derived__status" data-derived-status="' + i + '"></td>' +
            '<td>' + removeBtn('derived', i) + '</td></tr>'
        )
        .join('');
      return (
        '<fieldset class="rows"><legend>' + esc(I.t('builder.variables')) + '</legend>' +
        '<p class="hint">' + esc(I.t('builder.variablesHint')) + '</p>' +
        '<div class="table-scroll"><table class="param-table"><thead><tr><th>' + esc(I.t('builder.varName')) + '</th><th>min</th><th>max</th><th>' + esc(I.t('builder.varStep')) + '</th><th>' + esc(I.t('builder.varValues')) + '</th><th></th></tr></thead><tbody>' + varRows + '</tbody></table></div>' +
        addBtn('variables', 'builder.addVariable') + '</fieldset>' +
        '<fieldset class="rows"><legend>' + esc(I.t('builder.derived')) + '</legend>' +
        '<p class="hint">' + esc(I.t('builder.derivedHint', { fns: NS.MathParser.FUNCTION_NAMES.join(', ') })) + '</p>' +
        '<div class="table-scroll"><table class="param-table param-table--derived"><thead><tr><th>' + esc(I.t('builder.varName')) + '</th><th>' + esc(I.t('builder.expr')) + '</th><th>' + esc(I.t('builder.sample')) + '</th><th></th></tr></thead><tbody>' + derRows + '</tbody></table></div>' +
        addBtn('derived', 'builder.addDerived') + '</fieldset>' +
        '<div class="token-bar"><span class="hint">' + esc(I.t('builder.insertHint')) + '</span><span class="tokens" id="builder-tokens"></span></div>' +
        field(I.t('builder.promptTemplate'), '<textarea rows="4" data-field="promptTemplate" placeholder="' + esc(I.t('builder.promptTemplatePlaceholder')) + '">' + esc(draft.promptTemplate) + '</textarea>') +
        field(I.t('builder.solutionTemplate'), '<textarea rows="3" data-field="solutionTemplate" placeholder="' + esc(I.t('builder.solutionTemplatePlaceholder')) + '">' + esc(draft.solutionTemplate) + '</textarea>')
      );
    },
  };

  function renderForm() {
    els.form.innerHTML =
      commonFields() +
      typeForms[draft.type]() +
      '<div class="form-errors" id="builder-errors" role="alert" hidden></div>' +
      '<div class="form-actions">' +
      '<button type="button" class="btn btn--primary" data-action="save">' + esc(I.t(draft.id ? 'builder.update' : 'builder.save')) + '</button>' +
      '<button type="button" class="btn" data-action="reset">' + esc(I.t(draft.id ? 'builder.cancelEdit' : 'builder.clearForm')) + '</button>' +
      '</div>';
    els.title.textContent = I.t(draft.id ? 'builder.editTitle' : 'builder.title');
    els.editBadge.hidden = !draft.id;
    els.editBadge.textContent = draft.id || '';
    renderTokens();
    updatePreview();
  }

  function renderTokens() {
    const box = $('#builder-tokens');
    if (!box) return;
    const names = draft.variables.map((v) => v.name).concat(draft.derived.map((d) => d.name)).map((n) => String(n || '').trim()).filter(Boolean);
    box.innerHTML = names.map((n) => '<button type="button" class="token" data-action="insert" data-token="' + esc(n) + '">{{' + esc(n) + '}}</button>').join('');
  }

  /* ---------- Podgląd na żywo ---------- */

  function updatePreview() {
    const q = draftToQuestion(draft);
    let inst = null;
    let errorMsg = null;
    try {
      inst = NS.TestBuilder.instantiateQuestion(q, NS.PRNG.createRng(previewSeed));
      inst.number = 1;
    } catch (e) {
      errorMsg = I.error(e);
    }
    updateDerivedStatus(inst);
    if (!inst) {
      els.preview.innerHTML = '<div class="preview-error">' + esc(I.t('builder.previewError', { msg: errorMsg })) + '</div>';
      return;
    }
    els.preview.innerHTML = NS.Worksheet.renderSinglePreview(inst, { idPrefix: 'bp', scratchCm: 5 });
  }

  /** Przy zadaniach obliczeniowych pokazuje przykładową wartość lub błąd każdej formuły. */
  function updateDerivedStatus(inst) {
    if (draft.type !== 'parametric_math') return;
    draft.derived.forEach((dv, i) => {
      const cell = els.form.querySelector('[data-derived-status="' + i + '"]');
      if (!cell) return;
      const name = String(dv.name || '').trim();
      const err = dv.expr ? NS.MathParser.validate(dv.expr) : null;
      if (err) {
        cell.className = 'derived__status is-error';
        cell.textContent = I.error(err);
      } else if (inst && inst.values && name in inst.values) {
        cell.className = 'derived__status is-ok';
        cell.textContent = '= ' + NS.TemplateEngine.formatNumber(inst.values[name], I.getLang(), inst.decimals[name]);
      } else {
        cell.className = 'derived__status';
        cell.textContent = '—';
      }
    });
  }

  const debouncedPreview = debounce(updatePreview, 120);

  /* ---------- Obsługa formularza ---------- */

  function onInput(e) {
    const el = e.target;
    const fieldName = el.getAttribute('data-field');
    const list = el.getAttribute('data-list');

    if (fieldName) {
      if (fieldName === 'type') {
        changeType(el.value);
        return;
      }
      draft[fieldName] = el.type === 'number' ? el.value : el.value;
      if (fieldName === 'promptTemplate' || fieldName === 'solutionTemplate') lastTemplateField = fieldName;
    } else if (list) {
      const index = Number(el.getAttribute('data-index'));
      const prop = el.getAttribute('data-prop');
      const item = draft[list][index];
      if (!item) return;
      if (prop === 'correct') {
        if (el.type === 'radio') draft[list].forEach((o, i) => (o.correct = i === index));
        else item.correct = el.value === 'true';
      } else {
        item[prop] = el.value;
      }
      if ((list === 'variables' || list === 'derived') && prop === 'name') renderTokens();
    } else {
      return;
    }
    saveDraft();
    debouncedPreview();
  }

  function changeType(type) {
    if (type === draft.type) return;
    // treść pytania przenosimy między polami prompt ↔ promptTemplate, aby nie zginęła
    if (type === 'parametric_math' && !draft.promptTemplate) draft.promptTemplate = draft.prompt;
    if (draft.type === 'parametric_math' && type !== 'parametric_math' && !draft.prompt) draft.prompt = draft.promptTemplate;
    draft.type = type;
    if (type === 'parametric_math' && Number(draft.points) < 2) draft.points = 3;
    if (type === 'true_false' && !draft.prompt) draft.prompt = I.t('builder.tfDefaultPrompt');
    saveDraft();
    renderForm();
  }

  function onClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn || !els.form.contains(btn)) return;
    const action = btn.getAttribute('data-action');
    const list = btn.getAttribute('data-list');

    if (action === 'add') {
      const fresh = {
        options: { text: '', correct: false },
        statements: { text: '', correct: true },
        variables: { name: 'x' + (draft.variables.length + 1), min: '1', max: '10', step: '1', values: '' },
        derived: { name: 'w' + (draft.derived.length + 1), expr: '' },
      }[list];
      if (draft[list].length < LIMITS[list][1]) draft[list].push(fresh);
      saveDraft();
      renderForm();
    } else if (action === 'remove') {
      const index = Number(btn.getAttribute('data-index'));
      if (draft[list].length > LIMITS[list][0]) {
        const removed = draft[list].splice(index, 1)[0];
        if (list === 'options' && removed.correct && draft.options.length) draft.options[0].correct = true;
      }
      saveDraft();
      renderForm();
    } else if (action === 'insert') {
      insertToken('{{' + btn.getAttribute('data-token') + '}}');
    } else if (action === 'save') {
      saveQuestion();
    } else if (action === 'reset') {
      draft = emptyDraft();
      previewSeed = 1;
      saveDraft();
      renderForm();
    }
  }

  function insertToken(token) {
    const ta = els.form.querySelector('[data-field="' + lastTemplateField + '"]');
    if (!ta) return;
    const start = ta.selectionStart != null ? ta.selectionStart : ta.value.length;
    const end = ta.selectionEnd != null ? ta.selectionEnd : ta.value.length;
    ta.value = ta.value.slice(0, start) + token + ta.value.slice(end);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = start + token.length;
    draft[lastTemplateField] = ta.value;
    saveDraft();
    debouncedPreview();
  }

  /** Enter w formularzu — nie wysyłamy formularza (w ramkach z sandboxem jest to zablokowane). */
  function onSubmit(e) {
    e.preventDefault();
    saveQuestion();
  }

  function saveQuestion() {
    const q = draftToQuestion(draft);
    const errors = NS.CustomBank.validate(q);
    const box = $('#builder-errors');
    if (errors.length) {
      box.hidden = false;
      box.innerHTML = '<strong>' + esc(I.t('builder.fixErrors')) + '</strong><ul>' + errors.map((m) => '<li>' + esc(m) + '</li>').join('') + '</ul>';
      return;
    }
    box.hidden = true;
    const wasEdit = !!draft.id;
    NS.CustomBank.upsert(q);
    NS.Toast.show(I.t(wasEdit ? 'builder.updated' : 'builder.saved'), 'success');
    draft = emptyDraft();
    previewSeed = 1;
    saveDraft();
    renderForm();
  }

  /* ---------- Biblioteka własnych zadań ---------- */

  function renderLibrary() {
    const items = NS.CustomBank.list();
    if (!items.length) {
      els.library.innerHTML = '<p class="empty-note">' + esc(I.t('library.empty')) + '</p>';
      return;
    }
    els.library.innerHTML = items
      .map(
        (q) =>
          '<article class="lib-card' + (draft.id === q.id ? ' is-editing' : '') + '">' +
          '<div class="lib-card__meta">' + Meta.badges(q) + '<span class="lib-card__topic">' + esc(Meta.topicLabel(q.topic)) + '</span></div>' +
          '<p class="lib-card__text">' + esc(Meta.previewText(q, 180)) + '</p>' +
          '<div class="lib-card__actions">' +
          '<button type="button" class="btn btn--small" data-lib="edit" data-id="' + esc(q.id) + '">' + esc(I.t('library.edit')) + '</button>' +
          '<button type="button" class="btn btn--small" data-lib="duplicate" data-id="' + esc(q.id) + '">' + esc(I.t('library.duplicate')) + '</button>' +
          '<button type="button" class="btn btn--small btn--danger" data-lib="delete" data-id="' + esc(q.id) + '">' + esc(I.t('library.delete')) + '</button>' +
          '</div></article>'
      )
      .join('');
  }

  function onLibraryClick(e) {
    const btn = e.target.closest('[data-lib]');
    if (!btn) return;
    const q = NS.CustomBank.get(btn.getAttribute('data-id'));
    if (!q) return;
    const action = btn.getAttribute('data-lib');
    if (action === 'edit' || action === 'duplicate') {
      draft = questionToDraft(q);
      if (action === 'duplicate') draft.id = null;
      previewSeed = 1;
      saveDraft();
      renderForm();
      renderLibrary();
      els.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'delete') {
      NS.Dialog.confirm(I.t('library.confirmDelete'), { confirmLabel: I.t('library.delete'), danger: true }).then((ok) => {
        if (!ok) return;
        NS.CustomBank.remove(q.id);
        if (draft.id === q.id) {
          draft = emptyDraft();
          renderForm();
        }
        NS.Toast.show(I.t('library.deleted'), 'info');
      });
    }
  }

  async function onImportFile() {
    const file = els.file.files && els.file.files[0];
    els.file.value = '';
    if (!file) return;
    try {
      const res = NS.CustomBank.importJSON(await NS.Dom.readFileAsText(file));
      if (res.error) NS.Toast.show(res.error, 'error', 5000);
      else NS.Toast.show(I.t('library.imported', res), res.added + res.updated ? 'success' : 'info', 5000);
    } catch (err) {
      NS.Toast.show(I.t('library.importInvalid'), 'error');
    }
  }

  /* ---------- API ---------- */

  function init() {
    els = {
      form: $('#builder-form'),
      preview: $('#builder-preview'),
      title: $('#builder-title'),
      editBadge: $('#builder-edit-badge'),
      reroll: $('#builder-reroll'),
      library: $('#library-list'),
      exportBtn: $('#library-export'),
      importBtn: $('#library-import'),
      file: $('#library-file'),
    };
    const stored = NS.Storage.get(DRAFT_KEY, null);
    draft = stored && stored.type ? Object.assign(emptyDraft(), stored) : emptyDraft();

    els.form.addEventListener('input', onInput);
    els.form.addEventListener('change', onInput);
    els.form.addEventListener('click', onClick);
    els.form.addEventListener('submit', onSubmit);
    els.form.addEventListener('focusin', (e) => {
      const f = e.target.getAttribute && e.target.getAttribute('data-field');
      if (f === 'promptTemplate' || f === 'solutionTemplate') lastTemplateField = f;
    });
    els.reroll.addEventListener('click', () => {
      previewSeed = (Math.random() * 1e9) >>> 0;
      updatePreview();
    });
    els.library.addEventListener('click', onLibraryClick);
    els.exportBtn.addEventListener('click', () => {
      if (!NS.CustomBank.list().length) {
        NS.Toast.show(I.t('library.nothingToExport'), 'info');
        return;
      }
      NS.CustomBank.exportJSON();
    });
    els.importBtn.addEventListener('click', () => els.file.click());
    els.file.addEventListener('change', onImportFile);
    NS.Bus.on('customBank:changed', renderLibrary);

    refresh();
  }

  function refresh() {
    renderForm();
    renderLibrary();
  }

  NS.BuilderView = { init, refresh };
})(globalThis.BizTest = globalThis.BizTest || {});
