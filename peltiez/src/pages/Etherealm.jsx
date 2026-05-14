import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, HeartHandshake, Sparkles, ArrowRight, Globe } from "lucide-react";
import { recordRealmVisit } from "@/lib/worldPersistence";
import ThreeRealmsNav from "@/components/ThreeRealmsNav";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN, SITE_TAGLINE } from "@/lib/site";

/**
 * Plan d’élévation : cadre narratif lumineux, aligné charte Egor69 (fiction bienveillante + actions réelles hors écran).
 */
export default function Etherealm() {
  const canvasRef = useRef(null);

  useEffect(() => {
    recordRealmVisit("etherealm");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const draw = () => {
      t += 0.004;
      const w = canvas.width;
      const h = canvas.height;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, `rgba(6, 45, 38, ${0.65 + Math.sin(t) * 0.05})`);
      g.addColorStop(0.5, `rgba(12, 42, 72, ${0.35 + Math.cos(t * 0.8) * 0.06})`);
      g.addColorStop(1, `rgba(40, 28, 8, ${0.55 + Math.sin(t * 1.2) * 0.05})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 48; i++) {
        const px = (w * (i * 0.6180339887)) % w;
        const py = (h * 0.15 + Math.sin(t * 1.4 + i * 0.31) * h * 0.35 + (i / 48) * h * 0.6) % h;
        const sz = 1 + (i % 5);
        ctx.fillStyle = `rgba(${180 + (i % 40)}, ${220 + (i % 35)}, ${140 + (i % 50)}, ${0.08 + (i % 7) * 0.015})`;
        ctx.fillRect(px, py, sz, sz * (2 + (i % 3)));
      }

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden relative bg-[#031016]">
      <SEOMeta
        title="Etherealm — plan d’élévation"
        description={`Cadre lumineux Egor69 : don circulaire, sobriété marketing, fiction bienveillante. ${SITE_TAGLINE}`}
        keywords="igor, etherealm, netherealm, outworld, économie circulaire, fiction responsable"
        canonicalUrl={`${SITE_ORIGIN}/etherealm`}
      />

      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-90" />

      <div
        className="fixed inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_50%_20%,rgba(250,230,180,0.07),transparent_55%)]"
        aria-hidden
      />

      <article className="relative z-10 max-w-3xl mx-auto px-4 pt-10 pb-28 space-y-10 text-white/90">
        <header className="text-center pt-6">
          <Badge className="mb-4 bg-emerald-950/80 text-emerald-100 border border-emerald-500/35">
            Plan lumineux · action et don
          </Badge>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mb-3 text-emerald-100 drop-shadow-[0_0_22px_rgba(52,211,153,0.35)]">
            Etherealm
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {SITE_TAGLINE}
            <span className="block mt-3 text-white/50">
              Ici le tempo monte vers la générosité mesurable : radar, marketplace, réparation — sans promesses creuses,
              sans métriques inventées. La magie reste au service du vivant réel.
            </span>
          </p>
        </header>

        <section className="rounded-2xl border border-emerald-500/25 bg-black/50 backdrop-blur-md p-6 sm:p-8">
          <h2 className="font-display text-xl sm:text-2xl text-emerald-50 mb-4 flex items-center gap-2">
            <Sun className="h-6 w-6 text-amber-300" />
            Trois respirations du même monde
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-6">
            <strong className="text-emerald-100/90">Etherealm</strong> porte l&apos;intention ;{" "}
            <strong className="text-violet-100/90">Netherealm</strong> pose le cadre neutre ;{" "}
            <strong className="text-fuchsia-100/90">Outworld</strong> dissipe la pression en fiction consentie.
            Aucun plan ne remplace les soins, les urgences ou les obligations légales — ils les respectent.
          </p>
          <ThreeRealmsNav currentSlug="etherealm" />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl text-white flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-rose-300" />
            Circuits réels (hors pixels)
          </h2>
          <ul className="text-sm text-white/55 space-y-2 list-disc pl-5">
            <li>
              <Link to="/marketplace" className="text-emerald-300/90 underline-offset-2 hover:underline">
                Marketplace
              </Link>{" "}
              — don, troc, réparation lorsque les flux sont branchés.
            </li>
            <li>
              <Link to="/vision" className="text-emerald-300/90 underline-offset-2 hover:underline">
                Vision
              </Link>{" "}
              — feuille de route lisible, sans chiffres marketing fictionnels.
            </li>
            <li>
              <Link to="/hub-souverain" className="text-emerald-300/90 underline-offset-2 hover:underline">
                Hub souverain
              </Link>{" "}
              — santé API et transparence technique.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-500/20 bg-amber-950/15 backdrop-blur-md p-6 sm:p-8">
          <h2 className="font-display text-xl text-amber-50 mb-3 flex items-center gap-2">
            <Globe className="h-6 w-6 text-amber-400" />
            Passerelles immersives
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-6">
            Le Verse WebGL reste un vestibule : les engagements réels passent par les écrans fonctionnels (profil,
            listings, paiements documentés).
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="rounded-xl font-bold bg-emerald-700 hover:bg-emerald-600 border-0">
              <Link to="/world">
                Ether-Verse 3D
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl border-white/25 text-white">
              <Link to="/world">Hub monde</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-xl text-white/65">
              <Link to="/">Accueil</Link>
            </Button>
          </div>
        </section>

        <div className="flex justify-center">
          <Sparkles className="h-8 w-8 text-emerald-400/50" aria-hidden />
        </div>
      </article>
    </div>
  );
}
