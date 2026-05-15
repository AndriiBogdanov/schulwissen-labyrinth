# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Interaktives „Schulwissen-Labyrinth" zu Deutsch und Mathematik. React + Vite SPA, kein Backend. Spieler:innen bewegen sich durch Räume; das UI verrät nie direkt „richtig/falsch", stattdessen ändert sich der Pfad. Falsche Wege führen über einen langen Irrweg in eine einzelne Falle und zurück zur letzten Haupt-Entscheidung.

Sprache der Inhalte: Deutsch. UI-Texte, Daten, Hinweise — alles auf Deutsch belassen.

## Commands

```bash
npm install          # einmalig
npm run dev          # Vite-Devserver auf http://localhost:5173
npm run build        # Produktion → dist/
npm run preview      # Preview des Builds
```

Kein Linter, kein Test-Runner konfiguriert. Datenvalidierung läuft beim Import von `src/data/labyrinth.js` über `validateLabyrinth()` und schreibt Inkonsistenzen via `console.warn` in die Browser-Konsole — die Devserver-Konsole nach dem Reload prüfen, wenn die Daten verändert wurden.

Deploy: GitHub Actions (`.github/workflows/deploy.yml`) baut bei Push auf `main` und veröffentlicht `dist/` auf GitHub Pages. `vite.config.js` setzt `base: './'`, damit Subpfade (GH Pages) und Root (Vercel) funktionieren — nicht ändern, ohne beide Deploy-Ziele zu prüfen.

## Architecture

Drei tragende Dateien — alles andere ist Style oder Dekoration:

### `src/data/labyrinth.js` — single source of truth

Eine flache Map `{ [id]: room }`. Räume sind eines von acht Typen: `start`, `decision` (optional `variant: 'doors'`), `input`, `numericInput`, `sorting`, `corridor`, `falseCorridor`, `trap`, `final`. Navigation immer per `id`, nie per Index.

**Branch-Modell (zentral, leicht zu brechen):**
- Jeder Aufgaben-Raum trägt `branch: 'main' | 'false'`.
- Auf `'main'` hat **genau eine** Option `hiddenPathType: 'main'`, alle anderen `'false'`. Falsche Optionen zeigen auf den Übergangs-Korridor `c_branch`, der in den Irrweg führt.
- Auf `'false'` haben **alle** Optionen `hiddenPathType: 'false'`. Vom Irrweg führt kein Weg zurück — alles endet in `trap`.
- `hiddenPathType` ist **nur** Daten. Niemals im UI rendern oder erwähnen.
- Es gibt **einen** zentralen `trap`-Raum, nicht mehrere Sackgassen. Der Rückweg aus der Falle wird zur Laufzeit vom Engine-State (`lastBranchPoint`) gesteuert, nicht im Daten-Graph.

**Räume mit Eingabe (`input`, `numericInput`, `sorting`):** haben `acceptedAnswers[]` bzw. `items[]` + `correctOrder[]`, plus `onMatch` und `onMiss` (jeweils `{ target }`). `numericInput` wird in `App.jsx → normalize()` so behandelt: trim, lowercase, Whitespace raus, Komma→Punkt, führender Punkt wird zu `0.`. Akzeptierte Antworten ebenso behandeln (z. B. sowohl `'1/4'` als auch `'0.25'` in `acceptedAnswers` aufführen, wenn beides gültig ist).

**`validateLabyrinth()` am Dateiende prüft (jedes Mal beim Import):**
1. `room.id` stimmt mit Map-Key überein
2. alle Ziel-IDs existieren (`next`, `fallbackReturn`, `options[].target`, `onMatch.target`, `onMiss.target`)
3. Hauptpfad `start → … → final` erreichbar
4. Jede `main`-Entscheidung hat genau 1 `main`-Option
5. Jeder `false`-Raum erreicht `trap`
6. Jedes `false`-Ziel von einem `main`-Raum erreicht `trap`
7. `trap.fallbackReturn` ist gesetzt
8. `main`-Antworten sind über die Positionen verteilt (nicht alle auf Index 0)
9. Alle Interaktionstypen sind vertreten

Wenn beim Devserver-Reload `[labyrinth] Inkonsistenzen:` in der Konsole erscheint, **zuerst die Daten fixen**, bevor weiter gearbeitet wird — die Engine vertraut auf diese Invarianten.

### `src/App.jsx` — Engine + alle Raum-Komponenten

Eine Datei, ein Default-Export `App`. State lebt in `App` (kein Router, keine Context-API):
- `currentId` — aktiver Raum
- `visited` (Set), `steps`, `trapsHit` — Statistik für `FinalRoom`
- `lastBranchPoint` — die Haupt-Entscheidung, an der der Spieler abgebogen ist. Wird gesetzt, sobald von `branch === 'main'` mit `hiddenPathType === 'false'` navigiert wird **und** noch kein Branchpoint existiert. `TrapRoom` nutzt diesen Wert für den Rückkehr-Button (mit `fallbackReturn` als Fallback).
- `branch` — `'main' | 'false'`, gespiegelt aus `lastBranchPoint`. Wird beim Verlassen einer Falle auf `'main'` zurückgesetzt.

`navigate(targetId, sourceRoom, action)` ist der einzige Übergangs-Pfad. SFX werden hier **bewusst entkoppelt vom Erfolg** ausgewählt (Tür/Schritt/Whoosh nach `sourceRoom.type`) — niemals SFX abhängig davon spielen, ob die Antwort korrekt war.

Raum-Rendering: ein flacher `switch` in `Room({ room })`. Neuer Raumtyp = neuer `case` + neue Komponente in derselben Datei.

### `src/audio.js` — generativer Ambient (Tone.js)

Singleton-Engine, exportiert als `audio`. Fünf Moods (`start`, `main`, `false`, `trap`, `final`) — Akkord, Drone, Filter-Cutoff. `moodForRoom(room, branch)` mappt Raumtyp + Branch → Mood-Key. SFX: `playDoor`, `playStep`, `playWhoosh`, `playTrap`, `playSuccess`.

Audio startet **nur nach User-Geste** (`onEnableSound` im Start-Raum). Vorher ist alles stumm — Browser-Autoplay-Policy. Beim Toggle in `App.jsx → toggleMute()` wird das berücksichtigt.

## Inhaltliche Konventionen

- **Pfad-Position verteilen.** Wenn neue `main`-Entscheidungen mit Mehrfachauswahl hinzukommen, die korrekte Option nicht immer an Position 0 setzen — `validateLabyrinth()` warnt, aber gewünscht ist eine echte Mischung (siehe README-Tabelle).
- **Korridor-Texte zeigen Atmosphäre, nicht Bewertung.** „Du gehst weiter" / „Die Luft wird kühler" — niemals „Das war richtig" oder „Falsche Antwort".
- **Sackgassen-`hint`** erklärt den Lerninhalt sachlich; kein „Du hast verloren".
- **`final`** zeigt eine Übersicht (`visitedSize`, `trapsHit`, `steps`) — keine Bewertung „gut/schlecht".

## Bekannte Abweichung README ↔ Code

Der README-Abschnitt „Datenmodell" / „Struktur des Labyrinths" beschreibt eine ältere Variante mit `deadend`-Räumen, lokalen `returnTo`-Verweisen und 12 Sackgassen. Der aktuelle Code nutzt **einen zentralen `trap`-Raum** mit `fallbackReturn` und Engine-getriebenem `lastBranchPoint`. Bei Daten-Arbeit den Code als Quelle der Wahrheit nehmen, nicht den README-Abschnitt.
