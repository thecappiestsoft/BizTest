/** Dział: Marketing i rynek / Marketing and the market */
BizTest.QuestionsDB.add([
  {
    id: 'Q_MKT_4P_02',
    topic: 'marketing',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Który element koncepcji marketingu-mix (4P) obejmuje dobór kanałów dystrybucji oraz logistykę magazynową?',
      en: 'Which element of the marketing mix (4P) covers the choice of distribution channels and warehouse logistics?',
    },
    options: [
      { text: { pl: 'Place (Miejsce / Dystrybucja)', en: 'Place (distribution)' }, correct: true },
      { text: { pl: 'Promotion (Promocja)', en: 'Promotion' }, correct: false },
      { text: { pl: 'Product (Produkt)', en: 'Product' }, correct: false },
      { text: { pl: 'Price (Cena)', en: 'Price' }, correct: false },
    ],
  },
  {
    id: 'Q_MKT_SHARE_01',
    topic: 'marketing',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 2,
    variables: {
      s: { min: 500, max: 5000, step: 100 },
      m: { min: 20000, max: 60000, step: 1000 },
    },
    derived: {
      share: 'round(s / m * 100, 2)',
    },
    promptTemplate: {
      pl: 'Roczna sprzedaż firmy wyniosła {{s}} tys. zł, a wartość całego rynku, na którym działa, {{m}} tys. zł. Oblicz udział firmy w rynku.',
      en: 'A company\'s annual sales were PLN {{s}} thousand and the value of its whole market was PLN {{m}} thousand. Calculate the company\'s market share.',
    },
    solutionTemplate: {
      pl: 'Udział w rynku = {{s}} / {{m}} × 100% = {{share}}%.',
      en: 'Market share = {{s}} / {{m}} × 100% = {{share}}%.',
    },
  },
  {
    id: 'Q_MKT_DISC_01',
    topic: 'marketing',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 2,
    variables: {
      p: { min: 80, max: 600, step: 10 },
      d: { min: 10, max: 40, step: 5 },
    },
    derived: {
      np: 'round(p * (1 - d / 100), 2)',
      save: 'round(p - np, 2)',
    },
    promptTemplate: {
      pl: 'Sklep obniżył cenę kurtki wynoszącą {{p}} zł o {{d}}% w ramach promocji sezonowej. Oblicz nową cenę oraz kwotę oszczędności klienta.',
      en: 'A shop cut the price of a jacket from PLN {{p}} by {{d}}% in a seasonal sale. Calculate the new price and how much the customer saves.',
    },
    solutionTemplate: {
      pl: 'Nowa cena: {{p}} × (1 − {{d}}%) = {{np}} zł. Oszczędność: {{p}} − {{np}} = {{save}} zł.',
      en: 'New price: {{p}} × (1 − {{d}}%) = PLN {{np}}. Saving: {{p}} − {{np}} = PLN {{save}}.',
    },
  },
  {
    id: 'Q_MKT_ELAST_01',
    topic: 'marketing',
    level: 'rozszerzony',
    type: 'parametric_math',
    points: 3,
    variables: {
      p1: { min: 20, max: 60, step: 2 },
      dp: { min: 2, max: 10, step: 1 },
      q1: { min: 800, max: 2000, step: 100 },
      dq: { min: 50, max: 400, step: 50 },
    },
    derived: {
      p2: 'p1 + dp',
      q2: 'q1 - dq',
      e: 'round(((q2 - q1) / q1) / ((p2 - p1) / p1), 2)',
    },
    promptTemplate: {
      pl: 'Po podwyżce ceny produktu z {{p1}} zł do {{p2}} zł miesięczna sprzedaż spadła z {{q1}} szt. do {{q2}} szt. Oblicz współczynnik cenowej elastyczności popytu i określ, czy popyt jest elastyczny.',
      en: 'After the price of a product rose from PLN {{p1}} to PLN {{p2}}, monthly sales fell from {{q1}} to {{q2}} units. Calculate the price elasticity of demand and state whether demand is elastic.',
    },
    solutionTemplate: {
      pl: 'E = (ΔQ/Q) / (ΔP/P) = (({{q2}} − {{q1}}) / {{q1}}) / (({{p2}} − {{p1}}) / {{p1}}) = {{e}}. Jeśli |E| > 1 – popyt elastyczny; jeśli |E| < 1 – nieelastyczny.',
      en: 'E = (ΔQ/Q) / (ΔP/P) = (({{q2}} − {{q1}}) / {{q1}}) / (({{p2}} − {{p1}}) / {{p1}}) = {{e}}. If |E| > 1 demand is elastic; if |E| < 1 it is inelastic.',
    },
  },
  {
    id: 'Q_MKT_SC_03',
    topic: 'marketing',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Segmentacja rynku to:',
      en: 'Market segmentation is:',
    },
    options: [
      { text: { pl: 'podział rynku na jednorodne grupy klientów o podobnych potrzebach', en: 'dividing the market into uniform groups of customers with similar needs' }, correct: true },
      { text: { pl: 'ustalanie ceny na poziomie cen konkurencji', en: 'setting prices at the level of competitors\' prices' }, correct: false },
      { text: { pl: 'wybór kanału dystrybucji produktu', en: 'choosing a distribution channel for the product' }, correct: false },
      { text: { pl: 'tworzenie logo i nazwy marki', en: 'creating a logo and brand name' }, correct: false },
    ],
  },
  {
    id: 'Q_MKT_SC_04',
    topic: 'marketing',
    level: 'rozszerzony',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Strategia cenowa „zbierania śmietanki” (skimming) polega na:',
      en: 'A price-skimming strategy means:',
    },
    options: [
      { text: { pl: 'wprowadzeniu produktu po wysokiej cenie i jej stopniowym obniżaniu', en: 'launching a product at a high price and gradually lowering it' }, correct: true },
      { text: { pl: 'ustaleniu niskiej ceny, aby szybko zdobyć rynek', en: 'setting a low price to win the market quickly' }, correct: false },
      { text: { pl: 'ustaleniu ceny dokładnie na poziomie kosztów', en: 'setting the price exactly at cost' }, correct: false },
      { text: { pl: 'stosowaniu cen typu 9,99 zł', en: 'using prices such as PLN 9.99' }, correct: false },
    ],
  },
  {
    id: 'Q_MKT_SC_05',
    topic: 'marketing',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Prawidłowa kolejność faz cyklu życia produktu to:',
      en: 'The correct order of the product life cycle stages is:',
    },
    options: [
      { text: { pl: 'wprowadzenie, wzrost, dojrzałość, spadek', en: 'introduction, growth, maturity, decline' }, correct: true },
      { text: { pl: 'wzrost, wprowadzenie, spadek, dojrzałość', en: 'growth, introduction, decline, maturity' }, correct: false },
      { text: { pl: 'wprowadzenie, dojrzałość, wzrost, spadek', en: 'introduction, maturity, growth, decline' }, correct: false },
      { text: { pl: 'dojrzałość, wzrost, wprowadzenie, spadek', en: 'maturity, growth, introduction, decline' }, correct: false },
    ],
  },
  {
    id: 'Q_MKT_TF_01',
    topic: 'marketing',
    level: 'podstawowy',
    type: 'true_false',
    points: 2,
    prompt: {
      pl: 'Oceń prawdziwość podanych zdań dotyczących marketingu. Zaznacz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
      en: 'Decide whether the statements about marketing are true or false. Mark T if true or F if false.',
    },
    statements: [
      { text: { pl: 'Public relations to działania budujące wizerunek firmy i relacje z otoczeniem.', en: 'Public relations are activities that build a company\'s image and relationships with its environment.' }, correct: true },
      { text: { pl: 'Cena 49,99 zł zamiast 50 zł jest przykładem ceny psychologicznej.', en: 'A price of PLN 49.99 instead of PLN 50 is an example of psychological pricing.' }, correct: true },
      { text: { pl: 'Badania pierwotne wykorzystują wyłącznie dane zebrane wcześniej przez inne instytucje.', en: 'Primary research uses only data previously collected by other institutions.' }, correct: false },
      { text: { pl: 'W fazie spadku sprzedaż produktu zwykle rośnie najszybciej.', en: 'In the decline stage, sales of a product usually grow fastest.' }, correct: false },
    ],
  },
  {
    id: 'Q_MKT_OP_01',
    topic: 'marketing',
    level: 'podstawowy',
    type: 'open_short',
    points: 1,
    prompt: {
      pl: 'Wyjaśnij, czym jest grupa docelowa (target) w marketingu.',
      en: 'Explain what a target group is in marketing.',
    },
    answer: {
      pl: 'Grupa docelowa to wybrany segment odbiorców, do którego firma kieruje swój produkt i działania marketingowe.',
      en: 'A target group is the chosen segment of customers to whom a company directs its product and marketing activities.',
    },
    lines: 3,
  },
]);
