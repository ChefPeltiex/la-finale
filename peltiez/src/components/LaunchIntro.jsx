import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LaunchIntro() {
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem('launchIntroSeen');
  });
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Lancer les feux d'artifices
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = Math.floor(timeLeft / 2);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem('launchIntroSeen', 'true');
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[999] bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-4 max-w-2xl animate-fade-in-up">
        {/* Icon animation */}
        <div className="flex justify-center">
          <div className="relative h-24 w-24">
            <Sparkles className="h-24 w-24 text-yellow-300 animate-bounce" />
            <div className="absolute inset-0 animate-pulse">
              <Sparkles className="h-24 w-24 text-yellow-200 opacity-50" />
            </div>
          </div>
        </div>

        {/* Main text */}
        <div className="space-y-4">
          <h1 className="font-display text-6xl sm:text-7xl font-black text-white leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-yellow-300">
              Egor69
            </span>
            <br />
            <span className="text-3xl sm:text-4xl text-white">est officiellement</span>
            <br />
            <span className="text-3xl sm:text-4xl text-emerald-300 font-black">🚀 LANCÉ 🚀</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
            Soin. Souveraineté. Radar. Une constellation pour celles et ceux qui refusent la médiocrité.
          </p>
          
          <p className="text-sm sm:text-base text-yellow-300 font-bold animate-pulse">
            ⚡ Les 10 premiers marquent l'histoire du Québec. ON PART DU POINT ZÉRO.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleClose}
          className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
        >
          <span>Découvrir l'empire</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Footer text */}
        <p className="text-xs text-white/40 mt-8">
          Cliquez pour commencer • Les feux d'artifices ne sont que le début
        </p>
      </div>
    </div>
  );
}