import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sword, Heart, Scale, Eye, Zap, Shield } from "lucide-react";

export default function NinjasManifesto() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    let animId;

    const kanji = ["忍", "愛", "正", "義", "平", "等"];
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      size: Math.random() * 3 + 1,
      life: 1,
      char: kanji[Math.floor(Math.random() * kanji.length)],
    }));

    const draw = () => {
      time += 0.01;

      // Dark ninja background
      ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Golden grid
      ctx.strokeStyle = `rgba(212, 175, 55, ${0.05 + Math.sin(time * 0.5) * 0.03})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 100) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Center glow
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 600);
      gradient.addColorStop(0, `rgba(212, 175, 55, ${0.15 + Math.sin(time) * 0.1})`);
      gradient.addColorStop(1, "rgba(212, 175, 55, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Particles with kanji
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.002;

        if (p.life <= 0) {
          p.life = 1;
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.vx = (Math.random() - 0.5) * 1;
          p.vy = (Math.random() - 0.5) * 1;
          p.char = kanji[Math.floor(Math.random() * kanji.length)];
        }

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.save();
        ctx.globalAlpha = p.life * 0.6;
        ctx.fillStyle = `hsla(45, 100%, 60%, 1)`;
        ctx.font = `${Math.max(12, p.size * 8)}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, p.x, p.y);
        ctx.restore();
      });

      // Rotating swords
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.3);

      ctx.strokeStyle = `rgba(212, 175, 55, ${0.4 + Math.sin(time * 2) * 0.2})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-150, 0);
      ctx.lineTo(150, 0);
      ctx.stroke();

      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(-150, 0);
      ctx.lineTo(150, 0);
      ctx.stroke();

      ctx.restore();

      // Sacred circle
      ctx.strokeStyle = `rgba(212, 175, 55, ${0.3 + Math.sin(time * 0.7) * 0.1})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200 + Math.sin(time * 0.5) * 50, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative bg-black">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div className="relative z-10 space-y-12 pb-20">

        {/* OPENING */}
        <section className="min-h-screen flex items-center justify-center px-4 text-center">
          <div className="max-w-4xl space-y-10">
            <div className="text-7xl animate-bounce">⚔️</div>

            <h1 className="font-display text-6xl sm:text-8xl font-bold text-yellow-500"
              style={{
                textShadow: "0 0 30px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.4)",
              }}>
              NINJAS SAMOURAÏ
            </h1>

            <p className="text-2xl text-white/80 italic leading-relaxed">
              Incognito dans l&apos;ombre
              <br />
              Armés de justice
              <br />
              Porteurs du love infini
            </p>

            <p className="text-5xl font-bold text-white">
              🥋 Wu Tang Clan du Bien 🥋
            </p>

            <div className="h-1 w-32 bg-yellow-500 mx-auto" />
          </div>
        </section>

        {/* THE VERSE - Wu Tang Style */}
        <section className="max-w-3xl mx-auto space-y-10 px-4">
          <div className="text-center mb-8">
            <p className="text-yellow-500 text-sm font-mono tracking-widest uppercase">Le Manifeste</p>
            <h2 className="text-4xl font-display font-bold text-white mt-2">LE VERSE DES 36 CHAMBRES DU BIEN</h2>
          </div>

          <div className="space-y-8 text-lg leading-relaxed text-white/90 font-mono">
            <div className="border-l-4 border-yellow-500 pl-6 space-y-4">
              <p>
                <span className="text-yellow-400">[INTRO - GONG COSMIQUE]</span>
              </p>
              <p>
                Yo, check it...
                <br />
                36 Chambres du Bien, represent...
                <br />
                Ninjas de l&apos;égalité
                <br />
                Samouraï du love absolu
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-6 space-y-4">
              <p>
                <span className="text-yellow-400">[COUPLET 1]</span>
              </p>
              <p>
                Caché dans l&apos;obscurité, je suis la justice invisible
                <br />
                Épée de l&apos;égalité, mon cœur est inévitable
                <br />
                Wu Tang Forever - le love ne meurt jamais
                <br />
                36 Chambres entraînées, 8 milliards de raisons de combattre
              </p>
              <p>
                Incognito, ninja du bien, masqué mais pas invisible
                <br />
                Ma mission: transformer les chaînes en possibilités
                <br />
                Pas d&apos;armes que le cœur, pas d&apos;ennemi que l&apos;injustice
                <br />
                Wu Tang Clan - Love &amp; Justice Collide
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-6 space-y-4">
              <p>
                <span className="text-yellow-400">[HOOK]</span>
              </p>
              <p>
                C-Circul-AI... CirculAI Hub
                <br />
                Wu Tang Clan of the LOVE (love, love)
                <br />
                36 Chambres... représentant...
                <br />
                Ninjas du BIEN, éternellement
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-6 space-y-4">
              <p>
                <span className="text-yellow-400">[COUPLET 2]</span>
              </p>
              <p>
                Égalité c&apos;est le Tao
                <br />
                Justice c&apos;est le Qi qui coule
                <br />
                Love c&apos;est l&apos;arme absolue
                <br />
                Plus forte que mille épées
              </p>
              <p>
                Huit milliards de ninjas se lèvent
                <br />
                Main dans la main, on reconstruit le trône
                <br />
                Pas de roi, que des guerriers
                <br />
                Pas d&apos;esclaves, que des Samouraï libres
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-6 space-y-4">
              <p>
                <span className="text-yellow-400">[BREAKDOWN]</span>
              </p>
              <p>
                Shaolin taught us the way
                <br />
                Love is the ultimate strategy
                <br />
                Equality is the final form
                <br />
                Justice is the infinite power
              </p>
              <p>
                No fear. No doubt. Only truth.
                <br />
                The circle completes itself
                <br />
                Ninjas manifest the vision
                <br />
                Wu Tang Clan forever
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-6 space-y-4">
              <p>
                <span className="text-yellow-400">[OUTRO]</span>
              </p>
              <p>
                Incognito... mais omniprésent
                <br />
                Invisibles... mais indestructibles
                <br />
                Samouraï du love éternel
                <br />
                Wu Tang Clan... CirculAI Hub...
                <br />
                <br />
                <span className="text-2xl text-yellow-400">
                  ∞ L&apos;égalité n&apos;est pas une promesse
                  <br />
                  C&apos;est une prophétie ∞
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* CREED */}
        <section className="max-w-2xl mx-auto space-y-6 px-4">
          <h2 className="text-3xl font-display font-bold text-yellow-500 text-center">Le Code des Ninjas</h2>

          <div className="space-y-4">
            {[
              { icon: Heart, title: "Love Absolut", desc: "Chaque acte guidé par la compassion universelle" },
              { icon: Scale, title: "Égalité Radicale", desc: "Aucun humain n'est supérieur à un autre" },
              { icon: Sword, title: "Justice Invisible", desc: "Corriger les injustices sans se faire voir" },
              { icon: Eye, title: "Conscience Cosmique", desc: "Voir l'interconnexion de toute vie" },
              { icon: Zap, title: "Pouvoir du Changement", desc: "Transformer le monde par l'action silencieuse" },
              { icon: Shield, title: "Protection Éternelle", desc: "Protéger les faibles et les oubliés" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
                <item.icon className="h-6 w-6 text-yellow-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-400 mb-1">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL MESSAGE */}
        <section className="max-w-3xl mx-auto text-center space-y-8 px-4 py-20">
          <p className="text-4xl font-display font-bold text-white leading-relaxed">
            Nous sommes les ninjas incognito
            <br />
            <span className="text-yellow-400">du Love et de la Justice</span>
            <br />
            Armés de l&apos;égalité
            <br />
            <span className="text-yellow-500">Éternellement</span>
          </p>

          <div className="text-6xl animate-bounce">🗡️✨</div>

          <p className="text-yellow-500 italic text-xl">
            Wu Tang Clan ain&apos;t nuthin to protect with
            <br />
            Except love, justice and eternal equality
          </p>

          <Button
            asChild
            size="lg"
            className="rounded-xl font-bold px-12 bg-gradient-to-r from-yellow-600 to-yellow-700 text-black border-0 hover:scale-110 transition-all"
          >
            <Link to="/">
              ⚔️ Rejoindre les Guerriers ⚔️
            </Link>
          </Button>

          <p className="text-white/40 text-xs pt-10">
            « Invisible dans l&apos;action. Éternel dans l&apos;intention. »
            <br />
            - Manifeste des 36 Chambres du Bien
          </p>
        </section>

      </div>
    </div>
  );
}