import { useState, useEffect } from 'react';
import { X, Package, Users, Heart, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    step: 1,
    title: '📸 Publiez vos objets',
    description: 'Photographiez un objet que vous ne voulez plus utiliser. En 2 minutes, c\'est en ligne!',
    icon: Package,
    color: 'from-blue-500/20 to-cyan-500/20',
    action: 'Publier maintenant',
    link: '/publier',
  },
  {
    step: 2,
    title: '🤝 Connectez-vous',
    description: 'Un membre de la communauté vous contacte. Discutez, négociez, échangez en sécurité.',
    icon: Users,
    color: 'from-purple-500/20 to-pink-500/20',
    action: 'Explorer le marketplace',
    link: '/marketplace',
  },
  {
    step: 3,
    title: '🌍 Impactez la planète',
    description: 'L\'objet repart pour une nouvelle vie. Votre CO₂ économisé s\'affiche en temps réel.',
    icon: Heart,
    color: 'from-emerald-500/20 to-teal-500/20',
    action: 'Voir mon profil',
    link: '/profil',
  },
  {
    step: 4,
    title: '⚡ Gagnez des récompenses',
    description: 'Points, badges, et une communauté mondiale qui vous reconnait. C\'est ça, le futur.',
    icon: Zap,
    color: 'from-amber-500/20 to-orange-500/20',
    action: 'Découvrir le jeu',
    link: '/jeu',
  },
];

export default function OnboardingTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen the tutorial
    const hasSeenTutorial = localStorage.getItem('circul-ai-tutorial-seen');
    if (!hasSeenTutorial) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('circul-ai-tutorial-seen', 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-card rounded-3xl border border-border max-w-2xl w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className={`bg-gradient-to-r ${step.color} p-8 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3), transparent 70%)' }} />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Étape {step.step}/{STEPS.length}</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">{step.title}</h2>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors flex-shrink-0">
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <p className="text-lg text-foreground/80 leading-relaxed">{step.description}</p>

          {/* Visual progress indicator */}
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className="rounded-xl"
            >
              ← Précédent
            </Button>

            <Button asChild className="flex-1 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 text-white border-0 font-semibold gap-2">
              <Link to={step.link} onClick={handleClose}>
                {step.action} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              onClick={handleNext}
              className="rounded-xl gap-2"
            >
              {currentStep === STEPS.length - 1 ? (
                <>
                  Commencer! <CheckCircle className="h-4 w-4" />
                </>
              ) : (
                <>
                  Suivant <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}