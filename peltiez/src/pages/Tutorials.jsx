import { useState } from "react";
import { Play, BookOpen, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const TUTORIALS = [
  {
    id: 1,
    title: "Publier ta première annonce",
    description: "Apprends à poster un objet en 2 minutes. Simple, rapide, impactant.",
    category: "Débutant",
    duration: "2 min",
    icon: "📝",
    color: "from-blue-500 to-cyan-600",
    lessons: [
      "1. Choisir le type (don, vente, réparation, échange)",
      "2. Décrire l'objet en détail",
      "3. Télécharger une belle photo",
      "4. Calculer l'impact CO₂",
      "5. Publier et célébrer!"
    ],
    videoUrl: "https://placeholder-video.com/tutorial-1"
  },
  {
    id: 2,
    title: "Maximiser ton impact CO₂",
    description: "Découvre comment tes actions sauvent la planète. Les chiffres véritables.",
    category: "Intermédiaire",
    duration: "5 min",
    icon: "🌱",
    color: "from-emerald-500 to-teal-600",
    lessons: [
      "1. Comprendre l'impact CO₂ réel",
      "2. Calculer les équivalences (arbres, miles, énergie)",
      "3. Tracker ta progression personnelle",
      "4. Rejoindre les défis communautaires",
      "5. Devenir un champion écologique"
    ],
    videoUrl: "https://placeholder-video.com/tutorial-2"
  },
  {
    id: 3,
    title: "Générer des revenus",
    description: "Vendre intelligemment. 70% de commission. Des revenus réels.",
    category: "Avancé",
    duration: "8 min",
    icon: "💰",
    color: "from-amber-500 to-orange-600",
    lessons: [
      "1. Fixer les prix correctement",
      "2. Optimiser les photos pour les conversions",
      "3. Répondre rapidement aux acheteurs",
      "4. Gérer les paiements sécurisés",
      "5. Tracker tes revenus dans Mon Coffre-Fort"
    ],
    videoUrl: "https://placeholder-video.com/tutorial-3"
  },
  {
    id: 4,
    title: "Débloquer les badges",
    description: "Gagne des badges en faisant le bien. Montre ton engagement.",
    category: "Gamification",
    duration: "4 min",
    icon: "🏆",
    color: "from-rose-500 to-pink-600",
    lessons: [
      "1. Les 8 badges à débloquer",
      "2. Critères pour chaque badge",
      "3. Afficher tes réussites",
      "4. Partager tes victoires",
      "5. Inspirer la communauté"
    ],
    videoUrl: "https://placeholder-video.com/tutorial-4"
  },
  {
    id: 5,
    title: "Connecter avec la communauté",
    description: "Partage tes idées, apprends des autres, crée des liens.",
    category: "Communauté",
    duration: "6 min",
    icon: "👥",
    color: "from-violet-500 to-purple-600",
    lessons: [
      "1. Poster sur le flux communautaire",
      "2. Engager avec d'autres utilisateurs",
      "3. Rejoindre les défis thématiques",
      "4. Créer un groupe d'intérêt",
      "5. Devenir ambassadeur"
    ],
    videoUrl: "https://placeholder-video.com/tutorial-5"
  },
  {
    id: 6,
    title: "Exporter tes données",
    description: "Prends possession de tes données. Complètement. Toujours.",
    category: "Avancé",
    duration: "3 min",
    icon: "📥",
    color: "from-indigo-500 to-blue-600",
    lessons: [
      "1. Accéder à Mon Coffre-Fort",
      "2. Télécharger en JSON",
      "3. Exporter en CSV",
      "4. Comprendre tes droits RGPD",
      "5. Reprendre le contrôle total"
    ],
    videoUrl: "https://placeholder-video.com/tutorial-6"
  }
];

function TutorialCard({ tutorial, completed, onComplete }) {
  return (
    <div className={`bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer group`}
      onClick={onComplete}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`text-4xl`}>{tutorial.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{tutorial.title}</h3>
            {completed && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{tutorial.description}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{tutorial.category}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">⏱️ {tutorial.duration}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4 pl-14">
        {tutorial.lessons.slice(0, 2).map((lesson, i) => (
          <p key={i} className="text-xs text-muted-foreground">{lesson}</p>
        ))}
        <p className="text-xs text-muted-foreground italic">+ {tutorial.lessons.length - 2} leçons supplémentaires...</p>
      </div>

      <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
        <Play className="h-4 w-4" /> Commencer le tutoriel
      </div>
    </div>
  );
}

export default function Tutorials() {
  const [completedTutorials, setCompletedTutorials] = useState(() => {
    const saved = localStorage.getItem("completedTutorials");
    return saved ? JSON.parse(saved) : [];
  });

  const handleComplete = (tutorialId) => {
    const updated = completedTutorials.includes(tutorialId)
      ? completedTutorials.filter(id => id !== tutorialId)
      : [...completedTutorials, tutorialId];
    setCompletedTutorials(updated);
    localStorage.setItem("completedTutorials", JSON.stringify(updated));
  };

  const stats = {
    completed: completedTutorials.length,
    total: TUTORIALS.length,
    percentage: Math.round((completedTutorials.length / TUTORIALS.length) * 100)
  };

  return (
    <div className="pb-20 space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Apprendre</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">
          Maîtrise CirculAI Hub
        </h1>
        <p className="text-foreground/70 text-lg max-w-2xl">
          Des tutoriels complets pour devenir expert. De la première annonce au lancement d'une mission.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-2xl border border-primary/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Progression personnelle</p>
            <p className="font-display text-3xl font-black text-foreground">{stats.completed} / {stats.total} tutoriels</p>
          </div>
          <div className="text-right">
            <p className="font-display text-4xl font-black text-primary">{stats.percentage}%</p>
            <p className="text-xs text-muted-foreground mt-1">Complétés</p>
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TUTORIALS.map(tutorial => (
          <TutorialCard
            key={tutorial.id}
            tutorial={tutorial}
            completed={completedTutorials.includes(tutorial.id)}
            onComplete={() => handleComplete(tutorial.id)}
          />
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Catégories</p>
          <h2 className="font-display text-2xl font-bold text-foreground">Apprendre à ta façon</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🚀", title: "Débutant", desc: "Tes premiers pas" },
            { icon: "📈", title: "Intermédiaire", desc: "Approfondir" },
            { icon: "🏆", title: "Avancé", desc: "Devenir expert" },
            { icon: "👥", title: "Communauté", desc: "Inspirer d'autres" },
          ].map(cat => (
            <div key={cat.title} className="bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all hover:-translate-y-0.5 text-center">
              <p className="text-3xl mb-2">{cat.icon}</p>
              <p className="font-bold text-foreground">{cat.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-emerald-500/5 p-10 text-center space-y-4">
        <Zap className="h-10 w-10 text-primary mx-auto" />
        <h2 className="font-display text-2xl font-bold text-foreground">Prêt à maîtriser la plateforme?</h2>
        <p className="text-foreground/70 max-w-md mx-auto">
          Chaque tutoriel t'apprendra à maximiser ton impact. Du simple au complexe, à ton rythme.
        </p>
        <div className="flex flex-wrap gap-3 justify-center pt-3">
          <Button asChild className="rounded-xl font-bold">
            <Link to="/publier">👑 Commencer <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/">Retour</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}