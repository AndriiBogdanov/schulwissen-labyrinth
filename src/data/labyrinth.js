// =====================================================================
//  Schulwissen-Labyrinth – Datenmodell (Escape-Room-Variante)
// ---------------------------------------------------------------------
//  Konzept:
//    Es gibt einen langen Hauptpfad (8 Aufgaben) und einen langen
//    parallelen IRRWEG (6 Aufgaben). Eine falsche Antwort auf dem
//    Hauptpfad führt NICHT direkt in eine Sackgasse, sondern in einen
//    Übergangs-Korridor und dann in den Irrweg. Auf dem Irrweg geht es
//    ganz normal mit weiteren Aufgaben weiter – Korridore zwischen den
//    Aufgaben beschreiben atmosphärisch, was man sieht. Erst ganz am
//    Ende des Irrwegs schnappt die FALLE zu.
//
//  Räume:
//    start            – Eingang + Erklärung
//    decision         – Mehrfachauswahl (optional variant: 'doors')
//    input            – Texteingabe (Begriff tippen)
//    numericInput     – Zahl oder Bruch eintippen
//    sorting          – Bausteine in die richtige Reihenfolge bringen
//    corridor         – Korridor auf dem Hauptpfad
//    falseCorridor    – Korridor auf dem Irrweg (UI identisch zu corridor)
//    trap             – Falle am Ende des Irrwegs
//    final            – Ausgang
//
//  Branch-Markierung:
//    Jede Aufgabe trägt `branch: 'main' | 'false'`.
//    Auf 'main' hat EINE Option hiddenPathType: 'main', die anderen 'false'.
//    Auf 'false' haben ALLE Optionen hiddenPathType: 'false' (man kommt
//    nicht zurück, alle Wege führen am Ende in die TRAP).
//
//  Trap-Rückkehr:
//    Die Engine merkt sich, an welcher Haupt-Entscheidung der Spieler
//    abgebogen ist (lastBranchPoint). Aus der Falle führt der Weg
//    DORTHIN zurück – nicht zum Anfang.
// =====================================================================

export const startRoomId = 'start'
export const finalRoomId = 'final'
export const trapRoomId = 'trap'

export const labyrinth = {

  // ===================================================================
  //  EINGANG
  // ===================================================================
  start: {
    id: 'start',
    type: 'start',
    title: 'Die alte Schule',
    intro:
      'Du betrittst eine alte Schule. Die Tafeln stehen noch, die Stühle auch — ' +
      'aber irgendetwas ist anders. Hinter jeder Tür wartet eine Aufgabe aus ' +
      'Deutsch oder Mathematik. Du entscheidest, welcher Weg dich weiterbringt. ' +
      'Ob deine Wahl richtig war, sagt dir hier niemand — du merkst es selbst, ' +
      'an dem, was als Nächstes kommt. Finde den Ausgang.',
    steps: [
      'Lies die Aufgabe und schau dir die Optionen in Ruhe an.',
      'Klick auf die Antwort, die du für richtig hältst.',
      'Der nächste Raum zeigt dir, wohin dein Weg führt.',
      'Wirkt der Gang seltsam? Dann liegst du vielleicht daneben.',
      'Landest du in einer Falle, kommst du zurück zur letzten Entscheidung.'
    ],
    next: 'q_m1'
  },

  // ===================================================================
  //  HAUPTPFAD – Aufgabe 1: EÖ-Aufbau (DOORS, 3 Optionen, main@1)
  // ===================================================================
  q_m1: {
    id: 'q_m1',
    type: 'decision',
    variant: 'doors',
    branch: 'main',
    subject: 'deutsch',
    title: 'Der Türensaal',
    scene:
      'Drei steinerne Türen stehen in der Eingangshalle. Über jeder Tür hängt ein ' +
      'verblasstes Schild mit einer Aufzählung. Eine Schultafel an der Wand fragt nach ' +
      'dem Aufbau einer EÖ.',
    prompt: 'Welche Tür beschreibt den Aufbau einer erörternden Erschließung (EÖ)?',
    options: [
      {
        label: 'Inhaltsangabe · Hauptteil · eigene Meinung',
        target: 'c_branch',
        hiddenPathType: 'false'
      },
      {
        label: 'Einleitung mit Ohröffner · Sachtextanalyse · Erörterung mit Thesen · Schluss mit Position',
        target: 'c_m1',
        hiddenPathType: 'main'
      },
      {
        label: 'Deutungshypothese · Analyse · Rückbezug zur Hypothese',
        target: 'c_branch',
        hiddenPathType: 'false'
      }
    ]
  },

  c_m1: {
    id: 'c_m1',
    type: 'corridor',
    title: 'Korridor',
    scene:
      'Du gehst durch einen sandsteinfarbenen Gang. Die Fackeln werfen warmes Licht. An den ' +
      'Wänden hängen alte Sachtexte, in denen jemand Kernaussagen unterstrichen hat. Am ' +
      'Ende des Gangs öffnet sich eine Kammer voller Schilder.',
    next: 'q_m2'
  },

  // ===================================================================
  //  HAUPTPFAD – Aufgabe 2: Textfunktion (4 Optionen, main@2)
  // ===================================================================
  q_m2: {
    id: 'q_m2',
    type: 'decision',
    branch: 'main',
    subject: 'deutsch',
    title: 'Die Schilderkammer',
    scene:
      'Vier Schilder lehnen an der Wand. Auf jedem steht ein Beispieltext aus dem Alltag. ' +
      'Eine eingelassene Tafel fragt, welcher Text die Funktion „appellierend" hat.',
    prompt: 'Welcher Text ist primär appellierend?',
    options: [
      {
        label: 'Eine Wetter-Push-Nachricht: „Heute 12 °C, Regen am Nachmittag."',
        target: 'c_branch',
        hiddenPathType: 'false'
      },
      {
        label: 'Eine Kampagne auf einem Plakat: „Eine Woche ohne Handy — mach mit!"',
        target: 'c_m2',
        hiddenPathType: 'main'
      },
      {
        label: 'Ein Auszug aus dem Bürgerlichen Gesetzbuch',
        target: 'c_branch',
        hiddenPathType: 'false'
      },
      {
        label: 'Ein Eintrag in einem privaten Tagebuch',
        target: 'c_branch',
        hiddenPathType: 'false'
      }
    ]
  },

  c_m2: {
    id: 'c_m2',
    type: 'corridor',
    title: 'Korridor',
    scene:
      'Der Boden steigt leicht an. Du läufst an einer langen Vitrine vorbei: Werbeplakate, ' +
      'politische Aufrufe, Slogans, Demonstrationen. Alles ruft, alles fordert. Vor dir öffnet ' +
      'sich ein Raum mit vier umgestürzten Säulen.',
    next: 'q_m3'
  },

  // ===================================================================
  //  HAUPTPFAD – Aufgabe 3: Argumentstruktur (SORTING)
  // ===================================================================
  q_m3: {
    id: 'q_m3',
    type: 'sorting',
    branch: 'main',
    subject: 'deutsch',
    title: 'Die Säulen der Argumentation',
    scene:
      'Vier Säulen sind durcheinander geworfen. In den Stein sind die Bausteine eines ' +
      'vollständigen Arguments gemeißelt. Eine Inschrift verlangt die richtige Reihenfolge.',
    prompt: 'Bringe die Bausteine in die korrekte Reihenfolge eines vollständigen Arguments.',
    items: [
      { id: 'beleg', label: 'Beleg / Beispiel' },
      { id: 'these', label: 'These / Behauptung' },
      { id: 'schluss', label: 'Schlussfolgerung' },
      { id: 'begruendung', label: 'Begründung' }
    ],
    correctOrder: ['these', 'begruendung', 'beleg', 'schluss'],
    onMatch: { target: 'c_m3', hiddenPathType: 'main' },
    onMiss: { target: 'c_branch', hiddenPathType: 'false' }
  },

  c_m3: {
    id: 'c_m3',
    type: 'corridor',
    title: 'Korridor',
    scene:
      'Die Säulen richten sich auf, das Echo des Steins verklingt. Du gehst weiter durch ' +
      'einen Saal mit Notizzetteln an der Wand: jeder zeigt ein Argument zu „Digitalisierung ' +
      'und psychische Gesundheit". Vier davon liegen vor dir auf einem Tisch.',
    next: 'q_m4'
  },

  // ===================================================================
  //  HAUPTPFAD – Aufgabe 4: Argumenttyp (4 Optionen, main@4)
  // ===================================================================
  q_m4: {
    id: 'q_m4',
    type: 'decision',
    branch: 'main',
    subject: 'deutsch',
    title: 'Vier Notizzettel',
    scene:
      'Auf dem Tisch liegen vier Argumente. Jedes wirkt überzeugend, aber nur eines ist ein ' +
      'klassisches Faktenargument.',
    prompt: 'Welcher Notizzettel zeigt ein Faktenargument?',
    options: [
      {
        label: 'Mein Onkel meint: „Soziale Medien sind das Schlimmste."',
        target: 'c_branch',
        hiddenPathType: 'false'
      },
      {
        label: 'Es ist offensichtlich, dass jeder darunter leidet.',
        target: 'c_branch',
        hiddenPathType: 'false'
      },
      {
        label: 'Stell dir vor, dein eigenes Kind wäre süchtig — willst du das riskieren?',
        target: 'c_branch',
        hiddenPathType: 'false'
      },
      {
        label: 'Das Robert-Koch-Institut meldet: 18 % der Jugendlichen zeigen depressive Symptome.',
        target: 'c_m4',
        hiddenPathType: 'main'
      }
    ]
  },

  c_m4: {
    id: 'c_m4',
    type: 'corridor',
    title: 'Korridor',
    scene:
      'Die Tafel mit der RKI-Zahl leuchtet kurz auf. Du folgst einem Gang voller eingerahmter ' +
      'Statistiken und Zeitungsartikel — alles mit Quellenangabe. Hinter einer Drehtür hörst ' +
      'du fernes Theaterdonnern.',
    next: 'q_m5'
  },

  // ===================================================================
  //  HAUPTPFAD – Aufgabe 5: Drama-Begriff (TEXT-INPUT)
  // ===================================================================
  q_m5: {
    id: 'q_m5',
    type: 'input',
    branch: 'main',
    subject: 'deutsch',
    title: 'Inschrift im Stein',
    scene:
      'Eine schwere Steintafel versperrt den Durchgang. In den Stein ist ein Satz graviert: ' +
      '„Nenne den Begriff, an dem sich im klassischen Drama das Schicksal der Hauptfigur dreht."',
    prompt: 'Tippe das Wort für den Wendepunkt im klassischen Drama.',
    inputLabel: 'Begriff',
    placeholder: 'ein Wort',
    acceptedAnswers: ['peripetie', 'die peripetie'],
    onMatch: { target: 'c_m5', hiddenPathType: 'main' },
    onMiss: { target: 'c_branch', hiddenPathType: 'false' }
  },

  c_m5: {
    id: 'c_m5',
    type: 'corridor',
    title: 'Korridor',
    scene:
      'Die Tafel rutscht zur Seite. Du gehst durch einen Gang mit Theatermasken an den ' +
      'Wänden — Exposition, Peripetie, Katastrophe. Am Ende öffnet sich ein nachgebauter ' +
      'mittelalterlicher Marktplatz.',
    next: 'q_m6'
  },

  // ===================================================================
  //  HAUPTPFAD – Aufgabe 6: Apfelschuss (4 Optionen, main@3)
  // ===================================================================
  q_m6: {
    id: 'q_m6',
    type: 'decision',
    branch: 'main',
    subject: 'deutsch',
    title: 'Marktplatz von Altdorf',
    scene:
      'Auf dem nachgebauten Marktplatz steht Wilhelm Tell, den Bogen gespannt, vor ihm sein ' +
      'Sohn Walter mit einem Apfel auf dem Kopf. Vier Schilder beschreiben das, was hier ' +
      'wirklich verhandelt wird.',
    prompt: 'Welches Konfliktfeld dominiert die Apfelschussszene?',
    options: [
      {
        label: 'Liebe und Eifersucht',
        target: 'c_branch',
        hiddenPathType: 'false'
      },
      {
        label: 'Geld, Erbschaft, Macht über Reichtum',
        target: 'c_branch',
        hiddenPathType: 'false'
      },
      {
        label: 'Macht und Unterdrückung gegen Freiheit und Vaterrolle',
        target: 'c_m6',
        hiddenPathType: 'main'
      },
      {
        label: 'Religiöser Konflikt zwischen Konfessionen',
        target: 'c_branch',
        hiddenPathType: 'false'
      }
    ]
  },

  c_m6: {
    id: 'c_m6',
    type: 'corridor',
    title: 'Korridor',
    scene:
      'Du verlässt den Marktplatz. Ein Gang voller Schiefertafeln führt dich weiter — auf ' +
      'jeder steht eine Funktionsgleichung. Eine besonders große Tafel wartet auf dich, ' +
      'mit einer Aufgabe in Kreide.',
    next: 'q_m7'
  },

  // ===================================================================
  //  HAUPTPFAD – Aufgabe 7: Ableitung (NUMERIC-INPUT)
  // ===================================================================
  q_m7: {
    id: 'q_m7',
    type: 'numericInput',
    branch: 'main',
    subject: 'mathematik',
    title: 'Die große Schiefertafel',
    scene:
      'Die Tafel zeigt: f(x) = x³ − 3x² + 2. Daneben ein eingelassenes Feld und die ' +
      'Anweisung, den Wert der ersten Ableitung an der Stelle x = 2 einzutragen.',
    prompt: 'Berechne f ′(2) und trage den Wert ein.',
    inputLabel: 'f′(2) =',
    placeholder: 'Zahl',
    acceptedAnswers: ['0'],
    onMatch: { target: 'c_m7', hiddenPathType: 'main' },
    onMiss: { target: 'c_branch', hiddenPathType: 'false' }
  },

  c_m7: {
    id: 'c_m7',
    type: 'corridor',
    title: 'Korridor',
    scene:
      'Die Tafel ist mit einem Häkchen gekrönt — aber das siehst du nur in der Geste der ' +
      'Aufseher-Statue im Schatten. Du gehst durch einen Gang, in dem Gleichungen wie ' +
      'Lianen von der Decke hängen. Eine Tür mit einer letzten Aufgabe ist nicht mehr fern.',
    next: 'q_m8'
  },

  // ===================================================================
  //  HAUPTPFAD – Aufgabe 8: Substitution (4 Optionen, main@1) — Finale
  // ===================================================================
  q_m8: {
    id: 'q_m8',
    type: 'decision',
    branch: 'main',
    subject: 'mathematik',
    title: 'Die letzte Kammer',
    scene:
      'Ein schwerer Schlüssel hängt an einer Kette von der Decke. Daneben steht ' +
      'x⁴ − 5x² + 4 = 0 und die Frage, welche Substitution das in eine quadratische ' +
      'Gleichung in z verwandelt.',
    prompt: 'Welche Substitution überführt x⁴ − 5x² + 4 = 0 in eine quadratische Gleichung in z?',
    options: [
      { label: 'z = x²', target: 'c_m8', hiddenPathType: 'main' },
      { label: 'z = x⁴', target: 'c_branch', hiddenPathType: 'false' },
      { label: 'z = 2x', target: 'c_branch', hiddenPathType: 'false' },
      { label: 'z = 1 / x', target: 'c_branch', hiddenPathType: 'false' }
    ]
  },

  c_m8: {
    id: 'c_m8',
    type: 'corridor',
    title: 'Korridor',
    scene:
      'Der Schlüssel passt. Ein dünner Lichtstreifen unter einer Tür wird breiter. Du gehst ' +
      'durch — eine Stimme im Hintergrund spricht: „Du hast die Tafeln gelesen, die Säulen ' +
      'gerichtet, das Drama erkannt und die Gleichung gelöst."',
    next: 'final'
  },

  // ===================================================================
  //  AUSGANG (Ende des Hauptpfades)
  // ===================================================================
  final: {
    id: 'final',
    type: 'final',
    title: 'Ausgang',
    scene:
      'Die letzte Tür schwingt auf. Tageslicht. Hinter dir liegen acht Räume voller ' +
      'Schulwissen — EÖ-Aufbau, Textfunktionen, Argumentation, Argumenttyp, klassisches ' +
      'Drama, Wilhelm Tell, Ableitung und biquadratische Substitution.'
  },

  // ===================================================================
  //  ÜBERGANGS-KORRIDOR – einziger Punkt, an dem man vom Haupt- in den
  //  Irrweg wechselt. Wirkt absichtlich unauffällig: nur eine kleine
  //  Veränderung in der Atmosphäre.
  // ===================================================================
  c_branch: {
    id: 'c_branch',
    type: 'falseCorridor',
    title: 'Korridor',
    scene:
      'Die Tür, die du genommen hast, schließt sich hinter dir. Der Gang wird etwas enger, ' +
      'die Fackeln etwas dunkler. Es ist nichts Schlimmes — vielleicht nur eine andere Ecke ' +
      'des Labyrinths. Du gehst weiter und kommst in einen Raum mit einer Figur in einem ' +
      'Roman-Auszug an der Wand.',
    next: 'q_f1'
  },

  // ===================================================================
  //  IRRWEG – Aufgabe 1: Charakterisierung (3 Optionen)
  // ===================================================================
  q_f1: {
    id: 'q_f1',
    type: 'decision',
    branch: 'false',
    subject: 'deutsch',
    title: 'Romanecke',
    scene:
      'An der Wand klebt ein Romanauszug: „Sie lachte verlegen, schaute zu Boden und zupfte ' +
      'an ihrem Ärmel." Eine Tafel fragt, um welche Art der Charakterisierung es sich handelt.',
    prompt: 'Wie wird die Figur hier charakterisiert?',
    options: [
      { label: 'direkte Charakterisierung — der Erzähler sagt es explizit', target: 'c_f1', hiddenPathType: 'false' },
      { label: 'indirekte Charakterisierung — durch Verhalten und Körpersprache', target: 'c_f1', hiddenPathType: 'false' },
      { label: 'gar keine Charakterisierung, nur eine Beschreibung der Szene', target: 'c_f1', hiddenPathType: 'false' }
    ]
  },

  c_f1: {
    id: 'c_f1',
    type: 'falseCorridor',
    title: 'Korridor',
    scene:
      'Du verlässt die Romanecke. Der nächste Gang ist mit Buchrücken bedeckt — die Titel ' +
      'verschwimmen leicht, wenn du sie anschaust. Im nächsten Raum liegt eine offene Karteikarte ' +
      'zu Saša Stanišićs „Herkunft".',
    next: 'q_f2'
  },

  // ===================================================================
  //  IRRWEG – Aufgabe 2: Herkunft / Stanišić (3 Optionen)
  // ===================================================================
  q_f2: {
    id: 'q_f2',
    type: 'decision',
    branch: 'false',
    subject: 'deutsch',
    title: 'Karteikarte „Herkunft"',
    scene:
      'Drei Karten beschreiben, worum es in Stanišićs Roman gehen soll. Du erinnerst dich ' +
      'an Unterrichtsstunden – Heidelberg, Großmutter Kristina, ein Land, das es so nicht ' +
      'mehr gibt.',
    prompt: 'Welche Karte trifft das Themenfeld des Romans?',
    options: [
      { label: 'Eine Detektivgeschichte über Großvater Pero', target: 'c_f2', hiddenPathType: 'false' },
      { label: 'Identität, Heimat, Flucht/Migration, Familie und Sprache', target: 'c_f2', hiddenPathType: 'false' },
      { label: 'Eine reine Liebesgeschichte zwischen Heidelberg und Paris', target: 'c_f2', hiddenPathType: 'false' }
    ]
  },

  c_f2: {
    id: 'c_f2',
    type: 'falseCorridor',
    title: 'Korridor',
    scene:
      'Du gehst weiter. Etwas an den Wänden klingt jetzt anders — die Steine geben hohlere ' +
      'Töne ab, wenn du gegen sie stößt. Eine Tafel mit einem Baumdiagramm taucht auf: ' +
      'zweimal Münze werfen.',
    next: 'q_f3'
  },

  // ===================================================================
  //  IRRWEG – Aufgabe 3: Pfadregel (NUMERIC-INPUT)
  // ===================================================================
  q_f3: {
    id: 'q_f3',
    type: 'numericInput',
    branch: 'false',
    subject: 'mathematik',
    title: 'Münzwurf-Kammer',
    scene:
      'An der Wand: ein altes Baumdiagramm. Zweimaliger Wurf einer fairen Münze. Ein leeres ' +
      'Feld bittet um die Wahrscheinlichkeit für „zweimal Kopf".',
    prompt: 'Trage die Wahrscheinlichkeit als Bruch oder Dezimalzahl ein.',
    inputLabel: 'P(K, K) =',
    placeholder: 'z. B. 1/4 oder 0,25',
    acceptedAnswers: ['1/4', '0.25', ',25', '0,25', '.25', '25%'],
    onMatch: { target: 'c_f3', hiddenPathType: 'false' },
    onMiss: { target: 'c_f3', hiddenPathType: 'false' }
  },

  c_f3: {
    id: 'c_f3',
    type: 'falseCorridor',
    title: 'Korridor',
    scene:
      'Die Tür öffnet sich knirschend. Eine kühle Strömung kommt aus dem nächsten Gang. ' +
      'An den Wänden hängen jetzt Vierfeldertafeln. Eine besonders große Tafel mit einer ' +
      'Wahrscheinlichkeitsaufgabe wartet im nächsten Raum.',
    next: 'q_f4'
  },

  // ===================================================================
  //  IRRWEG – Aufgabe 4: Bedingte Wahrscheinlichkeit (3 Optionen)
  // ===================================================================
  q_f4: {
    id: 'q_f4',
    type: 'decision',
    branch: 'false',
    subject: 'mathematik',
    title: 'Vierfeldertafel',
    scene:
      'Eine Tafel beschreibt: In einer Klasse mit 20 Schüler:innen spielen 12 Fußball. ' +
      '8 davon singen auch im Schulchor. Eine eingelassene Frage richtet sich an dich.',
    prompt: 'Wie hoch ist die Wahrscheinlichkeit, dass jemand im Chor singt, GEGEBEN, dass die Person Fußball spielt?',
    options: [
      { label: '8 / 20 = 0,4', target: 'c_f4', hiddenPathType: 'false' },
      { label: '8 / 12 ≈ 0,667', target: 'c_f4', hiddenPathType: 'false' },
      { label: '12 / 20 = 0,6', target: 'c_f4', hiddenPathType: 'false' }
    ]
  },

  c_f4: {
    id: 'c_f4',
    type: 'falseCorridor',
    title: 'Korridor',
    scene:
      'Die Tafel klappt zu. Der nächste Korridor ist deutlich dunkler. Du kannst die Decke ' +
      'kaum noch sehen, aber das Licht der Fackeln reicht für die Funktionsgleichungen, ' +
      'die in den Stein gehauen sind. Eine davon ist gesucht.',
    next: 'q_f5'
  },

  // ===================================================================
  //  IRRWEG – Aufgabe 5: Stammfunktion (3 Optionen)
  // ===================================================================
  q_f5: {
    id: 'q_f5',
    type: 'decision',
    branch: 'false',
    subject: 'mathematik',
    title: 'Funktions-Nische',
    scene:
      'Drei Stammfunktionen sind in die Wand gegraben. Über ihnen die Aufgabe: ' +
      'Finde eine Stammfunktion von f(x) = 2x.',
    prompt: 'Welche Funktion ist eine Stammfunktion von f(x) = 2x?',
    options: [
      { label: 'F(x) = x²', target: 'c_f5', hiddenPathType: 'false' },
      { label: 'F(x) = 2x²', target: 'c_f5', hiddenPathType: 'false' },
      { label: 'F(x) = x² / 2', target: 'c_f5', hiddenPathType: 'false' }
    ]
  },

  c_f5: {
    id: 'c_f5',
    type: 'falseCorridor',
    title: 'Korridor',
    scene:
      'Die Wand öffnet sich leise. Ein kalter Luftzug. Auf den Steinplatten liegen verstreut ' +
      'Notizen zu Symmetrie, Achsenspiegelung und Punktsymmetrie. Drei letzte Türen sind in ' +
      'die Wand gehauen — auf jeder eine Funktion.',
    next: 'q_f6'
  },

  // ===================================================================
  //  IRRWEG – Aufgabe 6: Symmetrie (3 Optionen) — letzte Frage vor der Falle
  // ===================================================================
  q_f6: {
    id: 'q_f6',
    type: 'decision',
    variant: 'doors',
    branch: 'false',
    subject: 'mathematik',
    title: 'Drei letzte Türen',
    scene:
      'Drei Türen mit Funktionsgleichungen. Über ihnen die Frage nach Achsensymmetrie zur ' +
      'y-Achse. Hinter den Türen hörst du etwas — ein leises Schaben, fast wie Ketten.',
    prompt: 'Welche Funktion ist achsensymmetrisch zur y-Achse?',
    options: [
      { label: 'f(x) = x⁴ − 3x² + 1', target: 'c_f6', hiddenPathType: 'false' },
      { label: 'f(x) = x³ − x', target: 'c_f6', hiddenPathType: 'false' },
      { label: 'f(x) = x³ + 2', target: 'c_f6', hiddenPathType: 'false' }
    ]
  },

  c_f6: {
    id: 'c_f6',
    type: 'falseCorridor',
    title: 'Korridor',
    scene:
      'Die Tür schlägt hinter dir zu — laut, endgültig. Der Gang ist plötzlich eiskalt. ' +
      'Die Fackeln flackern. Du hörst dein eigenes Herz. Vor dir liegt eine Halle, in der ' +
      'es viel zu dunkel ist.',
    next: 'trap'
  },

  // ===================================================================
  //  TRAP – Ende des Irrwegs. Atmosphärischer Klimax + Rückweg.
  // ===================================================================
  trap: {
    id: 'trap',
    type: 'trap',
    title: 'Die Falle',
    scene:
      'Der Boden bricht weg. Aus der Dunkelheit greifen kalte Schatten nach deinen Füßen, ' +
      'tausende Spinnenfäden fallen von der Decke. Eine raue Stimme hallt durch die Halle: ' +
      '„Du bist seit Räumen auf dem falschen Pfad. Erinnerst du dich noch, wo du falsch ' +
      'abgebogen bist?" Ein einzelner Lichtstrahl zeigt zurück in den Gang, durch den du ' +
      'gekommen bist.',
    hint:
      'Auf dem Irrweg hast du Aufgaben zu Charakterisierung, Stanišićs „Herkunft", ' +
      'Pfadregel, bedingter Wahrscheinlichkeit, Stammfunktion und Symmetrie gesehen. Diese ' +
      'Themen kommen wieder. Korrekt wären gewesen: indirekte Charakterisierung; Identität ' +
      'und Migration; P = 1/4; 8/12; F(x) = x²; f(x) = x⁴ − 3x² + 1.',
    fallbackReturn: 'q_m1'
  }
}

// =====================================================================
//  Validation
// =====================================================================

function collectTargets(room) {
  const list = []
  if (room.next) list.push({ where: 'next', target: room.next })
  if (room.fallbackReturn) list.push({ where: 'fallbackReturn', target: room.fallbackReturn })
  if (Array.isArray(room.options)) {
    room.options.forEach((o, i) => list.push({ where: `options[${i}].target`, target: o.target }))
  }
  if (room.onMatch) list.push({ where: 'onMatch.target', target: room.onMatch.target })
  if (room.onMiss) list.push({ where: 'onMiss.target', target: room.onMiss.target })
  return list
}

function leadsToTrap(id, ids, seen = new Set()) {
  if (seen.has(id)) return false
  seen.add(id)
  const r = labyrinth[id]
  if (!r) return false
  if (r.type === 'trap') return true
  if ((r.type === 'falseCorridor' || r.type === 'corridor') && r.next) {
    return leadsToTrap(r.next, ids, seen)
  }
  if (r.type === 'decision' && r.branch === 'false' && Array.isArray(r.options)) {
    return r.options.every((o) => leadsToTrap(o.target, ids, new Set(seen)))
  }
  if ((r.type === 'input' || r.type === 'numericInput' || r.type === 'sorting') && r.branch === 'false') {
    return leadsToTrap(r.onMatch.target, ids, new Set(seen)) && leadsToTrap(r.onMiss.target, ids, new Set(seen))
  }
  return false
}

function leadsToFinal(id, ids, seen = new Set()) {
  if (seen.has(id)) return false
  seen.add(id)
  const r = labyrinth[id]
  if (!r) return false
  if (r.type === 'final') return true
  if (r.type === 'start' && r.next) return leadsToFinal(r.next, ids, seen)
  if (r.type === 'corridor' && r.next) return leadsToFinal(r.next, ids, seen)
  if (r.type === 'decision' && r.branch === 'main' && Array.isArray(r.options)) {
    const mainOpt = r.options.find((o) => o.hiddenPathType === 'main')
    return mainOpt ? leadsToFinal(mainOpt.target, ids, seen) : false
  }
  if ((r.type === 'input' || r.type === 'numericInput' || r.type === 'sorting') && r.branch === 'main') {
    return leadsToFinal(r.onMatch.target, ids, seen)
  }
  return false
}

export function validateLabyrinth() {
  const errors = []
  const ids = new Set(Object.keys(labyrinth))

  // 1) konsistente ids
  for (const [key, room] of Object.entries(labyrinth)) {
    if (room.id !== key) errors.push(`${key}: room.id stimmt nicht (${room.id})`)
  }

  // 2) alle Ziel-ids existieren
  for (const room of Object.values(labyrinth)) {
    for (const { where, target } of collectTargets(room)) {
      if (!ids.has(target)) errors.push(`${room.id}.${where} → unbekannte id "${target}"`)
    }
  }

  // 3) Hauptpfad erreicht final
  if (!leadsToFinal('start', ids)) errors.push('Hauptpfad erreicht final nicht')

  // 4) Jede Haupt-Entscheidung: genau 1 main-Option, Rest false; und main führt zu final
  for (const room of Object.values(labyrinth)) {
    if (room.branch === 'main' && Array.isArray(room.options)) {
      const mainCount = room.options.filter((o) => o.hiddenPathType === 'main').length
      if (mainCount !== 1) errors.push(`${room.id}: ${mainCount} main-Optionen (erwartet genau 1)`)
      for (const o of room.options) {
        if (!['main', 'false'].includes(o.hiddenPathType)) {
          errors.push(`${room.id}.${o.label}: unbekannter hiddenPathType ${o.hiddenPathType}`)
        }
      }
    }
  }

  // 5) Jede Irrweg-Komponente führt zur Falle
  for (const room of Object.values(labyrinth)) {
    if (room.branch === 'false') {
      // alle Ausgänge sollen zum Trap führen
      if (!leadsToTrap(room.id, ids)) {
        errors.push(`Irrweg-Raum ${room.id} erreicht trap nicht`)
      }
    }
  }
  // Auch der Übergangs-Korridor selbst und seine Folge
  if (!leadsToTrap('c_branch', ids)) errors.push('c_branch erreicht trap nicht')

  // 6) Falsche Wege vom Hauptpfad landen am Übergangs-Korridor
  for (const room of Object.values(labyrinth)) {
    if (room.branch === 'main') {
      const falseTargets = []
      if (Array.isArray(room.options)) {
        for (const o of room.options) if (o.hiddenPathType === 'false') falseTargets.push(o.target)
      }
      if (room.onMiss) falseTargets.push(room.onMiss.target)
      for (const t of falseTargets) {
        if (!leadsToTrap(t, ids)) {
          errors.push(`${room.id}: false-Ziel ${t} erreicht trap nicht`)
        }
      }
    }
  }

  // 7) Trap hat fallback-Rückkehr
  const trap = labyrinth.trap
  if (!trap || trap.type !== 'trap') errors.push('Kein trap-Raum gefunden')
  if (trap && !trap.fallbackReturn) errors.push('trap ohne fallbackReturn')

  // 8) Verteilung der Hauptpfad-Position
  const positions = []
  for (const room of Object.values(labyrinth)) {
    if (room.type === 'decision' && room.branch === 'main' && Array.isArray(room.options)) {
      const idx = room.options.findIndex((o) => o.hiddenPathType === 'main')
      if (idx >= 0) positions.push({ id: room.id, idx, count: room.options.length })
    }
  }
  if (positions.length > 0 && positions.every((p) => p.idx === 0)) {
    errors.push('Alle Hauptpfad-Antworten auf Position 0 – Verteilung erforderlich')
  }

  // 9) Mix der Interaktionstypen
  const types = new Set(Object.values(labyrinth).map((r) => r.type))
  for (const t of ['decision', 'input', 'numericInput', 'sorting', 'trap']) {
    if (!types.has(t)) errors.push(`Interaktions-/Raumtyp fehlt: ${t}`)
  }

  return { errors, positions, types: [...types] }
}

const _validation = validateLabyrinth()
if (typeof console !== 'undefined' && _validation.errors.length) {
  // eslint-disable-next-line no-console
  console.warn('[labyrinth] Inkonsistenzen:\n' + _validation.errors.join('\n'))
}
