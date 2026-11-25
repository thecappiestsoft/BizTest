/** Dział: Finanse osobiste / Personal finance */
BizTest.QuestionsDB.add([
  {
    id: 'Q_FP_DEP_01',
    topic: 'personal_finance',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 3,
    variables: {
      K: { min: 5000, max: 50000, step: 1000 },
      r: { min: 3, max: 7, step: 0.5 },
      m: { values: [3, 6, 12] },
    },
    derived: {
      gross: 'round(K * r / 100 * m / 12, 2)',
      tax: 'round(gross * 0.19, 2)',
      net: 'round(gross - tax, 2)',
      total: 'round(K + net, 2)',
    },
    promptTemplate: {
      pl: 'Klient założył lokatę terminową na kwotę {{K}} zł na okres {{m}} mies. Oprocentowanie nominalne wynosi {{r}}% w skali roku, a odsetki są kapitalizowane na koniec okresu lokaty. Oblicz odsetki netto po potrąceniu 19% podatku od zysków kapitałowych oraz kwotę wypłaconą po zakończeniu lokaty. Wyniki zaokrąglij do grosza.',
      en: 'A client opened a {{m}}-month term deposit of PLN {{K}}. The nominal interest rate is {{r}}% per year and interest is capitalised at the end of the term. Calculate the net interest after the 19% capital gains tax and the amount paid out at the end of the term. Round results to the nearest grosz.',
    },
    solutionTemplate: {
      pl: 'Odsetki brutto: {{K}} × {{r}}% × {{m}}/12 = {{gross}} zł. Podatek: {{gross}} × 0,19 = {{tax}} zł. Odsetki netto: {{gross}} − {{tax}} = {{net}} zł. Wypłata: {{K}} + {{net}} = {{total}} zł.',
      en: 'Gross interest: {{K}} × {{r}}% × {{m}}/12 = PLN {{gross}}. Tax: {{gross}} × 0.19 = PLN {{tax}}. Net interest: {{gross}} − {{tax}} = PLN {{net}}. Payout: {{K}} + {{net}} = PLN {{total}}.',
    },
  },
  {
    id: 'Q_FP_BUDGET_01',
    topic: 'personal_finance',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 2,
    variables: {
      inc: { min: 6000, max: 10000, step: 100 },
      fix: { min: 1500, max: 3500, step: 100 },
      vexp: { min: 800, max: 2000, step: 50 },
    },
    derived: {
      surplus: 'inc - fix - vexp',
      rate: 'round(surplus / inc * 100, 2)',
    },
    promptTemplate: {
      pl: 'Miesięczne dochody gospodarstwa domowego wynoszą {{inc}} zł. Wydatki stałe to {{fix}} zł, a wydatki zmienne {{vexp}} zł. Oblicz miesięczną nadwyżkę finansową oraz stopę oszczędności (jako % dochodu).',
      en: 'A household earns PLN {{inc}} a month. Fixed expenses are PLN {{fix}} and variable expenses are PLN {{vexp}}. Calculate the monthly surplus and the savings rate (as % of income).',
    },
    solutionTemplate: {
      pl: 'Nadwyżka: {{inc}} − {{fix}} − {{vexp}} = {{surplus}} zł. Stopa oszczędności: {{surplus}} / {{inc}} × 100% = {{rate}}%.',
      en: 'Surplus: {{inc}} − {{fix}} − {{vexp}} = PLN {{surplus}}. Savings rate: {{surplus}} / {{inc}} × 100% = {{rate}}%.',
    },
  },
  {
    id: 'Q_FP_REAL_01',
    topic: 'personal_finance',
    level: 'rozszerzony',
    type: 'parametric_math',
    points: 2,
    variables: {
      n: { min: 4, max: 9, step: 0.5 },
      inf: { min: 2, max: 8, step: 0.5 },
    },
    derived: {
      approx: 'n - inf',
      exact: 'round(((1 + n / 100) / (1 + inf / 100) - 1) * 100, 2)',
    },
    promptTemplate: {
      pl: 'Nominalne oprocentowanie lokaty wynosi {{n}}% rocznie, a roczna stopa inflacji {{inf}}%. Oblicz realną stopę procentową metodą przybliżoną oraz dokładną (wzór Fishera). Wynik dokładny zaokrąglij do 0,01 p.p.',
      en: 'A deposit pays a nominal {{n}}% per year and annual inflation is {{inf}}%. Calculate the real interest rate using the approximate method and the exact Fisher formula. Round the exact result to 0.01 pp.',
    },
    solutionTemplate: {
      pl: 'Przybliżenie: {{n}}% − {{inf}}% = {{approx}}%. Wzór Fishera: (1 + {{n}}%) / (1 + {{inf}}%) − 1 = {{exact}}%.',
      en: 'Approximation: {{n}}% − {{inf}}% = {{approx}}%. Fisher: (1 + {{n}}%) / (1 + {{inf}}%) − 1 = {{exact}}%.',
    },
  },
  {
    id: 'Q_FP_FX_01',
    topic: 'personal_finance',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 3,
    variables: {
      eur: { min: 200, max: 2000, step: 50 },
      buy: { min: 4.21, max: 4.35, step: 0.01 },
      spread: { min: 0.05, max: 0.15, step: 0.01 },
    },
    derived: {
      sell: 'round(buy + spread, 2)',
      pay: 'round(eur * sell, 2)',
      back: 'round(eur * buy, 2)',
      loss: 'round(pay - back, 2)',
    },
    promptTemplate: {
      pl: 'Turysta chce kupić {{eur}} EUR w kantorze. Kurs kupna EUR wynosi {{buy}} zł, a kurs sprzedaży {{sell}} zł. Ile złotych zapłaci turysta? Ile złotych otrzymałby, gdyby od razu odsprzedał te euro w tym samym kantorze, i ile wyniosłaby jego strata?',
      en: 'A tourist wants to buy EUR {{eur}} at an exchange office. The EUR buying rate is PLN {{buy}} and the selling rate is PLN {{sell}}. How much will the tourist pay? How much would they get if they sold the euros straight back to the same office, and what would the loss be?',
    },
    solutionTemplate: {
      pl: 'Zakup po kursie sprzedaży: {{eur}} × {{sell}} = {{pay}} zł. Odsprzedaż po kursie kupna: {{eur}} × {{buy}} = {{back}} zł. Strata (spread): {{pay}} − {{back}} = {{loss}} zł.',
      en: 'Buying at the selling rate: {{eur}} × {{sell}} = PLN {{pay}}. Selling back at the buying rate: {{eur}} × {{buy}} = PLN {{back}}. Loss (spread): {{pay}} − {{back}} = PLN {{loss}}.',
    },
  },
  {
    id: 'Q_FP_LOAN_01',
    topic: 'personal_finance',
    level: 'rozszerzony',
    type: 'parametric_math',
    points: 4,
    variables: {
      P: { min: 10000, max: 60000, step: 1000 },
      r: { min: 6, max: 12, step: 0.5 },
      n: { values: [12, 24, 36, 48] },
    },
    derived: {
      i: 'r / 1200',
      rate: 'round(P * i / (1 - (1 + i) ^ (-n)), 2)',
      total: 'round(rate * n, 2)',
      cost: 'round(total - P, 2)',
    },
    promptTemplate: {
      pl: 'Kredyt konsumencki w wysokości {{P}} zł zaciągnięto na {{n}} miesięcy przy oprocentowaniu {{r}}% w skali roku. Kredyt jest spłacany w ratach równych (annuitetowych). Oblicz wysokość miesięcznej raty, łączną kwotę spłat oraz koszt odsetek. Pomiń prowizje i ubezpieczenia.',
      en: 'A consumer loan of PLN {{P}} is taken for {{n}} months at {{r}}% per year and repaid in equal (annuity) instalments. Calculate the monthly instalment, the total repaid and the interest cost. Ignore fees and insurance.',
    },
    solutionTemplate: {
      pl: 'i = {{r}}% / 12. Rata: R = P · i / (1 − (1 + i)^(−n)) = {{rate}} zł. Łącznie: {{rate}} × {{n}} = {{total}} zł. Koszt odsetek: {{total}} − {{P}} = {{cost}} zł.',
      en: 'i = {{r}}% / 12. Instalment: R = P · i / (1 − (1 + i)^(−n)) = PLN {{rate}}. Total: {{rate}} × {{n}} = PLN {{total}}. Interest cost: {{total}} − {{P}} = PLN {{cost}}.',
    },
  },
  {
    id: 'Q_FP_SC_01',
    topic: 'personal_finance',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'RRSO (rzeczywista roczna stopa oprocentowania) to wskaźnik, który:',
      en: 'The APR (annual percentage rate of charge) is an indicator that:',
    },
    options: [
      { text: { pl: 'wyraża całkowity koszt kredytu jako procent kwoty kredytu w skali roku', en: 'expresses the total cost of credit as an annual percentage of the loan amount' }, correct: true },
      { text: { pl: 'określa wyłącznie oprocentowanie nominalne kredytu', en: 'shows only the nominal interest rate of the loan' }, correct: false },
      { text: { pl: 'informuje tylko o wysokości prowizji bankowej', en: 'shows only the amount of the bank fee' }, correct: false },
      { text: { pl: 'jest równy stopie referencyjnej NBP', en: 'equals the central bank reference rate' }, correct: false },
    ],
  },
  {
    id: 'Q_FP_SC_02',
    topic: 'personal_finance',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Które z poniższych jest przykładem dochodu pasywnego?',
      en: 'Which of the following is an example of passive income?',
    },
    options: [
      { text: { pl: 'Czynsz z wynajmu mieszkania', en: 'Rent from letting a flat' }, correct: true },
      { text: { pl: 'Wynagrodzenie z umowy o pracę', en: 'Salary from an employment contract' }, correct: false },
      { text: { pl: 'Wynagrodzenie z umowy zlecenia', en: 'Pay from a contract of mandate' }, correct: false },
      { text: { pl: 'Premia za wyniki w pracy', en: 'A performance bonus at work' }, correct: false },
    ],
  },
  {
    id: 'Q_FP_SC_03',
    topic: 'personal_finance',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Do jakiej kwoty Bankowy Fundusz Gwarancyjny gwarantuje środki jednego deponenta w jednym banku?',
      en: 'Up to what amount does the Polish Bank Guarantee Fund (BFG) protect one depositor\'s funds in one bank?',
    },
    options: [
      { text: { pl: 'Do równowartości 100 000 euro', en: 'Up to the equivalent of EUR 100,000' }, correct: true },
      { text: { pl: 'Do 50 000 zł', en: 'Up to PLN 50,000' }, correct: false },
      { text: { pl: 'Do równowartości 50 000 euro', en: 'Up to the equivalent of EUR 50,000' }, correct: false },
      { text: { pl: 'Do 100 000 zł', en: 'Up to PLN 100,000' }, correct: false },
    ],
  },
  {
    id: 'Q_FP_SC_04',
    topic: 'personal_finance',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Poduszka finansowa (fundusz awaryjny) to:',
      en: 'An emergency fund (financial cushion) is:',
    },
    options: [
      { text: { pl: 'oszczędności na nieprzewidziane wydatki, łatwo dostępne', en: 'easily accessible savings for unexpected expenses' }, correct: true },
      { text: { pl: 'długoterminowa inwestycja w akcje', en: 'a long-term investment in shares' }, correct: false },
      { text: { pl: 'limit kredytowy na karcie kredytowej', en: 'the credit limit on a credit card' }, correct: false },
      { text: { pl: 'składka na ubezpieczenie emerytalne', en: 'a pension insurance contribution' }, correct: false },
    ],
  },
  {
    id: 'Q_FP_TF_01',
    topic: 'personal_finance',
    level: 'podstawowy',
    type: 'true_false',
    points: 2,
    prompt: {
      pl: 'Oceń prawdziwość podanych zdań dotyczących finansów osobistych. Zaznacz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
      en: 'Decide whether the statements about personal finance are true or false. Mark T if the statement is true or F if it is false.',
    },
    statements: [
      { text: { pl: 'Kapitalizacja odsetek polega na doliczaniu odsetek do kapitału, od którego naliczane są dalsze odsetki.', en: 'Capitalisation means adding interest to the principal, on which further interest is then charged.' }, correct: true },
      { text: { pl: 'Wyższa RRSO oznacza tańszy kredyt dla konsumenta.', en: 'A higher APR means a cheaper loan for the consumer.' }, correct: false },
      { text: { pl: 'Debet na rachunku osobistym jest formą kredytu.', en: 'An overdraft on a personal account is a form of credit.' }, correct: true },
      { text: { pl: 'Odsetki od lokat bankowych w Polsce są zwolnione z podatku.', en: 'Interest on bank deposits in Poland is tax-free.' }, correct: false },
    ],
  },
  {
    id: 'Q_FP_OP_01',
    topic: 'personal_finance',
    level: 'podstawowy',
    type: 'open_short',
    points: 2,
    prompt: {
      pl: 'Wyjaśnij, czym różni się kapitalizacja prosta od kapitalizacji złożonej.',
      en: 'Explain the difference between simple and compound interest.',
    },
    answer: {
      pl: 'Przy kapitalizacji prostej odsetki nalicza się zawsze od kapitału początkowego. Przy złożonej odsetki są doliczane do kapitału i w kolejnych okresach same przynoszą odsetki („procent składany”).',
      en: 'With simple interest, interest is always charged on the original principal. With compound interest, interest is added to the principal and itself earns interest in later periods.',
    },
    lines: 4,
  },
]);
