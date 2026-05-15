# Schulwissen-Labyrinth

Ein interaktives Lern-Labyrinth zu Deutsch und Mathematik – Schulprojekt zweier Schüler.

Das Projekt ist **kein klassisches Quiz**: Statt sofort „richtig“ oder „falsch“ zu zeigen, bewegen sich Spieler:innen durch Räume eines Labyrinths. Manche Wege führen vorwärts, andere wirken plausibel und enden nach ein bis drei Räumen in einer **Sackgasse**, die zurück zur ursprünglichen Entscheidung schickt.

## Konzept

- **Keine Sofort-Rückmeldung**: Die UI verrät während der Reise nicht, ob eine Wahl richtig war. Nur der Pfad ändert sich.
- **Plausible Irrwege**: Falsche Türen, Eingaben oder Reihenfolgen führen in einen Korridor (identisch zum normalen Korridor) und enden später in einer Sackgasse.
- **Lokale Sackgassen**: Jede Sackgasse erklärt den Irrtum mit einem Lern-Hinweis und schickt zur konkreten Entscheidungs-Raum zurück.
- **Verschiedene Interaktionsformen**: Mehrfachauswahl, Türen-Variante, Texteingabe, Zahleneingabe (Brüche oder Dezimalzahlen), Sortier-Aufgabe.
- **Keine Score-Counter**: Während des Spielens werden keine ✓/✗-Zähler eingeblendet. Am Ausgang gibt es eine Übersicht (besuchte Räume, Sackgassen, Schritte).

## Technik

- React 18 + Vite, kein Backend, keine Datenbank
- Plain CSS (eigene Variablen, Labyrinth-Atmosphäre, responsive)
- Alle Räume und Pfade in `src/data/labyrinth.js`
- Beim Import läuft `validateLabyrinth()` automatisch.

## Lokal starten

```bash
npm install
npm run dev
```

Vite läuft standardmäßig auf `http://localhost:5173`.

Produktion:

```bash
npm run build
npm run preview
```

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

Oder via UI: GitHub-Push → vercel.com → Add New Project → Vite-Preset wird erkannt → Deploy.

### GitHub Pages

In `vite.config.js` ist `base: './'` gesetzt, das funktioniert in Unterpfaden. Mit `gh-pages`:

```bash
npm install --save-dev gh-pages
# in package.json:
"deploy": "npm run build && gh-pages -d dist"
npm run deploy
```

## Datenmodell (`src/data/labyrinth.js`)

```js
{
  id: 'm_eo_aufbau',
  type: 'decision',           // start | decision | input | numericInput |
                              // sorting | corridor | falseCorridor |
                              // deadend | final
  variant: 'doors',           // optional: 'doors' für decision
  subject: 'deutsch',         // deutsch | mathematik
  title: 'Türensaal',
  scene: 'Drei Türen ...',    // atmosphärischer Beschreibungstext
  prompt: 'Welches Schild ...?',
  options: [                  // decision
    { label: '...', target: 'fc_eo', hiddenPathType: 'false' },
    { label: '...', target: 'm_textfunktion', hiddenPathType: 'main' }
  ]
}
```

Eingabe-Räume nutzen `acceptedAnswers[]`, Sorting-Räume `items[]` + `correctOrder[]`. Beide haben `onMatch` und `onMiss`. Sackgassen haben `returnTo` zur Entscheidung. `hiddenPathType` ist nur Daten und wird **nie** im UI angezeigt.

## Struktur des Labyrinths

### Hauptpfad (14 Räume)

`start` → `m_eo_aufbau` (Türen) → `m_textfunktion` → `m_argument_sort` (Sortierung) → `m_argumenttyp` → `m_drama_input` (Texteingabe „Peripetie“) → `m_apfelschuss` → `m_herkunft` → `m_ableitung_input` (Zahleneingabe f'(2)) → `m_integral` → `m_pfadregel_input` (Zahleneingabe 1/4) → `m_symmetrie` (Türen) → `m_substitution` → `final`

### Ladder der Hauptpfad-Antworten

Position des richtigen Pfads in den 8 Mehrfachauswahl-Räumen ist gleichmäßig verteilt:

| Raum | Variante | Optionen | Position |
|------|----------|----------|----------|
| `m_eo_aufbau` | doors | 3 | **2.** (mitte) |
| `m_textfunktion` | list | 4 | **3.** |
| `m_argumenttyp` | list | 4 | **1.** |
| `m_apfelschuss` | list | 4 | **4.** |
| `m_herkunft` | list | 4 | **2.** |
| `m_integral` | list | 4 | **3.** |
| `m_symmetrie` | doors | 3 | **1.** (links) |
| `m_substitution` | list | 4 | **4.** |

→ Verteilung: 2 × Pos 1, 2 × Pos 2, 2 × Pos 3, 2 × Pos 4. „Immer A klicken“ schafft das Labyrinth nicht.

### False-Pfade und Sackgassen

| Decision | Korridore | Sackgasse | Länge |
|----------|-----------|-----------|-------|
| `m_eo_aufbau` | `fc_eo` | `dead_eo` | 2 |
| `m_textfunktion` | `fc_textfunktion` | `dead_textfunktion` | 2 |
| `m_argument_sort` | – | `dead_argument` | 1 |
| `m_argumenttyp` | `fc_argtyp_1` → `fc_argtyp_2` | `dead_argtyp` | 3 |
| `m_drama_input` | `fc_drama` | `dead_drama` | 2 |
| `m_apfelschuss` | – | `dead_apfel` | 1 |
| `m_herkunft` | `fc_herkunft` | `dead_herkunft` | 2 |
| `m_ableitung_input` | `fc_abl_1` → `fc_abl_2` | `dead_ableitung` | 3 |
| `m_integral` | `fc_integral` | `dead_integral` | 2 |
| `m_pfadregel_input` | `fc_pfadregel` | `dead_pfadregel` | 2 |
| `m_symmetrie` | – | `dead_symmetrie` | 1 |
| `m_substitution` | `fc_subst` | `dead_subst` | 2 |

Längen-Mix: 3 × Länge 1 (direkter Sackgasse), 7 × Länge 2 (1 Korridor + Sackgasse), 2 × Länge 3 (2 Korridore + Sackgasse).

### Interaktionstypen

| Typ | Räume | Beispiel |
|-----|-------|----------|
| `decision` (Liste) | 6 | `m_textfunktion`, `m_argumenttyp`, `m_apfelschuss`, `m_herkunft`, `m_integral`, `m_substitution` |
| `decision` (Türen) | 2 | `m_eo_aufbau`, `m_symmetrie` |
| `sorting` | 1 | `m_argument_sort` (Bausteine eines Arguments ordnen) |
| `input` (Text) | 1 | `m_drama_input` („Peripetie“ tippen) |
| `numericInput` | 2 | `m_ableitung_input` (f′(2) = 0), `m_pfadregel_input` (1/4 oder 0,25) |

## Räume insgesamt

37 Räume: 1 Start, 8 Decisions, 1 Sorting, 1 Text-Input, 2 Numeric-Input, 11 falseCorridors, 12 Sackgassen, 1 Final.

## Behandelte Schul-Themen

**Deutsch**: Aufbau einer EÖ · Sachtextfunktionen (informierend/appellierend/normierend/ausdrucksbetont) · Argumentationsstruktur (These → Begründung → Beleg → Schlussfolgerung) · Argumenttypen (Fakten/Autorität/Plausibilität/Manipulation) · Grundbegriffe des Dramas (Peripetie) · Wilhelm Tell – Apfelschussszene (Macht, Freiheit, Vaterrolle) · Stanišić „Herkunft“ (Identität, Heimat, Migration).

**Mathematik**: Funktionsuntersuchung (Ableitung an einer Stelle, Symmetrie) · Integralrechnung (Stammfunktion) · Stochastik (Pfadregel) · Grundlagen (biquadratische Gleichung, Substitution z = x²).
