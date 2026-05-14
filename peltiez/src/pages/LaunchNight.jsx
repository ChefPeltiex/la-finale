import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Rocket, Heart } from "lucide-react";
import { toast } from "sonner";

const MESSAGES = [
  {
    platform: "Twitter/X",
    emoji: "𝕏",
    msg: "Egor69 — ouverture ce soir 19h Toronto 🌌\n\nRadar Golden Nuggets · économie circulaire · visée souveraine.\nUne expérience pensée pour durer, sans promesses creuses.\n\nhttps://egor69.ca\n\n#Egor69 #EconomieCirculaire #Radar",
  },
  {
    platform: "LinkedIn",
    emoji: "💼",
    msg: "Ce soir à 19h (Toronto), Egor69 présente sa grille de lancement : vision produit, radar et hubs thématiques.\n\nPas de chiffres marketing inventés — uniquement une feuille de route claire et une plateforme sculptée pour la confiance.\n\nhttps://egor69.ca\n\n#Innovation #CircularEconomy #TrustByDesign",
  },
  {
    platform: "Instagram",
    emoji: "📸",
    msg: "✨ CE SOIR · 19h ✨\n\nEgor69 ouvre son hall cosmique.\n\n♻️ Donner · vendre · réparer · échanger\n🔭 Radar et Golden Nuggets\n🌙 Ambiance mystique, ton sobre\n\nhttps://egor69.ca",
  },
  {
    platform: "TikTok",
    emoji: "🎵",
    msg: "19h Toronto → Egor69 dévoile son univers.\n\nTu veux une app qui parle vrai sur la souveraineté et l'économie circulaire ? Viens voir.\n\nhttps://egor69.ca\n\n#Egor69 #EcoCirculaire #Radar",
  },
  {
    platform: "Reddit",
    emoji: "🔴",
    msg: "Lancement Egor69 ce soir 19h Toronto — hub circulaire avec radar Golden Nuggets.\n\nOn évite le hype vide : démo live, docs accessibles, communauté ouverte.\n\nhttps://egor69.ca\n\nr/sustainability · r/circulareconomy",
  },
  {
    platform: "WhatsApp/Telegram",
    emoji: "💬",
    msg: "🌙 Ce soir 19h (Toronto)\n\nEgor69 — plateforme circulaire majestueuse, sans mensonge sur les métriques.\nRadar · hubs · souveraineté utilisateur.\n\nPartage le lien : https://egor69.ca",
  },
];

export default function LaunchNight() {
  const [countdown, setCountdown] = useState({});
  const [phase, setPhase] = useState("waiting");
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const torontoTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Toronto" }));
      const today = new Date(torontoTime.getFullYear(), torontoTime.getMonth(), torontoTime.getDate());
      const launchTime = new Date(today.getTime() + 19 * 60 * 60 * 1000);

      if (torontoTime >= launchTime) {
        setPhase("live");
        setCountdown({ h: 0, m: 0, s: 0 });
      } else {
        const diff = launchTime - torontoTime;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown({ h, m, s });
        setPhase("waiting");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = (text, platform) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    toast.success(`${platform} — Copié! Poste partout 🚀`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: "linear-gradient(135deg, hsl(220,40%,5%) 0%, hsl(260,70%,8%) 50%, hsl(158,50%,10%) 100%)" }}>
      {/* Main hero */}
      <div className="pt-20 px-4 text-center space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: "rgba(16,185,129,0.2)", border: "2px solid rgba(16,185,129,0.5)", color: "rgba(16,185,129,1)" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            🌍 EN DIRECT MAINTENANT 🌍
          </div>

          <h1 className="font-display text-7xl sm:text-8xl font-black text-white leading-none tracking-tight">
            <span className="text-rainbow">Egor69</span><br />
            <span className="text-emerald-300">LANCE CE SOIR</span>
          </h1>

          <p className="text-2xl font-bold text-amber-300">19:00 TORONTO · 00:00 UTC</p>
        </div>

        {/* Countdown */}
        {phase === "waiting" && (
          <div className="rounded-3xl p-12 border-2 border-emerald-400/50" style={{ background: "rgba(16,185,129,0.08)" }}>
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              {[
                { val: countdown.h, label: "H" },
                { val: countdown.m, label: "M" },
                { val: countdown.s, label: "S" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <div className="text-5xl sm:text-7xl font-black text-emerald-400" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {String(item.val).padStart(2, "0")}
                  </div>
                  <div className="text-sm font-bold text-emerald-300 mt-2">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "live" && (
          <div className="rounded-3xl p-12 border-2 border-rose-400/50 bg-gradient-to-r from-rose-500/20 to-pink-500/20 animate-pulse">
            <Rocket className="h-16 w-16 text-rose-400 mx-auto mb-4" />
            <p className="text-4xl font-black text-white">🎉 C'EST LIVE! 🎉</p>
            <p className="text-rose-300 font-bold mt-2">Egor69 est en ligne — bienvenue dans le hall cosmique.</p>
          </div>
        )}

        {/* Copy to all platforms */}
        <div className="space-y-3">
          <p className="text-white/60 font-semibold">👇 Copie ces messages et poste partout (literally everywhere):</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MESSAGES.map((msg) => (
              <button
                key={msg.platform}
                onClick={() => handleCopy(msg.msg, msg.platform)}
                className="group relative overflow-hidden rounded-2xl p-5 text-left border border-white/10 hover:border-white/30 transition-all duration-300 bg-white/5 hover:bg-white/10"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "radial-gradient(circle at center, rgba(16,185,129,0.1), transparent)" }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{msg.emoji}</span>
                    {copied === msg.platform ? (
                      <span className="text-xs font-bold text-emerald-400">✅ COPIÉ</span>
                    ) : (
                      <Copy className="h-4 w-4 text-white/40 group-hover:text-white/80 transition-colors" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white/90 mb-2">{msg.platform}</p>
                  <p className="text-xs text-white/60 line-clamp-3 whitespace-pre-wrap">{msg.msg}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Final message */}
        <div className="rounded-3xl p-8 border-2 border-amber-400/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10 space-y-4">
          <Heart className="h-8 w-8 text-amber-400 mx-auto" />
          <div className="space-y-2">
            <p className="text-xl font-bold text-white">Poste maintenant.</p>
            <p className="text-white/70">Partage le lien. Invite chacun que tu connaîs. Le monde attend.</p>
            <p className="text-amber-300 font-semibold">19h00 = L'histoire commence.</p>
          </div>
        </div>

        {/* Back to home */}
        <Button asChild size="lg" className="rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 border-0 text-white" variant="default">
          <Link to="/">
            <Rocket className="h-5 w-5 mr-2" />
            Retour à Egor69
          </Link>
        </Button>
      </div>
    </div>
  );
}