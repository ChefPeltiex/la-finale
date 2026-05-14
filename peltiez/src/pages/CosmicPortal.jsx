import { useState, useMemo } from "react";
import SEOMeta from "@/components/SEOMeta";
import { Globe, Star, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { COSMIC_DATA, COSMIC_CATEGORIES } from "@/data/cosmicKnowledge";

export default function CosmicPortal() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() =>
    COSMIC_DATA.filter(item => {
      const q = search.toLowerCase();
      const blob = `${item.title} ${item.desc} ${item.facts.join(" ")}`.toLowerCase();
      const matchSearch = !q || blob.includes(q);
      const matchCat = category === "all" || item.category === category;
      return matchSearch && matchCat;
    }),
    [search, category]
  );

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Cosmic Portal — Astronomy & Cosmology",
    "description": "Explore the universe: galaxies, stars, planets, cosmic phenomena and space science."
  };

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title="Portail cosmique — Astronomie, cosmologie & exploration | Egor69"
        description="Atlas de vulgarisation scientifique : galaxies, trous noirs, CMB, système solaire, astros chimiques, missions spatiales — faits contextualisés et ordres de grandeur honnêtes."
        keywords="astronomie, cosmologie, matière noire, trous noirs, CMB, JWST, relativité générale, système solaire, Egor69"
        canonicalUrl="https://egor69.ca/cosmic-portal"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden p-10 text-center"
        style={{ background: "linear-gradient(135deg, hsl(260,70%,15%) 0%, hsl(200,60%,10%) 100%)" }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle at 20% 50%, hsla(260,80%,50%,0.4), transparent 70%), radial-gradient(circle at 80% 50%, hsla(200,80%,50%,0.3), transparent 70%)" }} />
        <div className="relative z-10 space-y-4">
          <div className="text-6xl animate-pulse">🌌</div>
          <h1 className="font-display text-4xl font-black text-white">Portail cosmique Egor69</h1>
          <p className="text-white/75 max-w-3xl mx-auto text-base leading-relaxed">
            Une traversée par couches : du grain interstellaire aux filaments de galaxies, des oscillations acoustiques baryoniques aux jets relativistes.
            Chaque fiche accumule des observations et des modèles — la carte est vivante, les incertitudes scientifiques assumées.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Chercher dans le cosmos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 rounded-xl h-12 bg-card"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 justify-center flex-wrap">
        {COSMIC_CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === cat.key
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-card border border-border text-muted-foreground hover:bg-accent"
            }`}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Globe className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun résultat cosmique</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div
              key={item.title}
              className="group bg-card rounded-2xl border border-indigo-200/30 p-6 hover:shadow-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 hover:-translate-y-1">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{item.emoji}</div>
              <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>

              {/* Facts */}
              <div className="space-y-2 pt-3 border-t border-border">
                {item.facts.map((fact, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>

              <Badge className="mt-4 bg-indigo-100 text-indigo-700 border-0 capitalize">
                {COSMIC_CATEGORIES.find(c => c.key === item.category)?.label}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-indigo-50 rounded-2xl border-2 border-indigo-300 p-4 text-center">
          <p className="text-3xl font-black text-indigo-600">13.8B</p>
          <p className="text-xs text-indigo-700 mt-1 font-bold">Âge univers (ans)</p>
        </div>
        <div className="bg-blue-50 rounded-2xl border-2 border-blue-300 p-4 text-center">
          <p className="text-3xl font-black text-blue-600">2T</p>
          <p className="text-xs text-blue-700 mt-1 font-bold">Galaxies observables</p>
        </div>
        <div className="bg-purple-50 rounded-2xl border-2 border-purple-300 p-4 text-center">
          <p className="text-lg font-black text-purple-700 leading-tight">Catalogues<br />vivants</p>
          <p className="text-xs text-purple-700 mt-1 font-bold">Gaia · SDSS · futurs LSST</p>
        </div>
        <div className="bg-cyan-50 rounded-2xl border-2 border-cyan-300 p-4 text-center">
          <p className="text-3xl font-black text-cyan-600">299K</p>
          <p className="text-xs text-cyan-700 mt-1 font-bold">km/s lumière</p>
        </div>
      </div>
    </div>
  );
}