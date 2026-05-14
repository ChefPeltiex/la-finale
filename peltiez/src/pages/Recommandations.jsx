import RecommandationEngine from "@/components/RecommandationEngine";
import { Sparkles, Zap, Brain, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FONCTIONNALITES = [
  { icon: Brain, title: "Analyse sémantique", desc: "Comprend votre besoin en langage naturel, même vague ou imprécis" },
  { icon: Zap, title: "Scoring temps réel", desc: "Chaque annonce reçoit un score de match de 0 à 100 basé sur votre demande" },
  { icon: Sparkles, title: "Favorise dons & échanges", desc: "Les annonces gratuites et les échanges sont valorisés davantage" },
  { icon: ArrowRight, title: "Conseils personnalisés", desc: "3 conseils sur-mesure pour trouver plus vite ce que vous cherchez" },
];

export default function Recommandations() {
  return (
    <div className="pb-20 space-y-10 max-w-4xl mx-auto px-4 pt-8">

      {/* Hero */}
      <div className="rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-border relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.07), rgba(16,185,129,0.04))" }}>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-500 text-xs font-bold mb-4">
            <Sparkles className="h-3.5 w-3.5" /> MOTEUR DE RECOMMANDATION IA · CIRCULIA
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">
            Trouvez exactement{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-emerald-500">
              ce qu'il vous faut
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-3">
            Décrivez votre besoin en langage naturel. Circulia analyse{" "}
            <strong className="text-foreground">toutes les annonces actives</strong> et vous
            retourne les meilleures correspondances avec un score de pertinence.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FONCTIONNALITES.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-card rounded-2xl border border-border p-4 text-center space-y-2">
              <Icon className="h-5 w-5 text-violet-500 mx-auto" />
              <p className="font-bold text-foreground text-xs">{f.title}</p>
              <p className="text-muted-foreground text-[10px] leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Engine */}
      <RecommandationEngine />

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
          <p className="font-bold text-foreground">Vous avez un objet à offrir ?</p>
          <p className="text-sm text-muted-foreground">Publiez-le et il apparaîtra dans les recommandations d'autres utilisateurs.</p>
          <Link to="/publier" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
            Publier une annonce <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
          <p className="font-bold text-foreground">Optimiser votre échange ?</p>
          <p className="text-sm text-muted-foreground">Utilisez l'IA de négociation pour maximiser vos chances de conclure rapidement.</p>
          <Link to="/negociation-ia" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-foreground text-sm font-bold hover:bg-muted transition-colors">
            Négociation IA <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}