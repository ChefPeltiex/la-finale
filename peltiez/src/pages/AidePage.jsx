/**
 * Page /aide — Manuel d'utilisation complet de CirculAI
 * Branding : sobre, municipal, vert émeraude. Zéro mystique.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  LayoutDashboard,
  Leaf,
  ShoppingBag,
} from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN } from "@/lib/site";

/* ── FAQ étendue ──────────────────────────────────────── */
const FAQ_EXTENDED = [
  {
    q: "C'est quoi CirculAI ?",
    a: "CirculAI est une plateforme territoriale québécoise pour piloter l'économie circulaire. Elle fournit des outils concrets aux municipalités, OBNL et entreprises : équations de flux, tableau de bord 90 jours, atlas vivant et kit de documentation municipal.",
  },
  {
    q: "Pour qui est cette plateforme ?",
    a: "Pour les décideurs municipaux, chargés de projets OBNL, directeurs d'entreprises en économie verte, et citoyens engagés. L'objectif est de fournir des données réelles et vérifiables — pas du marketing.",
  },
  {
    q: "Combien ça coûte ?",
    a: "L'accès aux modules de base (Hub, Encyclopédie, démo équation) est entièrement gratuit. La boutique propose des kits numériques payants : rapports PDF complets, kits municipaux, matériel de présentation. Aucune carte bancaire requise pour explorer.",
  },
  {
    q: "Comment la démo 2 min fonctionne-t-elle ?",
    a: "La démo sur /circulai/equation-pilote affiche l'équation pilote CirculAI avec des paramètres interactifs : μ_flux (taux de matière circulée), λ_fuite (pertes), ε_terrain (efficacité). Vous pouvez ajuster les curseurs pour voir l'impact calculé en temps réel. Aucune inscription requise.",
  },
  {
    q: "Qu'est-ce que le Kit municipal ?",
    a: "Le Kit régional CirculAI (/docs/circulai-kit-regional) contient tous les documents nécessaires pour proposer un pilote à une municipalité : lettre type, plan d'affaires, plan de démonstration, références RECYC-QC, et analyse valeur économique/environnementale.",
  },
  {
    q: "Comment fonctionne le tableau 90 jours ?",
    a: "La page /pilote affiche un tableau de suivi semaine par semaine avec jalons, preuves et indicateurs terrain. Il est conçu pour être présenté aux élus municipaux comme preuve de progression.",
  },
  {
    q: "L'Encyclopédie est-elle gratuite ?",
    a: "Oui, l'Encyclopédie (/encyclopedie) est accessible gratuitement. Elle explique les concepts de l'économie circulaire, les termes techniques du Codex, et les méthodes de mesure. Une édition complète en PDF est disponible en boutique (19 $ CA).",
  },
  {
    q: "Comment utiliser la carte Nature Québec ?",
    a: "La section /portail/nature-quebec offre une carte interactive du territoire québécois avec fiches faune, flore, minéraux et données environnementales. Utilisez le filtre par région ou par catégorie d'espèce.",
  },
];

/* ── Glossaire ────────────────────────────────────────── */
const GLOSSAIRE = [
  { term: "μ_flux", def: "Taux de matière circulée : proportion des ressources qui restent dans le circuit local plutôt que d'être perdues ou exportées." },
  { term: "λ_fuite", def: "Taux de fuite : pourcentage de matière ou d'énergie qui sort du circuit territorial sans être valorisée." },
  { term: "ε_terrain", def: "Efficacité terrain : facteur de performance opérationnelle mesuré sur le terrain (collecte, tri, réemploi, réparation)." },
  { term: "Softmax", def: "Fonction mathématique utilisée dans les modèles d'IA pour convertir des scores bruts en probabilités. Dans CirculAI, utilisée pour pondérer les indicateurs de confiance." },
  { term: "Confiance", def: "Score de fiabilité d'une donnée ou d'une prédiction — exprimé entre 0 et 1. Une confiance > 0.85 indique une donnée terrain vérifiée." },
  { term: "Flux matière", def: "Mouvement physique de ressources (biens, déchets, matériaux) à travers un territoire. L'économie circulaire vise à maximiser ces flux localement." },
  { term: "OBNL", def: "Organisme à but non lucratif. Acteur clé des initiatives d'économie circulaire locale au Québec." },
  { term: "RECYC-QC", def: "Recyc-Québec — organisme gouvernemental québécois responsable de la gestion des matières résiduelles. Les données CirculAI s'appuient sur leurs référentiels publics." },
  { term: "Pilote 90 jours", def: "Protocole de démonstration CirculAI sur 90 jours avec 3 preuves vérifiables à produire : flux documenté, indicateur terrain, rapport d'impact." },
  { term: "Atlas vivant", def: "Carte dynamique du territoire avec fiches mis à jour en temps réel. L'atlas vivant CirculAI couvre faune, flore, acteurs économiques et flux matière du Québec." },
];

/* ── Sections manuel ──────────────────────────────────── */
const SECTIONS = [
  {
    id: "hub",
    icon: LayoutDashboard,
    title: "Utiliser le Hub municipal",
    color: "text-emerald-700 bg-emerald-50",
    content: [
      {
        subtitle: "Vue d'ensemble",
        text: "Le Hub (/circulai/hub) est le tableau de bord central de CirculAI. Il regroupe tous les modules : équation du pilote, tableau 90 jours, kit régional, outils IA, et documentation. C'est votre point de départ opérationnel.",
      },
      {
        subtitle: "Modules principaux",
        text: "Équation du pilote : modèle mathématique interactif. Tableau 90 jours : suivi semaine par semaine. Kit régional : documents complets pour décideurs. Prompts IA : suggestions pour rédiger vos demandes. Partenaires : liste des organisations engagées.",
      },
      {
        subtitle: "Conseil pratique",
        text: "Commencez par l'équation du pilote (démo 2 min) pour comprendre les paramètres, puis explorez le kit régional pour structurer votre présentation aux élus.",
      },
    ],
  },
  {
    id: "encyclopedie",
    icon: BookOpen,
    title: "Lire l'Encyclopédie",
    color: "text-amber-700 bg-amber-50",
    content: [
      {
        subtitle: "Structure",
        text: "L'Encyclopédie (/encyclopedie) est organisée en volumes thématiques : économie circulaire, technologies, territoire québécois, arts et culture. Chaque article est référencé et indique son niveau de vérification.",
      },
      {
        subtitle: "Navigation",
        text: "Utilisez l'atlas Peano (/encyclopedie/atlas-peano) pour une vue cartographique des concepts interconnectés. Le maillage des fiches (/encyclopedie/maillage/:id) montre les liens entre articles.",
      },
      {
        subtitle: "Exemple concret",
        text: "Pour comprendre un terme dans l'équation pilote, cherchez directement dans l'Encyclopédie : tapez 'flux matière' ou 'confiance' dans la barre de recherche pour accéder aux définitions détaillées avec sources.",
      },
    ],
  },
  {
    id: "boutique",
    icon: ShoppingBag,
    title: "Commander dans la Boutique",
    color: "text-sky-700 bg-sky-50",
    content: [
      {
        subtitle: "Catalogue",
        text: "La boutique (/boutique) propose des produits numériques : PDF de l'Encyclopédie complète (19 $ CA), kits municipaux CirculAI, rapports d'impact, matériel de présentation pour élus.",
      },
      {
        subtitle: "Processus d'achat",
        text: "Parcourez le catalogue → sélectionnez un produit → paiement sécurisé via Stripe → téléchargement immédiat du PDF ou kit numérique. Aucun compte requis pour acheter.",
      },
      {
        subtitle: "Seconde main",
        text: "La section seconde main (/seconde-main) permet d'acheter et vendre des biens durables entre particuliers au Québec. Publiez une annonce gratuitement en 2 minutes.",
      },
    ],
  },
  {
    id: "nature",
    icon: Leaf,
    title: "Utiliser la carte Nature",
    color: "text-teal-700 bg-teal-50",
    content: [
      {
        subtitle: "Atlas territorial",
        text: "La section /portail/nature-quebec est l'atlas vivant du territoire québécois. Elle contient des fiches sur la faune (oiseaux, mammifères, poissons), la flore (plantes indigènes, espèces menacées) et les minéraux du Québec.",
      },
      {
        subtitle: "Filtres et navigation",
        text: "Utilisez les filtres par région administrative, par catégorie taxonomique ou par statut de conservation. Chaque fiche inclut des données de distribution géographique et des liens vers des sources vérifiables.",
      },
      {
        subtitle: "Kit documentation Nature",
        text: "Le kit de documentation (/docs/nature-quebec-kit) fournit des modèles de fiches d'inventaire et de cartographie pour les organismes qui souhaitent contribuer à l'atlas territorial.",
      },
    ],
  },
];

function FaqItemExtended({ q, a }) {
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
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function AidePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-14 py-4">
      <SEOMeta
        title="Aide · Manuel CirculAI"
        description="Manuel d'utilisation complet de la plateforme CirculAI : Hub municipal, Encyclopédie, Boutique, Nature Québec, FAQ et glossaire."
        canonicalUrl={`${SITE_ORIGIN}/aide`}
        compact
      />

      {/* En-tête */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <HelpCircle className="h-3 w-3" aria-hidden /> Manuel d'utilisation
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground">
          Comment utiliser CirculAI
        </h1>
        <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Tout ce qu'il faut savoir pour naviguer dans la plateforme, comprendre les outils et présenter CirculAI à votre équipe.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            to="/circulai/equation-pilote"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
          >
            Démo 2 min <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            to="/circulai/hub"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
          >
            Aller au Hub
          </Link>
        </div>
      </div>

      {/* Sections manuelles par module */}
      {SECTIONS.map(({ id, icon: Icon, title, color, content }) => (
        <section key={id} id={`aide-${id}`} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-5">
            <span className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
          </div>
          <div className="space-y-4">
            {content.map(({ subtitle, text }) => (
              <div
                key={subtitle}
                className="bg-white border border-border rounded-xl p-5"
              >
                <p className="text-sm font-semibold text-foreground mb-1.5">{subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* FAQ étendue */}
      <section id="aide-faq" className="scroll-mt-20">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">FAQ complète</h2>
          <p className="text-sm text-muted-foreground">Questions les plus fréquentes sur CirculAI.</p>
        </div>
        <div className="space-y-3">
          {FAQ_EXTENDED.map((f) => (
            <FaqItemExtended key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Glossaire */}
      <section id="aide-glossaire" className="scroll-mt-20">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">Glossaire</h2>
          <p className="text-sm text-muted-foreground">Termes techniques utilisés dans CirculAI.</p>
        </div>
        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
          {GLOSSAIRE.map(({ term, def }) => (
            <div key={term} className="px-5 py-4 bg-white hover:bg-muted/30 transition-colors">
              <p className="text-sm font-mono font-semibold text-emerald-800 mb-1">{term}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{def}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-7 text-center">
        <p className="text-sm font-semibold text-emerald-800 mb-1">Prêt à commencer ?</p>
        <p className="text-xs text-emerald-700 mb-4">Lancez la démo ou explorez le Hub directement.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/circulai/equation-pilote"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
          >
            Démo 2 min <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            to="/circulai/hub"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-emerald-300 text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            Aller au Hub
          </Link>
          <Link
            to="/docs/circulai-kit-regional"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-emerald-300 text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            Kit municipal
          </Link>
        </div>
      </section>
    </div>
  );
}
