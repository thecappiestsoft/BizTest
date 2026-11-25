/** Dział: Przedsiębiorstwo i zarządzanie / Enterprise and management */
BizTest.QuestionsDB.add([
  {
    id: 'Q_FIN_BEP_01',
    topic: 'enterprise',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 3,
    variables: {
      fc: { min: 12000, max: 45000, step: 1000 },
      vc: { min: 15, max: 40, step: 5 },
      margin_add: { min: 10, max: 35, step: 5 },
    },
    derived: {
      price: 'vc + margin_add',
      bep_units: 'Math.ceil(fc / margin_add)',
      bep_revenue: 'bep_units * price',
    },
    promptTemplate: {
      pl: 'Miesięczne koszty stałe manufaktury wynoszą {{fc}} PLN. Koszt zmienny wyprodukowania jednej sztuki towaru to {{vc}} PLN, a cena sprzedaży netto wynosi {{price}} PLN. Oblicz ilościowy oraz wartościowy próg rentowności (BEP).',
      en: 'A workshop\'s monthly fixed costs are PLN {{fc}}. The variable cost of producing one unit is PLN {{vc}} and the net selling price is PLN {{price}}. Calculate the break-even point in units and in sales value (BEP).',
    },
    solutionTemplate: {
      pl: 'Marża jednostkowa: {{price}} - {{vc}} = {{margin_add}} PLN. BEP ilościowy: {{fc}} / {{margin_add}} = {{bep_units}} szt. BEP wartościowy: {{bep_units}} * {{price}} = {{bep_revenue}} PLN.',
      en: 'Unit contribution margin: {{price}} − {{vc}} = PLN {{margin_add}}. BEP (units): {{fc}} / {{margin_add}} = {{bep_units}} units. BEP (value): {{bep_units}} × {{price}} = PLN {{bep_revenue}}.',
    },
  },
  {
    id: 'Q_ENT_VAT_01',
    topic: 'enterprise',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 2,
    variables: {
      net: { min: 100, max: 5000, step: 10 },
      vat: { values: [5, 8, 23] },
    },
    derived: {
      vat_amount: 'round(net * vat / 100, 2)',
      gross: 'round(net + vat_amount, 2)',
    },
    promptTemplate: {
      pl: 'Cena netto usługi wynosi {{net}} zł, a stawka podatku VAT {{vat}}%. Oblicz kwotę podatku VAT oraz cenę brutto.',
      en: 'The net price of a service is PLN {{net}} and the VAT rate is {{vat}}%. Calculate the VAT amount and the gross price.',
    },
    solutionTemplate: {
      pl: 'VAT: {{net}} × {{vat}}% = {{vat_amount}} zł. Cena brutto: {{net}} + {{vat_amount}} = {{gross}} zł.',
      en: 'VAT: {{net}} × {{vat}}% = PLN {{vat_amount}}. Gross price: {{net}} + {{vat_amount}} = PLN {{gross}}.',
    },
  },
  {
    id: 'Q_ENT_MARKUP_01',
    topic: 'enterprise',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 2,
    variables: {
      cost: { min: 20, max: 400, step: 5 },
      mk: { min: 10, max: 60, step: 5 },
    },
    derived: {
      price: 'round(cost * (1 + mk / 100), 2)',
      unit: 'round(price - cost, 2)',
    },
    promptTemplate: {
      pl: 'Hurtownia kupuje towar po {{cost}} zł netto za sztukę i nalicza narzut {{mk}}% liczony od ceny zakupu. Oblicz cenę sprzedaży netto oraz kwotę narzutu na jednej sztuce.',
      en: 'A wholesaler buys goods at PLN {{cost}} net per unit and applies a {{mk}}% mark-up on the purchase price. Calculate the net selling price and the mark-up per unit.',
    },
    solutionTemplate: {
      pl: 'Cena sprzedaży: {{cost}} × (1 + {{mk}}%) = {{price}} zł. Narzut: {{price}} − {{cost}} = {{unit}} zł.',
      en: 'Selling price: {{cost}} × (1 + {{mk}}%) = PLN {{price}}. Mark-up: {{price}} − {{cost}} = PLN {{unit}}.',
    },
  },
  {
    id: 'Q_ENT_ROI_01',
    topic: 'enterprise',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 2,
    variables: {
      inv: { min: 10000, max: 100000, step: 5000 },
      gain: { min: 1000, max: 30000, step: 500 },
    },
    derived: {
      roi: 'round(gain / inv * 100, 2)',
    },
    promptTemplate: {
      pl: 'Firma zainwestowała {{inv}} zł w nową maszynę. W ciągu roku inwestycja przyniosła {{gain}} zł zysku netto. Oblicz wskaźnik zwrotu z inwestycji (ROI).',
      en: 'A company invested PLN {{inv}} in a new machine. Within a year the investment generated a net profit of PLN {{gain}}. Calculate the return on investment (ROI).',
    },
    solutionTemplate: {
      pl: 'ROI = zysk / nakład × 100% = {{gain}} / {{inv}} × 100% = {{roi}}%.',
      en: 'ROI = profit / investment × 100% = {{gain}} / {{inv}} × 100% = {{roi}}%.',
    },
  },
  {
    id: 'Q_ENT_ROS_01',
    topic: 'enterprise',
    level: 'rozszerzony',
    type: 'parametric_math',
    points: 3,
    variables: {
      rev: { min: 200000, max: 900000, step: 10000 },
      np: { min: 10000, max: 90000, step: 5000 },
      eq: { min: 100000, max: 500000, step: 10000 },
    },
    derived: {
      ros: 'round(np / rev * 100, 2)',
      roe: 'round(np / eq * 100, 2)',
    },
    promptTemplate: {
      pl: 'Przychody ze sprzedaży spółki wyniosły {{rev}} zł, zysk netto {{np}} zł, a kapitał własny {{eq}} zł. Oblicz rentowność sprzedaży (ROS) oraz rentowność kapitału własnego (ROE).',
      en: 'A company had sales revenue of PLN {{rev}}, net profit of PLN {{np}} and equity of PLN {{eq}}. Calculate return on sales (ROS) and return on equity (ROE).',
    },
    solutionTemplate: {
      pl: 'ROS = {{np}} / {{rev}} × 100% = {{ros}}%. ROE = {{np}} / {{eq}} × 100% = {{roe}}%.',
      en: 'ROS = {{np}} / {{rev}} × 100% = {{ros}}%. ROE = {{np}} / {{eq}} × 100% = {{roe}}%.',
    },
  },
  {
    id: 'Q_ENT_LIQ_01',
    topic: 'enterprise',
    level: 'rozszerzony',
    type: 'parametric_math',
    points: 3,
    variables: {
      ca: { min: 80000, max: 200000, step: 5000 },
      cl: { min: 40000, max: 120000, step: 5000 },
      inv: { min: 10000, max: 40000, step: 1000 },
    },
    derived: {
      cr: 'round(ca / cl, 2)',
      qr: 'round((ca - inv) / cl, 2)',
    },
    promptTemplate: {
      pl: 'Aktywa obrotowe przedsiębiorstwa wynoszą {{ca}} zł, w tym zapasy {{inv}} zł. Zobowiązania krótkoterminowe to {{cl}} zł. Oblicz wskaźnik bieżącej płynności oraz wskaźnik szybki i krótko oceń sytuację firmy.',
      en: 'A company\'s current assets are PLN {{ca}}, including inventory of PLN {{inv}}. Current liabilities are PLN {{cl}}. Calculate the current ratio and the quick ratio and briefly assess the company\'s position.',
    },
    solutionTemplate: {
      pl: 'Płynność bieżąca: {{ca}} / {{cl}} = {{cr}} (wartość pożądana ok. 1,2–2,0). Wskaźnik szybki: ({{ca}} − {{inv}}) / {{cl}} = {{qr}} (pożądany ok. 1,0).',
      en: 'Current ratio: {{ca}} / {{cl}} = {{cr}} (desirable approx. 1.2–2.0). Quick ratio: ({{ca}} − {{inv}}) / {{cl}} = {{qr}} (desirable approx. 1.0).',
    },
  },
  {
    id: 'Q_ENT_DEPR_01',
    topic: 'enterprise',
    level: 'rozszerzony',
    type: 'parametric_math',
    points: 2,
    variables: {
      v: { min: 20000, max: 150000, step: 1000 },
      rate: { values: [10, 14, 20] },
    },
    derived: {
      annual: 'round(v * rate / 100, 2)',
      monthly: 'round(annual / 12, 2)',
    },
    promptTemplate: {
      pl: 'Firma kupiła środek trwały o wartości początkowej {{v}} zł. Stosuje amortyzację liniową ze stawką {{rate}}% rocznie. Oblicz roczny i miesięczny odpis amortyzacyjny.',
      en: 'A company bought a fixed asset with an initial value of PLN {{v}}. It uses straight-line depreciation at {{rate}}% per year. Calculate the annual and monthly depreciation charge.',
    },
    solutionTemplate: {
      pl: 'Odpis roczny: {{v}} × {{rate}}% = {{annual}} zł. Odpis miesięczny: {{annual}} / 12 = {{monthly}} zł.',
      en: 'Annual charge: {{v}} × {{rate}}% = PLN {{annual}}. Monthly charge: {{annual}} / 12 = PLN {{monthly}}.',
    },
  },
  {
    id: 'Q_ENT_SC_01',
    topic: 'enterprise',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Spółką kapitałową jest:',
      en: 'Which of the following is a capital company?',
    },
    options: [
      { text: { pl: 'spółka z ograniczoną odpowiedzialnością', en: 'a limited liability company (sp. z o.o.)' }, correct: true },
      { text: { pl: 'spółka jawna', en: 'a general partnership' }, correct: false },
      { text: { pl: 'spółka partnerska', en: 'a professional partnership' }, correct: false },
      { text: { pl: 'spółka komandytowa', en: 'a limited partnership' }, correct: false },
    ],
  },
  {
    id: 'Q_ENT_SC_02',
    topic: 'enterprise',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Jednoosobową działalność gospodarczą rejestruje się w:',
      en: 'A sole proprietorship in Poland is registered in:',
    },
    options: [
      { text: { pl: 'CEIDG', en: 'CEIDG (Central Register of Business Activity)' }, correct: true },
      { text: { pl: 'KRS', en: 'KRS (National Court Register)' }, correct: false },
      { text: { pl: 'BIK', en: 'BIK (Credit Information Bureau)' }, correct: false },
      { text: { pl: 'KDPW', en: 'KDPW (Central Securities Depository)' }, correct: false },
    ],
  },
  {
    id: 'Q_ENT_SC_03',
    topic: 'enterprise',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Do kosztów stałych przedsiębiorstwa zalicza się zwykle:',
      en: 'Which of the following is usually a fixed cost?',
    },
    options: [
      { text: { pl: 'czynsz za wynajem lokalu', en: 'rent for business premises' }, correct: true },
      { text: { pl: 'zużycie surowców do produkcji', en: 'raw materials used in production' }, correct: false },
      { text: { pl: 'prowizję od sprzedaży', en: 'sales commission' }, correct: false },
      { text: { pl: 'koszt opakowań wyrobów', en: 'product packaging' }, correct: false },
    ],
  },
  {
    id: 'Q_ENT_SC_04',
    topic: 'enterprise',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'W analizie SWOT czynnikami wewnętrznymi są:',
      en: 'In a SWOT analysis, the internal factors are:',
    },
    options: [
      { text: { pl: 'mocne i słabe strony', en: 'strengths and weaknesses' }, correct: true },
      { text: { pl: 'szanse i zagrożenia', en: 'opportunities and threats' }, correct: false },
      { text: { pl: 'mocne strony i szanse', en: 'strengths and opportunities' }, correct: false },
      { text: { pl: 'słabe strony i zagrożenia', en: 'weaknesses and threats' }, correct: false },
    ],
  },
  {
    id: 'Q_ENT_SC_05',
    topic: 'enterprise',
    level: 'rozszerzony',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Minimalny kapitał zakładowy spółki z ograniczoną odpowiedzialnością wynosi:',
      en: 'The minimum share capital of a Polish limited liability company is:',
    },
    options: [
      { text: { pl: '5 000 zł', en: 'PLN 5,000' }, correct: true },
      { text: { pl: '1 zł', en: 'PLN 1' }, correct: false },
      { text: { pl: '50 000 zł', en: 'PLN 50,000' }, correct: false },
      { text: { pl: '100 000 zł', en: 'PLN 100,000' }, correct: false },
    ],
  },
  {
    id: 'Q_ENT_SC_06',
    topic: 'enterprise',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Która funkcja zarządzania polega na porównywaniu osiągniętych wyników z planem?',
      en: 'Which management function involves comparing actual results with the plan?',
    },
    options: [
      { text: { pl: 'Kontrolowanie', en: 'Controlling' }, correct: true },
      { text: { pl: 'Planowanie', en: 'Planning' }, correct: false },
      { text: { pl: 'Organizowanie', en: 'Organising' }, correct: false },
      { text: { pl: 'Motywowanie', en: 'Motivating' }, correct: false },
    ],
  },
  {
    id: 'Q_ENT_TF_01',
    topic: 'enterprise',
    level: 'podstawowy',
    type: 'true_false',
    points: 2,
    prompt: {
      pl: 'Oceń prawdziwość podanych zdań dotyczących przedsiębiorstwa. Zaznacz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
      en: 'Decide whether the statements about businesses are true or false. Mark T if true or F if false.',
    },
    statements: [
      { text: { pl: 'W spółce jawnej wspólnicy odpowiadają za zobowiązania spółki całym swoim majątkiem.', en: 'Partners in a general partnership are liable for its debts with all their assets.' }, correct: true },
      { text: { pl: 'Wspólnicy spółki z o.o. odpowiadają osobiście za jej zobowiązania.', en: 'Shareholders of a limited liability company are personally liable for its debts.' }, correct: false },
      { text: { pl: 'Koszty zmienne rosną wraz ze wzrostem wielkości produkcji.', en: 'Variable costs rise as production volume increases.' }, correct: true },
      { text: { pl: 'Biznesplan jest obowiązkowym załącznikiem do wniosku o wpis do CEIDG.', en: 'A business plan must be attached to a CEIDG registration application.' }, correct: false },
    ],
  },
  {
    id: 'Q_ENT_OP_01',
    topic: 'enterprise',
    level: 'podstawowy',
    type: 'open_short',
    points: 2,
    prompt: {
      pl: 'Wyjaśnij pojęcie progu rentowności (BEP).',
      en: 'Explain the term break-even point (BEP).',
    },
    answer: {
      pl: 'Próg rentowności to taka wielkość sprzedaży (ilościowo lub wartościowo), przy której przychody pokrywają wszystkie koszty – firma nie ma ani zysku, ani straty.',
      en: 'The break-even point is the level of sales (in units or value) at which revenue covers all costs – the company makes neither a profit nor a loss.',
    },
    lines: 3,
  },
  {
    id: 'Q_ENT_OP_02',
    topic: 'enterprise',
    level: 'rozszerzony',
    type: 'open_short',
    points: 2,
    prompt: {
      pl: 'Podaj dwa przykłady pozapłacowych narzędzi motywowania pracowników.',
      en: 'Give two examples of non-financial ways to motivate employees.',
    },
    answer: {
      pl: 'Np.: pochwała i docenienie, możliwość awansu, szkolenia, elastyczny czas pracy, ciekawe zadania, dobra atmosfera.',
      en: 'E.g.: praise and recognition, promotion prospects, training, flexible working hours, interesting tasks, a good atmosphere.',
    },
    lines: 3,
  },
]);
