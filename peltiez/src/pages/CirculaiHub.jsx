import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  Calculator,
  FileText,
  FlaskConical,
  MapPin,
  MessageSquare,
  Recycle,
  ScrollText,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import PlatformPageHeader from "@/components/platform/PlatformPageHeader";
import { Button } from "@/components/ui/button";
import {
  CIRCULAI_BRAND,
  CIRCULAI_SEO_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
} from "@/lib/site";
import {
  CIRCULAI_EGOR_SPLIT,
  CIRCULAI_KIT_DOCS,
  CIRCULAI_KIT_REGIONAL_PATH,
} from "@/lib/circulaiEgorBrand";
import { motion } from "framer-motion";

const PRIMARY_DOCS = CIRCULAI_KIT_DOCS.filter((d) =>
  ["lettre", "plan-affaires", "plan-demo", "plan-action-quebec"].includes(d.id),
);

const MODULES = [
  {
    id: "equation",
    icon: Calculator,
    label: "Équation du pilote",
    desc: "Modèle mathématique humble — μ_flux, λ_fuite, ε_terrain. Outil de lecture pour aligner une équipe et un élu.",
    path: "/circulai/equation-pilote",
    status: "live",
  },
  {
    id: "pilote",
    icon: BarChart3,
    label: "Tableau 90 jours",
    desc: "Suivi opérationnel semaine par semaine : jalons, preuves, indicateurs terrain.",
    path: "/pilote",
    status: "live",
  },
  {
    id: "kit",
    icon: ScrollText,
    label: "Kit régional",
    desc: "Documents complets pour décideurs : lettre type, plan d'affaires, référence RECYC-QC.",
    path: "/docs/circulai-kit-regional",
    status: "live",
  },
  {
    id: "marketplace",
    icon: ShoppingBag,
    label: "Marketplace seconde main",
    desc: "Annonces don / vente / réparation géolocalisées. Interface publique Québec.",
    path: "/seconde-main",
    status: "live",
  },
  {
    id: "equations-systeme",
    icon: FlaskConical,
    label: "Cartographie équations",
    desc: "8 équations → routes code → métriques. Pont entre formules et pages actives.",
    path: "/docs/circulai/equations-systeme",
    status: "beta",
  },
  {
    id: "prompts",
    icon: MessageSquare,
    label: "Prompts IA",
    desc: "Guide de prompts adaptés pour entrepreneurs, mairie, communication — ton humble.",
    path: "/circulai/prompts-ia",
    status: "beta",
  },
  {
    id: "codex",
    icon: BookOpen,
    label: "Codex métaphores",
    desc: "Symboles, jumeaux, œil, pont — filiation Lumières. Discours territoriaux prêts.",
    path: "/circulai/codex-metaphores",
    status: "preview",
  },
  {
    id: "entreprises",
    icon: Building2,
    label: "Entreprises",
    desc: "Onboarding entreprises locales — intégration au pilote, rôles et livrables.",
    path: "/entreprises",
    status: "preview",
  },
];

const STATUS_CONFIG = {
  live: { label: "Live", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  beta: { label: "Bêta", className: "bg-sky-50 text-sky-700 border border-sky-200" },
  preview: { label: "Aperçu", className: "bg-zinc-100 text-zinc-600 border border-zinc-200" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function CirculaiHub() {
  return (
    <div className="pb-16 space-y-10">
      <SEOMeta
        title={`${CIRCULAI_BRAND} — pilote Québec · kit & preuves`}
        description={CIRCULAI_SEO_DESCRIPTION}
        keywords="circulai, économie circulaire, pilote 90 jours, municipalités, québec"
        canonicalUrl={`${SITE_ORIGIN}/circulai`}
      />

      <PlatformPageHeader
        eyebrow="Portail décideurs & partenaires"
        title={CIRCULAI_BRAND}
        description={CIRCULAI_EGOR_SPLIT.circulai.pitch}
        variant="sky"
      >
        <Button
          asChild
          size="lg"
          className="platform-btn-primary rounded-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <Link to={CIRCULAI_KIT_REGIONAL_PATH}>
            <ScrollText className="mr-2 h-4 w-4" aria-hidden />
            Kit régional
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
        >
          <Link to="/entreprises">
            <Building2 className="mr-2 h-4 w-4" aria-hidden />
            Entreprises & pilote
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200">
          <Link to="/circulai/equation-pilote">
            <Calculator className="mr-2 h-4 w-4" aria-hidden />
            Équation du pilote
          </Link>
        </Button>
      </PlatformPageHeader>

      <p className="text-sm text-muted-foreground flex items-center gap-2 -mt-4">
        <MapPin className="h-4 w-4 text-sky-600 shrink-0" aria-hidden />
        Pilote 90 jours · preuves vérifiables · un site, un discours
      </p>

      {/* ── Modules hub ── */}
      <section aria-label="Modules CirculAI">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Modules disponibles</h2>
          <span className="text-xs text-muted-foreground">
            {MODULES.filter((m) => m.status === "live").length} actifs
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
          {MODULES.map((mod, i) => {
            const Icon = mod.icon;
            const badge = STATUS_CONFIG[mod.status];
            return (
              <motion.div
                key={mod.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Link
                  to={mod.path}
                  className="group flex items-start gap-3 platform-surface rounded-xl border border-zinc-200/80 p-4 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 group-hover:bg-emerald-50 transition-colors duration-200">
                    <Icon className="h-4 w-4 text-zinc-600 group-hover:text-emerald-700 transition-colors duration-200" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{mod.label}</p>
                      <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{mod.desc}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all duration-150 shrink-0 mt-1.5" aria-hidden />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Documents clés ── */}
      <section className="grid gap-3 sm:grid-cols-2" aria-label="Documents clés">
        {PRIMARY_DOCS.map((doc, i) => (
          <motion.div
            key={doc.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
          >
            <Link
              to={doc.path}
              className="group block platform-surface rounded-2xl border border-sky-200/80 p-4 hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <FileText className="h-5 w-5 text-sky-600 mb-2" aria-hidden />
              <p className="font-semibold text-foreground text-sm">{doc.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{doc.summary}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700">
                Lire{" "}
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden />
              </span>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* ── Jumeau Egor69 ── */}
      <section className="platform-card-violet rounded-2xl p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
          Jumeau {SITE_NAME}
        </p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {CIRCULAI_EGOR_SPLIT.egor.pitch}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Link to="/">
              <Recycle className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Accueil
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Link to="/world">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Verse 3D
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Link to="/marketplace">Marketplace</Link>
          </Button>
        </div>
      </section>

      <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
        Pas de promesse blockchain ni de copy obsolète. Ce portail est la vitrine territoriale officielle —
        alignée avec le dépôt {SITE_NAME}.
      </p>
    </div>
  );
}
