import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Leaf,
  MapPin,
  Sparkles,
  Globe2,
} from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import { Button } from "@/components/ui/button";
import { CIRCULAI_BRAND, SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import { CIRCULAI_EGOR_SPLIT } from "@/lib/circulaiEgorBrand";
import {
  resolveCirculaiAppUrl,
  saveWorldChoice,
  WORLD_CONCRETE,
  WORLD_FANTASY,
} from "@/lib/worldGateway";

export default function WorldGateway() {
  const navigate = useNavigate();
  const circulaiUrl = resolveCirculaiAppUrl();

  const enterConcrete = () => {
    saveWorldChoice(WORLD_CONCRETE);
    window.location.assign(circulaiUrl);
  };

  const enterFantasy = () => {
    saveWorldChoice(WORLD_FANTASY);
    navigate("/world");
  };

  const enterCirculaiHub = () => {
    saveWorldChoice(WORLD_CONCRETE);
    navigate("/circulai");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <SEOMeta
        title={`${SITE_NAME} — choisir son monde`}
        description="CirculAI (concret) ou Egor69 (exploration) : deux interfaces, un même projet québécois."
        keywords="circulai, egor69, économie circulaire, verse 3d, pilote québec"
        canonicalUrl={`${SITE_ORIGIN}/entrer`}
      />

      <div className="relative min-h-screen flex flex-col">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(139,92,246,0.15),transparent)]"
          aria-hidden
        />

        <header className="relative z-10 px-4 sm:px-6 py-8 sm:py-10 text-center max-w-2xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">
            Un lien · deux mondes
          </p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold leading-tight">
            Dans quel monde veux-tu entrer ?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/60 leading-relaxed">
            Le même projet, deux interfaces. Le monde <strong className="text-emerald-300/90">concret</strong>{" "}
            sert le territoire et le pilote. Le monde{" "}
            <strong className="text-violet-300/90">fantaisiste</strong> sert l&apos;exploration et la culture.
          </p>
        </header>

        <main className="relative z-10 flex-1 px-4 sm:px-6 pb-12 max-w-5xl mx-auto w-full grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Monde concret */}
          <article className="group flex flex-col rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/80 to-zinc-950/90 p-6 sm:p-8 shadow-xl shadow-emerald-950/40">
            <div className="flex items-center gap-2 text-emerald-400/90">
              <Leaf className="h-5 w-5" aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-widest">Monde concret</span>
            </div>
            <h2 className="mt-4 text-2xl sm:text-3xl font-serif text-white leading-snug">
              Moins de chaos.
              <br />
              <span className="text-emerald-200/90">Plus de clarté.</span>
            </h2>
            <p className="mt-4 text-sm text-white/70 leading-relaxed flex-1">
              {CIRCULAI_EGOR_SPLIT.circulai.pitch}
            </p>
            <p className="mt-3 text-xs text-emerald-200/60 flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden />
              Pilote 90 jours · un site · trois preuves · OBNL référent
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                type="button"
                size="lg"
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold min-h-[48px]"
                onClick={enterConcrete}
              >
                Entrer dans {CIRCULAI_BRAND}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full rounded-xl border-emerald-500/25 text-emerald-100/80 hover:bg-emerald-500/10"
                onClick={enterCirculaiHub}
              >
                <Building2 className="mr-2 h-3.5 w-3.5" aria-hidden />
                Kit & pilote sur ce site (Vercel)
              </Button>
            </div>
            <p className="mt-3 text-[10px] text-white/35 leading-snug">
              Bouton principal → interface CirculAI (style Base44). Second bouton → documents décideurs
              sur {SITE_ORIGIN}.
            </p>
          </article>

          {/* Monde fantaisiste */}
          <article className="group flex flex-col rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-950/70 to-zinc-950/90 p-6 sm:p-8 shadow-xl shadow-violet-950/40">
            <div className="flex items-center gap-2 text-violet-300/90">
              <Sparkles className="h-5 w-5" aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-widest">Monde fantaisiste</span>
            </div>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white leading-snug">
              {SITE_NAME}
            </h2>
            <p className="mt-4 text-sm text-white/70 leading-relaxed flex-1">
              {CIRCULAI_EGOR_SPLIT.egor.pitch}
            </p>
            <p className="mt-3 text-xs text-violet-200/55">
              Verse 3D · encyclopédie · codex · quêtes — hors dossier municipal.
            </p>
            <Button
              type="button"
              size="lg"
              className="mt-6 w-full rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold min-h-[48px]"
              onClick={enterFantasy}
            >
              <Globe2 className="mr-2 h-4 w-4" aria-hidden />
              Explorer l&apos;univers
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
            <p className="mt-3 text-[10px] text-white/35 leading-snug">
              Pour le maire et les OBNL : rester dans le monde concret.
            </p>
          </article>
        </main>

        <footer className="relative z-10 px-4 pb-8 text-center text-[11px] text-white/35 max-w-lg mx-auto leading-relaxed">
          Initiative en développement · pilote non démarré sur les indicateurs = baseline honnête.
          <br />
          <button
            type="button"
            className="mt-2 underline underline-offset-2 hover:text-white/55"
            onClick={() => navigate("/")}
          >
            Accueil classique du site
          </button>
        </footer>
      </div>
    </div>
  );
}
