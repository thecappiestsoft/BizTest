# BizTest Gen — Generator Kart Pracy i Sprawdzianów (Moduł 3)

Lokalny (offline-first) generator kart pracy, quizów i zadań obliczeniowych dla przedmiotu
**Biznes i Zarządzanie**. Tworzy warianty dla grup A–F z innymi liczbami i inną kolejnością
odpowiedzi, a do tego klucz odpowiedzi dla nauczyciela. Druk i PDF obsługuje przeglądarka (bez serwera).

> **EN:** Offline worksheet & test generator. Open `index.html` in any modern browser. The UI and the
> built-in question bank are bilingual (PL / EN), with a PL | EN switch and an icon-only light/dark theme switch.

---

## Uruchomienie

1. Otwórz `index.html` w przeglądarce (Chrome, Edge, Firefox, Safari). Nie potrzeba serwera ani internetu.
2. Wybierz zadania → **Generuj karty pracy** → **Drukuj / PDF** (w oknie drukowania wybierz „Zapisz jako PDF”).

Wszystkie skrypty to zwykłe pliki `<script>` (bez modułów ES, bundlera i `npm install`), więc aplikacja
działa z adresu `file://`, z dowolnego serwera statycznego i z GitHub Pages bez kroku budowania.

## Publikacja na GitHub Pages

1. Utwórz repozytorium na GitHubie i wgraj **zawartość** tego archiwum do głównego katalogu repozytorium
   (`index.html` ma leżeć w katalogu głównym, obok folderów `css/`, `data/`, `js/`).
   ```bash
   git init
   git add .
   git commit -m "BizTest Gen"
   git branch -M main
   git remote add origin https://github.com/<uzytkownik>/<repozytorium>.git
   git push -u origin main
   ```
2. W repozytorium: **Settings → Pages → Build and deployment → Source: „Deploy from a branch”**,
   gałąź `main`, folder `/ (root)` → **Save**.
3. Po minucie–dwóch aplikacja będzie dostępna pod adresem `https://<uzytkownik>.github.io/<repozytorium>/`.

Wszystkie ścieżki w `index.html` są względne, więc aplikacja działa także w podkatalogu `/<repozytorium>/`.
Plik `.nojekyll` wyłącza przetwarzanie Jekyll, dzięki czemu GitHub Pages serwuje pliki bez zmian.
Każdy `git push` do `main` automatycznie aktualizuje stronę.

> Ustawienia i własne zadania nauczyciela są w `localStorage` przeglądarki — osobno dla każdego adresu.
> Zadania zapisane w wersji lokalnej (`file://`) nie pojawią się same w wersji na GitHub Pages:
> przenieś je przez **Eksportuj moje_zadania.json** → **Importuj JSON**.

## Dla programistów — szybki start

| Zadanie | Polecenie (z głównego katalogu) |
|---|---|
| Podgląd z lokalnym serwerem (opcjonalnie) | `python3 -m http.server 8000` → http://localhost:8000 |
| Test logiki i całej bazy zadań (Node.js) | `node tools/check.js` |
| Wersja w jednym pliku HTML | `python3 tools/build-single-html.py` → `dist/biztest-gen.html` |

- Uruchamiaj `node tools/check.js` po każdej zmianie w `data/questions/` — wykryje literówki w `{{zmiennych}}`, błędne formuły i zadania bez poprawnej odpowiedzi.
- `.editorconfig` ustala wspólny styl plików (UTF-8, LF, 2 spacje). Większość edytorów stosuje go automatycznie.
- Folder `dist/` jest w `.gitignore` — wersji jednoplikowej nie trzeba commitować.

## Funkcje

| Funkcja | Gdzie w kodzie |
|---|---|
| Deterministyczne ziarno `SEED-xxxxx` (Mulberry32, osobny PRNG na grupę: `seed + groupIndex`) | `js/core/prng.js`, `js/core/testBuilder.js` |
| Zadania parametryczne `{{zmienna}}` + zmienne wyliczane | `js/core/templateEngine.js` |
| Bezpieczny parser wyrażeń (bez `eval()`) | `js/core/mathParser.js` |
| Tasowanie odpowiedzi ABCD i stwierdzeń P/F (Fisher-Yates) | `js/core/prng.js` → `shuffle()` |
| Arkusz ucznia + klucz nauczyciela, metryczka na każdej stronie, kratka SVG | `js/render/worksheet.js` |
| Style druku A4, łamanie stron między grupami | `css/print-a4.css`, `css/worksheet.css` |
| Tryb oszczędny (Eco-Print) — tylko szare obramowania 1px | klasa `.worksheet--eco` w `css/worksheet.css` |
| Kreator własnych zadań z podglądem A4 na żywo | `js/views/builderView.js` |
| Własne zadania w `localStorage`, eksport/import `moje_zadania.json` | `js/core/customBank.js` |
| Język PL / EN | `js/i18n/` |
| Motyw jasny / ciemny | `css/theme.css`, `js/ui/theme.js` |
| 3 style graficzne (każdy w wersji jasnej i ciemnej) | `css/skins/*.css`, `js/ui/skin.js`, `js/ui/decorations.js` |

## Struktura katalogów

```
/ (katalog główny repozytorium)
├── index.html                  # Układ strony: nagłówek, widoki Generator / Kreator, stopka
├── README.md                   # Ten plik — dokumentacja formatu zadań
├── .nojekyll                   # GitHub Pages: serwuj pliki bez przetwarzania Jekyll
├── .editorconfig               # Wspólne ustawienia edytora (UTF-8, LF, wcięcia)
├── .gitignore
├── tools/
│   ├── check.js                # Test logiki i bazy zadań: node tools/check.js
│   └── build-single-html.py    # Składa wszystko w dist/biztest-gen.html
├── css/
│   ├── theme.css               # Zmienne kolorów i fontów (motyw jasny i ciemny)
│   ├── app.css                 # Style interfejsu aplikacji
│   ├── worksheet.css           # Wygląd kartki A4 (ekran + druk), tryb Eco
│   ├── print-a4.css            # @page, @media print, paginacja
│   └── skins/                  # Style graficzne nakładane na app.css
│       ├── ledger.css          # A – „Zeszyt ekonomisty”
│       ├── market.css          # B – „Parkiet giełdowy”
│       └── classroom.css       # C – „Tablica w klasie”
├── data/
│   ├── questions_db.js         # Rejestr bazy: działy (TOPICS), poziomy, API QuestionsDB
│   └── questions/              # Zadania podzielone według działów
│       ├── personal_finance.js
│       ├── financial_market.js
│       ├── enterprise.js
│       ├── marketing.js
│       ├── project_mgmt.js
│       └── economy.js
└── js/
    ├── app.js                  # Punkt wejścia: start aplikacji, zakładki
    ├── utils/
    │   ├── dom.js              # escapeHtml, $, $$, debounce, pobieranie plików
    │   ├── storage.js          # localStorage (JSON, prefiks „biztest.”)
    │   └── events.js           # Szyna zdarzeń (Bus) między widokami
    ├── i18n/
    │   ├── i18n.js             # t(), pick(), wiązanie atrybutów data-i18n
    │   └── locales/
    │       ├── pl.js           # Teksty interfejsu — polski
    │       └── en.js           # Teksty interfejsu — angielski
    ├── core/                   # Logika bez DOM (można testować w Node.js)
    │   ├── prng.js             # Mulberry32, obsługa kodów SEED
    │   ├── mathParser.js       # Parser i ewaluator wyrażeń
    │   ├── templateEngine.js   # Losowanie zmiennych, {{podstawianie}}, formatowanie liczb
    │   ├── testBuilder.js      # Budowa wariantów dla grup
    │   └── customBank.js       # Zadania nauczyciela: zapis, walidacja, import/eksport
    ├── render/
    │   └── worksheet.js        # HTML kart ucznia i klucza odpowiedzi
    ├── ui/
    │   ├── dialog.js           # Okno potwierdzenia w aplikacji (zamiast confirm())
    │   ├── theme.js            # Przełącznik jasny | ciemny
    │   ├── skin.js             # Przełącznik stylu graficznego (A | B | C)
    │   ├── decorations.js      # Pasek notowań i rysunek kredą (tłumaczone)
    │   ├── languageSwitch.js   # Przełącznik PL | EN
    │   ├── questionMeta.js     # Etykiety typów, poziomów i działów
    │   └── toast.js            # Powiadomienia
    └── views/
        ├── generatorView.js    # Widok „Generator”
        └── builderView.js      # Widok „Kreator zadań”
```

**Kolejność ładowania skryptów** jest ustalona w `index.html`: najpierw `utils`, potem `i18n`, `core`, `data`, a na końcu `render`, `ui`, `views` i `app.js`.
Każdy plik dopisuje swój moduł do globalnej przestrzeni nazw `window.BizTest` (np. `BizTest.MathParser`).

## Style graficzne

W nagłówku są trzy przełączniki z samymi ikonami: **styl** (zeszyt | wykres giełdowy | tablica), **język** (PL | EN) i **motyw** (słońce | księżyc). Każdy styl działa w wersji jasnej i ciemnej, a wybór zapamiętuje się w przeglądarce.

| Styl | Atrybut | Charakter |
|---|---|---|
| A – Zeszyt ekonomisty (domyślny) | `data-skin="ledger"` | kartka w kratkę, czerwony margines, przekładki segregatora, zakreślacz, przycisk-pieczątka |
| B – Parkiet giełdowy | `data-skin="market"` | terminal notowań, przewijany pasek z pojęciami z lekcji (BEP, ROI, VAT…), kolory wzrost/spadek |
| C – Tablica w klasie | `data-skin="classroom"` | tablica kredowa z wykresem BEP i wzorami, kartki na pinezkach, tablica korkowa |

Każdy plik w `css/skins/` definiuje zmienne kolorów dla `[data-theme="light"]` i `[data-theme="dark"]` oraz własne ozdobniki. Kartka A4 i wydruk nie zależą od stylu, bo zawsze są czarno-białe.
**Nowy styl:** skopiuj jeden z plików `css/skins/`, zmień nazwę w selektorach, dołącz go w `index.html`, dodaj nazwę do `SKINS` w `js/ui/skin.js` (oraz do skryptu w `<head>`) i dodaj przycisk `data-skin-value`.

## Format zadania (JSON)

Pola tekstowe mogą być **zwykłym tekstem** (`"..."`) albo **obiektem dwujęzycznym** (`{ "pl": "...", "en": "..." }`).
Wbudowane zadania są dwujęzyczne, a zadania z kreatora mają zwykły tekst w języku, w którym je napisano.

### Pola wspólne

| Pole | Opis |
|---|---|
| `id` | Unikalny identyfikator, np. `Q_FIN_BEP_01` (własne zadania: `CUSTOM_…`) |
| `topic` | Id działu z `TOPICS` w `data/questions_db.js` (np. `enterprise`) |
| `level` | `podstawowy` albo `rozszerzony` |
| `type` | `single_choice`, `true_false`, `open_short` lub `parametric_math` |
| `points` | Liczba punktów (≥ 1) |

### `single_choice` — jednokrotnego wyboru (ABCD)

```json
{
  "id": "Q_MKT_4P_02", "topic": "marketing", "level": "podstawowy",
  "type": "single_choice", "points": 1,
  "prompt": { "pl": "Który element 4P obejmuje dystrybucję?", "en": "Which 4P element covers distribution?" },
  "options": [
    { "text": "Place", "correct": true },
    { "text": "Promotion", "correct": false },
    { "text": "Product", "correct": false },
    { "text": "Price", "correct": false }
  ]
}
```
Dokładnie jedna opcja ma `correct: true`. Kolejność jest tasowana osobno dla każdej grupy.

### `true_false` — Prawda/Fałsz (tabela w stylu CKE)

```json
{
  "type": "true_false", "points": 2,
  "prompt": "Oceń prawdziwość zdań…",
  "statements": [
    { "text": "Debet jest formą kredytu.", "correct": true },
    { "text": "Wyższa RRSO oznacza tańszy kredyt.", "correct": false }
  ]
}
```

### `open_short` — otwarte z krótką odpowiedzią

```json
{ "type": "open_short", "points": 2, "prompt": "Wyjaśnij pojęcie BEP.", "answer": "Wzorcowa odpowiedź…", "lines": 3 }
```
`lines` to liczba linii na odpowiedź ucznia (1–15).

### `parametric_math` — zadanie obliczeniowe z parametrami

```json
{
  "id": "Q_FIN_BEP_01", "topic": "enterprise", "level": "podstawowy",
  "type": "parametric_math", "points": 3,
  "variables": {
    "fc": { "min": 12000, "max": 45000, "step": 1000 },
    "vc": { "min": 15, "max": 40, "step": 5 },
    "vat": { "values": [5, 8, 23] }
  },
  "derived": {
    "price": "vc + 20",
    "bep_units": "Math.ceil(fc / 20)"
  },
  "promptTemplate": "Koszty stałe wynoszą {{fc}} PLN…",
  "solutionTemplate": "BEP: {{fc}} / 20 = {{bep_units}} szt."
}
```

- **`variables`** — wartości losowane z przedziału `[min, max]` z krokiem `step` albo z listy `values`.
- **`derived`** — formuły liczone po wylosowaniu zmiennych. Mogą korzystać z innych formuł (kolejność zapisu nie ma znaczenia).
- **`promptTemplate` / `solutionTemplate`** — tekst z miejscami `{{nazwa}}`. Liczby są formatowane zgodnie z językiem (`12 000,50` / `12,000.50`).

#### Składnia formuł (`mathParser.js`)

- Operatory: `+ - * / %`, potęga `^` (lub `**`), nawiasy.
- Funkcje: `ceil`, `floor`, `round(x, miejsca)`, `abs`, `min`, `max`, `sqrt`, `pow`, `exp`, `ln`/`log`, `log10`. Prefiks `Math.` jest dozwolony.
- Stałe: `PI`, `E`.
- Nazwy zmiennych: litery łacińskie, cyfry i `_` (bez polskich znaków, nie mogą zaczynać się od cyfry).
- Dzielenie przez zero i wyniki nieskończone zgłaszają czytelny błąd.

### Plik eksportu `moje_zadania.json`

```json
{ "format": "biztest-gen/questions", "version": 1, "exportedAt": "…", "questions": [ … ] }
```
Import przyjmuje ten format albo samą tablicę zadań. Niepoprawne zadania są pomijane. Jeśli identyfikator koliduje z zadaniem wbudowanym, nadawany jest nowy.

## Typowe zmiany w kodzie

- **Nowe zadanie wbudowane:** dopisz obiekt do odpowiedniego pliku w `data/questions/`.
- **Nowy dział:** dodaj wpis do `TOPICS` w `data/questions_db.js`, utwórz plik `data/questions/<dzial>.js` i dołącz go w `index.html`.
- **Nowy tekst interfejsu:** dodaj klucz w `js/i18n/locales/pl.js` **i** `en.js`. W HTML użyj `data-i18n="klucz"`, a w JS `BizTest.I18n.t('klucz')`.
- **Nowy język:** skopiuj `en.js` jako np. `de.js`, zmień `register('de', …)`, dodaj `'de'` do `SUPPORTED` w `i18n.js` i przycisk `data-lang="de"` w nagłówku.
- **Kolory / motyw:** zmienne w `css/theme.css` (baza) i w `css/skins/*.css` (style). Kartka A4 jest zawsze biała i czarno-biała (`css/worksheet.css`).
- **Nowy typ zadania:** dodaj go do `QUESTION_TYPES` (`testBuilder.js`), renderery `studentBody` i `keyBody` (`worksheet.js`), walidację (`customBank.js`), formularz `typeForms` (`builderView.js`) oraz etykietę `types.*` w słownikach.

## Testowanie logiki bez przeglądarki

Pełny test bazy zadań: `node tools/check.js`. Moduły z `js/core/` nie używają DOM, więc można też korzystać z nich bezpośrednio w Node.js:

```js
['js/utils/dom.js','js/core/prng.js','js/core/mathParser.js','js/core/templateEngine.js','js/core/testBuilder.js']
  .forEach(f => require('./' + f));
const B = globalThis.BizTest;
console.log(B.MathParser.evaluate('round(fc / m, 2)', { fc: 12000, m: 35 })); // 342.86
```

## Dane i prywatność

Aplikacja nie wysyła żadnych danych. Ustawienia, wybrane zadania i własne zadania nauczyciela są
przechowywane wyłącznie w `localStorage` przeglądarki (klucze z prefiksem `biztest.`).

---

© 2026 CappySoft.pl
