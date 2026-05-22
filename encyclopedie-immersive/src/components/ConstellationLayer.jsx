import { useMemo } from 'react'

// Lightweight SVG constellation background
export default function ConstellationLayer() {
  const stars = useMemo(() => Array.from({ length: 180 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() < 0.15 ? (Math.random() * 1.2 + 0.8) : (Math.random() * 0.7 + 0.2),
    delay: Math.random() * 8,
    dur: Math.random() * 4 + 2.5,
    opacity: Math.random() * 0.45 + 0.08,
  })), [])

  // A few constellation lines (hand-crafted feel)
  const lines = useMemo(() => [
    { x1: 15, y1: 12, x2: 22, y2: 18 },
    { x1: 22, y1: 18, x2: 28, y2: 14 },
    { x1: 28, y1: 14, x2: 35, y2: 20 },
    { x1: 72, y1: 8,  x2: 78, y2: 15 },
    { x1: 78, y1: 15, x2: 85, y2: 10 },
    { x1: 85, y1: 10, x2: 90, y2: 18 },
    { x1: 50, y1: 5,  x2: 55, y2: 11 },
    { x1: 55, y1: 11, x2: 48, y2: 16 },
    { x1: 8,  y1: 55, x2: 14, y2: 60 },
    { x1: 14, y1: 60, x2: 10, y2: 68 },
    { x1: 88, y1: 60, x2: 82, y2: 65 },
    { x1: 82, y1: 65, x2: 87, y2: 72 },
  ], [])

  return (
    <svg
      className="constellation-layer"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Constellation lines */}
      {lines.map((l, i) => (
        <line
          key={i}
          x1={`${l.x1}%`} y1={`${l.y1}%`}
          x2={`${l.x2}%`} y2={`${l.y2}%`}
          stroke="rgba(201,168,76,0.06)"
          strokeWidth="0.08"
        />
      ))}

      {/* Stars */}
      {stars.map(s => (
        <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={`${s.r}`} fill="#c9a84c">
          <animate
            attributeName="opacity"
            values={`${s.opacity};${Math.min(s.opacity * 2.5, 0.85)};${s.opacity}`}
            dur={`${s.dur}s`}
            begin={`${s.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  )
}
