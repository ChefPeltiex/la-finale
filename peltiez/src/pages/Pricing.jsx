import { useEffect, useMemo, useState } from "react";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Globe2, Store, Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { createStripeCheckout } from "@/payments/checkout";
import { toast } from "sonner";
import { hasSingularityClauseAccepted } from "@/lib/singulariteClause";
import SingularityClauseDialog from "@/components/SingularityClauseDialog";

const REALM_CARD_BASE =
  "relative flex flex-col rounded-3xl border p-7 overflow-hidden bg-gradient-to-b from-zinc-950/95 via-zinc-950/90 to-black/90 backdrop-blur-md shadow-[0_0_48px_rgba(255,215,0,0.05)]";

const PLANS = [
  {
    key: "netherealm",
    name: "Pass Netherealm",
    price: "44 $",
    period: "/ mois",
    icon: Globe2,
    tagline: "Ancre ton exploration du vivant.",
    features: [
      "Accès Atlas Vivant",
      "10 scans radar / mois",
      "Matériaux de base Unreal (starter)",
    ],
    mode: "subscription",
    envPriceKey: "VITE_STRIPE_PRICE_NETHERREALM",
    featured: false,
    accent: "border-amber-500/30 ring-1 ring-amber-500/10",
    iconWrap: "bg-amber-500/15 text-amber-200 border border-amber-500/35",
  },
  {
    key: "etherealm",
    name: "Pass Etherealm",
    price: "144 $",
    period: "/ mois",
    icon: Store,
    tagline: "Marché et entraide, sans promesse magique.",
    features: [
      "Marketplace complet",
      "Revente de props (selon règles et disponibilité)",
      "« Milice » : signalement / modération communautaire (non professionnelle)",
    ],
    mode: "subscription",
    envPriceKey: "VITE_STRIPE_PRICE_ETHEREALM",
    featured: true,
    accent: "border-amber-400/45 ring-2 ring-amber-400/18 shadow-[0_0_56px_rgba(251,191,36,0.1)]",
    iconWrap: "bg-amber-400/18 text-amber-100 border border-amber-400/40",
  },
  {
    key: "outworld",
    name: "Pass Outworld",
    price: "1 444 $",
    period: "",
    icon: Crown,
    tagline: "Souveraineté totale — palier VIP produit.",
    features: [
      "Accès et options les plus étendus (selon périmètre produit)",
      "Traitement prioritaire des demandes",
      "Accompagnement sur les évolutions majeures, sous réserve des limites techniques",
    ],
    mode: "payment",
    envPriceKey: "VITE_STRIPE_PRICE_OUTWORLD",
    featured: false,
    accent: "border-amber-500/40 ring-1 ring-amber-500/18",
    iconWrap: "bg-gradient-to-br from-amber-500/25 to-amber-900/40 text-amber-50 border border-amber-400/45",
    pulseWrap: true,
  },
];

const FAQ = [
  {
    q: "Puis-je annuler un abonnement mensuel ?",
    a: "Pour Netherealm et Etherealm (facturation récurrente), la gestion se fait via Stripe / ton espace client, selon les conditions du tableau de bord Stripe.",
  },
  {
    q: "Les paiements sont-ils sécurisés ?",
    a: "Le checkout est géré par Stripe ; nous ne stockons pas tes coordonnées bancaires.",
  },
  {
    q: "Que garantissent ces passes ?",
    a: "Les fonctions listées dépendent des versions du produit et de leur disponibilité ; les montants sont indicatifs côté copie jusqu’à confirmation dans Stripe.",
  },
  {
    q: "Pourquoi une fenêtre « Singularité » avant Outworld ?",
    a: "Le palier Outworld déclenche la lecture et l’acceptation de la clause Legal Sovereign (document HTML dans /legal/) et une Clé de Singularité locale ; ce n’est pas une signature électronique qualifiée. Ensuite seulement, redirection Stripe.",
  },
];

function useRealmPriceIds() {
  return useMemo(
    () => ({
      netherealm: import.meta.env.VITE_STRIPE_PRICE_NETHERREALM || "",
      etherealm: import.meta.env.VITE_STRIPE_PRICE_ETHEREALM || "",
      outworld: import.meta.env.VITE_STRIPE_PRICE_OUTWORLD || "",
      outworldAnnual: import.meta.env.VITE_STRIPE_PRICE_OUTWORLD_ANNUAL || "",
    }),
    [],
  );
}

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [clauseDialogOpen, setClauseDialogOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(null);
  const [clauseSealed, setClauseSealed] = useState(() => hasSingularityClauseAccepted());
  const priceIds = useRealmPriceIds();
  const checkoutReady = !!import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT;
  const hasOutworldAnnual = !!priceIds.outworldAnnual;

  useEffect(() => {
    const sync = () => setClauseSealed(hasSingularityClauseAccepted());
    window.addEventListener("igor-singularite-clause-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("igor-singularite-clause-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      toast.success("Merci — si Stripe a confirmé, ton pass sera actif selon le produit.");
    }
    if (params.get("canceled") === "1") {
      toast.message("Checkout annulé. Tu peux réessayer quand tu veux.");
    }
    ["success", "canceled", "session_id"].forEach((k) => params.delete(k));
    const q = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${q ? `?${q}` : ""}`);
  }, []);

  const handleCheckout = async (priceId, mode, loadKey) => {
    if (!priceId) return;

    setLoading(loadKey);
    const res = await createStripeCheckout({ priceId, mode });
    setLoading(null);
    if (res?.url) {
      window.location.href = res.url;
      return;
    }
    toast.error(res?.error || "Checkout indisponible. Vérifie ton endpoint Stripe.", { icon: "⚠️" });
  };

  /** Pass Outworld : clause Singularité + Clé obligatoires avant Stripe. */
  const requestCheckout = (priceId, mode, loadKey) => {
    if (!priceId) return;
    const needsClause =
      (loadKey === "outworld" || loadKey === "outworld-annual") && !hasSingularityClauseAccepted();
    if (needsClause) {
      setPendingCheckout({ priceId, mode, loadKey });
      setClauseDialogOpen(true);
      return;
    }
    handleCheckout(priceId, mode, loadKey);
  };

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Tarifs — Pass Netherealm, Etherealm, Outworld",
    description: "Passes realm, checkout Stripe. Prix indicatifs, fonctions soumises à disponibilité.",
    url: `${SITE_ORIGIN}/pricing`,
  };

  return (
    <>
      <SingularityClauseDialog
        open={clauseDialogOpen}
        onOpenChange={setClauseDialogOpen}
        onConfirmed={() => {
          const p = pendingCheckout;
          setPendingCheckout(null);
          if (p?.priceId) handleCheckout(p.priceId, p.mode, p.loadKey);
        }}
      />
    <div
      className="max-w-6xl mx-auto pb-20 space-y-16 rounded-[2rem] px-4 sm:px-6"
      style={{
        background:
          "radial-gradient(1000px 500px at 10% 0%, rgba(212,175,55,0.08), transparent 55%), radial-gradient(800px 420px at 90% 10%, rgba(15,23,42,0.85), transparent 50%), hsl(222 47% 4%)",
      }}
    >
      <SEOMeta
        title="Tarifs — Netherealm, Etherealm, Outworld"
        description="Passes mensuels et Outworld. Checkout Stripe hébergé. Prix indicatifs — pas de promesse de gain."
        keywords="igor, tarifs, stripe, netherealm, etherealm, outworld, pass"
        canonicalUrl={`${SITE_ORIGIN}/pricing`}
        schemaData={pricingSchema}
      />

      <div className="text-center pt-8 px-1 space-y-3">
        <Badge className="bg-amber-500/12 text-amber-200 border border-amber-500/30 font-display tracking-wide">
          Ω Portails & passes
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-zinc-50 mb-2">
          Trois seuils.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
            Un même serment de clarté.
          </span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Choisis le pass aligné avec ton rythme : exploration, place de marché, ou souveraineté Outworld.
        </p>
        <p className="text-zinc-500 text-sm max-w-3xl mx-auto leading-relaxed">
          Prix indicatifs ; les fonctions listées sont soumises à disponibilité et aux évolutions du produit ; aucune promesse de gain
          financier ou autre.
        </p>
        {!checkoutReady && (
          <p className="text-xs text-amber-300/95 mt-3 font-semibold">
            Paiement désactivé tant que `VITE_STRIPE_CHECKOUT_ENDPOINT` n’est pas configuré.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const priceId = priceIds[plan.key];
          const canPay = checkoutReady && !!priceId;

          const inner = (
            <div className={cn(REALM_CARD_BASE, plan.accent, plan.featured && "lg:-mt-1 lg:mb-1")}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold font-display px-4 py-1.5 rounded-full shadow-lg z-10">
                  Souvent choisi
                </div>
              )}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.06),transparent_55%)]" />

              <div className="relative flex items-center gap-3 mb-4 mt-1">
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", plan.iconWrap)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left min-w-0">
                  <h2 className="font-display font-bold text-zinc-50 text-lg leading-tight">{plan.name}</h2>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-snug">{plan.tagline}</p>
                </div>
              </div>

              <div className="relative mb-1">
                <span className="font-display text-4xl font-bold text-amber-100">{plan.price}</span>
                {plan.period ? (
                  <span className="text-zinc-500 text-sm ml-1">{plan.period}</span>
                ) : (
                  <span className="text-zinc-500 text-sm ml-2">— paiement unique</span>
                )}
              </div>

              {plan.key === "outworld" && !hasOutworldAnnual && (
                <p className="relative text-xs text-zinc-500 mb-4 leading-relaxed">
                  Ou formule annuelle / à vie : contacte-nous ou ajoute{" "}
                  <code className="text-amber-200/90 text-[10px]">VITE_STRIPE_PRICE_OUTWORLD_ANNUAL</code> pour un second bouton.
                </p>
              )}

              {plan.key === "outworld" && hasOutworldAnnual && (
                <p className="relative text-xs text-zinc-500 mb-4 leading-relaxed">Formule annuelle disponible (deuxième bouton).</p>
              )}

              <ul className="relative space-y-2.5 mb-6 flex-1 text-left">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <CheckCircle className="h-4 w-4 text-amber-500/90 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              {plan.key === "outworld" && (
                <div className="relative mb-4 rounded-xl border border-amber-500/25 bg-amber-950/20 px-3 py-2.5 text-left">
                  {clauseSealed ? (
                    <p className="text-[11px] text-emerald-300/95 leading-snug">
                      <span className="font-semibold">Clause Singularité</span> — acceptation enregistrée sur cet appareil.
                      <Link
                        to="/legal/singularite"
                        className="block mt-1 text-amber-400/90 hover:text-amber-300 underline underline-offset-2"
                      >
                        Relire le texte intégral
                      </Link>
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-200/90 leading-snug">
                      Avant Stripe :{" "}
                      <Link to="/legal/singularite" className="underline font-medium text-amber-300">
                        lire la clause Legal Sovereign
                      </Link>{" "}
                      et la sceller dans le dialogue (Clé de Singularité).
                    </p>
                  )}
                </div>
              )}

              <div className="relative mt-auto space-y-2">
                {!priceId && (
                  <p className="text-[11px] text-amber-400/90 mb-1">
                    Définis {plan.envPriceKey} (+ allowlist serveur) pour activer ce portail.
                  </p>
                )}
                <Button
                  onClick={() => requestCheckout(priceId, plan.mode, plan.key)}
                  disabled={!canPay || loading === plan.key}
                  size="lg"
                  className={cn(
                    "w-full rounded-2xl font-display font-bold tracking-tight border border-amber-500/35",
                    plan.featured &&
                      "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500",
                    plan.key === "outworld" &&
                      "bg-gradient-to-r from-amber-600 to-amber-900 text-amber-50 hover:from-amber-500 hover:to-amber-800",
                    !plan.featured &&
                      plan.key !== "outworld" &&
                      "bg-zinc-900/80 text-amber-100 hover:bg-zinc-800/90",
                  )}
                >
                  {loading === plan.key ? "Ouverture du portail…" : "Activer mon Portail"}
                </Button>
                {plan.key === "outworld" && hasOutworldAnnual && (
                  <Button
                    onClick={() =>
                      requestCheckout(priceIds.outworldAnnual, "subscription", "outworld-annual")
                    }
                    disabled={!checkoutReady || loading === "outworld-annual"}
                    size="lg"
                    variant="outline"
                    className="w-full rounded-2xl font-display font-semibold border-amber-500/40 text-amber-100 bg-zinc-950/50 hover:bg-amber-500/10"
                  >
                    {loading === "outworld-annual" ? "Ouverture…" : "Formule annuelle (Stripe)"}
                  </Button>
                )}
              </div>
            </div>
          );

          if (plan.pulseWrap) {
            return (
              <div
                key={plan.key}
                className="rounded-3xl p-px animate-pulse bg-gradient-to-br from-amber-400/55 via-amber-700/35 to-amber-500/50"
              >
                {inner}
              </div>
            );
          }

          return (
            <div key={plan.key} className="rounded-3xl p-px bg-gradient-to-b from-amber-500/30 to-amber-950/25">
              {inner}
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-zinc-50 text-center mb-7">Questions fréquentes</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {FAQ.map(({ q, a }) => (
            <div
              key={q}
              className="rounded-2xl border border-amber-500/20 bg-zinc-950/75 backdrop-blur-sm p-5 text-left shadow-[inset_0_1px_0_rgba(255,215,0,0.06)]"
            >
              <p className="font-semibold text-zinc-100 mb-2 font-display">{q}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-amber-500/25 bg-gradient-to-br from-zinc-950 via-zinc-950/90 to-amber-950/25 p-10 text-center shadow-[0_0_60px_rgba(245,158,11,0.08)]">
        <Sparkles className="h-10 w-10 text-amber-400 mx-auto mb-4 opacity-90" />
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-50 mb-3">Pas prêt à sceller un pass ?</h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-7 text-sm sm:text-base">
          Explore le sanctuaire et reviens quand le moment est le tien.
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-2xl font-display font-bold bg-amber-500 text-black hover:bg-amber-400 border-0"
        >
          <Link to="/">Retour à l’accueil</Link>
        </Button>
      </div>
    </div>
    </>
  );
}
