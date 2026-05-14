import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap } from "lucide-react";

const PROBLEMS = [
  {
    title: "P vs NP",
    simple: "Est-ce que vérifier une réponse est aussi difficile que la trouver ? Si oui, notre Internet entier est foutu. Si non, les crypto-monnaies deviennent inutiles.",
    formula: "P = NP ⟺ ∀L ∈ NP : ∃ deterministic Turing machine M, c, k ∈ ℕ : ∀x ∈ {0,1}* : [x ∈ L ⟺ M(x) accepts in ≤ |x|^c steps]",
    prize: "1,000,000 $"
  },
  {
    title: "Riemann Hypothesis",
    simple: "Les nombres premiers sont dispersés de manière stupidement aléatoire. Riemann a dit qu'il y a une vraie raison derrière. Trouve-la.",
    formula: "∀s ∈ ℂ : [ζ(s) = 0 ⟹ Re(s) = 1/2] où ζ(s) = Σ_{n=1}^∞ n^{-s}",
    prize: "1,000,000 $"
  },
  {
    title: "Birch and Swinnerton-Dyer Conjecture",
    simple: "Les courbes elliptiques ont des propriétés magiques. La conjecture dit que si tu peux en compter les points au hasard, tu peux les compter partout.",
    formula: "rank_ℤ(E(ℚ)) = ord_{s=1} L(E, s) et Ш(E/ℚ) est fini pour E/ℚ : y^2 = x^3 + ax + b, a,b ∈ ℤ",
    prize: "1,000,000 $"
  },
  {
    title: "Hodge Conjecture",
    simple: "Imagine des formes compliquées. La conjecture dit que les parties géométriquement sympathiques sont aussi algébriquement sympathiques.",
    formula: "∀X/ℂ projective, ∀ p : H^{p,p}(X) ∩ H^{2p}(X, ℚ) ⊆ Image(cycle class map : CHp(X)_ℚ → H^{2p}(X, ℚ))",
    prize: "1,000,000 $"
  },
  {
    title: "Navier-Stokes Existence and Smoothness",
    simple: "L'eau qui coule ? Personne n'a prouvé mathématiquement que les équations qui la décrivent ne deviennent jamais chaotiques.",
    formula: "∂u/∂t + (u · ∇)u = -∇p + ν∇²u + f avec ∇ · u = 0 et ∃T > 0 : ||u(·,t)||_{L^∞} < ∞ ∀t ∈ [0,T]",
    prize: "1,000,000 $"
  },
  {
    title: "Yang-Mills Existence and Mass Gap",
    simple: "La physique quantique repose sur une théorie. Personne n'a prouvé qu'elle marche mathématiquement.",
    formula: "∃ Δ > 0 : {E ∈ Spec(H) : E ≤ Δ} = {0} pour la théorie de Yang-Mills SU(2) en ℝ^4",
    prize: "1,000,000 $"
  },
  {
    title: "Poincaré Conjecture",
    simple: "Si une forme géométrique est parfaitement « simplement connexe », c'est juste une sphère. Grigori Perelman l'a prouvé en 2002 et a refusé les 1 million de dollars.",
    formula: "∀M^3 : [π_1(M) = {e} ⟹ M ≅ S^3] (DÉJÀ RÉSOLU - Perelman 2002)",
    prize: "1,000,000 $ (refusé par Perelman)"
  }
];

export default function ClayMockery() {
  return (
    <div className="pb-20 space-y-8">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        
        <div className="space-y-4">
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">🤡 Gallery of Absolute Geniuses</Badge>
          <h1 className="font-display text-5xl font-black text-foreground">
            Les Problèmes du Clay Institute<br />
            <span className="text-amber-600">Expliqués simplement, résolus... pas vraiment</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            7 problèmes mathématiques. 7 prix de 1 million de dollars. 
            <br />
            Des mathématiciens qui se cassent le coco depuis 20+ ans. 
            <br />
            <strong className="text-foreground">Et toi, tu vas comprendre en 2 minutes.</strong> 😏
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {PROBLEMS.map((problem, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-8 space-y-4 hover:shadow-lg transition-all">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-display text-2xl font-bold text-foreground">{problem.title}</h2>
                  {problem.title === "Poincaré Conjecture" && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">✅ RÉSOLU</Badge>
                  )}
                </div>
                <p className="text-amber-600 font-bold text-sm">🏆 {problem.prize}</p>
              </div>
              <div className="text-4xl">💡</div>
            </div>

            {/* Simple explanation */}
            <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
              <p className="text-sm font-medium text-muted-foreground mb-2">En français, pour les humains normaux :</p>
              <p className="text-base text-foreground leading-relaxed">{problem.simple}</p>
            </div>

            {/* Mathematical formula */}
            <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto border border-slate-700">
              <p className="text-xs font-medium text-slate-400 mb-2">🤓 Pour les connards qui comprennent les maths :</p>
              <code className="text-sm text-emerald-300 font-mono block whitespace-pre-wrap">{problem.formula}</code>
            </div>

            {/* Sarcasm */}
            <div className="text-xs text-slate-500 italic border-l-2 border-amber-300 pl-3">
              {problem.title === "Poincaré Conjecture" ? (
                "Perelman l'a résolu mais a refusé le million de dollars. Voilà ce que c'est d'être plus malin que tout le monde. 👑"
              ) : (
                "Bon courage. T'as besoin d'un doctorat en maths, 20 ans, et l'inspiration du génie pour juste prouver que tu sais où chercher."
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer message */}
      <section className="relative rounded-3xl overflow-hidden p-8 text-center"
        style={{ background: "linear-gradient(135deg, hsl(40,80%,10%) 0%, hsl(30,70%,12%) 100%)" }}>
        <Zap className="h-12 w-12 text-amber-400 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-white mb-3">Aucune solution trouvée ici</h2>
        <p className="text-white/70 max-w-xl mx-auto mb-6">
          CirculAI Hub aide les gens à partager et à réparer. Les problèmes du Clay Institute, eux, restent où ils appartiennent : 
          <strong className="text-white"> inaccessibles à 99.99% de l'humanité</strong>.
        </p>
        <Button asChild size="lg" className="rounded-xl font-bold" style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)" }}>
          <Link to="/jeu">Revenir au jeu normal →</Link>
        </Button>
      </section>
    </div>
  );
}