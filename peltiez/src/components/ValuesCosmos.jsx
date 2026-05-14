import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Scale, Sparkles, Radar, BookOpen, Shield } from "lucide-react";

const ATLAS_LIVING = "/atlas?section=fiches-vivantes";

const VALUES = [
  {
    key: "soin",
    title: "Soin",
    desc: "Chaque action doit guérir: humain + planète.",
    icon: HeartHandshake,
    to: ATLAS_LIVING,
    glow: "rgba(16,185,129,0.22)",
  },
  {
    key: "verite",
    title: "Vérité",
    desc: "Preuves. Transparence. Pas de théâtre.",
    icon: Shield,
    to: "/transparency-log",
    glow: "rgba(59,130,246,0.18)",
  },
  {
    key: "justice",
    title: "Justice",
    desc: "La Sentinelle: incidents anonymisés, impacts, réparation.",
    icon: Scale,
    to: "/sentinelle",
    glow: "rgba(245,158,11,0.16)",
  },
  {
    key: "abondance",
    title: "Abondance",
    desc: "Valeur créée / (gaspillage + opacité).",
    icon: Sparkles,
    to: ATLAS_LIVING,
    glow: "rgba(168,85,247,0.18)",
  },
  {
    key: "radar",
    title: "Radar",
    desc: "Golden Nuggets → Quêtes légendaires.",
    icon: Radar,
    to: "/dashboard-royal",
    glow: "rgba(255,215,0,0.16)",
  },
  {
    key: "savoirs",
    title: "Savoirs",
    desc: "Une fiche = une sensation + une action.",
    icon: BookOpen,
    to: ATLAS_LIVING,
  },
];

export default function ValuesCosmos() {
  return (
    <div
      className="rounded-3xl border border-border overflow-hidden relative noise"
      style={{
        background:
          "radial-gradient(1200px 420px at 15% 15%, rgba(16,185,129,0.18), transparent 55%), radial-gradient(900px 420px at 85% 20%, rgba(99,102,241,0.16), transparent 55%), linear-gradient(135deg, rgba(5,10,25,0.92), rgba(5,20,12,0.88))",
      }}
    >
      <div className="absolute inset-0 aurora opacity-35 pointer-events-none" />

      <div className="relative z-10 p-8 sm:p-10 space-y-7">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-3">
            <Badge className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0 font-bold px-4 py-1">
              COSMOS DE VALEURS
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white leading-tight">
              Un bonheur infini,
              <br />
              <span className="text-white/65">par la circulation du soin.</span>
            </h2>
            <p className="text-white/60 max-w-2xl">
              Ici, on ne “consomme” pas: on se relève ensemble. Chaque module existe pour une raison — et cette raison est humaine.
            </p>
          </div>
          <Button asChild className="rounded-xl font-black">
            <Link to={ATLAS_LIVING}>Entrer dans l’Atlas</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <Link
                key={v.key}
                to={v.to}
                className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/7 transition-all hover:-translate-y-0.5 overflow-hidden"
                style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 0 80px ${v.glow}` }}
              >
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{v.title}</p>
                    <Icon className="h-5 w-5 text-white/60" />
                  </div>
                  <p className="text-sm text-white/60">{v.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

