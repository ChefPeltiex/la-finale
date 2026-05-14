import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Volume2, Waves, Sparkles, HeartHandshake } from "lucide-react";

function useOscillator() {
  const ctxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  const start = async ({ freq = 196, gain = 0.03 } = {}) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;

    if (!ctxRef.current) ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") await ctx.resume();

    if (oscRef.current) return true;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();

    oscRef.current = osc;
    gainRef.current = g;
    return true;
  };

  const stop = () => {
    try {
      oscRef.current?.stop();
    } catch {}
    oscRef.current = null;
    gainRef.current = null;
  };

  useEffect(() => stop, []);
  return { start, stop };
}

export default function SensoryCard({ card, className }) {
  const { start, stop } = useOscillator();
  const [soundOn, setSoundOn] = useState(false);
  const goodness = Math.max(0, Math.min(1, card?.dna?.goodness ?? 1));

  const aura = useMemo(() => {
    const g = Math.round(goodness * 100);
    return g >= 85 ? "Bonté Divine" : g >= 60 ? "Bonté Forte" : "Bonté en croissance";
  }, [goodness]);

  const vibrate = () => {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate([30, 40, 30]);
    }
  };

  const toggleSound = async () => {
    if (!soundOn) {
      const ok = await start({ freq: 196, gain: 0.02 + goodness * 0.015 });
      if (ok) setSoundOn(true);
      vibrate();
    } else {
      stop();
      setSoundOn(false);
      vibrate();
    }
  };

  if (!card) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "rounded-3xl border border-border overflow-hidden bg-card relative",
        className
      )}
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.55), transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(147,51,234,0.45), transparent 70%)",
            filter: "blur(35px)",
          }}
        />
      </div>

      <div className="relative z-10 p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-600 text-white border-0">{card.kind}</Badge>
            <Badge variant="secondary" className="gap-1">
              <HeartHandshake className="h-3.5 w-3.5" /> {aura}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant={soundOn ? "default" : "outline"} className="gap-2" onClick={toggleSound}>
              <Volume2 className="h-4 w-4" /> {soundOn ? "Audio ON" : "Audio"}
            </Button>
            <Button variant="outline" className="gap-2" onClick={vibrate}>
              <Waves className="h-4 w-4" /> Vibrer
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-4xl font-black text-foreground">{card.title}</h1>
          {card.summary ? <p className="text-muted-foreground text-lg">{card.summary}</p> : null}
        </div>

        {card.poem ? (
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="whitespace-pre-wrap rounded-2xl border border-border p-5 text-sm leading-relaxed"
            style={{
              background: "rgba(255,255,255,0.03)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)",
            }}
          >
            {card.poem}
          </motion.pre>
        ) : null}

        {card.body ? (
          <div className="rounded-2xl border border-border p-5 text-sm leading-relaxed bg-background/30">
            {card.body}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 items-center">
          <Sparkles className="h-4 w-4 text-primary" />
          {(card.tags || []).map(t => (
            <Badge key={t} variant="outline" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

