import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowRight, FileText, MapPin, RefreshCw } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import { Button } from "@/components/ui/button";
import PilotSdeChart from "@/components/circulai/PilotSdeChart";
import { MathBlock } from "@/components/MathRenderer";
import {
  PILOT_BETA_NOTE,
  PILOT_IMPACT_EQUATION,
  PILOT_RHYTHM,
  PILOT_SDE,
} from "@/lib/math/pilotEquations";
import { CIRCULAI_BRAND } from "@/lib/site";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
};

// Estimations terrain conservatrices par taille de territoire
const TERRITORY_PRESETS = [
  { label: "Petit quartier (< 5 000 hab.)", pop: 3500, rate: 0.018, label_short: "Quartier" },
  { label: "Arrondissement (5 000–25 000 hab.)", pop: 15000, rate: 0.015, label_short: "Arrondissement" },
  { label: "Ville moyenne (25 000–100 000 hab.)", pop: 55000, rate: 0.012, label_short: "Ville" },
  { label: "Grande ville (> 100 000 hab.)", pop: 150000, rate: 0.008, label_short: "Grande ville" },
];

function calcKpis({ pop, rate, days = 90 }) {
  const dailyFlux = Math.round(pop * rate);
  const totalFlux = Math.round(dailyFlux * days * 0.65);
  const matching = Math.round(totalFlux * 0.42);
  const kgDetourned = Math.round(totalFlux * 1.8);
  const benovoles = Math.round(totalFlux * 0.07);
  const co2Saved = Math.round(kgDetourned * 2.1);
  return { dailyFlux, totalFlux, matching, kgDetourned, benovoles, co2Saved };
}

function KpiCard({ label, value, unit, note }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-center">
      <p className="text-2xl font-bold text-sky-300 tabular-nums">{value.toLocaleString("fr-CA")}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50 mt-0.5">{unit}</p>
      <p className="text-xs text-white/70 mt-1 font-medium">{label}</p>
      {note && <p className="text-[10px] text-white/35 mt-1 leading-tight">{note}</p>}
    </div>
  );
}

export default function CirculaiEquationPilote() {
  const [presetIdx, setPresetIdx] = useState(1);
  const preset = TERRITORY_PRESETS[presetIdx];
  const kpis = useMemo(() => calcKpis({ pop: preset.pop, rate: preset.rate }), [preset]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-950/25 via-zinc-950 to-emerald-950/20 text-white pb-20">
      <div className="container max-w-3xl py-10 px-4">
        <SEOMeta
          title={`Équation du pilote — ${CIRCULAI_BRAND}`}
          description="Modèle humble pour pilote 90 jours : tendance, variation, trois preuves — sans promesse scientifique excessive."
          canonicalUrl="/circulai/equation-pilote"
        />

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <Link
            to="/circulai"
            className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200 mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour CirculAI
          </Link>

          <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400">Outil de lecture · pas un rapport IQ</p>
          <h1 className="text-3xl font-bold mt-2">Équation du pilote</h1>
          <p className="mt-3 text-white/75 leading-relaxed">
            Langage pour aligner l&apos;équipe et un élu : ce qu&apos;on mesure, ce qu&apos;on assume comme imprévu, ce qu&apos;on ne
            promet pas.
          </p>

          <aside className="mt-6 rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 flex gap-3" role="note">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" aria-hidden />
            <div className="text-sm text-amber-100/90 leading-relaxed">
              <strong className="text-amber-200">Message pour la mairie</strong> — Ce n&apos;est pas une certification
              universitaire ni une garantie de résultat. C&apos;est un cadre pour un <strong>pilote limité</strong> : un site,
              des flux réels documentés, <strong>trois preuves</strong> à la fin. Si les chiffres sont faibles, on les dit
              tels quels.
            </div>
          </aside>
        </motion.div>

        {/* ── Calculateur interactif ── */}
        <motion.section
          className="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 sm:p-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          aria-label="Calculateur estimatif pilote 90 jours"
        >
          <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Calculateur estimatif</p>
              <h2 className="text-base font-semibold text-white mt-0.5">Territoire → Projections 90 j</h2>
            </div>
            <span className="text-[10px] text-white/35 leading-tight max-w-[160px] text-right">
              Estimations conservatrices, sources RECYC-QC
            </span>
          </div>

          {/* Sélecteur territoire */}
          <fieldset className="flex flex-wrap gap-2 mb-5">
            <legend className="sr-only">Taille du territoire</legend>
            {TERRITORY_PRESETS.map((p, i) => (
              <button
                key={p.label_short}
                type="button"
                onClick={() => setPresetIdx(i)}
                aria-pressed={presetIdx === i}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                  presetIdx === i
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-md"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {p.label_short}
              </button>
            ))}
          </fieldset>

          <p className="text-xs text-white/50 mb-4">
            <span className="font-medium text-white/70">{preset.label}</span> —{" "}
            {preset.pop.toLocaleString("fr-CA")} hab. · taux participation estimé{" "}
            {(preset.rate * 100).toFixed(1)} %/j
          </p>

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <KpiCard
              label="Flux bruts cumulés"
              value={kpis.totalFlux}
              unit="transactions"
              note="Dons, échanges, réparations"
            />
            <KpiCard
              label="Objets circulés"
              value={kpis.matching}
              unit="matchings"
              note="Estimé à 42 % des flux"
            />
            <KpiCard
              label="Matière détournée"
              value={kpis.kgDetourned}
              unit="kg estimés"
              note="~1,8 kg/objet moyen"
            />
            <KpiCard
              label="CO₂ évité"
              value={kpis.co2Saved}
              unit="kg CO₂ eq."
              note="Facteur approx. RECYC-QC"
            />
            <KpiCard
              label="Implication bénévole"
              value={kpis.benovoles}
              unit="participations"
              note="7 % des flux, estimatif"
            />
            <KpiCard
              label="Flux/jour terrain"
              value={kpis.dailyFlux}
              unit="transactions/j"
              note="Avant friction terrain"
            />
          </div>

          <p className="mt-4 text-[10px] text-white/30 leading-relaxed">
            Projections non certifiées. Friction terrain (~35 %) et facteur CO₂ sont des approximations. Le pilote documente les chiffres réels.
          </p>
        </motion.section>

        <section className="mt-10 space-y-6">
          <motion.article
            className="rounded-2xl border border-white/10 bg-black/40 p-5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <h2 className="text-lg font-semibold text-sky-200">1. Impact cumulé (intention du pilote)</h2>
            <div className="mt-3 overflow-x-auto py-2">
              <MathBlock math={PILOT_IMPACT_EQUATION.latex} />
            </div>
            <ul className="mt-3 text-sm text-white/65 space-y-1 list-disc pl-5">
              <li>
                <strong className="text-white/85">μ_flux</strong> — dons, réparations, matchings comptés honnêtement
              </li>
              <li>
                <strong className="text-white/85">λ_fuite</strong> — abandons, doublons, erreurs de saisie
              </li>
              <li>
                <strong className="text-white/85">ε_terrain</strong> — météo, vacances, charge bénévole (normal)
              </li>
            </ul>
          </motion.article>

          <motion.article
            className="rounded-2xl border border-white/10 bg-black/40 p-5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <h2 className="text-lg font-semibold text-sky-200">2. Tendance + imprévu (SDE)</h2>
            <div className="mt-3 overflow-x-auto py-2">
              <MathBlock math={PILOT_SDE.latex} />
            </div>
            <p className="text-xs text-white/50 mt-1">{PILOT_SDE.plain}</p>
            <div className="mt-4">
              <PilotSdeChart />
            </div>
            <p className="text-[10px] text-white/35 mt-2 flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3 shrink-0" aria-hidden />
              Courbe simulée à chaque rendu — illustre la variabilité terrain, pas une prévision.
            </p>
          </motion.article>

          <motion.article
            className="rounded-2xl border border-white/10 bg-black/40 p-5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <h2 className="text-lg font-semibold text-sky-200">3. Deux flux, un ratio (Beta)</h2>
            <p className="text-sm text-white/70 mt-2">{PILOT_BETA_NOTE}</p>
            <p className="text-sm text-white/55 mt-2">
              Ex. combiner « objets circulés » et « heures bénévoles » sans gonfler un seul indicateur.
            </p>
          </motion.article>

          <motion.article
            className="rounded-2xl border border-white/10 bg-black/40 p-5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <h2 className="text-lg font-semibold text-sky-200">4. Rythme 90 jours (algoRYTHME)</h2>
            <ul className="mt-3 space-y-2 text-sm" role="list">
              {PILOT_RHYTHM.phases.map((p) => (
                <li key={p.label} className="flex gap-3 items-baseline">
                  <span className="font-mono text-sky-400 shrink-0 text-xs font-semibold">{p.label}</span>
                  <span className="text-white/70">{p.action}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-white/45 mt-3">{PILOT_RHYTHM.cycleExample}</p>
          </motion.article>
        </section>

        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          <Button
            asChild
            className="bg-sky-600 hover:bg-sky-500 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <Link to="/docs/circulai/lettre-municipale">
              <FileText className="h-4 w-4 mr-2" aria-hidden />
              Lettre pilote (humble)
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-emerald-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
          >
            <Link to="/pilote">Tableau 90 jours</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/docs/circulai/equations-systeme">
              Cartographie complète
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-amber-300/80">
            <Link to="/codex-metaphores">Codex · jumeaux, œil, pont</Link>
          </Button>
        </motion.div>

        <p className="mt-8 text-xs text-white/40 flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          Limoilou · Québec — {CIRCULAI_BRAND} reste séparé du divertissement Egor69.
        </p>
      </div>
    </div>
  );
}
