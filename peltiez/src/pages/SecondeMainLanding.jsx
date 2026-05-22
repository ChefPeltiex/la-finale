import { Link } from "react-router-dom";
import {
  ArrowRight,
  Gift,
  MapPin,
  Package,
  Recycle,
  RefreshCw,
  Sparkles,
  Wrench,
} from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import { CodexMetaphoreLink } from "@/components/codex/CodexMetaphoreCard";
import PlatformPageHeader from "@/components/platform/PlatformPageHeader";
import QuickSignup60 from "@/components/marketplace/QuickSignup60";
import { Button } from "@/components/ui/button";
import {
  DELTA_M,
  GOLDEN_BALANCE,
  NOUVEAU_CHIC,
  SOLIDITE_COLLECTIVE,
  TREASURE_HUNT,
} from "@/lib/math/consumerEquations";
import { CIRCULAI_BRAND, SITE_ORIGIN } from "@/lib/site";

const SIMPLICITY = [
  {
    icon: Package,
    title: "Un compte, quatre gestes",
    text: "Vente, don, échange ou réparation : même profil, même carte, zéro usine à gaz.",
  },
  {
    icon: Sparkles,
    title: "Publier en quelques clics",
    text: "Photo, titre, quartier, type. L'essentiel pour être trouvé près de chez vous.",
  },
  {
    icon: MapPin,
    title: "Tout près de Québec",
    text: "Filtres et logique locale : on cherche dans le quartier, pas « quelque part sur Internet ».",
  },
];

export default function SecondeMainLanding() {
  return (
    <div className="pb-16 space-y-12 sm:space-y-14">
      <SEOMeta
        title={`Seconde main Québec — ${CIRCULAI_BRAND}`}
        description="Consommez responsable sans vous ruiner : vente, don, échange, réparation. Inscription en moins de 60 secondes."
        canonicalUrl={`${SITE_ORIGIN}/seconde-main`}
        keywords="seconde main Québec, économie circulaire, don, échange, marketplace locale, Limoilou"
      />

      <PlatformPageHeader
        eyebrow="Québec · consommation responsable"
        title={
          <>
            Achetez moins neuf.
            <br />
            <span className="text-emerald-700">Gardez plus d&apos;argent.</span>
          </>
        }
        description={
          <>
            {CIRCULAI_BRAND} regroupe <strong>vente, don, échange et réparation</strong> au même endroit — un fil
            local, en français, pour la boucle québécoise.
          </>
        }
      >
        <Button asChild size="lg" className="platform-btn-primary rounded-xl">
          <Link to="#inscription">Inscription en 60 s</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-xl">
          <Link to="/marketplace">Voir le marché</Link>
        </Button>
      </PlatformPageHeader>

      <p className="text-sm text-amber-800/90 italic -mt-6">{TREASURE_HUNT.title}</p>
      <p className="text-sm text-muted-foreground flex items-center gap-2 -mt-4">
        <MapPin className="h-4 w-4 text-sky-600 shrink-0" aria-hidden />
        Limoilou, Québec et environs
      </p>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          L&apos;équation qui change votre rapport aux objets
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Pas de magie — une loupe simple pour voir ce qui circule vraiment dans votre quartier :
        </p>
        <div className="mt-6 platform-card-emerald rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <p className="font-mono text-xl sm:text-2xl text-emerald-800 tracking-wide">{DELTA_M.plain}</p>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">{DELTA_M.hint}</p>
          <div className="pt-4 border-t border-emerald-200/80">
            <p className="font-mono text-base sm:text-lg text-amber-900/90">{NOUVEAU_CHIC.plain}</p>
            <p className="mt-2 font-mono text-sm text-muted-foreground">{GOLDEN_BALANCE.plain}</p>
            <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">{GOLDEN_BALANCE.hint}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-violet-800/80">{SOLIDITE_COLLECTIVE.hint}</p>
        <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
          {[
            { k: "M_entrée", tone: "text-emerald-700", text: "Achat d'occasion, don reçu, échange, réparation" },
            { k: "M_sortie", tone: "text-sky-700", text: "Vous vendez, donnez, troquez, réparez pour autrui" },
            { k: "M_stock", tone: "text-amber-800", text: "Ce qui dort chez vous — l'empreinte à réduire" },
          ].map(({ k, tone, text }) => (
            <div key={k} className="platform-surface rounded-xl border border-border p-4">
              <p className={`font-semibold ${tone}`}>{k}</p>
              <p className="mt-1 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          Quand <strong className="text-emerald-700">ΔM est positif pour le quartier</strong>, l&apos;argent reste
          ici, les objets tournent, et vous consommez moins neuf sans culpabilité.
        </p>
      </section>

      <section className="platform-card-violet rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Dimanche prochain, concrètement</h2>
        <ul className="mt-5 space-y-4 text-muted-foreground">
          <li className="flex gap-3">
            <Package className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
            <span>
              Une <strong className="text-foreground">commode à 40 $</strong> au lieu de 400 $ — près de chez vous.
            </span>
          </li>
          <li className="flex gap-3">
            <Gift className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Un <strong className="text-foreground">don publié en 2 minutes</strong> — quelqu&apos;un passe,
              l&apos;objet ne dort plus dans l&apos;entrée.
            </span>
          </li>
          <li className="flex gap-3">
            <RefreshCw className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
            <span>
              Un <strong className="text-foreground">échange</strong> sans carte de crédit.
            </span>
          </li>
          <li className="flex gap-3">
            <Wrench className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Une <strong className="text-foreground">réparation listée</strong> avant d&apos;acheter neuf par défaut.
            </span>
          </li>
        </ul>
        <p className="mt-6 text-sm text-violet-800/80 italic">
          Moins de gaspillage, plus de sens, et de l&apos;argent pour ce qui compte vraiment.
        </p>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Simple. Vraiment.</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {SIMPLICITY.map(({ icon: Icon, title, text }) => (
            <div key={title} className="platform-surface rounded-xl border border-border p-5">
              <Icon className="h-7 w-7 text-emerald-600 mb-3" aria-hidden />
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="inscription" className="grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-800">Rejoignez la boucle</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Créez votre accès gratuit, parcourez les annonces, publiez avant votre prochain café.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/marketplace">
                Voir le marché
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/circulai">Décideurs & pilote municipal</Link>
            </Button>
          </div>
        </div>
        <QuickSignup60 />
      </section>

      <footer className="text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
        <p className="flex items-center gap-2">
          <Recycle className="h-3.5 w-3.5" aria-hidden />
          {CIRCULAI_BRAND} · ΔM positif, un objet à la fois
        </p>
        <CodexMetaphoreLink />
      </footer>
    </div>
  );
}
