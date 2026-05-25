import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Recycle,
  ScrollText,
  Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PlatformProfileDoors from "@/components/platform/PlatformProfileDoors";
import PlatformTrustStrip from "@/components/platform/PlatformTrustStrip";
import {
  CIRCULAI_BRAND,
  CIRCULAI_HERO_HEADLINE,
  CIRCULAI_HERO_SUBTEXT,
  CIRCULAI_TAGLINE,
} from "@/lib/site";
import { motion, AnimatePresence } from "framer-motion";

/* ── Animation helpers ─────────────────────────────────── */
const fade = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Signaux vivants (remplace les badges "preuves corporates") */
const SIGNALS = [
  { label: "Germe à Québec · Limoilou", icon: Sprout },
  { label: "Données honnêtes · pilote 90 j", icon: Recycle },
  { label: "Structure coopérative en devenir", icon: MapPin },
];

/* ── Section PAR OÙ COMMENCER : 3 étapes fluides ─────── */
const STEPS = [
  {
    n: "1",
    title: "Choisis ta porte",
    desc: "Citoyen, OBNL, élu ou curieux — chaque profil a son entrée. Aucune inscription requise.",
    cta: "Voir les 4 portes",
    to: "#portes",
    variant: "primary",
    anchor: true,
  },
  {
    n: "2",
    title: "Explore le Hub",
    desc: "Tableau de bord municipal : modules, jalons, kit régional — tout circule au même endroit.",
    cta: "Aller au Hub",
    to: "/circulai/hub",
    variant: "outline",
  },
  {
    n: "3",
    title: "Lance la démo 2 min",
    desc: "Vois l'équation pilote en action — les flux, les preuves, le territoire qui résonne.",
    cta: "Démo équation",
    to: "/circulai/equation-pilote",
    variant: "outline",
  },
];

/* ── FAQ ───────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: "C'est quoi CirculAI ?",
    a: "CirculAI est une plateforme vivante québécoise : elle aide citoyens, OBNL, élus et entreprises à faire germer une économie circulaire locale. Chaque contribution — un don, un service, un plan d'action — trouve sa place dans la symphonie collective.",
  },
  {
    q: "Pour qui est-ce fait ?",
    a: "Pour tous. Citoyens qui agissent, OBNL qui contribuent, élus qui décident, curieux qui comprennent. Nous n'avons pas de profil unique — nous avons quatre portes d'entrée et une même maison.",
  },
  {
    q: "Est-ce gratuit ?",
    a: "L'accès à la plateforme (Hub, Encyclopédie, démo, cartes) est libre et gratuit. La boutique propose des kits numériques et supports payants. Aucune carte bancaire requise pour explorer.",
  },
  {
    q: "Comment CirculAI s'organise-t-il ?",
    a: "Nous construisons une structure coopérative (50/20/20/10 les premières années, puis 25/25/25/25). Chaque acteur — citoyen, OBNL, institution, partenaire — a voix dans la symphonie. Le pilote 90 jours mesure les effets réels : temps, coût, qualité de données.",
  },
  {
    q: "Qu'est-ce qu'Egor69 dans tout ça ?",
    a: "Egor69 est la boussole contemplative de l'écosystème — un espace de réflexion profonde, à part. CirculAI agit sur le terrain ; Egor69 invite à la méditation. Les deux coexistent sans se mélanger.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-inset"
        aria-expanded={open}
      >
        {q}
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-2" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" aria-hidden />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PlatformHome() {
  return (
    <div className="platform-home living-bg space-y-16 sm:space-y-20 -mx-2 sm:mx-0 rounded-2xl">

      {/* ── HERO — Place du village qui respire ─────────── */}
      <motion.section
        className="text-center max-w-2xl mx-auto px-2 pt-2"
        initial="hidden"
        animate="visible"
        variants={fade}
      >
        {/* Tagline-badge sobre */}
        <motion.p
          variants={item}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full breathe-slow"
        >
          <Sprout className="h-3.5 w-3.5" aria-hidden />
          {CIRCULAI_BRAND} — {CIRCULAI_TAGLINE}
        </motion.p>

        {/* H1 vivant */}
        <motion.h1
          variants={item}
          className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1]"
        >
          {CIRCULAI_HERO_HEADLINE}
        </motion.h1>

        {/* Sous-titre inclusif */}
        <motion.p
          variants={item}
          className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          {CIRCULAI_HERO_SUBTEXT}
        </motion.p>

        {/* Signaux vivants — remplace les badges corporates */}
        <motion.ul
          variants={item}
          className="mt-5 flex flex-wrap justify-center gap-2"
          aria-label="Signaux CirculAI"
        >
          {SIGNALS.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full"
            >
              <Icon className="h-3 w-3 text-emerald-600 shrink-0" aria-hidden />
              {label}
            </li>
          ))}
        </motion.ul>

        {/* CTA principaux */}
        <motion.div
          variants={item}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="platform-btn-primary rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
          >
            <a href="#portes">
              Trouver ma porte
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
          >
            <Link to="/docs/circulai-kit-regional">
              <ScrollText className="mr-2 h-4 w-4" aria-hidden />
              Kit municipal
            </Link>
          </Button>
        </motion.div>

        <motion.div variants={item}>
          <PlatformTrustStrip className="mt-8" />
        </motion.div>
      </motion.section>

      {/* ── DIVISEUR ORGANIQUE ───────────────────────────── */}
      <div className="organic-divider max-w-xs mx-auto" aria-hidden />

      {/* ── 4 PORTES PAR PROFIL ──────────────────────────── */}
      <PlatformProfileDoors />

      {/* ── PAR OÙ COMMENCER : 3 étapes fluides ─────────── */}
      <motion.section
        id="par-ou-commencer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto px-2"
      >
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-2">
            Trois pas pour commencer
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Par où commencer&nbsp;?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Pas de bonne ou mauvaise porte — chaque chemin circule vers le même objectif.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {STEPS.map(({ n, title, desc, cta, to, variant, anchor }) => (
            <div
              key={n}
              className="relative bg-white border border-border rounded-xl p-6 flex flex-col hover:shadow-md hover:border-emerald-300 transition-all duration-200"
            >
              <div className="absolute -top-3.5 left-5 h-7 w-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                {n}
              </div>
              <h3 className="font-semibold text-foreground mt-2 mb-2">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{desc}</p>
              <div className="mt-5">
                {variant === "primary" ? (
                  anchor ? (
                    <Button asChild size="sm" className="w-full platform-btn-primary rounded-lg">
                      <a href={to}>{cta} <ArrowRight className="ml-1 h-3 w-3" aria-hidden /></a>
                    </Button>
                  ) : (
                    <Button asChild size="sm" className="w-full platform-btn-primary rounded-lg">
                      <Link to={to}>{cta} <ArrowRight className="ml-1 h-3 w-3" aria-hidden /></Link>
                    </Button>
                  )
                ) : (
                  <Button asChild size="sm" variant="outline" className="w-full rounded-lg">
                    <Link to={to}>{cta}</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── FAQ vivante ─────────────────────────────────── */}
      <motion.section
        id="faq"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto px-2"
      >
        <div className="text-center mb-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-2">
            Questions fréquentes
          </p>
          <h2 className="text-2xl font-bold text-foreground">Ce que nous sommes</h2>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Une question circule encore&nbsp;?{" "}
          <Link to="/aide" className="text-emerald-700 font-semibold hover:underline">
            Consulter le manuel complet →
          </Link>
        </p>
      </motion.section>

    </div>
  );
}
