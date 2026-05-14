import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { BIBLE_CATEGORIES, BIBLE_ENTRIES } from "@/data/bibleEncyclopedia";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Sparkles, ArrowRight, MapPin, Clock } from "lucide-react";
import { Network } from "lucide-react";

export default function BibleEncyclopedia() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tous");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return BIBLE_ENTRIES.filter((e) => {
      const matchCat = cat === "Tous" || e.category === cat;
      const blob = `${e.title} ${e.subtitle} ${e.category} ${(e.tags || []).join(" ")} ${e.summary}`.toLowerCase();
      const matchQ = !query || blob.includes(query);
      return matchCat && matchQ;
    });
  }, [q, cat]);

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title="Encyclopédie Biblique — Visuelle & Virtuelle | Egor69"
        description="Encyclopédie biblique interactive: livres, personnes, lieux, thèmes, symboles et lignes du temps. Fiches visuelles + univers immersif."
        keywords="encyclopédie biblique, bible, fiches, lieux, personnages, thèmes, virtuel, igor"
        canonicalUrl="/encyclopedie-biblique"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Encyclopédie Biblique — Egor69",
          description: "Portail encyclopédique: fiches, médias, navigation, recherche.",
        }}
      />

      <div
        className="relative rounded-3xl overflow-hidden p-10 text-center border border-white/10"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.08), rgba(245,158,11,0.10))" }}
      >
        <div className="absolute inset-0 opacity-35 pointer-events-none aurora" />
        <div className="relative z-10 space-y-4">
          <Badge className="bg-black/30 text-white border-white/10 px-4 py-1">
            <BookOpen className="h-3.5 w-3.5 mr-2" /> ENCYCLOPÉDIE BIBLIQUE
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
            La bibliothèque <span className="text-golden">visuelle</span> & <span className="text-magic">virtuelle</span>
          </h1>
          <p className="text-white/70 max-w-3xl mx-auto text-lg">
            Recherche instantanée, fiches, médias, et une base conçue pour devenir la plus complète de tous les temps.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild className="rounded-xl btn-magic border-0 text-white font-black">
              <Link to="/pantheon-renders">
                Explorer le Panthéon <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
              <Link to="/pantheon-3d">Basculer en 3D</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
              <Link to="/encyclopedie-biblique/timeline"><Clock className="h-4 w-4 mr-2" /> Timeline</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
              <Link to="/encyclopedie-biblique/carte"><MapPin className="h-4 w-4 mr-2" /> Carte</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
              <Link to="/encyclopedie-biblique/graphe"><Network className="h-4 w-4 mr-2" /> Graphe</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher: Genèse, Alliance, Moïse, Jérusalem…"
            className="pl-10 rounded-xl h-12 bg-card"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {BIBLE_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                cat === c ? "bg-primary text-primary-foreground border-primary/50 shadow-magic" : "bg-card text-muted-foreground border-border hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <Link
            key={e.id}
            to={`/encyclopedie-biblique/${e.id}`}
            className="group rounded-2xl overflow-hidden border border-white/10 bg-card hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="aspect-[16/9] bg-black/40 overflow-hidden">
              <img src={e.media?.hero} alt={e.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform" loading="lazy" />
            </div>
            <div className="p-5 space-y-2">
              <p className="text-xs text-white/45 font-mono uppercase tracking-widest">{e.category}</p>
              <h3 className="font-display font-black text-lg text-foreground">{e.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{e.subtitle}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(e.tags || []).slice(0, 4).map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-1 rounded-full bg-white/5 text-white/50 border border-white/10">
                    #{t}
                  </span>
                ))}
                {(e.tags || []).length > 4 && (
                  <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-white/5 text-white/40 border border-white/10">
                    +{(e.tags || []).length - 4}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-card rounded-3xl border border-dashed border-border">
          <Sparkles className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">Aucun résultat. Change le filtre ou la recherche.</p>
        </div>
      )}
    </div>
  );
}

