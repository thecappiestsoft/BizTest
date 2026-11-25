/** Dział: Gospodarka i państwo / Economy and the state */
BizTest.QuestionsDB.add([
  {
    id: 'Q_EC_INFL_01',
    topic: 'economy',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 2,
    variables: {
      y1: { min: 2000, max: 3000, step: 10 },
      inc: { min: 50, max: 300, step: 10 },
    },
    derived: {
      y2: 'y1 + inc',
      infl: 'round(inc / y1 * 100, 2)',
    },
    promptTemplate: {
      pl: 'Koszyk dóbr konsumpcyjnych kosztował w ubiegłym roku {{y1}} zł, a w bieżącym roku {{y2}} zł. Oblicz stopę inflacji.',
      en: 'A basket of consumer goods cost PLN {{y1}} last year and PLN {{y2}} this year. Calculate the inflation rate.',
    },
    solutionTemplate: {
      pl: 'Inflacja = ({{y2}} − {{y1}}) / {{y1}} × 100% = {{infl}}%.',
      en: 'Inflation = ({{y2}} − {{y1}}) / {{y1}} × 100% = {{infl}}%.',
    },
  },
  {
    id: 'Q_EC_UNEMP_01',
    topic: 'economy',
    level: 'podstawowy',
    type: 'parametric_math',
    points: 2,
    variables: {
      u: { min: 80, max: 300, step: 5 },
      emp: { min: 1500, max: 3000, step: 50 },
    },
    derived: {
      lf: 'u + emp',
      rate: 'round(u / lf * 100, 2)',
    },
    promptTemplate: {
      pl: 'W województwie jest {{emp}} tys. osób pracujących i {{u}} tys. osób bezrobotnych. Oblicz liczbę osób aktywnych zawodowo oraz stopę bezrobocia.',
      en: 'A region has {{emp}} thousand employed people and {{u}} thousand unemployed. Calculate the labour force and the unemployment rate.',
    },
    solutionTemplate: {
      pl: 'Aktywni zawodowo: {{emp}} + {{u}} = {{lf}} tys. Stopa bezrobocia: {{u}} / {{lf}} × 100% = {{rate}}%.',
      en: 'Labour force: {{emp}} + {{u}} = {{lf}} thousand. Unemployment rate: {{u}} / {{lf}} × 100% = {{rate}}%.',
    },
  },
  {
    id: 'Q_EC_GDP_01',
    topic: 'economy',
    level: 'rozszerzony',
    type: 'parametric_math',
    points: 2,
    variables: {
      gdp: { min: 500, max: 3500, step: 50 },
      pop: { min: 5, max: 40, step: 0.5 },
    },
    derived: {
      pc: 'round(gdp / pop * 1000, 2)',
    },
    promptTemplate: {
      pl: 'PKB kraju wyniósł {{gdp}} mld zł, a liczba ludności {{pop}} mln osób. Oblicz PKB na jednego mieszkańca (w zł).',
      en: 'A country\'s GDP was PLN {{gdp}} billion and its population {{pop}} million. Calculate GDP per capita (in PLN).',
    },
    solutionTemplate: {
      pl: 'PKB per capita = {{gdp}} mld / {{pop}} mln = {{pc}} zł na osobę.',
      en: 'GDP per capita = {{gdp}} bn / {{pop}} m = PLN {{pc}} per person.',
    },
  },
  {
    id: 'Q_EC_SC_01',
    topic: 'economy',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Podstawowe stopy procentowe NBP ustala:',
      en: 'The National Bank of Poland\'s base interest rates are set by:',
    },
    options: [
      { text: { pl: 'Rada Polityki Pieniężnej', en: 'the Monetary Policy Council' }, correct: true },
      { text: { pl: 'Komisja Nadzoru Finansowego', en: 'the Financial Supervision Authority' }, correct: false },
      { text: { pl: 'Minister Finansów', en: 'the Minister of Finance' }, correct: false },
      { text: { pl: 'Sejm w ustawie budżetowej', en: 'Parliament in the budget act' }, correct: false },
    ],
  },
  {
    id: 'Q_EC_SC_02',
    topic: 'economy',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Podatek VAT jest przykładem podatku:',
      en: 'VAT is an example of:',
    },
    options: [
      { text: { pl: 'pośredniego', en: 'an indirect tax' }, correct: true },
      { text: { pl: 'bezpośredniego', en: 'a direct tax' }, correct: false },
      { text: { pl: 'majątkowego', en: 'a property tax' }, correct: false },
      { text: { pl: 'dochodowego', en: 'an income tax' }, correct: false },
    ],
  },
  {
    id: 'Q_EC_SC_03',
    topic: 'economy',
    level: 'podstawowy',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Deflacja to:',
      en: 'Deflation is:',
    },
    options: [
      { text: { pl: 'spadek ogólnego poziomu cen w gospodarce', en: 'a fall in the general price level in the economy' }, correct: true },
      { text: { pl: 'spadek tempa wzrostu cen przy nadal rosnących cenach', en: 'a slowdown in price growth while prices still rise' }, correct: false },
      { text: { pl: 'spadek wartości PKB przez dwa kwartały', en: 'a fall in GDP for two quarters' }, correct: false },
      { text: { pl: 'wzrost kursu złotego wobec euro', en: 'a rise of the zloty against the euro' }, correct: false },
    ],
  },
  {
    id: 'Q_EC_SC_04',
    topic: 'economy',
    level: 'rozszerzony',
    type: 'single_choice',
    points: 1,
    prompt: {
      pl: 'Bezrobocie frykcyjne wynika przede wszystkim z:',
      en: 'Frictional unemployment results mainly from:',
    },
    options: [
      { text: { pl: 'czasu potrzebnego na znalezienie nowej pracy przy zmianie zatrudnienia', en: 'the time needed to find a new job when changing jobs' }, correct: true },
      { text: { pl: 'trwałego spadku popytu na pracę w regionie', en: 'a lasting fall in labour demand in a region' }, correct: false },
      { text: { pl: 'sezonowości prac, np. w rolnictwie', en: 'seasonal work, e.g. in agriculture' }, correct: false },
      { text: { pl: 'niedopasowania kwalifikacji do potrzeb rynku', en: 'a mismatch between skills and market needs' }, correct: false },
    ],
  },
  {
    id: 'Q_EC_TF_01',
    topic: 'economy',
    level: 'podstawowy',
    type: 'true_false',
    points: 2,
    prompt: {
      pl: 'Oceń prawdziwość podanych zdań dotyczących gospodarki. Zaznacz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',
      en: 'Decide whether the statements about the economy are true or false. Mark T if true or F if false.',
    },
    statements: [
      { text: { pl: 'PKB to wartość dóbr i usług finalnych wytworzonych na terenie kraju w danym okresie.', en: 'GDP is the value of final goods and services produced within a country in a given period.' }, correct: true },
      { text: { pl: 'Inflacja zwiększa siłę nabywczą pieniądza.', en: 'Inflation increases the purchasing power of money.' }, correct: false },
      { text: { pl: 'Narodowy Bank Polski jest bankiem centralnym Polski.', en: 'The National Bank of Poland is Poland\'s central bank.' }, correct: true },
      { text: { pl: 'Podatek PIT jest podatkiem pośrednim.', en: 'Personal income tax (PIT) is an indirect tax.' }, correct: false },
    ],
  },
  {
    id: 'Q_EC_OP_01',
    topic: 'economy',
    level: 'rozszerzony',
    type: 'open_short',
    points: 2,
    prompt: {
      pl: 'Wyjaśnij różnicę między PKB nominalnym a PKB realnym.',
      en: 'Explain the difference between nominal and real GDP.',
    },
    answer: {
      pl: 'PKB nominalny liczony jest w cenach bieżących, a realny – w cenach stałych (z wyeliminowanym wpływem inflacji), dlatego lepiej pokazuje faktyczny wzrost produkcji.',
      en: 'Nominal GDP is measured at current prices, real GDP at constant prices (with inflation removed), so real GDP better shows the actual growth in output.',
    },
    lines: 3,
  },
]);
