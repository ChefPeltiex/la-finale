import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  MapPin,
  Package,
  PlusCircle,
  ScrollText,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PlatformDualDoors from "@/components/platform/PlatformDualDoors";
import PlatformTrustStrip from "@/components/platform/PlatformTrustStrip";
import { CIRCULAI_BRAND, SITE_NAME } from "@/lib/site";
import { motion } from "framer-motion";

const ACTIONS = [
  { to: "/publier", label: "Publier", desc: "Don, vente, échange, réparation", icon: PlusCircle, tone: "emerald" },
  { to: "/marketplace", label: "Marché", desc: "Annonces près de chez vous", icon: ShoppingBag, tone: "sky" },
  { to: "/seconde-main", label: "Seconde main", desc: "Page publique Québec", icon: MapPin, tone: "emerald" },
  { to: "/docs/circulai-kit-regional", label: "Kit régional", desc: "Décideurs & OBNL", icon: ScrollText, tone: "sky" },
  { to: "/encyclopedie", label: "Encyclopédie", desc: "Planches or & noir", icon: BookOpen, tone: "amber" },
  { to: "/boutique", label: "Boutique", desc: "PDF & kits numériques", icon: Store, tone: "zinc" },
];

const toneBorder = {
  emerald: "border-emerald-200 hover:border-emerald-400",
  sky: "border-sky-200 hover:border-sky-400",
  amber: "border-amber-200 hover:border-amber-400",
  zinc: "border-border hover:border-foreground/20",
};

const PROOF_POINTS = [
  "Flux matière documentés",
  "3 preuves vérifiables à J90",
  "Données territoriales publiques",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
};

export default function PlatformHome() {
  return (
    <div className="platform-home space-y-14 sm:space-y-20 -mx-2 sm:mx-0">
      {/* ── Hero ── */}
      <motion.section
        className="text-center max-w-2xl mx-auto px-2 pt-2"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.p
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full"
        >
          Économie circulaire · Québec · Pilote 90 jours
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1]"
        >
          Pilote économie circulaire
          <br />
          <span className="text-emerald-700">90 jours, preuves vérifiables.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          Plateforme territoriale pour municipalités, OBNL et entreprises du Québec&nbsp;:
          marketplace seconde main, atlas vivant, équations pilotes, kit municipal.{" "}
          <span className="font-medium text-foreground/70">{CIRCULAI_BRAND}</span> pour le terrain
          &nbsp;·&nbsp;
          <span className="font-medium text-foreground/70">{SITE_NAME}</span> pour la culture.
        </motion.p>

        {/* Proof chips */}
        <motion.ul
          variants={itemVariants}
          className="mt-5 flex flex-wrap justify-center gap-2"
          aria-label="Points clés du pilote"
        >
          {PROOF_POINTS.map((pt) => (
            <li
              key={pt}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full"
            >
              <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" aria-hidden />
              {pt}
            </li>
          ))}
        </motion.ul>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="platform-btn-primary rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <Link to="/circulai/equation-pilote">
              Démo 2 min — équation pilote
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Link to="/docs/circulai-kit-regional">
              <ScrollText className="mr-2 h-4 w-4" aria-hidden />
              Kit municipal
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Link to="/marketplace">
              <Package className="mr-2 h-4 w-4" aria-hidden />
              Marché
            </Link>
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <PlatformTrustStrip className="mt-8" />
        </motion.div>
      </motion.section>

      <PlatformDualDoors />

      {/* ── Actions directes ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-lg font-semibold text-foreground text-center mb-6">Actions directes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
          {ACTIONS.map(({ to, label, desc, icon: Icon, tone }, idx) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={to}
                className={`group block platform-surface rounded-xl border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${toneBorder[tone]}`}
              >
                <Icon className="h-5 w-5 text-foreground/70 mb-2" aria-hidden />
                <p className="font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                <span className="mt-3 inline-flex items-center text-xs font-medium text-emerald-700">
                  Ouvrir{" "}
                  <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
