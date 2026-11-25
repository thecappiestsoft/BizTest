/**
 * testBuilder.js — budowa wariantów sprawdzianu dla grup A, B, C…
 * Builds per-group test variants: seeded PRNG, variable sampling, Fisher-Yates shuffling.
 *
 * Wynik (test) zawiera tylko dane instancji (wartości liczb, kolejność odpowiedzi).
 * Tekst jest składany dopiero przy renderowaniu, więc ten sam test można
 * wyświetlić po polsku lub angielsku bez ponownego losowania.
 */
(function (NS) {
  'use strict';

  const GROUP_LABELS = 'ABCDEFGH';
  const MAX_GROUPS = 6;

  const QUESTION_TYPES = ['single_choice', 'true_false', 'open_short', 'parametric_math'];

  /** Tworzy instancję jednego zadania dla danego generatora losowego. */
  function instantiateQuestion(question, rng) {
    const inst = { question, values: null, decimals: null, optionOrder: null, statementOrder: null };
    switch (question.type) {
      case 'parametric_math': {
        const res = NS.TemplateEngine.instantiate(question, rng);
        inst.values = res.values;
        inst.decimals = res.decimals;
        break;
      }
      case 'single_choice':
      case 'multiple_choice':
        inst.optionOrder = rng.shuffle((question.options || []).map((_, i) => i));
        break;
      case 'true_false':
        inst.statementOrder = rng.shuffle((question.statements || []).map((_, i) => i));
        break;
      default:
        break;
    }
    return inst;
  }

  /**
   * Buduje cały test.
   * @param {{questions: object[], groupCount: number, seed: string}} options
   */
  function build(options) {
    const questions = options.questions || [];
    const groupCount = Math.max(1, Math.min(MAX_GROUPS, options.groupCount | 0 || 1));
    const seed = NS.PRNG.parseSeed(options.seed) || NS.PRNG.parseSeed(NS.PRNG.randomSeedCode());

    const groups = [];
    for (let g = 0; g < groupCount; g++) {
      // Etap 1: osobny PRNG dla każdej grupy → mulberry32(seed + groupIndex)
      const rng = NS.PRNG.createRng((seed.value + g) >>> 0);
      const items = questions.map((q, i) => {
        try {
          return Object.assign({ number: i + 1 }, instantiateQuestion(q, rng));
        } catch (e) {
          e.questionId = q.id;
          throw e;
        }
      });
      groups.push({ index: g, label: GROUP_LABELS[g], items });
    }

    const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
    return { seedCode: seed.code, seedValue: seed.value, groups, totalPoints, createdAt: new Date().toISOString() };
  }

  /** Indeks pozycji (0..n) poprawnej odpowiedzi po przetasowaniu. */
  function correctPositions(inst) {
    const order = inst.optionOrder || [];
    const result = [];
    order.forEach((origIndex, pos) => {
      if (inst.question.options[origIndex].correct) result.push(pos);
    });
    return result;
  }

  NS.TestBuilder = { build, instantiateQuestion, correctPositions, GROUP_LABELS, MAX_GROUPS, QUESTION_TYPES };
})(globalThis.BizTest = globalThis.BizTest || {});
