import { useMemo } from "react";
import { Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import RosslerBridgePreview from "@/components/ueAiouy/RosslerBridgePreview";
import {
  ROSSLER_DEFAULT_PARAMS,
  downloadRosslerBridgeJson,
  integrateRossler,
  normalizeRosslerPoints,
} from "@/lib/rosslerAttractor";

export default function RosslerBridgePanel({ embedded = false }) {
  const exportPoints = useMemo(() => {
    const raw = integrateRossler(ROSSLER_DEFAULT_PARAMS);
    return normalizeRosslerPoints(raw, 0.12);
  }, []);

  const inner = (
    <div className="rounded-2xl border border-[#D4AF37]/25 bg-gradient-to-b from-zinc-950 to-black p-6 space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <Sparkles className="h-6 w-6 text-[#FFD700] shrink-0 mt-0.5" aria-hidden />
        <div>
          <h2 className="text-lg font-semibold text-[#FFD700]">Attracteur de Rössler — pont Verse → Unreal</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Même courbe en navigateur (Three.js) et dans l&apos;éditeur (spline / Niagara). Spirale = cycles ;
            boucle qui monte = rupture / passage Outworld. Pas une preuve scientifique — une{" "}
            <strong className="text-foreground">signature visuelle</strong> partagée.
          </p>
        </div>
      </div>

      <pre className="text-xs text-[#F5F0E6]/80 bg-black/60 rounded-lg p-4 overflow-x-auto border border-white/10 font-mono">
        {`dx/dt = -y - z\ndy/dt = x + a·y\ndz/dt = b + z·(x - c)   (a≈0.2, b≈0.2, c≈5.7)`}
      </pre>

      <RosslerBridgePreview />

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 gap-2"
          onClick={() => downloadRosslerBridgeJson(exportPoints, ROSSLER_DEFAULT_PARAMS)}
        >
          <Download className="h-4 w-4" />
          Exporter rossler-bridge.json (UE)
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href="/ue-aiouy/rossler-bridge.sample.json" download="rossler-bridge.sample.json">
            Échantillon JSON
          </a>
        </Button>
      </div>

      <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-foreground">Unreal</strong> : importer le JSON (Blueprint : tableau de FVector).
        </li>
        <li>
          <strong className="text-foreground">Spline</strong> : un point tous les N indices pour alléger le mesh.
        </li>
        <li>
          <strong className="text-foreground">Niagara</strong> : ruban le long de la spline.
        </li>
        <li>
          <strong className="text-foreground">Web</strong> : portail Verse (<code className="rounded bg-muted px-1">/world</code>).
        </li>
      </ol>
    </div>
  );

  if (embedded) return inner;
  return <section className="space-y-6">{inner}</section>;
}
