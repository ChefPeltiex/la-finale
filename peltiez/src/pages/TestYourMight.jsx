import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { Zap, Loader2, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TESTS = {
  power: {
    title: "Test de Pouvoir",
    emoji: "⚡",
    questions: [
      { q: "Face à une difficulté, tu...", a: "Attaques de front", b: "Cherches une stratégie", c: "Demandes de l'aide", d: "Fuis" },
      { q: "Ton énergie naturelle est...", a: "Intense et volcanique", b: "Fluide et adaptable", c: "Légère et rapide", d: "Ancrée et stable" },
      { q: "Tu inspires les autres par ta...", a: "Puissance brute", b: "Sérénité", c: "Dynamisme", d: "Sagesse" },
      { q: "Ton plus grand pouvoir est...", a: "La détermination", b: "L'intuition", c: "La rapidité", d: "L'empathie" }
    ]
  },
  element: {
    title: "Quel est ton Élément?",
    emoji: "🌀",
    questions: [
      { q: "Tu te sens le plus vivant...", a: "Au soleil brûlant", b: "Sous la pluie", c: "Dans le vent", d: "En montagne" },
      { q: "Ton comportement en groupe...", a: "Énergique et dominant", b: "Calme et observateur", c: "Libre et insouciant", d: "Fiable et stable" },
      { q: "Tu gères les crises...", a: "Avec passion", b: "Avec fluidité", c: "Avec légèreté", d: "Avec patience" }
    ]
  },
  archetype: {
    title: "Quel Archétype es-tu?",
    emoji: "🎭",
    questions: [
      { q: "Tu es plutôt...", a: "Le Héros", b: "Le Sage", c: "Le Trickster", d: "Le Gardien" },
      { q: "Tes valeurs sont...", a: "La bravoure", b: "La vérité", c: "La liberté", d: "La protection" }
    ]
  },
  destiny: {
    title: "Test de Destinée",
    emoji: "🔮",
    questions: [
      { q: "Ton but ultime est...", a: "Conquérir et dominer", b: "Comprendre et enseigner", c: "Créer et innover", d: "Servir et guérir" },
      { q: "Tu laisses un héritage de...", a: "Force", b: "Sagesse", c: "Beauté", d: "Amour" }
    ]
  }
};

const RESULTS = {
  power: {
    high: { title: "Puissance Cosmique", desc: "Tu possèdes une énergie exceptionnelle capable de changer les mondes." },
    medium: { title: "Force Équilibrée", desc: "Ton pouvoir est bien calibré pour accomplir de grandes choses." },
    low: { title: "Potentiel Caché", desc: "Ton vrai pouvoir attend d'être découvert et développé." }
  },
  element: {
    a: { title: "Feu", emoji: "🔥", desc: "Passion, transformation, purification. Tu brûles d'une flamme intérieure." },
    b: { title: "Eau", emoji: "💧", desc: "Fluidité, adaptation, profondeur. Tu couilles avec grâce à travers les défis." },
    c: { title: "Air", emoji: "🌬️", desc: "Liberté, communication, légèreté. Tu voliges à travers les opportunités." },
    d: { title: "Terre", emoji: "🌍", desc: "Stabilité, fondation, croissance. Tu as les pieds bien ancrés." }
  }
};

export default function TestYourMight() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me(), staleTime: Infinity });
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const test = selectedTest ? TESTS[selectedTest] : null;
  const totalQuestions = test?.questions.length || 0;
  const progress = (answers.length / totalQuestions) * 100;

  const handleAnswer = (choice) => {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);

    if (newAnswers.length === totalQuestions) {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = async (answers) => {
    setLoading(true);
    const score = (answers.filter(a => a === "a").length / totalQuestions) * 100;
    const powerLevel = score > 66 ? "high" : score > 33 ? "medium" : "low";

    const resultData = {
      ...RESULTS.power[powerLevel],
      score: Math.round(score),
      element: ["a", "b", "c", "d"][Math.floor(Math.random() * 4)]
    };

    // Sauvegarder le résultat
    if (user) {
      await base44.entities.TestYourMight.create({
        user_email: user.email,
        test_type: selectedTest,
        score: resultData.score,
        result_title: resultData.title,
        result_description: resultData.desc,
        power_element: RESULTS.element[resultData.element]?.title.toLowerCase()
      });
      queryClient.invalidateQueries(["my-tests"]);
    }

    setResult(resultData);
    setLoading(false);
  };

  const resetTest = () => {
    setSelectedTest(null);
    setAnswers([]);
    setResult(null);
  };

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "InteractiveResource",
    "name": "Test Your Might — Découvre tes Pouvoirs Cachés",
    "description": "Quiz interactif pour tester tes pouvoirs, éléments, archétypes et destinée."
  };

  if (!selectedTest) {
    return (
      <div className="pb-20 space-y-10 max-w-5xl mx-auto px-4 pt-6">
        <SEOMeta
          title="Test Your Might — Découvre tes Pouvoirs Cachés"
          description="Quiz interactif spirituel pour tester tes pouvoirs, éléments cosmiques, archétypes et destinée."
          keywords="test, quiz, pouvoirs, éléments, archétypes, destinée, spiritualité"
          canonicalUrl="https://egor69.ca/test-your-might"
          schemaData={seoSchema}
        />

        <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-violet-500/10 to-emerald-500/10">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="font-display text-4xl font-black text-foreground">Test Your Might</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Découvre tes pouvoirs cachés, ton élément, ton archétype et ta destinée à travers des quiz interactifs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(TESTS).map(([key, test]) => (
            <button
              key={key}
              onClick={() => setSelectedTest(key)}
              className="text-left p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all hover:-translate-y-1 group"
            >
              <div className="text-4xl mb-3">{test.emoji}</div>
              <h2 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">{test.title}</h2>
              <p className="text-xs text-muted-foreground">{test.questions.length} questions · 2 min</p>
              <div className="flex items-center gap-1.5 mt-3 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Commencer <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="pb-20 space-y-8 max-w-2xl mx-auto px-4 pt-6">
        <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
          <Trophy className="h-16 w-16 text-amber-500 mx-auto mb-4 animate-bounce" />
          <h2 className="font-display text-3xl font-black text-foreground mb-2">{result.title}</h2>
          <div className="text-5xl font-black text-amber-600 mb-4">{result.score}%</div>
          <p className="text-sm text-foreground/70 leading-relaxed max-w-md mx-auto mb-6">{result.desc}</p>
          <Badge className="bg-primary/20 text-primary border-primary/30 text-sm mb-6">{result.element}</Badge>
          
          <Button onClick={resetTest} className="rounded-xl font-bold gap-2 bg-primary hover:bg-primary/90">
            Tester un autre pouvoir <Zap className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 max-w-2xl mx-auto px-4 pt-6 space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-foreground">{test.title}</h2>
          <Badge variant="outline">{answers.length + 1}/{totalQuestions}</Badge>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Current question */}
      {answers.length < totalQuestions && (
        <div className="bg-card rounded-2xl border border-border p-8 space-y-5 animate-fade-in-up">
          <h3 className="font-bold text-lg text-foreground">{test.questions[answers.length].q}</h3>
          
          <div className="space-y-2">
            {["a", "b", "c", "d"].map(choice => {
              const label = test.questions[answers.length][choice];
              return (
                <button
                  key={choice}
                  onClick={() => handleAnswer(choice)}
                  className="w-full p-4 rounded-xl border border-border bg-background text-left hover:bg-accent hover:border-primary/50 transition-all text-sm font-medium text-foreground"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <button
        onClick={() => resetTest()}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Retour
      </button>
    </div>
  );
}