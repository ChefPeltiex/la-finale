import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, X, Flame, Users } from 'lucide-react';

export default function GlobalLaunchAlert() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Launch time: 19:00 ET (7 PM Toronto)
      const now = new Date();
      const launchTime = new Date(now);
      launchTime.setHours(19, 0, 0, 0);

      if (now > launchTime) {
        launchTime.setDate(launchTime.getDate() + 1);
      }

      const diff = launchTime - now;
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft('🎉 C\'EST PARTI!');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 border-b-2 border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-yellow-300 animate-bounce flex-shrink-0" />
              <Flame className="h-5 w-5 text-orange-300 flex-shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-black text-white leading-tight">
                🌍 LANCEMENT MONDIAL Egor69 — 19h00 (heure locale)
              </p>
              <p className="text-xs sm:text-sm text-white/80 mt-0.5 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 flex-shrink-0" />
                Croissance souveraine · Radar actif · LIVE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-end">
            <Link
              to="/pricing"
              className="rounded-full bg-white/95 px-4 py-2 text-xs font-black text-violet-800 shadow hover:bg-white"
            >
              Abonnements
            </Link>
            <Link
              to="/soutien"
              className="rounded-full border border-white/40 px-3 py-2 text-xs font-bold text-white hover:bg-white/10"
            >
              Soutien
            </Link>
            <div className="text-right">
              <p className="text-xs text-white/70 uppercase tracking-widest font-bold">Compte à rebours</p>
              <p className="text-lg sm:text-xl font-black text-yellow-300">{timeLeft}</p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}