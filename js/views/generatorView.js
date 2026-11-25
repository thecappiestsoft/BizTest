/**
 * generatorView.js — widok „Generator”: wybór działów i zadań, grupy, seed, podgląd A4, druk.
 * Generator view: question selection, groups, seed, A4 preview and printing.
 */
(function (NS) {
  'use strict';

  const { $, escapeHtml: esc, debounce } = NS.Dom;
  const I = NS.I18n;
  const Meta = NS.QuestionMeta;

  const SETTINGS_KEY = 'generator.settings';
  const ZOOM_MIN = 0.4;
  const ZOOM_MAX = 1.5;

  const state = {
    selected: new Set(),
    topics: new Set(NS.QuestionsDB.TOPICS.map((t) => t.id)),
    level: 'all',
    search: '',
    includeCustom: true,
    groups: 2,
    seed: '',
    title: '',
    eco: false,
    includeKey: true,
    scratchCm: 5,
    zoom: 0.8,
    test: null,
  };

  let els = {};

  /* ---------- Ustawienia trwałe ---------- */

  function loadSettings() {
    const s = NS.Storage.get(SETTINGS_KEY, null);
    if (!s) return;
    if (Array.isArray(s.selected)) state.selected = new Set(s.selected);
    if (Array.isArray(s.topics)) state.topics = new Set(s.topics);
    ['level', 'includeCustom', 'groups', 'title', 'eco', 'includeKey', 'scratchCm', 'zoom'].forEach((k) => {
      if (s[k] !== undefined) state[k] = s[k];
    });
  }

  const saveSettings = debounce(() => {
    NS.Storage.set(SETTINGS_KEY, {
      selected: Array.from(state.selected),
      topics: Array.from(state.topics),
      level: state.level,
      includeCustom: state.includeCustom,
      groups: state.groups,
      title: state.title,
      eco: state.eco,
      includeKey: state.includeKey,
      scratchCm: state.scratchCm,
      zoom: state.zoom,
    });
  }, 300);

  /* ---------- Dane ---------- */

  function allQuestions() {
    const builtIn = NS.QuestionsDB.all();
    return state.includeCustom ? builtIn.concat(NS.CustomBank.list()) : builtIn;
  }

  function matchesSearch(q, term) {
    if (!term) return true;
    const hay = [
      I.pick(q.prompt, 'pl'), I.pick(q.prompt, 'en'),
      I.pick(q.promptTemplate, 'pl'), I.pick(q.promptTemplate, 'en'), q.id,
    ].join(' ').toLowerCase();
    return hay.indexOf(term) !== -1;
  }

  function visibleQuestions() {
    const term = state.search.trim().toLowerCase();
    return allQuestions().filter(
      (q) =>
        state.topics.has(q.topic || 'custom') &&
        (state.level === 'all' || q.level === state.level) &&
        matchesSearch(q, term)
    );
  }

  function selectedQuestions() {
    return allQuestions().filter((q) => state.selected.has(q.id));
  }

  /* ---------- Renderowanie panelu ---------- */

  function renderGroupsSelect() {
    const labels = NS.TestBuilder.GROUP_LABELS;
    let html = '';
    for (let n = 1; n <= NS.TestBuilder.MAX_GROUPS; n++) {
      const range = n === 1 ? 'A' : 'A–' + labels[n - 1];
      html += '<option value="' + n + '"' + (n === state.groups ? ' selected' : '') + '>' + n + ' (' + range + ')</option>';
    }
    els.groups.innerHTML = html;
  }

  function renderTopics() {
    const hasCustom = state.includeCustom && NS.CustomBank.list().length > 0;
    els.topics.innerHTML = NS.QuestionsDB.TOPICS.filter((t) => t.id !== 'custom' || hasCustom)
      .map(
        (t) =>
          '<label class="chip"><input type="checkbox" value="' + esc(t.id) + '"' + (state.topics.has(t.id) ? ' checked' : '') + '>' +
          '<span>' + esc(I.pick(t.label)) + '</span></label>'
      )
      .join('');
  }

  function renderList() {
    const visible = visibleQuestions();
    if (!visible.length) {
      els.list.innerHTML = '<p class="empty-note">' + esc(I.t('gen.noMatches')) + '</p>';
      renderSummary();
      return;
    }
    const byTopic = new Map();
    visible.forEach((q) => {
      const key = q.topic || 'custom';
      if (!byTopic.has(key)) byTopic.set(key, []);
      byTopic.get(key).push(q);
    });
    let html = '';
    byTopic.forEach((items, topicId) => {
      html += '<div class="qgroup"><div class="qgroup__title">' + esc(Meta.topicLabel(topicId)) +
        ' <span class="qgroup__count">' + items.length + '</span></div>';
      items.forEach((q) => {
        html +=
          '<label class="qitem' + (state.selected.has(q.id) ? ' is-selected' : '') + '">' +
          '<input type="checkbox" value="' + esc(q.id) + '"' + (state.selected.has(q.id) ? ' checked' : '') + '>' +
          '<span class="qitem__body"><span class="qitem__text">' + esc(Meta.previewText(q, 150)) + '</span>' +
          '<span class="qitem__meta">' + Meta.badges(q) + (q.custom ? '<span class="badge badge--custom">' + esc(I.t('gen.mine')) + '</span>' : '') +
          '</span></span></label>';
      });
      html += '</div>';
    });
    els.list.innerHTML = html;
    renderSummary();
  }

  function renderSummary() {
    const qs = selectedQuestions();
    const pts = qs.reduce((s, q) => s + (Number(q.points) || 0), 0);
    els.summary.textContent = I.t('gen.summary', { count: qs.length, points: pts, pts: I.t('units.pts', { n: pts }) });
  }

  function syncControls() {
    els.title.value = state.title;
    els.seed.value = state.seed;
    els.level.value = state.level;
    els.includeCustom.checked = state.includeCustom;
    els.eco.checked = state.eco;
    els.key.checked = state.includeKey;
    els.scratch.value = String(state.scratchCm);
    renderGroupsSelect();
    applyZoom();
  }

  /* ---------- Podgląd i druk ---------- */

  function renderOptions(prefix) {
    return { title: state.title, eco: state.eco, includeKey: state.includeKey, scratchCm: state.scratchCm, idPrefix: prefix };
  }

  function renderPreview() {
    if (!state.test) {
      els.preview.innerHTML =
        '<div class="empty-state"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15H6z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M14 2v6h6M9 13h8M9 17h6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>' +
        '<p class="empty-state__title">' + esc(I.t('preview.emptyTitle')) + '</p>' +
        '<p>' + esc(I.t('preview.emptyText')) + '</p></div>';
      els.printRoot.innerHTML = '';
      els.seedBadge.hidden = true;
      return;
    }
    els.preview.innerHTML = NS.Worksheet.renderTest(state.test, renderOptions('pv'));
    els.printRoot.innerHTML = NS.Worksheet.renderTest(state.test, renderOptions('pr'));
    els.seedBadge.hidden = false;
    els.seedBadge.textContent = state.test.seedCode;
  }

  function generate(silent) {
    const questions = selectedQuestions();
    if (!questions.length) {
      state.test = null;
      renderPreview();
      if (!silent) NS.Toast.show(I.t('gen.errNoQuestions'), 'error');
      return;
    }
    let parsed = NS.PRNG.parseSeed(state.seed);
    if (!parsed) parsed = NS.PRNG.parseSeed(NS.PRNG.randomSeedCode());
    state.seed = parsed.code;
    els.seed.value = parsed.code;
    try {
      state.test = NS.TestBuilder.build({ questions, groupCount: state.groups, seed: parsed.code });
    } catch (e) {
      console.error(e);
      NS.Toast.show(I.t('gen.errBuild', { id: e.questionId || '?', msg: I.error(e) }), 'error', 6000);
      return;
    }
    renderPreview();
    if (!silent) NS.Toast.show(I.t('gen.generated', { groups: state.groups, code: parsed.code }), 'success');
  }

  /** Po zmianie ustawień — jeśli test już istnieje, przebuduj go automatycznie. */
  const regenerateIfActive = debounce(() => {
    if (state.test) generate(true);
  }, 200);

  function applyZoom() {
    els.preview.style.setProperty('--zoom', state.zoom);
    els.zoomValue.textContent = Math.round(state.zoom * 100) + '%';
  }

  /** Na wąskich ekranach zmniejsza podgląd, by kartka A4 (≈794 px) mieściła się w szerokości. */
  function fitZoomToWidth() {
    const scroller = els.preview.parentElement;
    const available = scroller.clientWidth - 40;
    const pageWidth = 794;
    if (available > 0 && available < pageWidth * state.zoom) {
      state.zoom = Math.max(ZOOM_MIN, Math.floor((available / pageWidth) * 20) / 20);
      applyZoom();
    }
  }

  function changeZoom(delta) {
    state.zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round((state.zoom + delta) * 10) / 10));
    applyZoom();
    saveSettings();
  }

  function print() {
    if (!state.test) {
      NS.Toast.show(I.t('gen.errNothingToPrint'), 'error');
      return;
    }
    if (NS.Dialog.isEmbedded()) NS.Toast.show(I.t('gen.printEmbedded'), 'info', 6000);
    try {
      window.print();
    } catch (e) {
      NS.Toast.show(I.t('gen.printEmbedded'), 'error', 6000);
    }
  }

  /* ---------- Zdarzenia ---------- */

  function bindEvents() {
    els.title.addEventListener('input', debounce(() => {
      state.title = els.title.value;
      saveSettings();
      if (state.test) renderPreview();
    }, 250));

    els.groups.addEventListener('change', () => {
      state.groups = Number(els.groups.value) || 1;
      saveSettings();
      regenerateIfActive();
    });

    els.seed.addEventListener('change', () => {
      state.seed = els.seed.value;
      regenerateIfActive();
    });

    els.seedRandom.addEventListener('click', () => {
      state.seed = NS.PRNG.randomSeedCode();
      els.seed.value = state.seed;
      if (state.test) generate(true);
    });

    els.level.addEventListener('change', () => {
      state.level = els.level.value;
      saveSettings();
      renderList();
    });

    els.search.addEventListener('input', debounce(() => {
      state.search = els.search.value;
      renderList();
    }, 150));

    els.topics.addEventListener('change', (e) => {
      const input = e.target;
      if (input.checked) state.topics.add(input.value);
      else state.topics.delete(input.value);
      saveSettings();
      renderList();
    });

    els.includeCustom.addEventListener('change', () => {
      state.includeCustom = els.includeCustom.checked;
      if (state.includeCustom) state.topics.add('custom');
      saveSettings();
      renderTopics();
      renderList();
      regenerateIfActive();
    });

    els.list.addEventListener('change', (e) => {
      const input = e.target;
      if (input.type !== 'checkbox') return;
      if (input.checked) state.selected.add(input.value);
      else state.selected.delete(input.value);
      input.closest('.qitem').classList.toggle('is-selected', input.checked);
      renderSummary();
      saveSettings();
      regenerateIfActive();
    });

    els.selectVisible.addEventListener('click', () => {
      visibleQuestions().forEach((q) => state.selected.add(q.id));
      afterSelectionChange();
    });

    els.clear.addEventListener('click', () => {
      state.selected.clear();
      afterSelectionChange();
    });

    els.random.addEventListener('click', () => {
      const pool = visibleQuestions();
      const n = Math.max(1, Math.min(pool.length, Number(els.randomCount.value) || 10));
      const rng = NS.PRNG.createRng((Math.random() * 1e9) >>> 0);
      state.selected = new Set(rng.shuffle(pool).slice(0, n).map((q) => q.id));
      afterSelectionChange();
      NS.Toast.show(I.t('gen.randomPicked', { count: n }), 'info');
    });

    els.eco.addEventListener('change', () => {
      state.eco = els.eco.checked;
      saveSettings();
      renderPreview();
    });
    els.key.addEventListener('change', () => {
      state.includeKey = els.key.checked;
      saveSettings();
      renderPreview();
    });
    els.scratch.addEventListener('change', () => {
      state.scratchCm = Number(els.scratch.value) || 5;
      saveSettings();
      renderPreview();
    });

    els.generate.addEventListener('click', () => generate(false));
    els.print.addEventListener('click', print);
    els.zoomIn.addEventListener('click', () => changeZoom(0.1));
    els.zoomOut.addEventListener('click', () => changeZoom(-0.1));

    NS.Bus.on('customBank:changed', () => {
      const ids = new Set(NS.CustomBank.list().map((q) => q.id));
      state.selected.forEach((id) => {
        if (id.indexOf('CUSTOM_') === 0 && !ids.has(id)) state.selected.delete(id);
      });
      renderTopics();
      renderList();
      regenerateIfActive();
    });
  }

  function afterSelectionChange() {
    renderList();
    saveSettings();
    regenerateIfActive();
  }

  /* ---------- API ---------- */

  function init() {
    els = {
      title: $('#gen-title'),
      groups: $('#gen-groups'),
      seed: $('#gen-seed'),
      seedRandom: $('#gen-seed-random'),
      level: $('#gen-level'),
      search: $('#gen-search'),
      topics: $('#gen-topics'),
      includeCustom: $('#gen-include-custom'),
      selectVisible: $('#gen-select-visible'),
      clear: $('#gen-clear'),
      randomCount: $('#gen-random-count'),
      random: $('#gen-random'),
      list: $('#gen-question-list'),
      summary: $('#gen-summary'),
      eco: $('#gen-eco'),
      key: $('#gen-key'),
      scratch: $('#gen-scratch'),
      generate: $('#gen-generate'),
      print: $('#gen-print'),
      preview: $('#gen-preview'),
      printRoot: $('#print-root'),
      seedBadge: $('#gen-seed-badge'),
      zoomIn: $('#zoom-in'),
      zoomOut: $('#zoom-out'),
      zoomValue: $('#zoom-value'),
    };
    loadSettings();
    if (!state.selected.size) {
      // przykładowy wybór na start: po jednym zadaniu każdego typu
      ['Q_FIN_BEP_01', 'Q_MKT_4P_02', 'Q_ENT_VAT_01', 'Q_FP_TF_01', 'Q_ENT_OP_01'].forEach((id) => state.selected.add(id));
    }
    syncControls();
    fitZoomToWidth();
    bindEvents();
    refresh();
  }

  /** Pełne odświeżenie (np. po zmianie języka). */
  function refresh() {
    renderGroupsSelect();
    renderTopics();
    renderList();
    renderPreview();
  }

  NS.GeneratorView = { init, refresh };
})(globalThis.BizTest = globalThis.BizTest || {});
