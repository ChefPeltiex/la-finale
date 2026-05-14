import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUPPORT_EMAIL, SITE_ORIGIN } from "@/lib/site";
import { cn } from "@/lib/utils";
import { getFiathintMultiplier } from "@/lib/peltXpEconomy";
import { loadUniversePreferences } from "@/lib/universePreferences";

function matchReply(q) {
  const s = q.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

  if (/market|achete|vend|annonce/.test(s)) {
    return `Pour les objets proches : ouvre la carte sur l’accueil ou le Marketplace (${SITE_ORIGIN}/marketplace). Active la géolocalisation dans ton navigateur pour trier par proximité quand le backend expose les coordonnées des vendeurs.`;
  }
  if (/xp|point|echange|credit|fiat|argent/.test(s)) {
    return `Les points XP sont locaux à ton navigateur (prototype). Le coefficient d’estimation marchande affiché utilise ×${String(
      getFiathintMultiplier()
    )} sur un taux que tu entres manuellement — ce n’est pas une crypto ni une garantie de valeur.`;
  }
  if (/univers|theme|personnal|interface/.test(s)) {
    return `Construis ton univers dans « Mon univers » (${SITE_ORIGIN}/mon-univers) : thèmes, densité d’affichage, ambiance sonore (presets), coffre de props débloqués par XP.`;
  }
  if (/world|3d|verse|gameplay/.test(s)) {
    return `Le Verse 3D est accessible via ${SITE_ORIGIN}/world — exploration WebGL, portails vers les sections réelles de Egor69.`;
  }
  if (/donnee|donnees|vie priv|secur|confidential/.test(s)) {
    return `Tes préférences et XP sont stockés localement (localStorage) dans cette démo. Pour une souveraineté renforcée : export futur, chiffrement et politique de confidentialité à formaliser avec ton juriste.`;
  }
  if (/contact|humain|support/.test(s)) {
    return `Écris à ${SUPPORT_EMAIL} pour une prise en charge humaine.`;
  }

  return `Je suis le concierge prototype Egor69 : pose une question sur marketplace, XP, personnalisation, Verse 3D ou données. Pour tout le reste : ${SUPPORT_EMAIL}.`;
}

export default function ConciergeOrb({ enabled: enabledProp }) {
  const [conciergeOn, setConciergeOn] = useState(() => loadUniversePreferences().showConcierge !== false);

  useEffect(() => {
    const sync = (ev) => {
      const d = ev.detail || loadUniversePreferences();
      setConciergeOn(d.showConcierge !== false);
    };
    window.addEventListener("igor-universe-change", sync);
    return () => window.removeEventListener("igor-universe-change", sync);
  }, []);

  const enabled = enabledProp !== undefined ? enabledProp : conciergeOn;

  const [open, setOpen] = useState(false);
  const [explain, setExplain] = useState(true);
  const [input, setInput] = useState("");
  const [geoLabel, setGeoLabel] = useState(null);
  const threadRef = useRef([
    {
      role: "assistant",
      text: "Bonjour — je cartographie la plateforme. Demande-moi où trouver une fonction, comment fonctionne l’XP, ou comment ouvrir ton univers personnalisé.",
    },
  ]);
  const [, bump] = useState(0);

  const messages = threadRef.current;

  useEffect(() => {
    if (!enabled || !open) return;
    if (!navigator.geolocation) {
      setGeoLabel("géolocalisation non supportée");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLabel(`${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°`);
      },
      () => setGeoLabel("localisation refusée ou indisponible"),
      { maximumAge: 60_000, timeout: 8000 }
    );
  }, [enabled, open]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    messages.push({ role: "user", text: t });
    let reply = matchReply(t);
    if (explain) {
      reply += `\n\n[Mode explicatif] J’analyse des mots-clés simples + règles fixes — pas un LLM cloud ici. Branche un fournisseur IA sur cette entrée quand tu es prêt.`;
    }
    messages.push({ role: "assistant", text: reply });
    setInput("");
    bump((x) => x + 1);
  };

  if (!enabled) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-20 right-4 z-[180] h-14 w-14 rounded-full shadow-xl border border-emerald-400/40 flex items-center justify-center transition-all",
          "bg-gradient-to-br from-emerald-600 to-indigo-700 text-white hover:scale-105"
        )}
        aria-label="Concierge Egor69"
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {open && (
        <div className="fixed bottom-36 right-4 z-[181] w-[min(100vw-2rem,380px)] rounded-2xl border border-white/15 bg-black/80 backdrop-blur-xl shadow-2xl flex flex-col max-h-[min(70vh,520px)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-sm text-white">Concierge</span>
            </div>
            <button type="button" className="text-white/60 hover:text-white" onClick={() => setOpen(false)} aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 py-2 text-[10px] text-white/45 flex items-center gap-1 border-b border-white/5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>{geoLabel || "Géolocalisation…"}</span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl px-3 py-2 whitespace-pre-wrap leading-relaxed",
                  m.role === "user" ? "bg-emerald-500/15 text-emerald-50 ml-6" : "bg-white/5 text-white/85 mr-6"
                )}
              >
                {m.text}
              </div>
            ))}
          </div>

          <label className="px-4 pb-2 flex items-center gap-2 text-[11px] text-white/55 cursor-pointer">
            <input type="checkbox" checked={explain} onChange={(e) => setExplain(e.target.checked)} />
            Explications pédagogiques (comment je réponds)
          </label>

          <div className="p-3 border-t border-white/10 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ta question…"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/35"
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <Button type="button" size="icon" className="shrink-0 bg-emerald-600 hover:bg-emerald-500" onClick={send}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
