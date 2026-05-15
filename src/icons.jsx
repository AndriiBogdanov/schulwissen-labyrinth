// =====================================================================
//  Inline-SVG-Icons (von lucide.dev adaptiert, MIT-Lizenz).
//  Per Raumtyp und per Aufgabenthema.
// =====================================================================

function Svg({ size = 24, stroke = 1.7, children, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

// -------- Allgemeine Steuerung -------------------------------------

export const VolumeOn = (p) => (
  <Svg {...p}>
    <path d="M11 4.7v14.6L6.5 16H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.5L11 4.7Z" />
    <path d="M16 8a5 5 0 0 1 0 8" />
    <path d="M19 5a9 9 0 0 1 0 14" />
  </Svg>
)
export const VolumeOff = (p) => (
  <Svg {...p}>
    <path d="M11 4.7v14.6L6.5 16H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.5L11 4.7Z" />
    <line x1="22" y1="9" x2="16" y2="15" />
    <line x1="16" y1="9" x2="22" y2="15" />
  </Svg>
)
export const Brand = (p) => (
  <Svg {...p}>
    <path d="M4 4h6v6H4z" />
    <path d="M14 4h6v6h-6z" />
    <path d="M4 14h6v6H4z" />
    <path d="M14 14h6v6h-6z" />
    <path d="M10 7h4" />
    <path d="M7 10v4" />
    <path d="M17 10v4" />
    <path d="M10 17h4" />
  </Svg>
)

// -------- Raumtypen ------------------------------------------------

export const Compass = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </Svg>
)
export const Scroll = (p) => (
  <Svg {...p}>
    <path d="M19 17V5a2 2 0 0 0-2-2H4" />
    <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
  </Svg>
)
export const DoorOpen = (p) => (
  <Svg {...p}>
    <path d="M13 4h3a2 2 0 0 1 2 2v14" />
    <path d="M2 20h20" />
    <path d="M13 20V7l-7 2v11" />
    <circle cx="9" cy="14" r=".5" fill="currentColor" />
  </Svg>
)
export const PenLine = (p) => (
  <Svg {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Svg>
)
export const Calculator = (p) => (
  <Svg {...p}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="8" y2="10" />
    <line x1="12" y1="10" x2="12" y2="10" />
    <line x1="16" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="8" y2="14" />
    <line x1="12" y1="14" x2="12" y2="14" />
    <line x1="16" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="16" y2="18" />
  </Svg>
)
export const ListOrdered = (p) => (
  <Svg {...p}>
    <line x1="10" y1="6" x2="21" y2="6" />
    <line x1="10" y1="12" x2="21" y2="12" />
    <line x1="10" y1="18" x2="21" y2="18" />
    <path d="M4 6h1v4" />
    <path d="M4 10h2" />
    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
  </Svg>
)
export const Flame = (p) => (
  <Svg {...p}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </Svg>
)
export const AlertOctagon = (p) => (
  <Svg {...p}>
    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
)
export const Sun = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </Svg>
)

// -------- Themen per Raum-ID --------------------------------------

export const BookOpen = (p) => (
  <Svg {...p}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2Z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7Z" />
  </Svg>
)
export const Megaphone = (p) => (
  <Svg {...p}>
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </Svg>
)
export const Columns = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="4" height="18" rx="1" />
    <rect x="10" y="3" width="4" height="18" rx="1" />
    <rect x="17" y="3" width="4" height="18" rx="1" />
  </Svg>
)
export const BarChart = (p) => (
  <Svg {...p}>
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
    <line x1="3" y1="20" x2="21" y2="20" />
  </Svg>
)
export const Drama = (p) => (
  <Svg {...p}>
    <path d="M10 11h.01M14 11h.01" />
    <path d="M10 16s.8 1 2 1 2-1 2-1" />
    <path d="M16 18a4 4 0 0 1-8 0V6a4 4 0 0 1 8 0Z" />
    <path d="M21 9c0 1.5-1 3-3 3s-3-1.5-3-3 1.5-3 3-3" />
  </Svg>
)
export const Crosshair = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </Svg>
)
export const TrendingUp = (p) => (
  <Svg {...p}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </Svg>
)
export const SwapHoriz = (p) => (
  <Svg {...p}>
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </Svg>
)
export const UserCircle = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.66A8 8 0 0 1 17 20.66" />
  </Svg>
)
export const MapPin = (p) => (
  <Svg {...p}>
    <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
)
export const GitBranch = (p) => (
  <Svg {...p}>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </Svg>
)
export const Grid = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </Svg>
)
export const Sigma = (p) => (
  <Svg {...p}>
    <path d="M18 7V5H6l6 7-6 7h12v-2" />
  </Svg>
)
export const FlipH = (p) => (
  <Svg {...p}>
    <path d="M8 3v18" />
    <path d="M16 3v18" />
    <path d="M3 7l5-4 5 4" />
    <path d="M21 7l-5-4-5 4" />
    <path d="M3 17l5 4 5-4" />
    <path d="M21 17l-5 4-5-4" />
  </Svg>
)

// -------- Mapping ---------------------------------------------------

export function typeIcon(type, variant) {
  if (type === 'decision' && variant === 'doors') return DoorOpen
  if (type === 'decision') return Scroll
  if (type === 'input') return PenLine
  if (type === 'numericInput') return Calculator
  if (type === 'sorting') return ListOrdered
  if (type === 'corridor' || type === 'falseCorridor') return Flame
  if (type === 'trap') return AlertOctagon
  if (type === 'final') return Sun
  if (type === 'start') return Compass
  return Compass
}

export function topicIcon(roomId) {
  switch (roomId) {
    case 'q_m1': return BookOpen        // EÖ-Aufbau
    case 'q_m2': return Megaphone        // Textfunktion (appellierend)
    case 'q_m3': return Columns          // Säulen der Argumentation
    case 'q_m4': return BarChart         // Argumenttyp (Fakten/Statistik)
    case 'q_m5': return Drama            // Drama – Peripetie
    case 'q_m6': return Crosshair        // Apfelschuss
    case 'q_m7': return TrendingUp       // Ableitung
    case 'q_m8': return SwapHoriz        // Substitution
    case 'q_f1': return UserCircle       // Charakterisierung
    case 'q_f2': return MapPin           // Herkunft / Heimat
    case 'q_f3': return GitBranch        // Pfadregel (Baumdiagramm)
    case 'q_f4': return Grid             // Vierfeldertafel
    case 'q_f5': return Sigma            // Stammfunktion / Integral
    case 'q_f6': return FlipH            // Symmetrie
    default: return null
  }
}
