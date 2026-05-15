import { Link } from "react-router-dom";
import { PlusCircle, ShoppingBag, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <section id="accueil-hero-cards" className="scroll-mt-28 lg:scroll-mt-8 max-w-6xl mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none sovereign-rainbow-subtle"
                aria-hidden
              />
              <Icon className={cn("h-8 w-8 mb-3", card.iconColor)} />
              <h3 className="font-display font-bold text-lg text-white">{card.title}</h3>
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
