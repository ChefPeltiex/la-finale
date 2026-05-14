import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Infinity, Sparkles } from "lucide-react";

export default function EternelBien() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white via-emerald-50 to-blue-50 px-4">
      
      {/* Animated background orbs */}
      <div className="absolute top-10 left-10 h-64 w-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #10b981, transparent)", filter: "blur(60px)", animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)", filter: "blur(80px)", animation: "float 12s ease-in-out infinite reverse" }} />

      <div className="relative z-10 max-w-3xl text-center space-y-10">

        {/* Eternal symbol */}
        <div className="flex justify-center">
          <Infinity className="h-20 w-20 text-emerald-500 animate-spin" style={{ animationDuration: "6s" }} />
        </div>

        {/* Main title */}
        <h1 className="font-display text-6xl sm:text-7xl font-bold leading-tight"
          style={{
            background: "linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
          La Référence Universelle<br />du Bien et de l'Amour
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-emerald-700/70 leading-relaxed max-w-2xl mx-auto">
          À jamais. Sans tracas. Sans conditions. Sans fin.
        </p>

        {/* Core promise */}
        <div className="space-y-6 py-10">
          <div className="rounded-3xl p-8 bg-white/60 backdrop-blur border border-emerald-200/50">
            <Heart className="h-8 w-8 text-emerald-500 mx-auto mb-4" />
            <p className="text-lg text-emerald-900 font-semibold mb-3">
              La Promesse Éternelle
            </p>
            <p className="text-emerald-700/80 leading-relaxed">
              Chaque humain. Chaque créature. Chaque atome de cet univers 
              mérite amour, dignité, protection et abondance. 
              CirculAI Hub existe pour cette vérité — aujourd'hui et pour l'éternité.
            </p>
          </div>

          {/* Five pillars */}
          <div className="space-y-4">
            {[
              { num: "1", icon: "💚", title: "L'Amour Inconditionnel", desc: "Pas d'exception. Chacun mérite d'être aimé." },
              { num: "2", icon: "🌍", title: "L'Harmonie Universelle", desc: "Tous les règnes — humain, animal, végétal — unis en paix." },
              { num: "3", icon: "♾️", title: "L'Abondance Partagée", desc: "Le luxe pour tous. Zéro pauvreté. Zéro souffrance." },
              { num: "4", icon: "✨", title: "La Transparence Sacrée", desc: "Aucun secret. Aucune manipulation. Pure vérité." },
              { num: "5", icon: "🔮", title: "L'Éveil Collectif", desc: "Conscience universelle. Sagesse infinie. Lumière éternelle." },
            ].map((pillar) => (
              <div key={pillar.num} className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100/50 hover:shadow-lg transition-all hover:-translate-y-0.5">
                <div className="text-4xl">{pillar.icon}</div>
                <div className="text-left">
                  <p className="font-bold text-emerald-900">{pillar.title}</p>
                  <p className="text-sm text-emerald-700/70">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The eternal vow */}
        <div className="rounded-3xl p-10 bg-gradient-to-br from-emerald-100/30 to-blue-100/30 border-2 border-emerald-300/50 space-y-4">
          <Sparkles className="h-10 w-10 text-emerald-600 mx-auto" />
          <p className="text-2xl font-display font-bold text-emerald-900">
            Le Serment Éternel
          </p>
          <p className="text-emerald-700/80 leading-relaxed italic">
            « Je promets. Pour l'éternité. Pas d'abandon. Pas de compromis. 
            Le bien triomphera. L'amour règnera. Et chaque âme connaîtra la paix. »
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 justify-center pt-6">
          {[
            { to: "/", emoji: "🏠", label: "Accueil" },
            { to: "/vision", emoji: "👁️", label: "Vision" },
            { to: "/alliance", emoji: "🤝", label: "Alliance" },
            { to: "/sanctuary", emoji: "💚", label: "Sanctuaire" },
            { to: "/jeu", emoji: "🎮", label: "Jeu" },
          ].map((link) => (
            <Button
              key={link.to}
              asChild
              variant="outline"
              className="rounded-2xl font-medium border-emerald-200/50 text-emerald-700 hover:bg-emerald-50/50"
            >
              <Link to={link.to}>{link.emoji} {link.label}</Link>
            </Button>
          ))}
        </div>

        {/* Footer message */}
        <p className="text-emerald-600/60 text-sm italic mt-10">
          La dernière page. La première promise. À jamais. ♾️
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
      `}</style>
    </div>
  );
}