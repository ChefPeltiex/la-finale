import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Network } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import PeanoAtlasCanvas from "@/components/encyclopedie/PeanoAtlasCanvas";
import { Button } from "@/components/ui/button";
import { assignHilbertLayout, downloadPeanoMaillageJson, sortMaillageIds } from "@/lib/math/peanoBridge";

export default function EncyclopediePeanoAtlas() {
  const [layout, setLayout] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/docs/encyclopedie/generated/ensemble-manifest.json")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const fiches = (data.spine || []).filter((x) => x.type === "fiche-maillage");
        const ids = sortMaillageIds(fiches.map((f) => f.id));
        const mapped = assignHilbertLayout(ids).map((cell) => {
          const meta = fiches.find((f) => f.id === cell.id);
          return { ...cell, title: meta?.title ?? cell.id, tome: meta?.tome };
        });
        setLayout(mapped);
        setSelected(mapped[0] ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#F5F0E6] px-4 py-10">
      <SEOMeta
        title="Atlas Peano — maillage 126 fiches | Encyclopédie"
        description="Parcours de remplissage : 14 domaines × 9 sujets, ordre Hilbert pour le Verse et Unreal."
        canonicalUrl="/encyclopedie/atlas-peano"
      />

      <div className="max-w-5xl mx-auto">
        <Link to="/encyclopedie" className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#FFD700] mb-6">
          <ArrowLeft className="h-4 w-4" />
          Encyclopédie illustrée
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <Network className="h-6 w-6 text-[#FFD700]" />
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#FFD700] uppercase">Atlas Peano</h1>
        </div>
        <p className="text-sm text-[#F5F0E6]/70 max-w-2xl mb-8">
          Un seul fil visite les <strong className="text-[#FFD700] font-normal">{layout.length || 126} fiches</strong>{" "}
          sans sauter au hasard — métaphore Egor ; export identique dans{" "}
          <Link to="/ue-aiouy" className="text-[#D4AF37] underline">
            UEAIOUY
          </Link>
          .
        </p>

        {loading ? (
          <p className="text-muted-foreground text-sm">Chargement du maillage…</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <PeanoAtlasCanvas layout={layout} highlightId={selected?.id} onSelect={setSelected} />
            <div className="space-y-4">
              {selected && (
                <div className="rounded-xl border border-[#D4AF37]/35 bg-zinc-950 p-5">
                  <p className="text-[10px] tracking-widest text-[#D4AF37] uppercase">
                    Étape {selected.peanoIndex + 1} / {layout.length}
                  </p>
                  <p className="font-mono text-[#FFD700] mt-1">{selected.id}</p>
                  <h2 className="text-lg font-semibold text-white mt-2">{selected.title}</h2>
                  <Button asChild className="mt-4 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 w-full sm:w-auto">
                    <Link to={`/encyclopedie/maillage/${selected.id}`}>Lire la fiche</Link>
                  </Button>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                className="border-[#D4AF37]/40 gap-2"
                onClick={() => downloadPeanoMaillageJson(layout)}
              >
                <Download className="h-4 w-4" />
                Exporter pour Unreal
              </Button>
              <p className="text-xs text-[#F5F0E6]/45">
                Courbe de Hilbert (famille Peano). Cliquez un point sur la carte pour ouvrir la fiche.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
