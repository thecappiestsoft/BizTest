/**
 * questions_db.js — rejestr wbudowanej bazy zadań BiZ (Biznes i Zarządzanie).
 * Built-in question bank registry: topics, levels and the question list.
 *
 * Zadania są rozdzielone na pliki tematyczne w katalogu data/questions/.
 * Każdy plik wywołuje BizTest.QuestionsDB.add([...]).
 * Format pojedynczego zadania opisuje README.md.
 *
 * Teksty wbudowanych zadań są dwujęzyczne: { pl: '...', en: '...' }.
 * Zadania własne nauczyciela mogą mieć zwykłe ciągi znaków.
 */
(function (NS) {
  'use strict';

  /** Działy podstawy programowej (id → etykieta PL/EN). */
  const TOPICS = [
    { id: 'personal_finance', label: { pl: 'Finanse osobiste', en: 'Personal finance' } },
    { id: 'financial_market', label: { pl: 'Rynek finansowy', en: 'Financial market' } },
    { id: 'enterprise', label: { pl: 'Przedsiębiorstwo i zarządzanie', en: 'Enterprise and management' } },
    { id: 'marketing', label: { pl: 'Marketing i rynek', en: 'Marketing and the market' } },
    { id: 'project_mgmt', label: { pl: 'Zarządzanie projektami', en: 'Project management' } },
    { id: 'economy', label: { pl: 'Gospodarka i państwo', en: 'Economy and the state' } },
    { id: 'custom', label: { pl: 'Zadania własne', en: 'My own questions' } },
  ];

  const LEVELS = ['podstawowy', 'rozszerzony'];

  const questions = [];
  const byId = new Map();

  function add(list) {
    list.forEach((q) => {
      if (byId.has(q.id)) {
        console.warn('[QuestionsDB] Duplicate id:', q.id);
        return;
      }
      q.builtIn = true;
      questions.push(q);
      byId.set(q.id, q);
    });
  }

  NS.QuestionsDB = {
    TOPICS,
    LEVELS,
    add,
    all: () => questions.slice(),
    get: (id) => byId.get(id),
    topic: (id) => TOPICS.find((t) => t.id === id) || null,
  };
})(globalThis.BizTest = globalThis.BizTest || {});
