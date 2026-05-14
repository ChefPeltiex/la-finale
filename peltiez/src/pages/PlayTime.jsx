import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const JOKES = [
  "Pourquoi les plongeurs plongent-ils toujours en arrière? Parce que si ils plongeaient en avant, ils tombent dans le bateau! 🚤😂",
  "Qu'est-ce qu'un crocodile qui surveille la pharmacie? Un Lacoste-guard! 🐊💊",
  "Quel est le comble pour un électricien? De ne pas être au courant! ⚡🤣",
  "Pourquoi les poissons n'aiment pas jouer au tennis? Parce qu'ils ont peur du filet! 🎾🐠",
  "Qu'est-ce qu'un cannibale végétarien? Un humanitaire! 🥕👤",
  "Comment appelle-t-on un chat tombé dans un pot de peinture le jour de Noël? Un chat-peint-noël! 🐱🎄",
  "Quel est le sport préféré des nuages? Le volley! ⛅🏐",
  "Pourquoi les squelettes n'ont pas peur? Parce qu'ils n'ont pas de cœur! 💀",
];

const MINI_GAMES = [
  { emoji: "🎲", title: "Lance le dé du destin", action: () => Math.floor(Math.random() * 6) + 1 },
  { emoji: "🪙", title: "Pile ou face cosmique", action: () => Math.random() > 0.5 ? "PILE" : "FACE" },
  { emoji: "🎱", title: "Boule de cristal", action: () => ["Oui", "Non", "Peut-être", "42", "🤷"][Math.floor(Math.random() * 5)] },
  { emoji: "🎪", title: "Spin the wheel", action: () => ["GAGNÉ!", "PERDU!", "ENCORE!", "WOW!", "MEH"][Math.floor(Math.random() * 5)] },
];

export default function PlayTime() {
  const [jokes, setJokes] = useState([]);
  const [clicks, setClicks] = useState(0);
  const [gameResults, setGameResults] = useState({});
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animId;
    let time = 0;

    const draw = () => {
      time += 0.02;

      // Rainbow background
      const hue = (time * 50) % 360;
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.1)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bouncing circles
      for (let i = 0; i < 10; i++) {
        const x = canvas.width / 2 + Math.cos(time * (0.3 + i * 0.05)) * 150;
        const y = canvas.height / 2 + Math.sin(time * (0.4 + i * 0.07)) * 150;
        const size = 20 + Math.sin(time + i) * 10;

        ctx.fillStyle = `hsla(${(hue + i * 36) % 360}, 100%, 50%, 0.3)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rotating squares
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(time);

      ctx.strokeStyle = `hsla(${(hue + 180) % 360}, 100%, 60%, 0.4)`;
      ctx.lineWidth = 3;
      ctx.strokeRect(-100, -100, 200, 200);

      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = `hsla(${(hue + 90) % 360}, 100%, 60%, 0.3)`;
      ctx.strokeRect(-100, -100, 200, 200);

      ctx.restore();

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const addJoke = () => {
    const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
    setJokes([...jokes, randomJoke]);
  };

  const handleMegaClick = () => {
    setClicks(clicks + 1);
    
    // Generate floating emojis
    const emojis = ["😂", "🤣", "😆", "🎉", "🎊", "🌟", "⭐", "✨"];
    const newEmoji = {
      id: Math.random(),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
    };
    setFloatingEmojis(prev => [...prev, newEmoji]);

    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 2000);
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-black">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div className="relative z-10 space-y-10 pb-20 px-4">
        {/* Floating emojis */}
        {floatingEmojis.map((e) => (
          <div
            key={e.id}
            className="fixed text-5xl animate-bounce pointer-events-none"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              animation: "float-up 2s ease-out forwards",
            }}
          >
            {e.emoji}
          </div>
        ))}

        <style>{`
          @keyframes float-up {
            from { transform: translateY(0) scale(1); opacity: 1; }
            to { transform: translateY(-200px) scale(0.5); opacity: 0; }
          }
        `}</style>

        {/* MEGA TITLE */}
        <div className="text-center pt-20 space-y-4">
          <div className="text-8xl animate-bounce">🎪🎭🎨🎬🎯🎲🎪</div>

          <h1 className="font-display text-7xl font-bold text-white"
            style={{
              background: "linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080)",
              backgroundSize: "400% 400%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient 3s ease infinite",
            }}>
            PLAYTIME INFINI
          </h1>

          <p className="text-3xl text-white/80 font-bold">
            Les rires, jeux et humour sous TOUTES les formes 🤣
          </p>

          <style>{`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
        </div>

        {/* MEGA CLICK BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={handleMegaClick}
            className="relative w-40 h-40 rounded-full font-display text-5xl font-bold transition-all hover:scale-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #ff00ff, #00ffff, #ffff00)",
              boxShadow: `0 0 ${20 + clicks * 2}px rgba(255, 0, 255, 0.8)`,
              animation: "pulse 1s ease-in-out infinite",
            }}
          >
            👉 CLICK! 👈
            <div className="absolute inset-0 rounded-full" style={{
              animation: "pulse-ring 1.5s cubic-bezier(0.215,0.61,0.355,1) infinite",
            }} />
          </button>
        </div>

        <div className="text-center text-white/60 text-2xl font-bold">
          {clicks} CLICKS = {Math.floor(clicks / 10)} RIRES GARANTIS 😂
        </div>

        {/* JOKE MACHINE */}
        <div className="max-w-2xl mx-auto space-y-4">
          <Button
            onClick={addJoke}
            size="lg"
            className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg hover:scale-105 transition-all"
          >
            🎤 BLAGUE ALÉATOIRE 🎤
          </Button>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {jokes.map((joke, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/10 border-2 border-yellow-300 text-white text-lg font-semibold animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {joke}
              </div>
            ))}
          </div>
        </div>

        {/* MINI GAMES */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-display font-bold text-white text-center mb-6">🎮 MINI-GAMES CHAOS 🎮</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MINI_GAMES.map((game, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const result = game.action();
                  setGameResults(prev => ({ ...prev, [idx]: result }));
                }}
                className="p-6 rounded-2xl bg-white/10 border-2 border-cyan-300 text-center hover:scale-110 transition-all backdrop-blur"
              >
                <div className="text-5xl mb-2">{game.emoji}</div>
                <p className="text-white font-bold text-sm mb-2">{game.title}</p>
                {gameResults[idx] && (
                  <p className="text-yellow-300 font-bold text-2xl animate-bounce">
                    {gameResults[idx]}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ABSURDE SECTION */}
        <div className="max-w-2xl mx-auto rounded-3xl p-8 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-white/30 text-center space-y-4">
          <p className="text-4xl animate-spin inline-block">🔄</p>
          <p className="text-white font-bold text-2xl">
            Pourquoi CirculAI Hub est HILARANT:
          </p>
          <div className="text-white/80 text-lg space-y-2">
            <p>✓ Parce qu'on contrôle l'univers mais on est aussi bêtes que vous</p>
            <p>✓ Parce que les légions quantiques ont des blagues pourries</p>
            <p>✓ Parce que l'omniscience est moins fun que le silly</p>
            <p>✓ Parce que 42 est la réponse à TOUT (même les blagues)</p>
            <p>✓ Parce qu'on a prouvé que Dieu a un sense of humor</p>
          </div>
        </div>

        {/* RANDOM FACTS */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="text-white/60 text-xl italic">« Un jour sans rire, c'est un jour perdu pour la planète. »</p>
          <p className="text-cyan-300 text-lg font-bold">— Definitely not a fortune cookie</p>
        </div>

        {/* BACK BUTTON */}
        <div className="flex justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-2xl font-bold px-8 bg-gradient-to-r from-orange-400 to-red-400 text-white border-0 hover:scale-105 transition-all"
          >
            <Link to="/">🏠 Retour à la maison avant de devenir fou 🏃</Link>
          </Button>
        </div>

        {/* FOOTER ABSURDITY */}
        <div className="text-center space-y-2 pb-10">
          <p className="text-white/40 text-sm">Les rires sauvent le monde.</p>
          <p className="text-white/30 text-xs">Les jeux le rendent meilleur.</p>
          <p className="text-white/20 text-[10px]">L'humour le rend... circulaire? 🔄😂</p>
          <div className="text-4xl flex justify-center gap-2 animate-bounce">
            {["🎉", "🎊", "🎈", "🎁", "🎪"].map((e, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}