/**
 * questionMeta.js — wspólne etykiety zadań (typ, poziom, dział, skrót treści).
 * Shared helpers for question labels used by the generator list and the library.
 */
(function (NS) {
  'use strict';

  const I = NS.I18n;
  const esc = NS.Dom.escapeHtml;

  function topicLabel(topicId) {
    const topic = NS.QuestionsDB.topic(topicId);
    return topic ? I.pick(topic.label) : String(topicId || I.t('topics.unknown'));
  }

  function typeLabel(type) {
    return I.t('types.' + type);
  }

  function levelLabel(level) {
    return I.t('levels.' + (level || 'podstawowy'));
  }

  /** Krótki tekst zadania do list (zmienne {{x}} zastąpione przez „…”). */
  function previewText(q, max) {
    const raw = I.pick(q.type === 'parametric_math' ? q.promptTemplate : q.prompt);
    return NS.Dom.truncate(raw.replace(NS.TemplateEngine.PLACEHOLDER, '…'), max || 140);
  }

  /** Plakietki: typ · poziom · punkty. */
  function badges(q) {
    return (
      '<span class="badge badge--' + esc(q.type) + '">' + esc(typeLabel(q.type)) + '</span>' +
      '<span class="badge">' + esc(levelLabel(q.level)) + '</span>' +
      '<span class="badge">' + q.points + ' ' + esc(I.t('units.pts', { n: q.points })) + '</span>'
    );
  }

  NS.QuestionMeta = { topicLabel, typeLabel, levelLabel, previewText, badges };
})(globalThis.BizTest = globalThis.BizTest || {});
