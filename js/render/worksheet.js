/**
 * worksheet.js — skład kart pracy (HTML gotowy do druku A4 / PDF).
 * Worksheet renderer: student sheets + teacher answer keys as print-ready HTML.
 *
 * Struktura arkusza ucznia:
 *   <section.sheet> → <table.sheet__layout> z <thead> zawierającym metryczkę
 *   (przeglądarka powtarza <thead> na każdej drukowanej stronie).
 */
(function (NS) {
  'use strict';

  const I = NS.I18n;
  const T = NS.TemplateEngine;
  const esc = NS.Dom.escapeHtml;

  let gridCounter = 0;

  /* ---------- Pomocnicze ---------- */

  function text(value) {
    return esc(I.pick(value)).replace(/\n/g, '<br>');
  }

  function pointsLabel(n) {
    return n + ' ' + I.t('units.pts', { n });
  }

  function letter(i) {
    return String.fromCharCode(65 + i);
  }

  function promptHtml(inst) {
    const q = inst.question;
    if (q.type === 'parametric_math') return T.render(I.pick(q.promptTemplate), inst, I.getLang());
    return text(q.prompt);
  }

  /** Kratka na obliczenia — lekki wzór SVG (5 mm), drukuje się zawsze, także bez teł. */
  function scratchArea(opts) {
    const id = (opts.idPrefix || 'ws') + '-grid-' + ++gridCounter;
    const h = opts.scratchCm || 5;
    return (
      '<div class="scratch" style="height:' + h + 'cm">' +
      '<svg class="scratch__svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden="true">' +
      '<defs><pattern id="' + id + '" width="18.9" height="18.9" patternUnits="userSpaceOnUse">' +
      '<path d="M18.9 0H0V18.9" fill="none" class="scratch__line"/></pattern></defs>' +
      '<rect width="100%" height="100%" fill="url(#' + id + ')"/></svg>' +
      '<span class="scratch__label">' + esc(I.t('sheet.scratch')) + '</span></div>'
    );
  }

  /* ---------- Treść zadania (arkusz ucznia) ---------- */

  const studentBody = {
    single_choice(inst) {
      const q = inst.question;
      const items = inst.optionOrder
        .map(
          (orig, pos) =>
            '<li class="choice"><span class="choice__box" aria-hidden="true"></span>' +
            '<span class="choice__letter">' + letter(pos) + '.</span>' +
            '<span class="choice__text">' + text(q.options[orig].text) + '</span></li>'
        )
        .join('');
      return '<ol class="choices">' + items + '</ol>';
    },

    true_false(inst) {
      const q = inst.question;
      const rows = inst.statementOrder
        .map(
          (orig, pos) =>
            '<tr><td class="tf__no">' + (pos + 1) + '.</td><td class="tf__text">' + text(q.statements[orig].text) +
            '</td><td class="tf__mark"><span class="tf__box"></span></td><td class="tf__mark"><span class="tf__box"></span></td></tr>'
        )
        .join('');
      return (
        '<table class="tf"><thead><tr><th></th><th>' + esc(I.t('sheet.statement')) + '</th>' +
        '<th class="tf__mark">' + esc(I.t('sheet.trueShort')) + '</th><th class="tf__mark">' + esc(I.t('sheet.falseShort')) +
        '</th></tr></thead><tbody>' + rows + '</tbody></table>'
      );
    },

    open_short(inst) {
      const n = Math.max(1, Math.min(15, Number(inst.question.lines) || 3));
      return '<div class="lines">' + '<div class="line"></div>'.repeat(n) + '</div>';
    },

    parametric_math(inst, opts) {
      return (
        scratchArea(opts) +
        '<div class="answer-line"><span>' + esc(I.t('sheet.answer')) + ':</span><span class="answer-line__fill"></span></div>'
      );
    },
  };

  function taskHtml(inst, opts) {
    const q = inst.question;
    const body = studentBody[q.type] ? studentBody[q.type](inst, opts) : '';
    return (
      '<li class="task task--' + q.type + '">' +
      '<div class="task__head"><span class="task__no">' + esc(I.t('sheet.task')) + ' ' + inst.number + '.</span>' +
      '<span class="task__pts">(0–' + pointsLabel(q.points) + ')</span></div>' +
      '<div class="task__prompt">' + promptHtml(inst) + '</div>' +
      body +
      '</li>'
    );
  }

  /* ---------- Klucz odpowiedzi ---------- */

  const keyBody = {
    single_choice(inst) {
      const q = inst.question;
      return NS.TestBuilder.correctPositions(inst)
        .map((pos) => '<strong>' + letter(pos) + '</strong> – ' + text(q.options[inst.optionOrder[pos]].text))
        .join('<br>');
    },
    true_false(inst) {
      const q = inst.question;
      return (
        '<span class="key-tf">' +
        inst.statementOrder
          .map(
            (orig, pos) =>
              '<span>' + (pos + 1) + '. <strong>' +
              esc(q.statements[orig].correct ? I.t('sheet.trueShort') : I.t('sheet.falseShort')) + '</strong></span>'
          )
          .join('') +
        '</span>'
      );
    },
    open_short(inst) {
      return text(inst.question.answer);
    },
    parametric_math(inst) {
      return T.render(I.pick(inst.question.solutionTemplate), inst, I.getLang());
    },
  };

  function keyRow(inst) {
    const q = inst.question;
    const body = keyBody[q.type] ? keyBody[q.type](inst) : '';
    return (
      '<tr><td class="key__no">' + inst.number + '.</td><td class="key__answer">' + body +
      '</td><td class="key__pts">' + q.points + '</td></tr>'
    );
  }

  /* ---------- Metryczka ucznia ---------- */

  function studentHeader(groupLabel, totalPoints) {
    return (
      '<table class="student-header"><tr>' +
      '<td class="sh sh--name"><span class="sh__label">' + esc(I.t('sheet.name')) + ':</span><span class="sh__fill"></span></td>' +
      '<td class="sh sh--class"><span class="sh__label">' + esc(I.t('sheet.class')) + ':</span><span class="sh__fill"></span></td>' +
      '<td class="sh sh--group"><span class="sh__label">' + esc(I.t('sheet.group')) + ':</span><span class="sh__badge">' + esc(groupLabel) + '</span></td>' +
      '<td class="sh sh--score"><span class="sh__label">' + esc(I.t('sheet.score')) + ':</span><span class="sh__fill sh__fill--short"></span>' +
      '<span class="sh__total">/ ' + pointsLabel(totalPoints) + '</span></td>' +
      '</tr></table>'
    );
  }

  function titleBlock(opts, subtitle) {
    const title = opts.title && opts.title.trim() ? opts.title.trim() : I.t('sheet.defaultTitle');
    return (
      '<header class="sheet__title"><h1>' + esc(title) + '</h1>' +
      (subtitle ? '<div class="sheet__subtitle">' + subtitle + '</div>' : '') +
      '</header>'
    );
  }

  /* ---------- Arkusze ---------- */

  function studentSheet(test, group, opts) {
    const tasks = group.items.map((inst) => taskHtml(inst, opts)).join('');
    const subtitle =
      esc(I.t('sheet.group')) + ' ' + esc(group.label) + ' · ' + esc(I.t('sheet.code')) + ': ' + esc(test.seedCode);
    return (
      '<section class="sheet sheet--student" data-group="' + esc(group.label) + '">' +
      '<table class="sheet__layout"><thead><tr><td>' + studentHeader(group.label, test.totalPoints) + '</td></tr></thead>' +
      '<tbody><tr><td>' + titleBlock(opts, subtitle) +
      '<p class="sheet__instructions">' + esc(I.t('sheet.instructions')) + '</p>' +
      '<ol class="tasks">' + tasks + '</ol>' +
      '</td></tr></tbody></table></section>'
    );
  }

  function keySheet(test, group, opts) {
    const rows = group.items.map(keyRow).join('');
    const subtitle = esc(I.t('sheet.keyFor', { group: group.label })) + ' · ' + esc(I.t('sheet.code')) + ': <strong>' + esc(test.seedCode) + '</strong>';
    return (
      '<section class="sheet sheet--key" data-group="' + esc(group.label) + '">' +
      '<div class="key-banner">' + esc(I.t('sheet.keyBanner')) + '</div>' +
      titleBlock(opts, subtitle) +
      '<table class="key"><thead><tr><th>' + esc(I.t('sheet.no')) + '</th><th>' + esc(I.t('sheet.keyAnswer')) +
      '</th><th>' + esc(I.t('sheet.ptsShort')) + '</th></tr></thead><tbody>' + rows + '</tbody>' +
      '<tfoot><tr><td></td><td>' + esc(I.t('sheet.total')) + '</td><td class="key__pts">' + test.totalPoints + '</td></tr></tfoot>' +
      '</table></section>'
    );
  }

  /**
   * Renderuje cały test: arkusze uczniów dla wszystkich grup, potem klucze.
   * @param {object} test  wynik TestBuilder.build()
   * @param {{title, eco, includeKey, scratchCm, idPrefix}} opts
   */
  function renderTest(test, opts) {
    const o = opts || {};
    let html = test.groups.map((g) => studentSheet(test, g, o)).join('');
    if (o.includeKey) html += test.groups.map((g) => keySheet(test, g, o)).join('');
    return '<div class="worksheet' + (o.eco ? ' worksheet--eco' : '') + '">' + html + '</div>';
  }

  /** Podgląd pojedynczego zadania (kreator): fragment karty ucznia + klucz. */
  function renderSinglePreview(inst, opts) {
    const o = opts || {};
    return (
      '<div class="worksheet worksheet--single' + (o.eco ? ' worksheet--eco' : '') + '">' +
      '<section class="sheet sheet--student">' +
      studentHeader('A', inst.question.points) +
      '<ol class="tasks">' + taskHtml(inst, o) + '</ol>' +
      '<div class="key-preview"><div class="key-preview__title">' + esc(I.t('sheet.keyBanner')) + '</div>' +
      '<table class="key"><tbody>' + keyRow(inst) + '</tbody></table></div>' +
      '</section></div>'
    );
  }

  NS.Worksheet = { renderTest, renderSinglePreview };
})(globalThis.BizTest = globalThis.BizTest || {});
