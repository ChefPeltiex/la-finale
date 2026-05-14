import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  CheckCircle, Sparkles, Globe, Shield, Award, Zap, ArrowLeft,
  Star, Crown, Heart, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "gratuit",
    name: "Citoyen Libre",
    price: "0€",
    period: "/mois",
    badge: null,
    icon: Heart,
    color: "border-border",
    highlight: false,
    description: "Pour commencer à explorer et contribuer à la communauté.",
    features: [
      "3 annonces par mois",
      "Accès au marketplace",
      "Forum communautaire (lecture)",
      "Actualités de base",
    ],
    cta: "Commencer gratuitement",
    href: "/publier",
    price_id: null,
  },
  {
    id: "pro",
    name: "Pro",
    price: "5€",
    period: "/mois",
    badge: "🔥 Populaire",
    icon: Star,
    color: "border-primary ring-2 ring-primary/20",
    highlight: true,
    description: "L'accès complet à la plateforme et au contenu indépendant.",
    features: [
      "Annonces illimitées",
      "Actualités premium non censurées",
      "Arts & Culture complet",
      "Forum souverain actif",
      "Badge Citoyen Engagé",
      "Import CSV groupé",
      "Priorité dans les recherches",
    ],
    cta: "Rejoindre le mouvement",
    price_id: "price_1TUYO0DKbUATy2hWQ2Qbox0T",
    plan_name: "Pro",
  },
  {
    id: "premium",
    name: "Premium",
    price: "15€",
    period: "/mois",
    badge: "👑 Élite",
    icon: Crown,
    color: "border-amber-400 ring-2 ring-amber-200",
    highlight: false,
    description: "Pour ceux qui veulent amplifier le mouvement à l'échelle mondiale.",
    features: [
      "Tout Pro",
      "Profil mis en avant",
      "Badge Or Ambassadeur",
      "Accès aux événements culturels",
      "Lien d'affiliation (20% commission)",
      "Contenu exclusif des artistes",
      "Tableau de bord impact personnel",
    ],
    cta: "Devenir Premium",
    price_id: "price_1TUYO0DKbUATy2hW3uW64X6q",
    plan_name: "Premium",
  },
];

const GUARANTEES = [
  { icon: Shield,  text: "Paiement 100% sécurisé (Stripe)" },
  { icon: Zap,     text: "Annulation à tout moment" },
  { icon: Globe,   text: "L'argent reste dans la communauté" },
  { icon: Award,   text: "Satisfait ou remboursé 30 jours" },
];

export default function Abonnement() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [signupCount] = useState(9);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get("success");
  const plan = urlParams.get("plan");
  const cancelled = urlParams.get("cancelled");

  const handleCheckout = async (planItem) => {
    if (!planItem.price_id) return;

    if (window.self !== window.top) {
      alert("Le paiement fonctionne uniquement depuis l'application publiée. Ouvrez igor.com dans votre navigateur.");
      return;
    }

    if (!user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }

    setLoadingPlan(planItem.id);
    const res = await base44.functions.invoke("createCheckout", {
      price_id: planItem.price_id,
      plan_name: planItem.plan_name,
    });
    setLoadingPlan(null);
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
  };

  if (success) return (
    <div className="max-w-lg mx-auto text-center py-20">
      <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-emerald-600" />
      </div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-3">Bienvenue dans le mouvement ! 🎉</h1>
      <p className="text-muted-foreground mb-2">Votre abonnement <b>{plan}</b> est actif.</p>
      <p className="text-sm text-muted-foreground mb-8">Vous faites maintenant partie de la communauté souveraine mondiale. Chaque euro contribue à la liberté collective.</p>
      <Button asChild className="rounded-xl">
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );

  return (
    <div className="pb-20 space-y-12 max-w-5xl mx-auto">

      <Button variant="ghost" asChild className="rounded-xl -ml-2">
        <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" /> Retour</Link>
      </Button>

      {cancelled && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center text-sm text-amber-700">
          ⚠️ Paiement annulé. Aucun montant n'a été débité. Choisissez un plan quand vous êtes prêt.
        </div>
      )}

      {/* Hero */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-bold">
          ⚡ Les 10 premiers marquent l'histoire · {signupCount} places restantes
        </div>
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">💰 Souveraineté économique</Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Votre argent.<br /><span className="text-primary">Votre communauté.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Chaque abonnement finance du contenu indépendant, des artistes locaux, et une économie circulaire qui résiste au système. Pas de publicités. Pas d'actionnaires. Juste la communauté.
        </p>
      </section>

      {/* Plans */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <div key={plan.id} className={cn(
              "bg-card rounded-2xl border p-6 flex flex-col relative transition-all hover:shadow-lg",
              plan.color, plan.highlight && "shadow-md"
            )}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center mb-4",
                plan.highlight ? "bg-primary/10" : "bg-muted"
              )}>
                <Icon className={cn("h-6 w-6", plan.highlight ? "text-primary" : "text-muted-foreground")} />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-1">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{plan.description}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.price_id ? (
                <Button
                  onClick={() => handleCheckout(plan)}
                  disabled={loadingPlan === plan.id}
                  className={cn("w-full rounded-xl font-bold", plan.highlight ? "" : "variant-outline")}
                  variant={plan.highlight ? "default" : plan.id === "premium" ? "outline" : "outline"}
                >
                  {loadingPlan === plan.id ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Redirection…</>
                  ) : plan.cta}
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full rounded-xl font-bold">
                  <Link to={plan.href}>{plan.cta}</Link>
                </Button>
              )}
            </div>
          );
        })}
      </section>

      {/* Garanties */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <p className="text-center text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-5">Nos garanties</p>
        <div className="flex flex-wrap justify-center gap-6">
          {GUARANTEES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-foreground">
              <Icon className="h-4 w-4 text-primary" /> {text}
            </div>
          ))}
        </div>
      </section>

      {/* Engagement */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-center">
        <Sparkles className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-white mb-3">
          L'abonnement le plus éthique du web.
        </h2>
        <p className="text-white/60 max-w-xl mx-auto text-base leading-relaxed">
          70% des revenus d'abonnement vont directement aux créateurs de contenu, artistes et artisans de la plateforme. 
          30% financent l'infrastructure technique. <b className="text-emerald-400">Zéro actionnaire externe.</b>
        </p>
      </section>
    </div>
  );
}