import { useMemo, useState } from "react";
import { unlockGrosCalin } from "@/lib/grosCalin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";

export default function GrosCalinGate({ onUnlocked }) {
  const [checked, setChecked] = useState(false);
  const [kind, setKind] = useState("open");

  const copy = useMemo(() => {
    if (kind === "open") {
      return {
        title: "Filtre Gros Câlin",
        line: "L’Encyclopédie s’ouvre aux âmes ouvertes. Zéro jugement, zéro troll.",
        pledge: "Je viens avec curiosité, bienveillance, et envie d’apprendre.",
      };
    }
    return {
      title: "Parvis",
      line: "Tu peux visiter la surface. Les profondeurs demandent une intention claire.",
      pledge: "Je garde mes jugements pour moi. Je cherche le soin.",
    };
  }, [kind]);

  const unlock = () => {
    if (!checked) return;
    unlockGrosCalin();
    if (typeof onUnlocked === "function") onUnlocked();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 pb-20 pt-10">
      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        <div
          className="p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.10), rgba(99,102,241,0.08))",
          }}
        >
          <Badge className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0 font-bold px-4 py-1">
            ACCÈS — GROS CÂLIN
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground mt-4">
            {copy.title}
          </h1>
          <p className="text-muted-foreground text-lg mt-3">{copy.line}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              variant={kind === "open" ? "default" : "outline"}
              onClick={() => setKind("open")}
              className="gap-2"
            >
              <Heart className="h-4 w-4" /> Âme ouverte
            </Button>
            <Button
              variant={kind === "parvis" ? "default" : "outline"}
              onClick={() => setKind("parvis")}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" /> Parvis
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="rounded-2xl border border-border p-5 bg-background/30">
            <p className="text-sm text-muted-foreground mb-2">Intention</p>
            <p className="text-foreground font-medium">{copy.pledge}</p>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-border p-5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1"
            />
            <div className="space-y-1">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Je choisis la bienveillance
              </p>
              <p className="text-sm text-muted-foreground">
                L’accès est local (sur cet appareil). Pas de compte. Pas de tracking.
              </p>
            </div>
          </label>

          <div className="flex flex-wrap gap-3">
            <Button onClick={unlock} disabled={!checked} className="gap-2">
              <Heart className="h-4 w-4" /> Entrer dans les profondeurs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

