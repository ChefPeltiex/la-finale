import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function Intro() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [phase, setPhase] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(auth => setIsAuthenticated(auth));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicOn) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicOn]);

  const handleEnter = () => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      base44.auth.redirectToLogin();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Ambient Music */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/02/10/audio_79faa5bbd3.mp3"
        loop
        autoPlay
        style={{ display: "none" }}
      />
      {/* YouTube Video Background */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/9dOhAnaV4IE?autoplay=1&amp;mute=1&amp;controls=0&amp;modestbranding=1&amp;rel=0&amp;showinfo=0"
          title="Egor69 Intro"
          frameBorder="0"
          allowFullScreen
          className="object-cover"
          style={{ opacity: 0.3, pointerEvents: "none" }}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-5" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none z-5"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, hsla(158,80%,30%,0.4), transparent 60%), radial-gradient(ellipse at 80% 50%, hsla(260,80%,30%,0.4), transparent 60%)",
          animation: "aurora 8s ease infinite"
        }} />

      {/* Main content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-4">
        <div className={`max-w-2xl text-center space-y-8 transform transition-all duration-1000 ${
          phase ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}>
          {/* Logo animation */}
          <div className="mb-12">
            <div className="relative h-32 w-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500 opacity-50 animate-spin" 
                style={{ animationDuration: "4s" }} />
              <div className="absolute inset-4 rounded-full border-2 border-emerald-400 opacity-30 animate-spin"
                style={{ animationDuration: "6s", animationDirection: "reverse" }} />
              <div className="absolute inset-0 flex items-center justify-center text-6xl float">
                ♻️
              </div>
            </div>
          </div>

          {/* Main message */}
          <div className="space-y-6">
            <h1 className="font-display text-6xl sm:text-7xl font-black text-white leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300">
                Egor69
              </span>
              <br />
              <span className="text-white/80">est née</span>
            </h1>

            <p className="text-white/70 text-lg sm:text-xl leading-relaxed font-medium">
              Une orbite circulaire : don, échange, réparation — amplifiée par l’IA avec humilité.<br />
              <span className="text-emerald-300 font-bold">Pour quiconque choisit le réel plutôt que le bruit.</span>
            </p>
          </div>

          {/* L'Origine */}
          <div className="space-y-6 pt-8 border-t border-white/20">
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-300 font-black text-sm uppercase tracking-widest">L&apos;Origine</span>
            </div>
            <p
              className="font-display text-2xl sm:text-4xl font-black leading-tight text-center"
              style={{
                background: "linear-gradient(90deg, #fbbf24 0%, #fde68a 35%, #10b981 70%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              DE MOI, PAR MOI, POUR MOI. DOMINIC PELLETIER.
            </p>
            <p className="text-white/70 text-base leading-relaxed max-w-2xl mx-auto">
              Mon histoire devient énergie. Ma détermination devient système. Mon refus de la médiocrité devient expérience.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={handleEnter}
              size="lg"
              className="rounded-2xl font-bold px-10 text-base border-0 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-2xl gap-2"
            >
              👑 Entrer dans l'empire
              <ArrowRight className="h-5 w-5" />
            </Button>

            <Button
              onClick={() => navigate("/vision")}
              variant="outline"
              size="lg"
              className="rounded-2xl text-white hover:bg-white/10 border-white/30"
            >
              ✨ Découvrir la vision
            </Button>
          </div>

          {/* Links & Music toggle */}
          <div className="pt-6 flex flex-wrap gap-3 justify-center">
            <a
              href="https://www.youtube.com/watch?v=9dOhAnaV4IE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600/30 border border-red-500/60 text-red-200 hover:text-red-100 hover:border-red-400 hover:bg-red-600/50 transition-all text-sm font-semibold"
            >
              ▶️ Voir le clip complet
            </a>

            <button
              onClick={() => setIsMusicOn(!isMusicOn)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 text-white/70 hover:text-white/90 hover:border-white/40 transition-all text-sm"
              title={isMusicOn ? "Désactiver la musique" : "Activer la musique"}
            >
              {isMusicOn ? (
                <>
                  <Volume2 className="h-4 w-4" /> Musique On
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4" /> Musique Off
                </>
              )}
            </button>
          </div>

          {/* Footer message */}
          <p className="text-white/40 text-xs italic pt-6">
            Egor69 respire la détermination. Point final.
          </p>
        </div>
      </div>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-400 opacity-20 blur-xl"
            style={{
              width: Math.random() * 100 + 50 + "px",
              height: Math.random() * 100 + 50 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: Math.random() * 5 + "s",
            }}
          />
        ))}
      </div>
    </div>
  );
}