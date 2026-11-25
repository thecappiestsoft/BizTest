/** Dział: Zarządzanie projektami / Project management */
BizTest.QuestionsDB.add([
  {
    id: 'Q_PM_PERT_01',
    topic: 'project_mgmt',
    level: 'rozszerzony',
    type: 'parametric_math',
    points: 2,
    variables: {
      a: { min: 2, max: 6, step: 1 },
      dm: { min: 2, max: 6, step: 1 },
      db: { min: 3, max: 10, step: 1 },
    },
    derived: {
      m: 'a + dm',
      b: 'm + db',
      te: 'round((a + 4 * m + b) / 6, 2)',
      sd: 'round((b - a) / 6, 2)',
    },
    promptTemplate: {
      pl: 'Zespół oszacował czas wykonania zadania w projekcie metodą PERT: optymistyczny {{a}} dni, najbardziej prawdopodobny {{m}} dni, pesymistyczny {{b}} dni. Oblicz oczekiwany czas trwania zadania oraz odchylenie standardowe.',
      en: 'A team estimated a project task using PERT: optimistic {{a}} days, most likely {{m}} days, pessimistic {{b}} days. Calculate the expected duration and the standard deviation.',
    },
    solutionTemplate: {
      pl: 'tₑ = (a + 4m + b) / 6 = ({{a}} + 4 × {{m}} + {{b}}) / 6 = {{te}} dni. σ = (b − a) / 6 = ({{b}} − {{a}}) / 6 = {{sd}} dnia.',
      en: 'tₑ = (a + 4m + b) / 6 = ({{a}} + 4 × {{m}} + {{b}}) / 6 = {{te}} days. σ = (b − a) / 6 = ({{b}} − {{a}}) / 6 = {{sd}} days.',
    },
  },
  {
    id: 'Q_PM_BUDGET_01',
    topic: 'project_mgmt',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 2,
    variables: {
      plan: { min: 20000, max: 80000, step: 1000 },
      over: { min: 1000, max: 12000, step: 500 },
    },
    derived: {
      actual: 'plan + over',
      pct: 'round(over / plan * 100, 2)',
    },
    promptTemplate: {
      pl: 'Zaplanowany budżet szkolnego projektu wynosił {{plan}} zł, a rzeczywiste koszty wyniosły {{actual}} zł. Oblicz kwotę przekroczenia budżetu oraz przekroczenie w procentach.',
      en: 'The planned budget of a school project was PLN {{plan}} and actual costs were PLN {{actual}}. Calculate the budget overrun in PLN and as a percentage.',
    },
    solutionTemplate: {
      pl: 'Przekroczenie: {{actual}} − {{plan}} = {{over}} zł. W procentach: {{over}} / {{plan}} × 100% = {{pct}}%.',
      en: 'Overrun: {{actual}} − {{plan}} = PLN {{over}}. As a percentage: {{over}} / {{plan}} × 100% = {{pct}}%.',
    },
  },
  {
    id: 'Q_PM_EV_01',
    topic: 'project_mgmt',
    level: 'rozszerzony',
    type: 'parametric_math',
    points: 3,
    variables: {
      bac: { min: 50000, max: 200000, step: 5000 },
      prog: { min: 30, max: 80, step: 5 },
      acf: { min: 85, max: 125, step: 5 },
    },
    derived: {
      ev: 'round(bac * prog / 100, 2)',
      ac: 'round(ev * acf / 100, 2)',
      cv: 'round(ev - ac, 2)',
      cpi: 'round(ev / ac, 2)',
    },
    promptTemplate: {
      pl: 'Całkowity budżet projektu (BAC) wynosi {{bac}} zł. Do dziś wykonano {{prog}}% prac, a poniesione koszty rzeczywiste (AC) wynoszą {{ac}} zł. Oblicz wartość wypracowaną (EV), odchylenie kosztowe (CV) oraz wskaźnik wykonania kosztów (CPI).',
      en: 'A project\'s total budget (BAC) is PLN {{bac}}. So far {{prog}}% of the work is done and actual costs (AC) are PLN {{ac}}. Calculate earned value (EV), cost variance (CV) and the cost performance index (CPI).',
    },
    solutionTemplate: {
      pl: 'EV = {{bac}} × {{prog}}% = {{ev}} zł. CV = EV − AC = {{ev}} − {{ac}} = {{cv}} zł. CPI = EV / AC = {{cpi}} (CPI < 1 – przekroczenie kosztów, CPI > 1 – oszczędność).',
      en: 'EV = {{bac}} × {{prog}}% = PLN {{ev}}. CV = EV − AC = {{ev}} − {{ac}} = PLN {{cv}}. CPI = EV / AC = {{cpi}} (CPI < 1 means over budget, CPI > 1 means under budget).',
    },
  },
  {
    id: 'Q_PM_SC_01',
    topic: 'project_mgmt',
    level: 'rozszerzony',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Ścieżka krytyczna w projekcie to:',
      en: 'The critical path in a project is:',
    },
    options: [
      { text: { pl: 'najdłuższy ciąg zależnych zadań, wyznaczający minimalny czas trwania projektu', en: 'the longest chain of dependent tasks, which sets the minimum project duration' }, correct: true },
      { text: { pl: 'najkrótszy ciąg zadań w projekcie', en: 'the shortest chain of tasks in a project' }, correct: false },
      { text: { pl: 'lista zadań o najwyższym budżecie', en: 'the list of tasks with the highest budget' }, correct: false },
      { text: { pl: 'zestaw zadań wykonywanych przez kierownika projektu', en: 'the set of tasks done by the project manager' }, correct: false },
    ],
  },
  {
    id: 'Q_PM_SC_02',
    topic: 'project_mgmt',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Wykres Gantta służy przede wszystkim do:',
      en: 'A Gantt chart is used mainly to:',
    },
    options: [
      { text: { pl: 'przedstawienia harmonogramu zadań w czasie', en: 'show the schedule of tasks over time' }, correct: true },
      { text: { pl: 'obliczenia progu rentowności projektu', en: 'calculate the project\'s break-even point' }, correct: false },
      { text: { pl: 'opisania struktury organizacyjnej firmy', en: 'describe a company\'s organisational structure' }, correct: false },
      { text: { pl: 'prowadzenia księgowości projektu', en: 'keep the project\'s accounts' }, correct: false },
    ],
  },
  {
    id: 'Q_PM_SC_03',
    topic: 'project_mgmt',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Cel projektu sformułowany zgodnie z metodą SMART powinien być m.in.:',
      en: 'A project goal written using the SMART method should be, among other things:',
    },
    options: [
      { text: { pl: 'mierzalny i określony w czasie', en: 'measurable and time-bound' }, correct: true },
      { text: { pl: 'ogólny i elastyczny', en: 'general and flexible' }, correct: false },
      { text: { pl: 'ambitny ponad możliwości zespołu', en: 'more ambitious than the team can manage' }, correct: false },
      { text: { pl: 'znany wyłącznie kierownikowi projektu', en: 'known only to the project manager' }, correct: false },
    ],
  },
  {
    id: 'Q_PM_SC_04',
    topic: 'project_mgmt',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Kamień milowy (milestone) w projekcie to:',
      en: 'A milestone in a project is:',
    },
    options: [
      { text: { pl: 'ważne zdarzenie o zerowym czasie trwania, np. zakończenie etapu', en: 'a key event with zero duration, e.g. the end of a phase' }, correct: true },
      { text: { pl: 'najdroższe zadanie w projekcie', en: 'the most expensive task in the project' }, correct: false },
      { text: { pl: 'dokument zamykający projekt', en: 'the document that closes the project' }, correct: false },
      { text: { pl: 'spotkanie zespołu odbywające się codziennie', en: 'a daily team meeting' }, correct: false },
    ],
  },
  {
    id: 'Q_PM_TF_01',
    topic: 'project_mgmt',
    level: 'podstawowy',
    type: 'true_false',
    points: 2,
    prompt: {
      pl: 'Oceń prawdziwość podanych zdań dotyczących zarządzania projektami. Zaznacz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
      en: 'Decide whether the statements about project management are true or false. Mark T if true or F if false.',
    },
    statements: [
      { text: { pl: 'Trójkąt ograniczeń projektu obejmuje zakres, czas i koszt.', en: 'The project management triangle covers scope, time and cost.' }, correct: true },
      { text: { pl: 'W metodyce Scrum praca jest podzielona na sprinty.', en: 'In Scrum, work is divided into sprints.' }, correct: true },
      { text: { pl: 'Ryzyko projektowe to zdarzenie, które już wystąpiło.', en: 'A project risk is an event that has already happened.' }, correct: false },
      { text: { pl: 'Interesariuszami projektu są wyłącznie członkowie zespołu projektowego.', en: 'Only members of the project team are project stakeholders.' }, correct: false },
    ],
  },
  {
    id: 'Q_PM_OP_01',
    topic: 'project_mgmt',
    level: 'podstawowy',
    type: 'open_short',
    points: 2,
    prompt: {
      pl: 'Wymień trzy etapy cyklu życia projektu.',
      en: 'Name three stages of the project life cycle.',
    },
    answer: {
      pl: 'Np.: inicjowanie, planowanie, realizacja (wykonanie), monitorowanie i kontrola, zamknięcie.',
      en: 'E.g.: initiation, planning, execution, monitoring and control, closure.',
    },
    lines: 3,
  },
]);
