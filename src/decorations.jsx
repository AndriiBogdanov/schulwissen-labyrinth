// =====================================================================
//  Dekorative SVG-Elemente — Ecken, Kerzen, Trennlinien, Hintergrund.
//  Alles inline, kein externes Asset.
// =====================================================================

// Manuscript-Stil Eck-Ornamente
export function CornerOrnament({ position = 'tl' }) {
  // tl, tr, bl, br – Rotation pro Ecke
  const rotation = { tl: 0, tr: 90, br: 180, bl: 270 }[position]
  return (
    <svg
      className={`corner corner-${position}`}
      width="56"
      height="56"
      viewBox="0 0 56 56"
      aria-hidden="true"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <g stroke="currentColor" fill="none" strokeLinecap="round">
        <path d="M 4 4 L 26 4" strokeWidth="1.2" />
        <path d="M 4 4 L 4 26" strokeWidth="1.2" />
        <path d="M 8 8 L 18 8" strokeWidth="0.6" opacity="0.6" />
        <path d="M 8 8 L 8 18" strokeWidth="0.6" opacity="0.6" />
        <path d="M 26 4 Q 32 4 32 10 Q 32 16 26 16 Q 22 16 22 12" strokeWidth="0.9" />
        <path d="M 4 26 Q 4 32 10 32 Q 16 32 16 26 Q 16 22 12 22" strokeWidth="0.9" />
        <circle cx="22" cy="22" r="1.5" fill="currentColor" />
        <circle cx="4" cy="4" r="2" fill="currentColor" />
      </g>
    </svg>
  )
}

// Trennlinie unter dem Titel — Diamant + Schwung
export function TitleDivider() {
  return (
    <svg
      className="title-divider"
      width="220"
      height="14"
      viewBox="0 0 220 14"
      aria-hidden="true"
    >
      <g stroke="currentColor" fill="none" strokeLinecap="round">
        <line x1="0" y1="7" x2="92" y2="7" strokeWidth="0.8" opacity="0.4" />
        <line x1="128" y1="7" x2="220" y2="7" strokeWidth="0.8" opacity="0.4" />
        <line x1="40" y1="7" x2="84" y2="7" strokeWidth="0.4" opacity="0.6" />
        <line x1="136" y1="7" x2="180" y2="7" strokeWidth="0.4" opacity="0.6" />
        <path d="M 96 7 L 110 1 L 124 7 L 110 13 Z" fill="currentColor" opacity="0.85" />
        <circle cx="110" cy="7" r="1.2" fill="rgba(0,0,0,0.55)" />
      </g>
    </svg>
  )
}

// Kerze – kleine SVG mit Flammen-Animation (CSS-Animation auf .flame)
export function Candle({ side = 'left', size = 1 }) {
  const w = 32 * size
  const h = 80 * size
  return (
    <div className={`candle candle-${side}`} aria-hidden="true">
      <svg width={w} height={h} viewBox="0 0 32 80">
        <defs>
          <radialGradient id={`flame-${side}`} cx="0.5" cy="0.7" r="0.5">
            <stop offset="0" stopColor="#fff6c8" />
            <stop offset="0.4" stopColor="#f4a657" />
            <stop offset="1" stopColor="#7a1f0d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`wax-${side}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c4b08c" />
            <stop offset="0.4" stopColor="#f0e4cc" />
            <stop offset="1" stopColor="#8a7c64" />
          </linearGradient>
          <radialGradient id={`glow-${side}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#f4a657" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f4a657" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Glow halo */}
        <ellipse className="flame-glow" cx="16" cy="14" rx="22" ry="20"
          fill={`url(#glow-${side})`} />
        {/* Flame */}
        <g className="flame">
          <path d="M 16 4 Q 20 10 20 16 Q 20 22 16 26 Q 12 22 12 16 Q 12 10 16 4 Z"
            fill={`url(#flame-${side})`} />
          <ellipse cx="16" cy="20" rx="1.5" ry="3" fill="#7a1f0d" opacity="0.7" />
        </g>
        {/* Wick */}
        <line x1="16" y1="24" x2="16" y2="29" stroke="#2a1810" strokeWidth="1" />
        {/* Wax body */}
        <rect x="11" y="29" width="10" height="44" fill={`url(#wax-${side})`} />
        {/* Drip */}
        <path d="M 11 33 Q 9 38 11 42" fill={`url(#wax-${side})`} opacity="0.85" />
        {/* Brass holder */}
        <rect x="8" y="71" width="16" height="6" fill="#8a6d3a" />
        <rect x="6" y="76" width="20" height="3" fill="#c9a050" />
        <rect x="9" y="78" width="14" height="2" fill="#6a4d22" />
      </svg>
    </div>
  )
}

// Hintergrund-Karte des Labyrinths — sehr subtiles Watermark
export function MazeBackdrop() {
  // handgezeichnete Labyrinth-Pfade, opacity sehr niedrig
  return (
    <svg
      className="maze-backdrop"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="#f0e4cc" strokeWidth="1.2" fill="none" opacity="0.06" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 60 540 L 60 80 L 740 80 L 740 540 L 60 540 Z" />
        <path d="M 100 500 L 100 120 L 700 120 L 700 500 L 100 500 Z" />
        <path d="M 140 460 L 140 160 L 660 160 L 660 460 L 140 460 Z" />
        <path d="M 60 300 L 220 300" />
        <path d="M 260 300 L 380 300" />
        <path d="M 420 300 L 540 300" />
        <path d="M 580 300 L 740 300" />
        <path d="M 400 80 L 400 220" />
        <path d="M 400 260 L 400 380" />
        <path d="M 400 420 L 400 540" />
        <path d="M 200 200 L 320 200 L 320 360 L 200 360 Z" />
        <path d="M 480 200 L 600 200 L 600 360 L 480 360 Z" />
        <path d="M 280 420 L 520 420" />
        {/* Sterne und kleine Symbole */}
        <g opacity="0.4">
          <path d="M 80 40 L 82 46 L 88 46 L 84 50 L 86 56 L 80 52 L 74 56 L 76 50 L 72 46 L 78 46 Z" />
          <path d="M 720 560 L 722 566 L 728 566 L 724 570 L 726 576 L 720 572 L 714 576 L 716 570 L 712 566 L 718 566 Z" />
          <circle cx="400" cy="40" r="3" />
          <circle cx="400" cy="560" r="3" />
        </g>
      </g>
    </svg>
  )
}

// Wax-Seal — kleines rundes Siegel mit Stempel-Charakter
export function WaxSeal({ children = '§' }) {
  return (
    <div className="wax-seal" aria-hidden="true">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <defs>
          <radialGradient id="seal-grad" cx="0.4" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#a83b32" />
            <stop offset="0.5" stopColor="#7a1f1a" />
            <stop offset="1" stopColor="#3a0e0a" />
          </radialGradient>
        </defs>
        <circle cx="28" cy="28" r="24" fill="url(#seal-grad)" />
        <circle cx="28" cy="28" r="20" fill="none" stroke="#3a0e0a" strokeWidth="0.6" opacity="0.5" />
        <text
          x="28" y="36"
          fontSize="22"
          fontFamily="'Cinzel', serif"
          fontWeight="700"
          textAnchor="middle"
          fill="#f0e4cc"
          opacity="0.85"
        >
          {children}
        </text>
      </svg>
    </div>
  )
}
