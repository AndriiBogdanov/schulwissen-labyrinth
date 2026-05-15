import { useEffect, useMemo, useRef, useState } from 'react'
import { labyrinth, startRoomId } from './data/labyrinth.js'
import { audio, moodForRoom } from './audio.js'
import {
  Brand, VolumeOn, VolumeOff,
  typeIcon, topicIcon
} from './icons.jsx'

const TYPE_TAGS = {
  start: 'Eingang',
  decision: 'Entscheidung',
  input: 'Inschrift',
  numericInput: 'Berechnung',
  sorting: 'Ordnung',
  corridor: 'Korridor',
  falseCorridor: 'Korridor',
  trap: 'Falle',
  final: 'Ausgang'
}

const SUBJECT_TAGS = { deutsch: 'Deutsch', mathematik: 'Mathematik' }

function normalize(raw, mode) {
  let s = String(raw).trim().toLowerCase().replace(/\s+/g, '')
  if (mode === 'numeric') {
    s = s.replace(',', '.')
    if (s.startsWith('.')) s = '0' + s
  }
  return s
}

function matchesAnswer(input, accepted, mode) {
  const norm = normalize(input, mode)
  return accepted.map((a) => normalize(a, mode)).includes(norm)
}

function Tag({ kind, children }) {
  return <span className={`tag tag-${kind}`}>{children}</span>
}

function HeroIcon({ room }) {
  // Decorative hero icon im Eck der Karte (themenspezifisch oder Raumtyp).
  const Topic = topicIcon(room.id)
  const Type = typeIcon(room.type, room.variant)
  const Comp = Topic || Type
  if (!Comp) return null
  return (
    <div className="hero-icon" aria-hidden="true">
      <Comp size={64} stroke={1.2} />
    </div>
  )
}

function RoomHead({ room }) {
  const tagKind = room.type === 'falseCorridor' ? 'corridor' : room.type
  const TypeI = typeIcon(room.type, room.variant)
  return (
    <header className="room-head">
      <div className="tags">
        <Tag kind={tagKind}>
          <TypeI size={12} stroke={2} />
          <span className="tag-text">{TYPE_TAGS[room.type]}</span>
        </Tag>
        {room.subject && (
          <Tag kind={'subject-' + room.subject}>
            <span className="tag-text">{SUBJECT_TAGS[room.subject]}</span>
          </Tag>
        )}
      </div>
      {room.title && <h2 className="room-title">{room.title}</h2>}
    </header>
  )
}

function Scene({ text }) {
  return text ? <p className="scene">{text}</p> : null
}

// =====================================================================
//  Räume
// =====================================================================

function StartRoom({ room, onNavigate, onEnableSound }) {
  return (
    <section className="room room-start">
      <HeroIcon room={room} />
      <div className="start-eyebrow">Schulprojekt · Deutsch &amp; Mathematik</div>
      <h1 className="start-title">{room.title}</h1>
      <p className="start-intro">{room.intro}</p>

      <div className="how-it-works">
        <h3 className="hiw-title">So funktioniert es</h3>
        <ol className="hiw-list">
          {room.steps.map((s, i) => (
            <li key={i}>
              <span className="hiw-num">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="start-actions">
        <button
          className="btn-primary btn-large"
          onClick={() => {
            onEnableSound()
            onNavigate(room.next, room)
          }}
        >
          Labyrinth betreten →
        </button>
        <span className="start-hint">Klick startet die Klangkulisse — du kannst sie oben wieder ausschalten.</span>
      </div>
    </section>
  )
}

function DecisionRoom({ room, onNavigate }) {
  const isDoors = room.variant === 'doors'
  return (
    <section className={`room room-decision ${isDoors ? 'room-doors' : ''}`}>
      <HeroIcon room={room} />
      <RoomHead room={room} />
      <Scene text={room.scene} />
      <p className="prompt">{room.prompt}</p>

      {isDoors ? (
        <div className="doors">
          {room.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className="door"
              onClick={() => onNavigate(opt.target, room, opt)}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <svg className="door-svg" viewBox="0 0 60 100" aria-hidden="true">
                <defs>
                  <linearGradient id={`door-grad-${room.id}-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="currentColor" stopOpacity="0.05" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0.18" />
                  </linearGradient>
                </defs>
                <path
                  d="M10 95 L10 25 Q10 5 30 5 Q50 5 50 25 L50 95 Z"
                  fill={`url(#door-grad-${room.id}-${i})`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="42" cy="55" r="1.8" fill="currentColor" />
              </svg>
              <span className="door-label">{opt.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <ul className="options">
          {room.options.map((opt, i) => (
            <li key={i} style={{ animationDelay: `${i * 60}ms` }}>
              <button
                type="button"
                className="option"
                onClick={() => onNavigate(opt.target, room, opt)}
              >
                <span className="option-marker" aria-hidden="true">→</span>
                <span className="option-label">{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function InputRoom({ room, onNavigate, mode = 'text' }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [room.id])

  const submit = () => {
    if (!value.trim()) return
    const matched = matchesAnswer(value, room.acceptedAnswers, mode)
    const action = matched ? room.onMatch : room.onMiss
    onNavigate(action.target, room, action)
  }

  return (
    <section className={`room room-input ${mode === 'numeric' ? 'room-numeric' : ''}`}>
      <HeroIcon room={room} />
      <RoomHead room={room} />
      <Scene text={room.scene} />
      <p className="prompt">{room.prompt}</p>

      <div className="input-block">
        <label className="input-label">{room.inputLabel}</label>
        <div className="input-row">
          <input
            ref={inputRef}
            type="text"
            inputMode={mode === 'numeric' ? 'decimal' : 'text'}
            autoComplete="off"
            spellCheck="false"
            value={value}
            placeholder={room.placeholder}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
            className="text-input"
          />
          <button
            type="button"
            className="btn-primary"
            onClick={submit}
            disabled={!value.trim()}
          >
            Eintragen
          </button>
        </div>
      </div>
    </section>
  )
}

function SortingRoom({ room, onNavigate }) {
  const [order, setOrder] = useState([])
  const pool = useMemo(
    () => room.items.filter((it) => !order.includes(it.id)),
    [order, room.items]
  )

  const submit = () => {
    const correct =
      order.length === room.correctOrder.length &&
      order.every((id, i) => id === room.correctOrder[i])
    const action = correct ? room.onMatch : room.onMiss
    onNavigate(action.target, room, action)
  }

  return (
    <section className="room room-sorting">
      <HeroIcon room={room} />
      <RoomHead room={room} />
      <Scene text={room.scene} />
      <p className="prompt">{room.prompt}</p>

      <div className="sort-zone">
        <div className="sort-half">
          <div className="sort-half-title">Verfügbare Bausteine</div>
          <div className="sort-pool">
            {pool.length === 0 ? (
              <div className="sort-empty">Alle Bausteine gewählt</div>
            ) : (
              pool.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  className="sort-pill"
                  style={{ animationDelay: `${i * 70}ms` }}
                  onClick={() => setOrder([...order, it.id])}
                >
                  {it.label}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="sort-half">
          <div className="sort-half-title">Deine Reihenfolge</div>
          <ol className="sort-sequence">
            {order.length === 0 && (
              <li className="sort-empty">Noch keine Säule gewählt</li>
            )}
            {order.map((id, idx) => {
              const it = room.items.find((i) => i.id === id)
              return (
                <li key={id} className="sort-slot">
                  <span className="sort-num">{idx + 1}</span>
                  <span className="sort-slot-label">{it.label}</span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div className="sort-actions">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setOrder([])}
          disabled={order.length === 0}
        >
          Zurücksetzen
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={submit}
          disabled={order.length !== room.items.length}
        >
          Reihenfolge bestätigen
        </button>
      </div>
    </section>
  )
}

function CorridorRoom({ room, onNavigate }) {
  return (
    <section className="room room-corridor">
      <HeroIcon room={room} />
      <RoomHead room={room} />
      <Scene text={room.scene} />
      <button
        type="button"
        className="btn-primary btn-corridor"
        onClick={() => onNavigate(room.next, room)}
      >
        Weiter →
      </button>
    </section>
  )
}

function TrapRoom({ room, lastBranchPoint, onNavigate, onRestart }) {
  const target = lastBranchPoint || room.fallbackReturn
  const branchTitle = labyrinth[target]?.title

  return (
    <section className="room room-trap">
      <HeroIcon room={room} />
      <RoomHead room={room} />
      <Scene text={room.scene} />

      {room.hint && (
        <aside className="hint">
          <span className="hint-tag">Lern-Hinweis</span>
          <p>{room.hint}</p>
        </aside>
      )}

      <div className="trap-actions">
        <button
          type="button"
          className="btn-primary btn-return"
          onClick={() => onNavigate(target, room, { backFromTrap: true })}
        >
          <span className="btn-main">← Zurück zur Hauptentscheidung</span>
          {branchTitle && <span className="btn-sub">{branchTitle}</span>}
        </button>
        <button type="button" className="btn-ghost" onClick={onRestart}>
          Ganz von vorne
        </button>
      </div>
    </section>
  )
}

function FinalRoom({ room, stats, onRestart }) {
  const { visitedSize, totalRooms, trapsHit, steps } = stats
  const note =
    trapsHit === 0
      ? 'Direkt durch das Labyrinth — keine Falle, keine Umwege. Sauberer Lauf.'
      : trapsHit === 1
      ? 'Einmal in der Falle, einmal zurück. Genau dafür ist Escape gebaut: man merkt, wo man falsch war.'
      : 'Mehrere Fallen — aber du hast den Ausgang gefunden. Das Labyrinth hat seine Aufgabe getan.'
  return (
    <section className="room room-final">
      <HeroIcon room={room} />
      <RoomHead room={room} />
      <Scene text={room.scene} />

      <div className="final-summary">
        <div className="summary-cell">
          <div className="summary-num">{visitedSize}</div>
          <div className="summary-label">besuchte Räume</div>
        </div>
        <div className="summary-cell">
          <div className="summary-num">{totalRooms}</div>
          <div className="summary-label">Räume insgesamt</div>
        </div>
        <div className="summary-cell">
          <div className="summary-num">{trapsHit}</div>
          <div className="summary-label">Fallen</div>
        </div>
        <div className="summary-cell">
          <div className="summary-num">{steps}</div>
          <div className="summary-label">Schritte</div>
        </div>
      </div>

      <p className="final-note">{note}</p>

      <button type="button" className="btn-primary btn-large" onClick={onRestart}>
        Noch einmal durch das Labyrinth
      </button>
    </section>
  )
}

function Room({ room, lastBranchPoint, onNavigate, onRestart, onEnableSound, stats }) {
  switch (room.type) {
    case 'start':
      return <StartRoom room={room} onNavigate={onNavigate} onEnableSound={onEnableSound} />
    case 'decision':
      return <DecisionRoom room={room} onNavigate={onNavigate} />
    case 'input':
      return <InputRoom room={room} onNavigate={onNavigate} mode="text" />
    case 'numericInput':
      return <InputRoom room={room} onNavigate={onNavigate} mode="numeric" />
    case 'sorting':
      return <SortingRoom room={room} onNavigate={onNavigate} />
    case 'corridor':
    case 'falseCorridor':
      return <CorridorRoom room={room} onNavigate={onNavigate} />
    case 'trap':
      return (
        <TrapRoom
          room={room}
          lastBranchPoint={lastBranchPoint}
          onNavigate={onNavigate}
          onRestart={onRestart}
        />
      )
    case 'final':
      return <FinalRoom room={room} stats={stats} onRestart={onRestart} />
    default:
      return <pre>Unbekannter Raumtyp: {room.type}</pre>
  }
}

// =====================================================================
//  App-Controller
// =====================================================================
export default function App() {
  const [currentId, setCurrentId] = useState(startRoomId)
  const [visited, setVisited] = useState(() => new Set([startRoomId]))
  const [trapsHit, setTrapsHit] = useState(0)
  const [steps, setSteps] = useState(0)
  const [transitionKey, setTransitionKey] = useState(0)
  const [lastBranchPoint, setLastBranchPoint] = useState(null)
  const [branch, setBranch] = useState('main')
  const [muted, setMuted] = useState(true)

  const totalRooms = useMemo(() => Object.keys(labyrinth).length, [])
  const room = labyrinth[currentId] ?? labyrinth[startRoomId]

  // Mood beim Wechsel
  useEffect(() => {
    audio.setMood(moodForRoom(room, branch))
    if (room.type === 'trap') audio.playTrap()
    if (room.type === 'final') audio.playSuccess()
  }, [currentId, branch, room])

  async function enableSound() {
    await audio.start()
    audio.setMuted(false)
    setMuted(false)
  }

  function toggleMute() {
    if (!audio.started) {
      enableSound()
      return
    }
    const next = !muted
    audio.setMuted(next)
    setMuted(next)
  }

  function navigate(targetId, sourceRoom, action) {
    const target = labyrinth[targetId]
    if (!target) return

    if (
      sourceRoom &&
      sourceRoom.branch === 'main' &&
      action &&
      action.hiddenPathType === 'false' &&
      lastBranchPoint == null
    ) {
      setLastBranchPoint(sourceRoom.id)
      setBranch('false')
    }
    if (sourceRoom && sourceRoom.type === 'trap') {
      setLastBranchPoint(null)
      setBranch('main')
    }
    if (target.branch === 'main' && branch !== 'main' && sourceRoom?.type === 'trap') {
      setBranch('main')
    }

    // SFX – aber NICHT richtig/falsch verraten
    if (sourceRoom?.type === 'start') audio.playDoor()
    else if (sourceRoom?.type === 'decision' && sourceRoom.variant === 'doors') audio.playDoor()
    else if (sourceRoom?.type === 'decision') audio.playStep()
    else if (sourceRoom?.type === 'input' || sourceRoom?.type === 'numericInput') audio.playStep()
    else if (sourceRoom?.type === 'sorting') audio.playStep()
    else if (sourceRoom?.type === 'corridor' || sourceRoom?.type === 'falseCorridor') audio.playWhoosh()

    setVisited((v) => new Set(v).add(targetId))
    setSteps((s) => s + 1)
    if (target.type === 'trap') setTrapsHit((t) => t + 1)
    setCurrentId(targetId)
    setTransitionKey((k) => k + 1)
  }

  function restart() {
    setCurrentId(startRoomId)
    setVisited(new Set([startRoomId]))
    setTrapsHit(0)
    setSteps(0)
    setLastBranchPoint(null)
    setBranch('main')
    setTransitionKey((k) => k + 1)
  }

  // Floating Funken/Staub – mehrfach via CSS
  const particles = useMemo(() => Array.from({ length: 22 }, (_, i) => i), [])

  return (
    <div className="app">
      {/* Atmosphärische Hintergrund-Layer */}
      <div className="bg-layer bg-vignette" aria-hidden />
      <div className="bg-layer bg-grid" aria-hidden />
      <div className="bg-layer bg-particles" aria-hidden>
        {particles.map((i) => (
          <span key={i} className={`particle p-${i % 6}`} style={{
            left: `${(i * 13 + 7) % 100}%`,
            animationDelay: `${(i * 0.7) % 12}s`,
            animationDuration: `${10 + (i % 6) * 2}s`
          }} />
        ))}
      </div>

      <header className="app-top">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            <Brand size={18} stroke={2} />
          </span>
          <span className="brand-name">Schulwissen-Labyrinth</span>
        </div>
        <div className="app-top-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={toggleMute}
            aria-label={muted ? 'Klang einschalten' : 'Klang ausschalten'}
            title={muted ? 'Klang einschalten' : 'Klang ausschalten'}
          >
            {muted ? <VolumeOff size={18} /> : <VolumeOn size={18} />}
          </button>
          {room.type !== 'start' && (
            <button type="button" className="btn-ghost btn-restart" onClick={restart}>
              Neustart
            </button>
          )}
        </div>
      </header>

      <main className="stage">
        <div key={transitionKey} className="room-shell">
          <Room
            room={room}
            lastBranchPoint={lastBranchPoint}
            onNavigate={navigate}
            onRestart={restart}
            onEnableSound={enableSound}
            stats={{
              visitedSize: visited.size,
              totalRooms,
              trapsHit,
              steps
            }}
          />
        </div>
      </main>

      <footer className="app-foot">
        <span>Schulprojekt · 2026</span>
        <span aria-hidden>·</span>
        <span>{TYPE_TAGS[room.type] || ''}</span>
      </footer>
    </div>
  )
}
