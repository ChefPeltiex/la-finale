import { useNavigate } from "react-router-dom";
import { Zap, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Maintenance() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, hsl(220,40%,5%) 0%, hsl(240,35%,8%) 40%, hsl(158,40%,8%) 100%)" }}>
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated Icon */}
        <div className="inline-block">
          <div className="relative h-24 w-24 mx-auto">
            <Zap className="h-24 w-24 text-amber-400 animate-bounce" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 animate-ping" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
            Maintenance en cours
          </h1>
          <p className="text-xl text-white/60 leading-relaxed">
            CirculAI Hub se met à jour pour vous offrir une expérience encore meilleure
          </p>
        </div>

        {/* Status Items */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
          {[
            { icon: Zap, text: "Optimisation de la plateforme", status: "en cours" },
            { icon: CheckCircle, text: "Déploiement des nouvelles fonctionnalités", status: "en cours" },
            { icon: CheckCircle, text: "Tests de sécurité et performance", status: "en cours" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <Icon className={`h-5 w-5 flex-shrink-0 ${item.status === "en cours" ? "text-amber-400 animate-pulse" : "text-emerald-400"}`} />
                <span className="text-sm font-medium flex-1 text-left">{item.text}</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/60">
                  {item.status === "en cours" ? "⏳ En cours" : "✓ Complété"}
                </span>
              </div>
            );
          })}
        </div>

        {/* ETA */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary font-semibold">
            <Clock className="h-5 w-5" />
            Temps estimé
          </div>
          <p className="text-white text-lg font-bold">15-30 minutes</p>
          <p className="text-sm text-white/60">Nous nous excusons pour le désagrément</p>
        </div>

        {/* Message */}
        <div className="space-y-4 text-white/70">
          <p className="text-sm leading-relaxed">
            Merci pour votre patience. CirculAI Hub se prépare pour des changements majeurs qui amélioreront votre expérience.
            <br />
            <strong className="text-white">Revenez bientôt!</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="rounded-xl gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4" /> Retourner à l'accueil
          </Button>
          <Button
            onClick={() => location.reload()}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 font-semibold"
          >
            🔄 Actualiser la page
          </Button>
        </div>

        {/* Footer message */}
        <p className="text-xs text-white/40 pt-4">
          CirculAI Hub © 2026 — Propriété Intellectuelle Exclusive Protégée
        </p>
      </div>
    </div>
  );
}