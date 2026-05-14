import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Star, MapPin, Calendar, Clock, Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Carte du ciel canvas ──────────────────────────────────────────
function SkyMap({ birthData, chart }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !chart) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = 340;
    const H = canvas.height = 340;
    const cx = W / 2, cy = H / 2, R = 150;

    ctx.clearRect(0, 0, W, H);

    // Fond cosmique
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    bg.addColorStop(0, "#0d0d2b");
    bg.addColorStop(1, "#020210");
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(cx, cy, R + 10, 0, Math.PI * 2);
    ctx.fill();

    // Étoiles aléatoires (seed basé sur date de naissance)
    const seed = (birthData.date || "").split("").reduce((a, c) => a + c.charCodeAt(0), 42);
    const rand = (n) => { const x = Math.sin(n + seed) * 10000; return x - Math.floor(x); };
    for (let i = 0; i < 80; i++) {
      const angle = rand(i) * Math.PI * 2;
      const r = rand(i + 100) * R;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const size = rand(i + 200) * 2 + 0.3;
      ctx.fillStyle = `rgba(255,255,255,${0.3 + rand(i + 300) * 0.7})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cercles zodiacaux
    [R * 0.55, R * 0.78, R].forEach((r, i) => {
      ctx.strokeStyle = `rgba(99,102,241,${0.15 + i * 0.08})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 12 maisons
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.strokeStyle = "rgba(148,163,184,0.2)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.stroke();
    }

    // Symboles des planètes depuis le chart IA
    const PLANET_SYMBOLS = { soleil: "☉", lune: "☽", mercure: "☿", venus: "♀", mars: "♂", jupiter: "♃", saturne: "♄", uranus: "♅", neptune: "♆", pluton: "♇" };
    const PLANET_COLORS  = { soleil: "#fbbf24", lune: "#e2e8f0", mercure: "#a78bfa", venus: "#f472b6", mars: "#f87171", jupiter: "#34d399", saturne: "#94a3b8", uranus: "#67e8f9", neptune: "#818cf8", pluton: "#c084fc" };

    (chart.planets || []).forEach((p, i) => {
      const angle = ((p.degree || i * 30) / 360) * Math.PI * 2 - Math.PI / 2;
      const r = R * 0.65;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const key = p.name?.toLowerCase() || "";
      const sym = PLANET_SYMBOLS[key] || "★";
      const col = PLANET_COLORS[key] || "#ffffff";
      ctx.font = "bold 14px serif";
      ctx.fillStyle = col;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Halo
      ctx.shadowColor = col;
      ctx.shadowBlur = 8;
      ctx.fillText(sym, x, y);
      ctx.shadowBlur = 0;
    });

    // Ascendant
    if (chart.ascendant_degree !== undefined) {
      const angle = (chart.ascendant_degree / 360) * Math.PI * 2 - Math.PI / 2;
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "bold 10px sans-serif";
      ctx.fillStyle = "#f59e0b";
      ctx.textAlign = "center";
      ctx.fillText("ASC", cx + Math.cos(angle) * (R - 14), cy + Math.sin(angle) * (R - 14));
    }

    // Signes zodiacaux sur la périphérie
    const SIGNS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
    SIGNS.forEach((s, i) => {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2 + Math.PI / 12;
      const x = cx + Math.cos(angle) * (R + 5);
      const y = cy + Math.sin(angle) * (R + 5);
      ctx.font = "11px serif";
      ctx.fillStyle = "rgba(148,163,184,0.6)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s, x, y);
    });

  }, [chart, birthData]);

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} width={340} height={340} className="rounded-full"
        style={{ boxShadow: "0 0 60px rgba(99,102,241,0.3), 0 0 120px rgba(99,102,241,0.1)" }} />
    </div>
  );
}

// ── Mission Card ──────────────────────────────────────────────────
function MissionCard({ mission, index }) {
  const [open, setOpen] = useState(index === 0);
  const colors = ["from-violet-500/20 to-indigo-500/20", "from-amber-500/20 to-rose-500/20", "from-emerald-500/20 to-teal-500/20", "from-pink-500/20 to-purple-500/20", "from-cyan-500/20 to-blue-500/20"];
  const icons = ["🌟", "⚡", "🌿", "💎", "🔥"];
  return (
    <div className={`rounded-2xl border border-border bg-gradient-to-br ${colors[index % colors.length]} overflow-hidden`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors">
        <span className="text-2xl">{icons[index % icons.length]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Badge variant="outline" className="text-[10px] shrink-0">Mission {index + 1}</Badge>
            <span className="text-[10px] text-muted-foreground">{mission.domain}</span>
          </div>
          <p className="font-bold text-sm text-foreground line-clamp-1">{mission.title}</p>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-border/40 pt-3">
          <p className="text-sm text-foreground/90 leading-relaxed">{mission.description}</p>
          {mission.action && (
            <div className="flex items-start gap-2 bg-white/5 rounded-xl p-3">
              <span className="text-xs font-bold text-primary shrink-0 mt-0.5">Action concrète :</span>
              <p className="text-xs text-muted-foreground">{mission.action}</p>
            </div>
          )}
          {mission.timing && (
            <p className="text-xs text-muted-foreground">⏱️ <strong>Timing :</strong> {mission.timing}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────
export default function CarteDuCiel() {
  const [form, setForm] = useState({ date: "", time: "", city: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!form.date || !form.city) return;
    setLoading(true);
    setResult(null);

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un astrologue expert en carte natale et missions de vie.

DONNÉES DE NAISSANCE :
- Prénom : ${form.name || "l'utilisateur"}
- Date : ${form.date}
- Heure : ${form.time || "inconnue (utilise midi)"}
- Ville : ${form.city}

Génère une analyse astrologique complète et profonde :

1. CARTE PLANÉTAIRE : Positionne les planètes en degrés (0-360° sur l'écliptique). Calcule l'ascendant (degré approximatif).
2. PROFIL ASTRAL : Signe solaire, signe lunaire, ascendant — caractère, forces, défis.
3. MISSIONS DE VIE (5 missions distinctes) : Chaque mission doit avoir un domaine, titre, description riche, action concrète et timing (cette vie, 5 ans, maintenant).
4. PRÉDICTIONS FUTURES : 3 périodes clés (1 an, 5 ans, vie entière).
5. MESSAGE COSMIQUE : Une phrase inspirante personnalisée.

Sois profond, précis, personnel et bienveillant.`,
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
                action: { type: "string" },
                timing: { type: "string" }
              }
            }
          },
          predictions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                period: { type: "string" },
                title: { type: "string" },
                description: { type: "string" }
              }
            }
          },
          cosmic_message: { type: "string" }
        }
      }
    });

    setResult(res);
    setLoading(false);
  };

  const SIGN_EMOJIS = { Bélier:"♈", Taureau:"♉", Gémeaux:"♊", Cancer:"♋", Lion:"♌", Vierge:"♍", Balance:"♎", Scorpion:"♏", Sagittaire:"♐", Capricorne:"♑", Verseau:"♒", Poissons:"♓" };
  const getEmoji = (sign) => Object.entries(SIGN_EMOJIS).find(([k]) => sign?.includes(k))?.[1] || "✨";

  return (
    <div className="pb-20 space-y-8 max-w-2xl mx-auto px-4 pt-6">

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
          <Star className="h-3.5 w-3.5" /> Carte Natale · IA Astrologique
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">Carte du Ciel</h1>
        <p className="text-muted-foreground">Découvre tes missions de vie, ton profil cosmique et les cycles qui t'attendent.</p>
      </div>

      {/* Formulaire */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block uppercase tracking-wide">Prénom</label>
            <input className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Marie, Lucas, Amara…"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block uppercase tracking-wide flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Date de naissance
            </label>
            <input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block uppercase tracking-wide flex items-center gap-1">
              <Clock className="h-3 w-3" /> Heure <span className="font-normal">(optionnel)</span>
            </label>
            <input type="time" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block uppercase tracking-wide flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Ville de naissance
            </label>
            <input className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Montréal, Paris, Dakar…"
              value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={!form.date || !form.city || loading}
          className="w-full rounded-xl font-bold gap-2 h-11"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", border: "none" }}>
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Calcul de ta carte cosmique…</>
            : <><Sparkles className="h-4 w-4" /> Révéler ma Carte du Ciel</>
          }
        </Button>
      </div>

      {/* Résultats */}
      {result && (
        <div className="space-y-8 animate-fade-in-up">

          {/* Carte visuelle + Profil */}
          <div className="rounded-3xl overflow-hidden border border-indigo-500/20"
            style={{ background: "linear-gradient(135deg,#0d0d2b,#0f0f1f)" }}>
            <div className="p-6">
              <SkyMap birthData={form} chart={result} />
            </div>
            <div className="px-6 pb-6 text-center space-y-3">
              <div className="flex justify-center gap-4 flex-wrap">
                {[
                  { label: "☉ Soleil", val: result.sun_sign },
                  { label: "☽ Lune", val: result.moon_sign },
                  { label: "↑ Ascendant", val: result.ascendant },
                ].map(({ label, val }) => val && (
                  <div key={label} className="text-center">
                    <p className="text-[10px] text-white/40 uppercase tracking-wide">{label}</p>
                    <p className="text-white font-bold text-sm">{getEmoji(val)} {val}</p>
                  </div>
                ))}
              </div>
              {result.profile_summary && (
                <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto italic">
                  "{result.profile_summary}"
                </p>
              )}
            </div>
          </div>

          {/* Planètes */}
          {result.planets?.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-violet-500" /> Positions planétaires
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {result.planets.map((p, i) => (
                  <div key={i} className="bg-card rounded-xl p-3 border border-border">
                    <p className="text-xs font-bold text-foreground capitalize">{p.name}</p>
                    <p className="text-xs text-primary">{p.sign}</p>
                    {p.meaning && <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{p.meaning}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missions de vie */}
          {result.missions?.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" /> Tes Missions de Vie
              </h2>
              <div className="space-y-3">
                {result.missions.map((m, i) => <MissionCard key={i} mission={m} index={i} />)}
              </div>
            </div>
          )}

          {/* Prédictions */}
          {result.predictions?.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-3">🔮 Prédictions Futures</h2>
              <div className="space-y-3">
                {result.predictions.map((p, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">{p.period}</Badge>
                      <p className="font-bold text-sm text-foreground">{p.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message cosmique */}
          {result.cosmic_message && (
            <div className="rounded-2xl p-6 text-center"
              style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(168,85,247,0.08))", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Star className="h-8 w-8 text-violet-400 mx-auto mb-3" />
              <p className="text-foreground font-semibold text-base italic leading-relaxed">
                "{result.cosmic_message}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}