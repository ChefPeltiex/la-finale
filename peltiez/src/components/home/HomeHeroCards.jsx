import { Link } from "react-router-dom";
import { PlusCircle, ShoppingBag, BookOpen, Sparkles, ArrowRight, Crown, Globe2, Building2, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CIRCULAI_BRAND, SITE_NAME } from "@/lib/site";

const CARDS = [
  {
    title: "Publier",
    desc: "Offrir, vendre ou proposer un échange en quelques minutes.",
    to: "/publier",
    icon: PlusCircle,
    accent: "from-[#FFD700]/20 to-[#D4AF37]/5 border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]",
    iconColor: "text-[#FFD700]",
  },
  {
    title: "Boutique",
    desc: "PDF, Codex et kits numériques — achats uniques ou gratuits.",
    to: "/boutique",
    icon: Store,
    accent: "from-emerald-500/20 to-transparent border-emerald-500/45 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    iconColor: "text-emerald-400",
  },
  {
    title: "Marketplace",
    desc: "Parcourir dons, trocs, réparations et ventes locales.",
    to: "/marketplace",
    icon: ShoppingBag,
    accent: "from-[#39FF14]/15 to-transparent border-[#39FF14]/40 hover:shadow-[0_0_20px_rgba(57,255,20,0.12)]",
    iconColor: "text-[#39FF14]",
  },
  {
    title: "Atlas",
    desc: "Fiches vivantes : savoirs, faune, flore, encyclopédies.",
    to: "/atlas",
    icon: BookOpen,
    accent: "from-[#BF00FF]/15 to-transparent border-[#8A2BE2]/40 hover:shadow-[0_0_20px_rgba(191,0,255,0.12)]",
    iconColor: "text-[#BF00FF]",
  },
  {
    title: "Verse 3D",
    desc: "Voyage cinéma · anneaux en brume indigo — mood Planet Earth II, sans copier la bande-son.",
    to: "/world",
    icon: Sparkles,
    accent: "from-[#FF1744]/10 to-transparent border-[#FF1744]/35 hover:shadow-[0_0_20px_rgba(255,23,68,0.1)]",
    iconColor: "text-[#FF1744]",
  },
];

export default function HomeHeroCards() {
  return (
    <section id="accueil-hero-cards" className="scroll-mt-28 lg:scroll-mt-8 max-w-6xl mx-auto px-4 lg:px-8 space-y-8">
      <CirculAIHeroBandContent />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-zinc-950/80 p-5 transition-all duration-300",
                "hover:-translate-y-0.5",
                card.accent
              )}
            >
              <CardHoverShimmer />
              <Icon className={cn("h-8 w-8 mb-3", card.iconColor)} />
              <h2 className="font-display font-bold text-lg text-white">{card.title}</h2>
              <p className="text-xs text-white/55 mt-1 leading-relaxed">{card.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#FFD700]/90 group-hover:text-[#FFD700]">
                Ouvrir <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function CirculAIHeroBandContent() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-emerald-500/30 px-6 py-10 sm:px-10 sm:py-12 text-center"
      style={{
        background:
          "radial-gradient(900px 320px at 50% 0%, rgba(16,185,129,0.22), transparent 60%), linear-gradient(135deg, rgba(5,10,25,0.96), rgba(5,20,12,0.92))",
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-400/90 mb-3">
        Intelligence circulaire · Québec
      </p>
      <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight">
        <span className="bg-gradient-to-r from-emerald-300 via-[#FFD700] to-cyan-300 bg-clip-text text-transparent">
          {CIRCULAI_BRAND}
        </span>
      </h1>
      <p className="mt-3 text-base sm:text-lg text-white/70 font-semibold">
        <span className="text-emerald-200/95">{CIRCULAI_BRAND}</span> — territoire & pilote mesuré ·{" "}
        <span className="text-amber-200/95">{SITE_NAME}</span> — jumeau numérique & divertissement (Verse, encyclopédie)
      </p>
      <p className="mt-2 text-sm text-white/50 max-w-xl mx-auto leading-relaxed">
        Rejoignez le hub pour agir tout de suite, ou entrez dans le Verse 3D pour explorer l&apos;univers complet.
      </p>
      <p className="mt-3 text-xs sm:text-sm text-emerald-200/85 max-w-lg mx-auto leading-relaxed font-medium italic">
        Manifeste · demain on circule mieux, aujourd&apos;hui on s&apos;ouvre l&apos;accès — avec amour du réel, sans
        promesse vide.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-4 max-w-2xl mx-auto">
        <Button
          asChild
          size="lg"
          className="w-full sm:flex-1 sm:min-w-0 rounded-2xl h-14 text-base font-black uppercase tracking-wide border-0 shadow-[0_0_40px_rgba(16,185,129,0.35)] text-white"
          style={{ background: "linear-gradient(135deg, hsl(158,65%,38%), hsl(160,55%,28%))" }}
        >
          <Link to="/boutique" className="inline-flex items-center justify-center gap-2">
            <Store className="h-5 w-5 shrink-0" aria-hidden />
            Boutique & offres
            <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="w-full sm:flex-1 sm:min-w-0 rounded-2xl h-14 text-base font-bold border-amber-500/40 text-amber-100 hover:bg-amber-500/10"
        >
          <Link to="/pricing" className="inline-flex items-center justify-center gap-2">
            <Crown className="h-5 w-5 shrink-0" aria-hidden />
            Passes Verse
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="w-full sm:flex-1 sm:min-w-0 rounded-2xl h-14 text-base font-bold border-2 border-violet-400/50 bg-violet-950/40 text-violet-100 hover:bg-violet-500/15 hover:border-violet-300/70"
        >
          <Link to="/world" className="inline-flex items-center justify-center gap-2">
            <Globe2 className="h-5 w-5 shrink-0" aria-hidden />
            Entrer dans l&apos;univers {SITE_NAME}
            <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
          </Link>
        </Button>
      </div>

      <p className="mt-4">
        <Link
          to="/entreprises"
          className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-300/90 hover:text-emerald-200 transition-colors"
        >
          <Building2 className="h-4 w-4" aria-hidden />
          Entreprises — déposez votre idée, on bâtit ensemble
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </p>
      <p className="mt-2 text-[11px] text-white/40 tracking-wide">
        egor69.ca — même plateforme, un seul compte
      </p>
    </div>
  );
}

function CardHoverShimmer() {
  return (
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none sovereign-rainbow-subtle"
      aria-hidden
    />
  );
}
