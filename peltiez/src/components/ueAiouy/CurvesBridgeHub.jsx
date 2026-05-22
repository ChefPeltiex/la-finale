import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RosslerBridgePanel from "@/components/ueAiouy/RosslerBridgePanel";
import PeanoBridgePreview from "@/components/ueAiouy/PeanoBridgePreview";
import PolarBridgePreview from "@/components/ueAiouy/PolarBridgePreview";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { assignHilbertLayout, downloadPeanoMaillageJson, sortMaillageIds } from "@/lib/math/peanoBridge";
import { POLAR_ROSE_DEFAULT, downloadPolarBridgeJson, polarRosePoints } from "@/lib/math/polarCurve";

export default function CurvesBridgeHub() {
  const [maillageLayout, setMaillageLayout] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/docs/encyclopedie/generated/ensemble-manifest.json")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const fiches = (data.spine || []).filter((x) => x.type === "fiche-maillage");
        const ids = sortMaillageIds(fiches.map((f) => f.id));
        const layout = assignHilbertLayout(ids).map((cell) => {
          const meta = fiches.find((f) => f.id === cell.id);
          return { ...cell, title: meta?.title ?? cell.id };
        });
        setMaillageLayout(layout);
      })
      .catch(() => {
        if (!cancelled) setMaillageLayout(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const polarPoints = useMemo(() => polarRosePoints(POLAR_ROSE_DEFAULT), []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground max-w-2xl">
        Trois courbes exportables vers Unreal (spline / Niagara) : même logique web → éditeur. Aucun plugin Epic
        dans ce dépôt.
      </p>
      <Tabs defaultValue="rossler" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="rossler">Rössler · pont</TabsTrigger>
          <TabsTrigger value="peano">Peano · 126 fiches</TabsTrigger>
          <TabsTrigger value="polar">Polaire · sigil</TabsTrigger>
        </TabsList>
        <TabsContent value="rossler" className="mt-4">
          <RosslerBridgePanel embedded />
        </TabsContent>
        <TabsContent value="peano" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-[#D4AF37]/25 bg-zinc-950/80 p-5 space-y-4">
            <h3 className="text-[#FFD700] font-semibold">Atlas maillage — courbe de remplissage</h3>
            <p className="text-sm text-muted-foreground">
              Les fiches D01–D14 × S01–S09 suivent un parcours Hilbert (famille Peano) : un seul fil visite tout
              l&apos;espace sans sauter au hasard.
            </p>
            <PeanoBridgePreview layout={maillageLayout} />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 gap-2"
                disabled={!maillageLayout?.length}
                onClick={() => maillageLayout && downloadPeanoMaillageJson(maillageLayout)}
              >
                <Download className="h-4 w-4" />
                peano-maillage-bridge.json
              </Button>
              <Button type="button" variant="outline" asChild>
                <a href="/ue-aiouy/peano-maillage-bridge.sample.json" download>
                  Échantillon
                </a>
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="polar" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-teal-500/25 bg-zinc-950/80 p-5 space-y-4">
            <h3 className="text-teal-300 font-semibold">Rose polaire · Codex / Verse</h3>
            <pre className="text-xs font-mono text-muted-foreground bg-black/50 p-3 rounded-lg">
              r = a·cos(b·θ) · a=3, b=0.95
            </pre>
            <PolarBridgePreview />
            <Button
              type="button"
              variant="outline"
              className="gap-2 border-teal-500/40"
              onClick={() => downloadPolarBridgeJson(polarPoints, POLAR_ROSE_DEFAULT)}
            >
              <Download className="h-4 w-4" />
              polar-rose-bridge.json
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
