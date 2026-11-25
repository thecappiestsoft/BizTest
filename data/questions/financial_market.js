/** Dział: Rynek finansowy / Financial market */
BizTest.QuestionsDB.add([
  {
    id: 'Q_FM_COMP_01',
    topic: 'financial_market',
    level: 'rozszerzony',
    type: 'parametric_math',
    points: 3,
    variables: {
      K: { min: 2000, max: 20000, step: 500 },
      r: { min: 3, max: 8, step: 0.5 },
      n: { min: 2, max: 6, step: 1 },
    },
    derived: {
      FV: 'round(K * (1 + r / 100) ^ n, 2)',
      interest: 'round(FV - K, 2)',
    },
    promptTemplate: {
      pl: 'Inwestor wpłacił {{K}} zł na rachunek oszczędnościowy oprocentowany {{r}}% w skali roku z roczną kapitalizacją odsetek. Oblicz wartość oszczędności po {{n}} latach oraz łączną kwotę odsetek. Pomiń podatek.',
      en: 'An investor deposited PLN {{K}} in a savings account paying {{r}}% per year, compounded annually. Calculate the value of the savings after {{n}} years and the total interest earned. Ignore tax.',
    },
    solutionTemplate: {
      pl: 'FV = K · (1 + r)^n = {{K}} · (1 + {{r}}%)^{{n}} = {{FV}} zł. Odsetki: {{FV}} − {{K}} = {{interest}} zł.',
      en: 'FV = K · (1 + r)^n = {{K}} · (1 + {{r}}%)^{{n}} = PLN {{FV}}. Interest: {{FV}} − {{K}} = PLN {{interest}}.',
    },
  },
  {
    id: 'Q_FM_STOCK_01',
    topic: 'financial_market',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 3,
    variables: {
      q: { min: 50, max: 500, step: 10 },
      buy: { min: 20, max: 60, step: 0.5 },
      gain: { min: 2, max: 15, step: 0.5 },
      c: { values: [0.29, 0.39] },
    },
    derived: {
      sell: 'buy + gain',
      cost: 'round(q * buy, 2)',
      cbuy: 'round(cost * c / 100, 2)',
      value: 'round(q * sell, 2)',
      csell: 'round(value * c / 100, 2)',
      profit: 'round(value - cost - cbuy - csell, 2)',
    },
    promptTemplate: {
      pl: 'Inwestor kupił {{q}} akcji spółki po {{buy}} zł za sztukę, a po kilku miesiącach sprzedał je po {{sell}} zł. Dom maklerski pobiera prowizję {{c}}% od wartości każdej transakcji. Oblicz zysk inwestora przed opodatkowaniem.',
      en: 'An investor bought {{q}} shares at PLN {{buy}} each and sold them a few months later at PLN {{sell}}. The broker charges a {{c}}% commission on the value of each trade. Calculate the investor\'s profit before tax.',
    },
    solutionTemplate: {
      pl: 'Zakup: {{q}} × {{buy}} = {{cost}} zł, prowizja {{cbuy}} zł. Sprzedaż: {{q}} × {{sell}} = {{value}} zł, prowizja {{csell}} zł. Zysk: {{value}} − {{cost}} − {{cbuy}} − {{csell}} = {{profit}} zł.',
      en: 'Purchase: {{q}} × {{buy}} = PLN {{cost}}, commission PLN {{cbuy}}. Sale: {{q}} × {{sell}} = PLN {{value}}, commission PLN {{csell}}. Profit: {{value}} − {{cost}} − {{cbuy}} − {{csell}} = PLN {{profit}}.',
    },
  },
  {
    id: 'Q_FM_BOND_01',
    topic: 'financial_market',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 2,
    variables: {
      cnt: { min: 10, max: 100, step: 5 },
      nom: { values: [100, 1000] },
      cp: { min: 4, max: 8, step: 0.25 },
      yrs: { min: 2, max: 5, step: 1 },
    },
    derived: {
      annual: 'round(cnt * nom * cp / 100, 2)',
      total: 'round(annual * yrs, 2)',
    },
    promptTemplate: {
      pl: 'Inwestor kupił {{cnt}} obligacji o wartości nominalnej {{nom}} zł każda. Oprocentowanie stałe wynosi {{cp}}% rocznie, a odsetki są wypłacane raz w roku. Oblicz roczną kwotę odsetek oraz łączne odsetki za {{yrs}} lata/lat (bez podatku).',
      en: 'An investor bought {{cnt}} bonds with a face value of PLN {{nom}} each. The fixed coupon is {{cp}}% per year, paid annually. Calculate the annual interest and the total interest over {{yrs}} years (before tax).',
    },
    solutionTemplate: {
      pl: 'Odsetki roczne: {{cnt}} × {{nom}} × {{cp}}% = {{annual}} zł. Łącznie: {{annual}} × {{yrs}} = {{total}} zł.',
      en: 'Annual interest: {{cnt}} × {{nom}} × {{cp}}% = PLN {{annual}}. Total: {{annual}} × {{yrs}} = PLN {{total}}.',
    },
  },
  {
    id: 'Q_FM_SC_01',
    topic: 'financial_market',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Instytucją sprawującą nadzór nad rynkiem finansowym w Polsce jest:',
      en: 'The institution supervising the financial market in Poland is:',
    },
    options: [
      { text: { pl: 'Komisja Nadzoru Finansowego (KNF)', en: 'the Polish Financial Supervision Authority (KNF)' }, correct: true },
      { text: { pl: 'Giełda Papierów Wartościowych w Warszawie (GPW)', en: 'the Warsaw Stock Exchange (GPW)' }, correct: false },
      { text: { pl: 'Bankowy Fundusz Gwarancyjny (BFG)', en: 'the Bank Guarantee Fund (BFG)' }, correct: false },
      { text: { pl: 'Krajowy Depozyt Papierów Wartościowych (KDPW)', en: 'the Central Securities Depository of Poland (KDPW)' }, correct: false },
    ],
  },
  {
    id: 'Q_FM_SC_02',
    topic: 'financial_market',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Akcja jest papierem wartościowym, który:',
      en: 'A share is a security that:',
    },
    options: [
      { text: { pl: 'potwierdza udział w kapitale zakładowym spółki akcyjnej', en: 'confirms a stake in the share capital of a joint-stock company' }, correct: true },
      { text: { pl: 'potwierdza zaciągnięcie długu przez emitenta', en: 'confirms that the issuer has taken on a debt' }, correct: false },
      { text: { pl: 'gwarantuje stałe, coroczne oprocentowanie', en: 'guarantees a fixed annual interest rate' }, correct: false },
      { text: { pl: 'może być emitowany wyłącznie przez Skarb Państwa', en: 'can only be issued by the State Treasury' }, correct: false },
    ],
  },
  {
    id: 'Q_FM_SC_03',
    topic: 'financial_market',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Hossa na giełdzie oznacza:',
      en: 'A bull market on the stock exchange means:',
    },
    options: [
      { text: { pl: 'długotrwały wzrost kursów akcji', en: 'a prolonged rise in share prices' }, correct: true },
      { text: { pl: 'długotrwały spadek kursów akcji', en: 'a prolonged fall in share prices' }, correct: false },
      { text: { pl: 'zawieszenie notowań spółki', en: 'a suspension of trading in a company' }, correct: false },
      { text: { pl: 'pierwsze notowanie nowej spółki', en: 'a new company\'s first listing' }, correct: false },
    ],
  },
  {
    id: 'Q_FM_SC_04',
    topic: 'financial_market',
    level: 'rozszerzony',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Dywersyfikacja portfela inwestycyjnego polega na:',
      en: 'Diversifying an investment portfolio means:',
    },
    options: [
      { text: { pl: 'rozłożeniu kapitału na różne instrumenty w celu ograniczenia ryzyka', en: 'spreading capital across different instruments to reduce risk' }, correct: true },
      { text: { pl: 'inwestowaniu całego kapitału w jedną, najlepszą spółkę', en: 'investing all capital in one, best company' }, correct: false },
      { text: { pl: 'zaciąganiu kredytu na zakup akcji', en: 'taking out a loan to buy shares' }, correct: false },
      { text: { pl: 'sprzedaży wszystkich akcji przed wypłatą dywidendy', en: 'selling all shares before the dividend is paid' }, correct: false },
    ],
  },
  {
    id: 'Q_FM_SC_05',
    topic: 'financial_market',
    level: 'rozszerzony',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Który instrument finansowy należy do rynku pieniężnego (instrumenty o terminie do 1 roku)?',
      en: 'Which financial instrument belongs to the money market (maturity up to 1 year)?',
    },
    options: [
      { text: { pl: 'Bon skarbowy', en: 'A Treasury bill' }, correct: true },
      { text: { pl: 'Akcja zwykła', en: 'An ordinary share' }, correct: false },
      { text: { pl: 'Obligacja 10-letnia', en: 'A 10-year bond' }, correct: false },
      { text: { pl: 'Jednostka funduszu akcji', en: 'A unit in an equity fund' }, correct: false },
    ],
  },
  {
    id: 'Q_FM_TF_01',
    topic: 'financial_market',
    level: 'podstawowy',
    type: 'true_false',
    points: 2,
    prompt: {
      pl: 'Oceń prawdziwość podanych zdań dotyczących rynku finansowego. Zaznacz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
      en: 'Decide whether the statements about the financial market are true or false. Mark T if true or F if false.',
    },
    statements: [
      { text: { pl: 'Obligacja daje jej posiadaczowi prawo głosu na walnym zgromadzeniu spółki.', en: 'A bond gives its holder the right to vote at the company\'s general meeting.' }, correct: false },
      { text: { pl: 'Inwestycje o wyższym oczekiwanym zysku wiążą się zwykle z wyższym ryzykiem.', en: 'Investments with a higher expected return usually carry higher risk.' }, correct: true },
      { text: { pl: 'Dywidenda to część zysku spółki wypłacana akcjonariuszom.', en: 'A dividend is the part of a company\'s profit paid out to shareholders.' }, correct: true },
      { text: { pl: 'Fundusz inwestycyjny gwarantuje zwrot całego zainwestowanego kapitału.', en: 'An investment fund guarantees the return of all invested capital.' }, correct: false },
    ],
  },
  {
    id: 'Q_FM_OP_01',
    topic: 'financial_market',
    level: 'podstawowy',
    type: 'open_short',
    points: 2,
    prompt: {
      pl: 'Podaj dwie różnice między akcją a obligacją.',
      en: 'Give two differences between a share and a bond.',
    },
    answer: {
      pl: 'Np.: akcja to udział we własności spółki, obligacja – dług emitenta; akcjonariusz ma prawo głosu i dywidendy, obligatariusz otrzymuje odsetki i zwrot nominału; obligacja ma termin wykupu, akcja nie.',
      en: 'E.g.: a share is part-ownership of a company, a bond is the issuer\'s debt; a shareholder has voting and dividend rights, a bondholder gets interest and the face value back; a bond has a maturity date, a share does not.',
    },
    lines: 4,
  },
]);
