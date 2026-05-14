import { useEffect, useMemo, useState } from "react";

export default function TorusTransactionSigil() {
  const [active, setActive] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    /** @param {CustomEvent<{state?: string}>} e */
    const onTx = (e) => {
      const state = e?.detail?.state;
      if (state === "start") {
        setPulseKey((k) => k + 1);
        setActive(true);
      } else if (state === "end") {
        setActive(false);
      }
    };

    window.addEventListener("igor:stripe:tx", onTx);
    return () => window.removeEventListener("igor:stripe:tx", onTx);
  }, []);

  const styleText = useMemo(
    () => `
      @keyframes torusFadeIn {
        from { opacity: 0; transform: translate3d(0, 6px, 0) scale(0.98); }
        to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
      }
      @keyframes circleToTorus {
        0%   { stroke-dasharray: 0 999; opacity: 0.35; }
        40%  { stroke-dasharray: 240 999; opacity: 0.75; }
        70%  { stroke-dasharray: 420 999; opacity: 0.9; }
        100% { stroke-dasharray: 520 999; opacity: 0.75; }
      }
      @keyframes torusCore {
        0%   { transform: translate3d(0,0,0) scale(0.92); opacity: 0.2; }
        55%  { transform: translate3d(0,0,0) scale(1.0); opacity: 0.55; }
        100% { transform: translate3d(0,0,0) scale(1.06); opacity: 0.18; }
      }
      @keyframes torusSpinSoft {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,
    []
  );

  if (!active) return null;

  return (
    <div
      key={pulseKey}
      aria-hidden="true"
      className="fixed inset-0 z-[80] pointer-events-none"
      style={{
        background: "radial-gradient(circle at 50% 35%, rgba(16,185,129,0.06), rgba(0,0,0,0) 55%)",
        animation: "torusFadeIn 240ms ease-out both",
      }}
    >
      <style>{styleText}</style>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative"
          style={{
            width: 180,
            height: 180,
            opacity: 0.9,
            filter: "drop-shadow(0 0 18px rgba(16,185,129,0.35)) drop-shadow(0 0 26px rgba(255,215,0,0.18))",
          }}
        >
          {/* core haze */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 50% 40%, rgba(255,215,0,0.18), rgba(16,185,129,0.12), rgba(0,0,0,0) 60%)",
              animation: "torusCore 1.6s ease-in-out infinite",
            }}
          />

          <svg
            width="180"
            height="180"
            viewBox="0 0 200 200"
            className="absolute inset-0"
            style={{ animation: "torusSpinSoft 2.8s linear infinite" }}
          >
            <defs>
              <linearGradient id="torusStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,215,0,0.9)" />
                <stop offset="45%" stopColor="rgba(16,185,129,0.9)" />
                <stop offset="100%" stopColor="rgba(167,139,250,0.85)" />
              </linearGradient>
              <radialGradient id="torusFill" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="rgba(16,185,129,0.18)" />
                <stop offset="60%" stopColor="rgba(255,215,0,0.10)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
            </defs>

            {/* circle path => torus signature via dash */}
            <circle
              cx="100"
              cy="100"
              r="72"
              fill="none"
              stroke="url(#torusStroke)"
              strokeWidth="3.5"
              style={{ animation: "circleToTorus 1.1s ease-in-out infinite" }}
            />

            {/* donut fill suggestion */}
            <path
              d="M100 35
                 C135 35 165 65 165 100
                 C165 135 135 165 100 165
                 C65 165 35 135 35 100
                 C35 65 65 35 100 35 Z"
              fill="url(#torusFill)"
              opacity="0.55"
            />
            <circle cx="100" cy="100" r="34" fill="rgba(0,0,0,0.55)" opacity="0.65" />

            <text
              x="100"
              y="106"
              textAnchor="middle"
              fontSize="14"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fill="rgba(255,255,255,0.55)"
            >
              Ω TX
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

