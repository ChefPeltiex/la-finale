import { useEffect } from 'react';

export default function MagicLayout({ children }) {
  /** Onglet en arrière-plan : pause les animations globales (GPU + compositeur). */
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      root.dataset.igorTab = document.hidden ? 'hidden' : 'visible';
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root { --igor-speed: 1; }
      body {
        background: linear-gradient(135deg, hsl(228, 35%, 5%) 0%, hsl(240, 30%, 8%) 35%, hsl(168, 40%, 7%) 70%, hsl(228, 35%, 5%) 100%);
        background-attachment: fixed;
        position: relative;
        overflow-x: hidden;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(ellipse at 15% 40%, hsla(260, 80%, 20%, 0.35) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, hsla(158, 80%, 15%, 0.35) 0%, transparent 55%), radial-gradient(ellipse at 50% 85%, hsla(42, 80%, 15%, 0.2) 0%, transparent 55%);
        pointer-events: none;
        z-index: 0;
        animation: aurora calc(15s / var(--igor-speed)) ease-in-out infinite;
      }

      html[data-igor-tab="hidden"] body::before,
      html[data-igor-tab="hidden"] body::after {
        animation-play-state: paused !important;
      }

      body::after {
        content: '';
        position: fixed;
        inset: -20%;
        background:
          radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.10), transparent 40%),
          radial-gradient(circle at 75% 20%, rgba(16, 185, 129, 0.09), transparent 38%),
          radial-gradient(circle at 55% 70%, rgba(168, 85, 247, 0.10), transparent 42%),
          repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0 1px, transparent 1px 6px);
        opacity: 0.55;
        filter: blur(0px);
        pointer-events: none;
        z-index: 0;
        transform: translate3d(0,0,0);
        animation: starDrift calc(32s / var(--igor-speed)) linear infinite;
      }

      main, [role="main"] { position: relative; z-index: 1; }
      @keyframes aurora { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
      @keyframes starDrift {
        0% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0.45; }
        50% { transform: translate3d(-2%, 1%, 0) rotate(2deg); opacity: 0.6; }
        100% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0.45; }
      }
      @media (prefers-reduced-motion: no-preference) { * { scroll-behavior: smooth; } }
      @media (prefers-reduced-motion: reduce) {
        body::before, body::after { animation: none !important; opacity: 0.7; }
        button:hover, a:hover { transition: none !important; }
      }
      button:hover, a:hover { transition: transform calc(0.2s / var(--igor-speed)) cubic-bezier(0.34, 1.56, 0.64, 1), opacity calc(0.2s / var(--igor-speed)) cubic-bezier(0.34, 1.56, 0.64, 1); }
      ::selection { background: rgba(16,185,129,0.35); color: white; }
    `;
    document.head.appendChild(style);
    return () => {
      try {
        document.head.removeChild(style);
      } catch {
        /* node peut avoir été déjà retiré */
      }
    };
  }, []);

  return <>{children}</>;
}