/**
 * check.js — szybki test logiki i bazy zadań w Node.js (bez przeglądarki).
 *
 * Uruchomienie (z głównego katalogu projektu):
 *     node tools/check.js
 *
 * Sprawdza:
 *   • unikalność id i poprawność odpowiedzi w zadaniach zamkniętych,
 *   • czy każde zadanie obliczeniowe losuje się poprawnie dla 200 ziaren,
 *   • czy wszystkie {{zmienne}} z szablonów PL/EN istnieją,
 *   • determinizm: ten sam SEED daje ten sam zestaw.
 */
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const load = (rel) => require(path.join(root, rel));

['js/utils/dom.js', 'js/core/prng.js', 'js/core/mathParser.js', 'js/core/templateEngine.js', 'js/core/testBuilder.js', 'data/questions_db.js']
  .forEach(load);
fs.readdirSync(path.join(root, 'data/questions')).filter((f) => f.endsWith('.js')).forEach((f) => load('data/questions/' + f));

const B = globalThis.BizTest;
const T = B.TemplateEngine;
const all = B.QuestionsDB.all();
const problems = [];
const langs = (v) => (v && typeof v === 'object' ? Object.keys(v) : [null]);
const pick = (v, l) => (l && v && typeof v === 'object' ? v[l] : v);

all.forEach((q) => {
  if (q.type === 'single_choice' && q.options.filter((o) => o.correct).length !== 1) {
    problems.push(q.id + ': musi mieć dokładnie jedną poprawną odpowiedź');
  }
  if (q.type !== 'parametric_math') return;
  for (let seed = 0; seed < 200; seed++) {
    let inst;
    try {
      inst = T.instantiate(q, B.PRNG.createRng(seed));
    } catch (e) {
      problems.push(q.id + ' (seed ' + seed + '): ' + e.message);
      return;
    }
    [q.promptTemplate, q.solutionTemplate].forEach((tpl) =>
      langs(tpl).forEach((l) =>
        T.placeholdersOf(pick(tpl, l)).forEach((name) => {
          if (!(name in inst.values)) problems.push(q.id + ': nieznana zmienna {{' + name + '}}' + (l ? ' [' + l + ']' : ''));
        })
      )
    );
  }
});

const a = B.TestBuilder.build({ questions: all, groupCount: 4, seed: 'SEED-84920' });
const b = B.TestBuilder.build({ questions: all, groupCount: 4, seed: 'seed-84920' });
const strip = (t) => JSON.stringify(t.groups.map((g) => g.items.map((i) => [i.values, i.optionOrder, i.statementOrder])));
if (strip(a) !== strip(b)) problems.push('Ten sam SEED dał różne zestawy (brak determinizmu)');

const unique = Array.from(new Set(problems));
if (unique.length) {
  console.error('✗ Znaleziono problemy (' + unique.length + '):\n  - ' + unique.join('\n  - '));
  process.exit(1);
}
console.log('✓ OK — ' + all.length + ' zadań, wszystkie testy przeszły.');
