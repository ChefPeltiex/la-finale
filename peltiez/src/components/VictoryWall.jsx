import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AnimatedCounter from "@/components/AnimatedCounter";
import { ensureRadarMetrics, tickRadar, getRadarMetrics } from "@/lib/radarMetrics";
import { sovereignApiAbsolute, atlasFichesCountRefetchInterval } from "@/lib/sovereignAtlasApi";
import { LIVING_CARDS } from "@/data/livingCards";
import { Badge } from "@/components/ui/badge";
import { Radar, Activity, Globe2, Sparkles } from "lucide-react";
import { isSovereignContributor } from "@/lib/sovereignStatus";

export default function VictoryWall() {
  const [sovereignContributor, setSovereignContributor] = useState(() => isSovereignContributor());

  useEffect(() => {
    const sync = () => setSovereignContributor(isSovereignContributor());
    window.addEventListener("igor:sovereign:status", sync);
    return () => window.removeEventListener("igor:sovereign:status", sync);
  }, []);

  const { data } = useQuery({
    queryKey: ["igor-radar-metrics"],
    queryFn: async () => {
      await ensureRadarMetrics();
      return getRadarMetrics();
    },
    staleTime: 500,
    refetchInterval: 1000,
  });

  const { data: atlasLive } = useQuery({
    queryKey: ["atlas-fiches-vivantes-count"],
    queryFn: async () => {
      const r = await fetch(sovereignApiAbsolute("/api/atlas/fiches-vivantes-count"), { credentials: "omit" });
      if (!r.ok) throw new Error("atlas api");
      return r.json();
    },
    staleTime: 0,
    refetchInterval: atlasFichesCountRefetchInterval,
    retry: 0,
  });

  useEffect(() => {
    // heartbeat: show visible motion without spamming
    const t = setInterval(() => {
      tickRadar({ bump: true }).catch(() => {});
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const members = data?.hub_members ?? 1;
  const regions = data?.regions ?? 1;
  const scans = data?.radar_scans ?? 0;
  const strategicFiches = LIVING_CARDS.length;
  const fichesVivantes =
    typeof atlasLive?.fiches_vivantes_count === "number"
      ? Math.max(atlasLive.fiches_vivantes_count, strategicFiches)
      : strategicFiches;

  const memberLabel = sovereignContributor ? "Contributeur Souverain" : "Membres (POC)";

  return (
    <div
      className="rounded-3xl overflow-hidden border border-border"
      style={{
        background:
          "radial-gradient(1200px 400px at 20% 10%, rgba(16,185,129,0.20), transparent 60%), radial-gradient(900px 380px at 90% 20%, rgba(99,102,241,0.18), transparent 55%), linear-gradient(135deg, rgba(5,10,25,0.92), rgba(5,20,12,0.88))",
      }}
    >
      <div className="p-8 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Badge className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0 font-bold px-4 py-1">
              MUR DE LA VICTOIRE — RADAR
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white flex items-center gap-2">
              <Radar className="h-6 w-6 text-amber-300" /> Expansion visible
            </h2>
            <p className="text-white/60">
              Croissance et battement: preuve de santé du Hub (mode souverain, sans infrastructure externe).
            </p>
          </div>

          <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
            <Activity className="h-4 w-4 text-emerald-300 animate-pulse" />
            heartbeat: {data?.last_heartbeat ? new Date(data.last_heartbeat).toLocaleTimeString() : "…"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { icon: Sparkles, label: memberLabel, value: members, color: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.35)" },
            { icon: Globe2, label: "Régions", value: regions, color: "rgba(59,130,246,0.14)", border: "rgba(59,130,246,0.30)" },
            { icon: Radar, label: "Scans Radar", value: scans, color: "rgba(245,158,11,0.14)", border: "rgba(245,158,11,0.28)" },
            { icon: Sparkles, label: "Fiches vivantes", value: fichesVivantes, color: "rgba(99,102,241,0.14)", border: "rgba(99,102,241,0.28)" },
          ].map(({ icon: Icon, label, value, color, border }) => (
            <div
              key={label}
              className="rounded-2xl p-5 border"
              style={{ background: color, borderColor: border }}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/60 font-medium">{label}</p>
                <Icon className="h-4 w-4 text-white/50" />
              </div>
              <p className="mt-3 text-4xl font-black text-white tracking-tight">
                <AnimatedCounter target={value} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

