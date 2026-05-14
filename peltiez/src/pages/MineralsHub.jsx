import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import SpecimenCard from "@/components/SpecimenCard";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MineralsHub() {
  const [search, setSearch] = useState("");

  const { data: minerals = [], isLoading } = useQuery({
    queryKey: ["minerals"],
    queryFn: () => base44.entities.Mineral.filter({ is_published: true }, "-created_date", 100),
    staleTime: 120_000
  });

  const filtered = useMemo(() =>
    minerals.filter(m => {
      const q = search.toLowerCase();
      return !q || m.name?.toLowerCase().includes(q) || m.chemical_formula?.toLowerCase().includes(q);
    }),
    [minerals, search]
  );

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Minerals Hub - Pierres et Cristaux | CirculAI Hub"
        description="Découvrez minéraux et cristaux. Propriétés, système cristallin, dureté, utilisations. Guide géologique interactif."
        keywords="minéraux, cristaux, géologie, pierres précieuses, durée Mohs"
        canonicalUrl="https://egor69.ca/minerals-hub"
      />

      {/* Hero */}
      <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-slate-500/10 to-gray-500/10 border border-slate-200/20">
        <div className="text-5xl mb-4 animate-bounce" style={{ animationDuration: "2.5s" }}>💎</div>
        <h1 className="font-display text-4xl font-black text-foreground">Minerals Hub</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Pierres et cristaux · Propriétés géologiques, histoire et folklore
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher minéral ou formule chimique..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-11"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">Aucun minéral trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{filtered.length} minéraux trouvés</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(mineral => (
              <SpecimenCard key={mineral.id} specimen={mineral} type="mineral" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}