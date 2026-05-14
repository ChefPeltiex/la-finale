import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, ChevronUp, ChevronDown } from "lucide-react";
import { getOrCreateSessionGardenId } from "@/lib/personalRealmGuard";

const MINI_KEY = "igor:personalGuard:compact";

/** Routes très immersives : on garde uniquement le bouton réduit pour ne pas masquer le spectacle. */
const IMMERSIVE_PREFIXES = ["/intro", "/welcome"];

function pathLooksImmersive(pathname) {
  return IMMERSIVE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Rappel permanent et égalitaire : une même « garde » narrative pour chaque citoyen,
 * du hub au Verse — avec liens vers la charte et la sécurité réelle.
 */
export default function PersonalRealmGuard() {
  const { pathname } = useLocation();
  const [compact, setCompact] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return sessionStorage.getItem(MINI_KEY) !== "0";
    } catch {
      return true;
    }
  });

  const immersive = useMemo(() => pathLooksImmersive(pathname), [pathname]);

  useEffect(() => {
    document.documentElement.dataset.personalRealmGuard = "active";
    getOrCreateSessionGardenId();
    return () => {
      delete document.documentElement.dataset.personalRealmGuard;
    };
  }, []);

  const toggleCompact = () => {
    setCompact((c) => {
      const next = !c;
      try {
        sessionStorage.setItem(MINI_KEY, next ? "1" : "0");
      } catch {
        /* quota / privé */
      }
      return next;
    });
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-[96] flex flex-col items-start gap-2 pointer-events-none max-[480px]:bottom-24"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto rounded-2xl border border-emerald-500/35 bg-zinc-950/92 backdrop-blur-md shadow-[0_8px_40px_rgba(16,185,129,0.12)] text-white max-w-[min(100vw-2rem,20rem)] transition-all duration-300 ${
          compact ? "p-2" : "p-4 space-y-3"
        }`}
        role="region"
        aria-label="Garde du jardin personnel — cadre de sécurité et charte"
      >
        <div className="flex items-start gap-2">
          <Shield className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-200/90 leading-tight">
              Garde du jardin
            </p>
            {!compact && (
              <>
                <p className="text-xs text-white/75 mt-1 leading-relaxed">
                  Même respect sur{" "}
                  <strong className="text-white/90">chaque route</strong> : ton univers qui grandit, ton périmètre local,
                  tes préférences — un socle unique, pour tout le monde.
                </p>
                <ul className="text-[11px] text-white/55 mt-2 space-y-1 list-disc pl-4 marker:text-emerald-500/80">
                  <li>Pas de secrets dans le bundle client ; TLS en production.</li>
                  <li>Charte + sécurité : transparence plutôt que slogans « militaires ».</li>
                  <li>Tes « lutins » restent chez toi — données locales par défaut quand c’est le mode souverain.</li>
                  <li>
                    Valve ludique : extérioriser la négativité en fiction (Outworld / arène) pour préserver la paix réelle — pas un substitut aux soins.
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link
                    to="/security"
                    className="text-[11px] rounded-lg bg-emerald-600/90 hover:bg-emerald-500 px-2.5 py-1 font-semibold text-white"
                  >
                    Sécurité
                  </Link>
                  <Link
                    to="/charte"
                    className="text-[11px] rounded-lg border border-white/20 hover:bg-white/10 px-2.5 py-1 font-medium text-white/85"
                  >
                    Charte
                  </Link>
                  <Link
                    to="/outworld"
                    className="text-[11px] rounded-lg border border-rose-500/35 hover:bg-rose-500/15 px-2.5 py-1 font-medium text-rose-100/95"
                  >
                    Valve fiction
                  </Link>
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={toggleCompact}
            className="shrink-0 rounded-lg p-1 hover:bg-white/10 text-white/70"
            aria-expanded={!compact}
            title={compact ? "Déplier la garde du jardin" : "Replier"}
          >
            {compact ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {immersive && compact && (
        <span className="pointer-events-none text-[10px] text-white/35 px-2 max-w-[14rem]">
          Mode immersif : garde réduite — bouclier pour déplier.
        </span>
      )}
    </div>
  );
}
