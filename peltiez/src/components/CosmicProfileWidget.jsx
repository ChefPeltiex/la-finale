import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Star, MapPin, Calendar, Sparkles, Loader2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// ── Mini Carte Canvas ──
function MiniSkyMap({ birthData, chart }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !chart) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = 220, H = canvas.height = 220;
    const cx = W / 2, cy = H / 2, R = 96;
    ctx.clearRect(0, 0, W, H);

    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    bg.addColorStop(0, "#0d0d2b");
    bg.addColorStop(1, "#020210");
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.arc(cx, cy, R + 8, 0, Math.PI * 2); ctx.fill();

    const seed = (birthData.birth_date || "").split("").reduce((a, c) => a + c.charCodeAt(0), 42);
    const rand = (n) => { const x = Math.sin(n + seed) * 10000; return x - Math.floor(x); };
    for (let i = 0; i < 60; i++) {
      const angle = rand(i) * Math.PI * 2;
      const r = rand(i + 100) * R;
      ctx.fillStyle = `rgba(255,255,255,${0.2 + rand(i + 300) * 0.7})`;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, rand(i + 200) * 1.5 + 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    [R * 0.55, R * 0.78, R].forEach((r, i) => {
      ctx.strokeStyle = `rgba(99,102,241,${0.15 + i * 0.08})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    });

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.strokeStyle = "rgba(148,163,184,0.15)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.stroke();
    }

    const PLANET_SYMBOLS = { soleil: "☉", lune: "☽", mercure: "☿", venus: "♀", mars: "♂", jupiter: "♃", saturne: "♄" };
    const PLANET_COLORS = { soleil: "#fbbf24", lune: "#e2e8f0", mercure: "#a78bfa", venus: "#f472b6", mars: "#f87171", jupiter: "#34d399", saturne: "#94a3b8" };

    (chart.planets || []).slice(0, 7).forEach((p, i) => {
      const angle = ((p.degree || i * 30) / 360) * Math.PI * 2 - Math.PI / 2;
      const r = R * 0.65;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const key = p.name?.toLowerCase() || "";
      ctx.font = "bold 11px serif";
      ctx.fillStyle = PLANET_COLORS[key] || "#ffffff";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = PLANET_COLORS[key] || "#ffffff"; ctx.shadowBlur = 6;
      ctx.fillText(PLANET_SYMBOLS[key] || "★", x, y);
      ctx.shadowBlur = 0;
    });

    if (chart.ascendant_degree !== undefined) {
      const angle = (chart.ascendant_degree / 360) * Math.PI * 2 - Math.PI / 2;
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 2]);
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.stroke(); ctx.setLineDash([]);
    }

    const SIGNS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
    SIGNS.forEach((s, i) => {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2 + Math.PI / 12;
      ctx.font = "9px serif";
      ctx.fillStyle = "rgba(148,163,184,0.5)";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(s, cx + Math.cos(angle) * (R + 6), cy + Math.sin(angle) * (R + 6));
    });
  }, [chart, birthData]);

  return (
    <canvas ref={canvasRef} width={220} height={220} className="rounded-full mx-auto block"
      style={{ boxShadow: "0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.1)" }} />
  );
}

// ── Mission mini ──
function MiniMission({ mission, index }) {
  const [open, setOpen] = useState(index === 0);
  const colors = ["#f59e0b", "#8b5cf6", "#10b981", "#ec4899", "#3b82f6"];
  const icons = ["🌟", "⚡", "🌿", "💎", "🔥"];
  const color = colors[index % colors.length];
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ borderLeft: `3px solid ${color}` }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors">
        <span className="text-lg shrink-0">{icons[index % icons.length]}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xs text-foreground line-clamp-1">{mission.title || mission.titre}</p>
          <p className="text-[10px] text-muted-foreground">{mission.domain || mission.domaine}</p>
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0" /> : <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-border/40 pt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">{mission.description}</p>
          {(mission.action || mission.action_cle) && (
            <p className="text-xs font-semibold mt-2" style={{ color }}>
              {"⚡ " + (mission.action || mission.action_cle)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Widget principal ──
export default function CosmicProfileWidget({ user }) {
  const [birthDate, setBirthDate] = useState(user?.birth_date || "");
  const [birthCity, setBirthCity] = useState(user?.birth_city || "");
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState(null);
  const [formVisible, setFormVisible] = useState(!user?.birth_date);

  const SIGN_EMOJIS = { "Bélier":"♈", "Taureau":"♉", "Gémeaux":"♊", "Cancer":"♋", "Lion":"♌", "Vierge":"♍", "Balance":"♎", "Scorpion":"♏", "Sagittaire":"♐", "Capricorne":"♑", "Verseau":"♒", "Poissons":"♓" };
  const getEmoji = (sign) => {
    const entry = Object.entries(SIGN_EMOJIS).find(([k]) => sign?.includes(k));
    return entry ? entry[1] : "✨";
  };

  const generateChart = async (date, city, name) => {
    if (!date || !city) return;
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Astrologue expert. Données : Prénom=${name || "?"}, Date=${date}, Ville=${city}. Génère carte natale complète avec planètes en degrés (0-360), ascendant en degrés, 3 missions de vie clés et message cosmique personnel. Sois profond et précis.`,
      response_json_schema: {
        type: "object",
        properties: {
          sun_sign: { type: "string" },
          moon_sign: { type: "string" },
          ascendant: { type: "string" },
          ascendant_degree: { type: "number" },
          profile_summary: { type: "string" },
          planets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                sign: { type: "string" },
                degree: { type: "number" },
                meaning: { type: "string" }
              }
            }
          },
          missions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                domain: { type: "string" },
                description: { type: "string" },
                action: { type: "string" }
              }
            }
          },
          cosmic_message: { type: "string" }
        }
      }
    });
    setChart(res);
    setLoading(false);
    setFormVisible(false);
  };

  useEffect(() => {
    if (user?.birth_date && user?.birth_city) {
      setBirthDate(user.birth_date);
      setBirthCity(user.birth_city);
      generateChart(user.birth_date, user.birth_city, user.full_name);
    }
  }, []);

  const handleSaveAndGenerate = async () => {
    if (!birthDate || !birthCity) return;
    await base44.auth.updateMe({ birth_date: birthDate, birth_city: birthCity });
    await generateChart(birthDate, birthCity, user?.full_name);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(168,85,247,0.04))" }}>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-violet-500" />
          <h2 className="font-display font-bold text-foreground">Carte du Ciel</h2>
        </div>
        <Link to="/carte-du-ciel" className="flex items-center gap-1 text-xs text-violet-500 hover:underline font-semibold">
          Vue complète <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="p-5 space-y-5">
        {formVisible && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Entre tes données de naissance pour révéler tes missions de vie :</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1 block">
                  <Calendar className="h-3 w-3" /> Date de naissance
                </label>
                <input type="date"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                  value={birthDate} onChange={e => setBirthDate(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1 block">
                  <MapPin className="h-3 w-3" /> Ville de naissance
                </label>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                  placeholder="Montréal, Paris…"
                  value={birthCity} onChange={e => setBirthCity(e.target.value)} />
              </div>
            </div>
            <Button onClick={handleSaveAndGenerate} disabled={!birthDate || !birthCity || loading}
              className="w-full rounded-xl font-bold gap-2"
              style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", border: "none" }}>
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Calcul cosmique…</>
                : <><Sparkles className="h-4 w-4" /> Révéler ma Mission de Vie</>}
            </Button>
          </div>
        )}

        {loading && !formVisible && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Les étoiles lisent ton destin…</p>
          </div>
        )}

        {chart && !loading && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="rounded-2xl overflow-hidden p-4"
              style={{ background: "linear-gradient(135deg,#0d0d2b,#0f0f1f)" }}>
              <MiniSkyMap birthData={{ birth_date: birthDate }} chart={chart} />
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {[
                  { label: "☉ Soleil", val: chart.sun_sign },
                  { label: "☽ Lune", val: chart.moon_sign },
                  { label: "↑ Asc.", val: chart.ascendant },
                ].map(({ label, val }) => val ? (
                  <div key={label} className="text-center">
                    <p className="text-[9px] text-white/40 uppercase tracking-wide">{label}</p>
                    <p className="text-white font-bold text-xs">{getEmoji(val)} {val}</p>
                  </div>
                ) : null)}
              </div>
              {chart.profile_summary && (
                <p className="text-white/50 text-xs leading-relaxed text-center mt-3 italic max-w-xs mx-auto">
                  {'"' + chart.profile_summary + '"'}
                </p>
              )}
            </div>

            {chart.missions?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Missions de Vie
                </p>
                {chart.missions.slice(0, 3).map((m, i) => (
                  <MiniMission key={i} mission={m} index={i} />
                ))}
              </div>
            )}

            {chart.cosmic_message && (
              <div className="rounded-xl p-4 text-center"
                style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(168,85,247,0.08))", border: "1px solid rgba(99,102,241,0.2)" }}>
                <p className="text-xs text-violet-400 font-bold uppercase tracking-widest mb-1">Message Cosmique</p>
                <p className="text-sm text-foreground font-semibold italic">{'"' + chart.cosmic_message + '"'}</p>
              </div>
            )}

            <Link to="/carte-du-ciel"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-violet-300/30 text-violet-500 text-sm font-bold hover:bg-violet-500/5 transition-colors">
              <Star className="h-4 w-4" /> Voir la carte complete et predictions
            </Link>

            <button onClick={() => setFormVisible(true)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center">
              Modifier mes données de naissance
            </button>
          </div>
        )}
      </div>
    </div>
  );
}