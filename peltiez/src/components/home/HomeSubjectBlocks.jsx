import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOME_POLE_CARDS, poleLabel } from "@/config/navPoles";
import useDisplayMode from "@/hooks/useDisplayMode";

function ctaTarget(to) {
  if (typeof to === "string") return to;
  return { pathname: to.pathname || "/", hash: to.hash };
}

export default function HomeSubjectBlocks() {
  const { simple } = useDisplayMode();

  return (
    <section
      id="accueil-poles"
      className="scroll-mt-28 lg:scroll-mt-8 max-w-6xl mx-auto px-4 lg:px-8"
      aria-labelledby="accueil-poles-title"
    >
      <div className="text-center mb-8">
        <h2
          id="accueil-poles-title"
          className="font-display text-2xl sm:text-3xl font-bold text-foreground"
        >
          {simple ? "Cinq portes, un seul voyage" : "Cinq pôles · blocs sujets"}
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          {simple
            ? "Choisis ton élan : échanger, explorer, agir, jouer ou l’univers Egor69."
            : "Chaque pôle regroupe des blocs — comme des constellations à déplier dans le menu."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HOME_POLE_CARDS.map(({ pole, tagline, ctas, verseHighlight }) => {
          const PoleIcon = pole.icon;
          return (
            <article
              key={pole.id}
              className={cn(
                "relative overflow-hidden rounded-2xl border bg-zinc-950/85 p-5 transition-all duration-300 hover:-translate-y-0.5",
                verseHighlight
                  ? "border-[#BF00FF]/45 hover:shadow-[0_0_28px_rgba(191,0,255,0.18)]"
                  : "border-[#D4AF37]/25 hover:border-[#D4AF37]/45 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <PoleIcon className={cn("h-5 w-5", pole.color)} />
                <h3 className="font-display font-bold text-white text-lg">
                  {poleLabel(pole, simple)}
                </h3>
              </div>
              <p className="text-xs text-white/55 leading-relaxed mb-4">{tagline}</p>

              {verseHighlight && (
                <Link
                  to="/world"
                  className="mb-4 flex items-center gap-2 rounded-xl border border-[#FFD700]/40 bg-[#FFD700]/10 px-3 py-2.5 text-sm font-semibold text-[#FFD700] hover:bg-[#FFD700]/15 transition-colors"
                >
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="flex-1 min-w-0">
                    Entrer dans le Verse
                    <span className="block text-[10px] font-normal text-[#FFD700]/70">
                      Vol cosmique · anneaux
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              )}

              <div className="flex flex-wrap gap-2">
                {ctas.map((cta) => (
                  <Link
                    key={`${pole.id}-${cta.blockId}`}
                    to={ctaTarget(cta.to)}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 hover:text-[#FFD700] hover:border-[#D4AF37]/40 transition-colors"
                  >
                    {cta.label}
                    <ArrowRight className="h-3 w-3 opacity-60" />
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

