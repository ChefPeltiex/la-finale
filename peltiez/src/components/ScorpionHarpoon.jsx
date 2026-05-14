import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Target, Zap } from "lucide-react";

export default function ScorpionHarpoon() {
  const nav = useNavigate();
  const loc = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only on the parvis (home) and only after a breath.
    if (loc.pathname !== "/") {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, [loc.pathname]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[min(92vw,720px)]">
      <div
        className="rounded-2xl border border-border overflow-hidden shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(5,10,25,0.92), rgba(5,20,12,0.88))",
        }}
      >
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-0 font-black">
                GET OVER HERE
              </Badge>
              <span className="text-xs text-white/50 font-mono flex items-center gap-1">
                <Target className="h-3.5 w-3.5" /> Harpon Scorpion
              </span>
            </div>
            <p className="text-sm sm:text-base text-white/80 mt-1 line-clamp-2">
              Entre dans l’Encyclopédie vivante. Une fiche = une sensation + une leçon.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => nav("/atlas?section=fiches-vivantes")}
              className="rounded-xl gap-2 font-black"
            >
              <Zap className="h-4 w-4" /> Vers l’Atlas <ArrowRight className="h-4 w-4" />
            </Button>
            <button
              onClick={() => setVisible(false)}
              className="text-white/40 hover:text-white/70 text-xs px-2"
              aria-label="Fermer"
            >
              fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

