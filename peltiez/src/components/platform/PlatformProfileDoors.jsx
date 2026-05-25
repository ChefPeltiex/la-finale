/**
 * PlatformProfileDoors
 * 4 portes d'entrée par PROFIL (pas par fonction).
 * Chaque porte cible un visiteur précis avec son langage et ses destinations.
 *
 * Esthétique : terre / eau / lumière — sobre, municipal, vert émeraude.
 * JAMAIS de violet/doré (réservé à Egor69).
 */
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, HandHeart, Landmark, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const doorVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Les 4 portes ──────────────────────────────────────── */
const PROFILE_DOORS = [
  {
    id: "agis",
    icon: Leaf,
    verb: "J'agis",
    who: "Citoyen · Bénévole",
    desc: "Tu as un objet à donner, un besoin à exprimer, un geste à poser pour ton quartier. La plateforme germe ici.",
    cta: "Trouver ma place",
    to: "/seconde-main",
    secondaryCta: "Carte du territoire",
    secondaryTo: "/portail/nature-quebec",
    accent: "emerald",
    bg: "bg-emerald-50/70 hover:bg-emerald-50",
    border: "border-emerald-200 hover:border-emerald-400",
    iconBg: "bg-emerald-100 text-emerald-700",
    verbColor: "text-emerald-700",
  },
  {
    id: "contribue",
    icon: HandHeart,
    verb: "Je contribue",
    who: "OBNL · Producteur · Artisan",
    desc: "Ton organisation circule dans l'écosystème — partage tes ressources, propose tes services, rejoins le réseau.",
    cta: "Contribuer maintenant",
    to: "/boutique",
    secondaryCta: "Kit régional",
    secondaryTo: "/docs/circulai-kit-regional",
    accent: "teal",
    bg: "bg-teal-50/70 hover:bg-teal-50",
    border: "border-teal-200 hover:border-teal-400",
    iconBg: "bg-teal-100 text-teal-700",
    verbColor: "text-teal-700",
  },
  {
    id: "decide",
    icon: Landmark,
    verb: "Je décide",
    who: "Élu · Fonctionnaire · Institution",
    desc: "Les données résonnent. Pilote l'équation du territoire, consulte les preuves, structure ton plan d'action.",
    cta: "Ouvrir le tableau de bord",
    to: "/circulai/hub",
    secondaryCta: "Plan d'action Québec",
    secondaryTo: "/docs/circulai/plan-action-quebec",
    accent: "sky",
    bg: "bg-sky-50/70 hover:bg-sky-50",
    border: "border-sky-200 hover:border-sky-400",
    iconBg: "bg-sky-100 text-sky-700",
    verbColor: "text-sky-700",
  },
  {
    id: "comprends",
    icon: BookOpen,
    verb: "Je comprends",
    who: "Curieux · Chercheur · Étudiant",
    desc: "Explore les concepts, plonge dans l'Encyclopédie, laisse Egor69 guider ta réflexion contemplative.",
    cta: "Lire l'Encyclopédie",
    to: "/encyclopedie",
    secondaryCta: "Boussole Egor69 ↗",
    secondaryTo: "https://egor69.vercel.app",
    secondaryExternal: true,
    accent: "stone",
    bg: "bg-stone-50/70 hover:bg-stone-50",
    border: "border-stone-200 hover:border-stone-300",
    iconBg: "bg-stone-100 text-stone-600",
    verbColor: "text-stone-600",
  },
];

export default function PlatformProfileDoors({ className = "" }) {
  return (
    <section
      id="portes"
      aria-labelledby="portes-title"
      className={`max-w-5xl mx-auto px-2 ${className}`}
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 mb-2">
          Par où entrer
        </p>
        <h2
          id="portes-title"
          className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
        >
          Où te situes-tu dans cette symphonie&nbsp;?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Chaque profil trouve sa porte — et chaque porte mène là où ça circule.
        </p>
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {PROFILE_DOORS.map(
          ({
            id,
            icon: Icon,
            verb,
            who,
            desc,
            cta,
            to,
            secondaryCta,
            secondaryTo,
            secondaryExternal,
            bg,
            border,
            iconBg,
            verbColor,
          }) => (
            <motion.article
              key={id}
              variants={doorVariants}
              className={`group relative flex flex-col rounded-2xl border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${bg} ${border}`}
            >
              {/* Icône profil */}
              <span
                className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}
                aria-hidden
              >
                <Icon className="h-5 w-5" />
              </span>

              {/* Verb + who */}
              <p className={`text-lg font-bold leading-tight ${verbColor}`}>{verb}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5 mb-3">
                {who}
              </p>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{desc}</p>

              {/* CTA principal */}
              <Link
                to={to}
                className={`mt-5 inline-flex items-center gap-1.5 text-xs font-semibold ${verbColor} group-hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded`}
              >
                {cta}
                <ArrowRight
                  className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-150"
                  aria-hidden
                />
              </Link>

              {/* CTA secondaire */}
              {secondaryExternal ? (
                <a
                  href={secondaryTo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
                >
                  {secondaryCta}
                </a>
              ) : (
                <Link
                  to={secondaryTo}
                  className="mt-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
                >
                  {secondaryCta} →
                </Link>
              )}
            </motion.article>
          )
        )}
      </motion.div>
    </section>
  );
}
