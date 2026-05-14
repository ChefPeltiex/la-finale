import { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LaunchIntroWithDedication() {
  const [showOrigin, setShowOrigin] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowOrigin(true), 900);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-12 sm:p-16 text-center mb-20">
      {/* Aurora blobs */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsla(158,80%,50%,1), transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsla(260,80%,60%,1), transparent 70%)", filter: "blur(50px)" }} />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Main Message */}
        <div className="space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white/80 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            C'EST MAINTENANT · RÉEL · VIVANT
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-black text-white leading-tight">
            Egor69<br />
            <span className="text-emerald-300">prend forme.</span>
          </h1>

          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Une plateforme construite pour changer le monde.<br />
            <strong>Pas demain. Pas plus tard.</strong> AUJOURD'HUI.
          </p>
        </div>

        {/* Origin */}
        {showOrigin && (
          <div className="pt-8 border-t border-white/20 animate-fade-in-up">
            <p
              className="font-display text-xl sm:text-3xl font-black leading-tight"
              style={{
                background: "linear-gradient(90deg, #fbbf24 0%, #fde68a 35%, #10b981 70%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              DE MOI, PAR MOI, POUR MOI. DOMINIC PELLETIER.
            </p>
            <p className="text-white/60 text-sm mt-3">
              L’ego n’est pas une excuse. C’est une direction: soin, souveraineté, vitesse.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap gap-4 justify-center pt-6">
          <Button asChild size="lg" className="rounded-2xl font-bold px-10 text-base border-0 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
            <Link to="/publier">👑 Rejoindre l'empire <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-2xl font-bold text-white hover:bg-white/10 border-white/30">
            <Link to="/vision">✨ Découvrir la vision</Link>
          </Button>
        </div>

        {/* Final message */}
        <p className="text-white/40 text-xs italic pt-4">
          Egor69 respire la détermination. Point final.
        </p>
      </div>
    </div>
  );
}