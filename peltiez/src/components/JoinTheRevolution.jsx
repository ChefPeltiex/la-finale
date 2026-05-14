import { useState, useEffect } from "react";
import { Users, Zap, Globe, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function JoinTheRevolution() {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    let isMounted = true;
    const maybeAuth = base44.auth?.isAuthenticated;
    if (typeof maybeAuth === "function") {
      maybeAuth().then(auth => {
        if (isMounted) setIsAuth(auth);
      }).catch(() => setIsAuth(false));
    }
    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuth) return null; // Hide for authenticated users

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-violet-900 p-12 sm:p-16 mb-20">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full animate-pulse"
          style={{ background: "radial-gradient(circle, hsla(158,80%,50%,1), transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full animate-pulse"
          style={{ background: "radial-gradient(circle, hsla(260,80%,60%,1), transparent 70%)", filter: "blur(70px)", animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-sm font-bold text-white/90">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          ✦ Réseau en croissance honnête · aucun chiffre inventé
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h2 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight">
            Rejoins<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300">l'humanité</span>
            <br />
            en mouvement.
          </h2>

          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Les premiers Piliers sculptent l’expérience : atlas, radar, quêtes, Ω.
            <br />
            <strong className="text-emerald-300">Si tu sens l’appel, tu es déjà dedans.</strong>
          </p>
        </div>

        {/* Key Messages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          {[
            { icon: Heart, text: "100% gratuit", subtext: "Aucun coût caché" },
            { icon: Zap, text: "Impact immédiat", subtext: "Ton 1er objet aujourd'hui" },
            { icon: Globe, text: "6 continents", subtext: "Le monde t'attend" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
              <item.icon className="h-5 w-5 text-emerald-300" />
              <p className="font-bold text-white text-sm">{item.text}</p>
              <p className="text-xs text-white/50">{item.subtext}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button
            onClick={() => base44.auth.redirectToLogin()}
            size="lg"
            className="rounded-2xl font-bold px-10 text-base border-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 shadow-2xl"
          >
            <Users className="mr-2 h-5 w-5" />
            Créer mon compte gratuitement
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
           variant="outline"
           size="lg"
           className="rounded-2xl font-bold text-white hover:bg-white/10 border-white/30"
           onClick={() => {
             if (typeof window !== 'undefined') {
               window.scrollTo({ top: 0, behavior: "smooth" });
             }
           }}
          >
            ← Revenir à l'intro
          </Button>
        </div>

        {/* Trust Message */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-white/50 text-xs leading-relaxed">
            🔒 TLS en prod · 📋 Conformité à cartographier · 💚 Zéro pub (objectif) · ♻️ Circularité
            <br />
            <strong className="text-white/70">Tes données te appartiennent. Toujours.</strong>
          </p>
        </div>

        {/* Principes (pas de vanity metrics inventées) */}
        <div className="space-y-3 pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest">Ce qui compte vraiment</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "Ω", label: "Flux transparents" },
              { value: "∞", label: "Atlas vivant" },
              { value: "⚡", label: "Radar discipliné" },
            ].map((stat, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="font-display text-2xl font-black text-emerald-300">{stat.value}</p>
                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Call */}
        <div className="pt-8 space-y-3">
          <p className="text-white text-lg font-bold">
            ✨ Le moment est venu. ✨
          </p>
          <p className="text-white/60 italic">
            Pas demain. Pas plus tard. <strong className="text-emerald-300">MAINTENANT.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}