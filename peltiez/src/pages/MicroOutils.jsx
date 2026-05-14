import { useState } from "react";
import { Leaf, Car, Droplets, Zap, Trees, Utensils, ChevronDown, ChevronUp } from "lucide-react";

const TOOLS = [
  {
    id: "co2",
    emoji: "🌍",
    title: "Calculateur d'Empreinte CO₂",
    desc: "Estimez votre impact carbone annuel par secteur de vie.",
    icon: Leaf,
    color: "from-emerald-500 to-teal-600",
    component: CO2Calculator,
  },
  {
    id: "jardin",
    emoji: "🌱",
    title: "Planificateur de Jardin",
    desc: "Optimisez votre potager selon votre superficie et votre région.",
    icon: Trees,
    color: "from-green-500 to-emerald-600",
    component: GardenPlanner,
  },
  {
    id: "covoiturage",
    emoji: "🚗",
    title: "Calculateur Covoiturage",
    desc: "Combien économisez-vous en partageant vos trajets ?",
    icon: Car,
    color: "from-blue-500 to-cyan-600",
    component: CarpoolCalc,
  },
  {
    id: "energie",
    emoji: "⚡",
    title: "Audit Énergie Maison",
    desc: "Repérez vos postes de gaspillage énergétique.",
    icon: Zap,
    color: "from-yellow-500 to-amber-600",
    component: EnergyAudit,
  },
  {
    id: "eau",
    emoji: "💧",
    title: "Économiseur d'Eau",
    desc: "Calculez votre consommation d'eau et les économies possibles.",
    icon: Droplets,
    color: "from-sky-500 to-blue-600",
    component: WaterCalc,
  },
  {
    id: "alimentation",
    emoji: "🥗",
    title: "Impact Alimentaire",
    desc: "Le CO₂ de votre assiette, semaine par semaine.",
    icon: Utensils,
    color: "from-orange-500 to-red-500",
    component: FoodCalc,
  },
];

// ── Tool Components ──────────────────────────────────────────────

function CO2Calculator() {
  const [vals, setVals] = useState({ voiture: 15000, avion: 1, viande: 4, logement: 80 });
  const v = (k) => Number(vals[k]) || 0;
  const total = Math.round(v("voiture") * 0.21 / 1000 + v("avion") * 255 + v("viande") * 52 * 6.5 + v("logement") * 12 * 1.8);
  const avg = 11200;
  const pct = Math.min(Math.round((total / avg) * 100), 200);
  const color = total < 6000 ? "#10b981" : total < 10000 ? "#f59e0b" : "#ef4444";

  return (
    <div className="space-y-4">
      {[
        { key: "voiture", label: "Km en voiture / an", min: 0, max: 50000, step: 1000, unit: "km" },
        { key: "avion", label: "Vols aller-retour / an", min: 0, max: 20, step: 1, unit: "vols" },
        { key: "viande", label: "Repas avec viande / semaine", min: 0, max: 21, step: 1, unit: "repas" },
        { key: "logement", label: "Surface logement (m²)", min: 10, max: 300, step: 5, unit: "m²" },
      ].map(({ key, label, min, max, step, unit }) => (
        <div key={key}>
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-mono text-foreground">{vals[key]} {unit}</span>
          </div>
          <input type="range" min={min} max={max} step={step} value={vals[key]}
            onChange={e => setVals(v => ({ ...v, [key]: e.target.value }))}
            className="w-full accent-emerald-500" />
        </div>
      ))}
      <div className="rounded-xl p-4 text-center space-y-2" style={{ background: `${color}18`, border: `2px solid ${color}40` }}>
        <p className="text-3xl font-black" style={{ color }}>{total.toLocaleString("fr-CA")} kg CO₂/an</p>
        <p className="text-xs text-muted-foreground">Moyenne canadienne : {avg.toLocaleString("fr-CA")} kg/an · Vous êtes à <strong style={{ color }}>{pct}%</strong> de la moyenne</p>
        {total < avg && <p className="text-xs text-emerald-600 font-bold">🌱 Félicitations — vous êtes sous la moyenne nationale !</p>}
      </div>
    </div>
  );
}

function GardenPlanner() {
  const [m2, setM2] = useState(20);
  const [region, setRegion] = useState("qc");
  const REGIONS = { qc: "Québec", on: "Ontario", bc: "C.-B.", fr: "France", be: "Belgique" };
  const plants = Math.floor(m2 / 0.5);
  const kg = Math.round(m2 * 4.2);
  const co2 = Math.round(kg * 0.3);
  const suggestions = [
    { name: "Tomates", m2: 1.5, kg: 6 }, { name: "Laitues", m2: 0.3, kg: 1 },
    { name: "Courgettes", m2: 2, kg: 8 }, { name: "Fèves", m2: 0.5, kg: 1.5 },
    { name: "Carottes", m2: 1, kg: 3 }, { name: "Basilic", m2: 0.2, kg: 0.5 },
  ].slice(0, Math.min(Math.floor(m2 / 3) + 2, 6));

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs mb-1 font-medium">
          <span className="text-muted-foreground">Surface disponible</span>
          <span className="font-mono text-foreground">{m2} m²</span>
        </div>
        <input type="range" min={2} max={200} step={2} value={m2} onChange={e => setM2(+e.target.value)} className="w-full accent-green-500" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {Object.entries(REGIONS).map(([k, v]) => (
          <button key={k} onClick={() => setRegion(k)} className="px-3 py-1 rounded-full text-xs font-bold transition-all"
            style={{ background: region === k ? "#10b981" : "hsl(var(--muted))", color: region === k ? "white" : "hsl(var(--muted-foreground))" }}>
            {v}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl p-3 text-center bg-green-50 dark:bg-green-500/10">
          <p className="text-xl font-black text-green-600">{plants}</p><p className="text-[10px] text-muted-foreground">Plants</p>
        </div>
        <div className="rounded-xl p-3 text-center bg-emerald-50 dark:bg-emerald-500/10">
          <p className="text-xl font-black text-emerald-600">{kg} kg</p><p className="text-[10px] text-muted-foreground">Récolte/an</p>
        </div>
        <div className="rounded-xl p-3 text-center bg-teal-50 dark:bg-teal-500/10">
          <p className="text-xl font-black text-teal-600">{co2} kg</p><p className="text-[10px] text-muted-foreground">CO₂ évité</p>
        </div>
      </div>
      {suggestions.length > 0 && (
        <div>
          <p className="text-xs font-bold text-muted-foreground mb-2">Suggestions pour {m2} m² :</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <span key={s.name} className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium dark:bg-green-500/15 dark:text-green-400">
                🌿 {s.name} (~{s.kg} kg)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CarpoolCalc() {
  const [km, setKm] = useState(30);
  const [jours, setJours] = useState(20);
  const [passagers, setPassagers] = useState(2);
  const totalKm = km * 2 * jours * 12;
  const carburant = Math.round(totalKm * 0.08 * 1.8 / passagers);
  const co2 = Math.round(totalKm * 0.21 / passagers);
  const economie = Math.round(totalKm * 0.08 * 1.8 * (1 - 1/passagers));

  return (
    <div className="space-y-4">
      {[
        { key: "km", label: "Distance aller (km)", val: km, set: setKm, min: 1, max: 200, step: 1, unit: "km" },
        { key: "jours", label: "Jours / mois", val: jours, set: setJours, min: 1, max: 31, step: 1, unit: "j" },
        { key: "passagers", label: "Passagers (vous incl.)", val: passagers, set: setPassagers, min: 1, max: 8, step: 1, unit: "pers" },
      ].map(({ key, label, val, set, min, max, step, unit }) => (
        <div key={key}>
          <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{label}</span><span className="font-mono font-bold">{val} {unit}</span></div>
          <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(+e.target.value)} className="w-full accent-blue-500" />
        </div>
      ))}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl p-3 bg-blue-50 dark:bg-blue-500/10"><p className="text-xl font-black text-blue-600">{economie}$</p><p className="text-[10px] text-muted-foreground">Économies/an</p></div>
        <div className="rounded-xl p-3 bg-sky-50 dark:bg-sky-500/10"><p className="text-xl font-black text-sky-600">{carburant}$</p><p className="text-[10px] text-muted-foreground">Votre coût/an</p></div>
        <div className="rounded-xl p-3 bg-emerald-50 dark:bg-emerald-500/10"><p className="text-xl font-black text-emerald-600">{co2}kg</p><p className="text-[10px] text-muted-foreground">CO₂ évité/an</p></div>
      </div>
    </div>
  );
}

function EnergyAudit() {
  const [vals, setVals] = useState({ chauffage: 3, frigo: 1, eclairage: 8, laveuse: 5, seche: 3, ecrans: 4 });
  const CONSO = { chauffage: 2000, frigo: 150, eclairage: 60, laveuse: 500, seche: 800, ecrans: 100 };
  const LABELS = { chauffage: "Chauffage (intensité 1-5)", frigo: "Frigos/congélos", eclairage: "Heures éclairage/j", laveuse: "Brassées/mois", seche: "Séchages/mois", ecrans: "Heures écrans/j" };
  const kwh = Object.entries(vals).reduce((s, [k, v]) => s + (CONSO[k] * v) / 1000, 0);
  const cad = Math.round(kwh * 365 * 0.09);

  return (
    <div className="space-y-3">
      {Object.entries(vals).map(([key, val]) => (
        <div key={key}>
          <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{LABELS[key]}</span><span className="font-mono font-bold">{val}</span></div>
          <input type="range" min={0} max={10} step={1} value={val} onChange={e => setVals(v => ({ ...v, [key]: +e.target.value }))} className="w-full accent-yellow-500" />
        </div>
      ))}
      <div className="rounded-xl p-4 text-center" style={{ background: "rgba(245,158,11,0.1)", border: "2px solid rgba(245,158,11,0.3)" }}>
        <p className="text-3xl font-black text-amber-500">{Math.round(kwh * 365)} kWh/an</p>
        <p className="text-sm text-muted-foreground mt-1">≈ <strong className="text-amber-500">{cad} $ CAD</strong> de facture annuelle</p>
        {cad > 1500 && <p className="text-xs text-red-500 font-bold mt-2">⚠️ Consommation élevée — des économies importantes sont possibles !</p>}
      </div>
    </div>
  );
}

function WaterCalc() {
  const [vals, setVals] = useState({ douche: 8, bains: 1, wc: 6, robinet: 10, lavevaisselle: 3 });
  const LITRES = { douche: 65, bains: 150, wc: 9, robinet: 12, lavevaisselle: 15 };
  const LABELS = { douche: "Min de douche/j", bains: "Bains/semaine", wc: "Chasses d'eau/j", robinet: "Min robinet/j", lavevaisselle: "Cycles lave-vaisselle/semaine" };
  const total = Math.round(Object.entries(vals).reduce((s, [k, v]) => s + LITRES[k] * v, 0));
  const cad = Math.round(total * 365 * 0.0016);

  return (
    <div className="space-y-3">
      {Object.entries(vals).map(([key, val]) => (
        <div key={key}>
          <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{LABELS[key]}</span><span className="font-mono font-bold">{val}</span></div>
          <input type="range" min={0} max={20} step={1} value={val} onChange={e => setVals(v => ({ ...v, [key]: +e.target.value }))} className="w-full accent-sky-500" />
        </div>
      ))}
      <div className="rounded-xl p-4 text-center" style={{ background: "rgba(14,165,233,0.1)", border: "2px solid rgba(14,165,233,0.3)" }}>
        <p className="text-3xl font-black text-sky-500">{total} L/jour</p>
        <p className="text-sm text-muted-foreground mt-1">≈ <strong className="text-sky-500">{Math.round(total * 365 / 1000)} m³/an</strong> · {cad}$ de facture</p>
        <p className="text-xs text-muted-foreground mt-1">Moyenne recommandée : 150 L/pers/jour</p>
      </div>
    </div>
  );
}

function FoodCalc() {
  const [vals, setVals] = useState({ boeuf: 2, porc: 1, poulet: 3, poisson: 2, oeuf: 5, laitier: 7, local: 4 });
  const CO2 = { boeuf: 27, porc: 12, poulet: 6.9, poisson: 6.1, oeuf: 4.8, laitier: 3.2, local: -1.2 };
  const LABELS = { boeuf: "Repas bœuf/sem", porc: "Repas porc/sem", poulet: "Repas poulet/sem", poisson: "Repas poisson/sem", oeuf: "Œufs/sem", laitier: "Portions laitières/j", local: "Repas local/circuit court/sem" };
  const kgPerYear = Object.entries(vals).reduce((s, [k, v]) => s + CO2[k] * v * 52, 0);

  return (
    <div className="space-y-3">
      {Object.entries(vals).map(([key, val]) => (
        <div key={key}>
          <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{LABELS[key]}</span><span className="font-mono font-bold">{val}</span></div>
          <input type="range" min={0} max={14} step={1} value={val} onChange={e => setVals(v => ({ ...v, [key]: +e.target.value }))} className="w-full accent-orange-500" />
        </div>
      ))}
      <div className="rounded-xl p-4 text-center" style={{ background: "rgba(249,115,22,0.1)", border: "2px solid rgba(249,115,22,0.3)" }}>
        <p className="text-3xl font-black text-orange-500">{Math.round(kgPerYear)} kg CO₂/an</p>
        <p className="text-xs text-muted-foreground mt-1">Via votre alimentation · Végétarien : ~1 500 kg · Omnivore moyen : ~3 300 kg</p>
        {vals.local >= 5 && <p className="text-xs text-emerald-600 font-bold mt-2">🌱 Bravo ! Votre circuit court réduit l'impact positivement.</p>}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────

export default function MicroOutils() {
  const [active, setActive] = useState(null);

  return (
    <div className="pb-20 space-y-10 max-w-5xl mx-auto px-4 pt-8">
      {/* Hero */}
      <div className="rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-border"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.06))" }}>
        <div className="text-5xl">🧰</div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">Micro-Outils d'Utilité Publique</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Calculateurs instantanés, gratuits, sans trackers, sans pub.<br />
          <strong className="text-foreground">Votre impact. Vos décisions. Votre souveraineté.</strong>
        </p>
        <div className="flex justify-center gap-8 text-sm">
          <div className="text-center"><p className="text-3xl font-black text-primary">{TOOLS.length}</p><p className="text-muted-foreground text-xs">Outils actifs</p></div>
          <div className="text-center"><p className="text-3xl font-black text-emerald-400">0$</p><p className="text-muted-foreground text-xs">Frais</p></div>
          <div className="text-center"><p className="text-3xl font-black text-violet-400">0</p><p className="text-muted-foreground text-xs">Trackers</p></div>
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-4">
        {TOOLS.map(tool => {
          const Icon = tool.icon;
          const isOpen = active === tool.id;
          return (
            <div key={tool.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button className="w-full px-6 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left"
                onClick={() => setActive(isOpen ? null : tool.id)}>
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground">{tool.emoji} {tool.title}</p>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-border">
                  <tool.component />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="rounded-2xl p-6 text-center border border-border text-muted-foreground text-xs space-y-1">
        <p>🔒 Tous les calculs se font <strong>dans votre navigateur</strong> — aucune donnée n'est envoyée à nos serveurs.</p>
        <p>Sources : ADEME, ECCC, Statistique Canada, FAO.</p>
      </div>
    </div>
  );
}