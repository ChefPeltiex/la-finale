import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { PANTHEON_ENTITIES, PANTHEON_REALMS } from "@/data/pantheonEntities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Crown, ArrowRight } from "lucide-react";

function rarityBadge(rarity) {
  const r = String(rarity || "").toLowerCase();
  if (r === "legendary") return "bg-amber-500/15 text-amber-300 border-amber-400/30";
  if (r === "epic") return "bg-violet-500/15 text-violet-300 border-violet-400/30";
  if (r === "rare") return "bg-blue-500/15 text-blue-300 border-blue-400/30";
  return "bg-muted text-muted-foreground border-border";
}

export default function PantheonRenders() {
  const [q, setQ] = useState("");
  const [realm, setRealm] = useState("Tous");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PANTHEON_ENTITIES.filter((e) => {
      const matchRealm = realm === "Tous" || e.realm === realm;
      const blob = `${e.name} ${e.kind} ${e.realm} ${e.tagline} ${(e.tags || []).join(" ")}`.toLowerCase();
      const matchQ = !query || blob.includes(query);
      return matchRealm && matchQ;
    });
  }, [q, realm]);

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title="Panthéon — Renders & Fiches | Egor69"
        description="Le Panthéon Egor69: galerie premium, fiches descriptives, univers immersif. Renders d’entités originales et mythologiques (domaine public)."
        keywords="panthéon, renders, galerie, fiches, mythologie, entités, igor, omega"
        canonicalUrl="/pantheon-renders"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Panthéon — Renders & Fiches",
          description:
            "Galerie premium d’entités (renders) avec fiches descriptives. Univers immersif Egor69.",
        }}
      />

      {/* Hero */}
      <div
        className="relative rounded-3xl overflow-hidden p-10 text-center border border-white/10"
        style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.10), rgba(16,185,129,0.08), rgba(99,102,241,0.08))" }}
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none aurora" />
        <div className="relative z-10 space-y-4">
          <Badge className="bg-black/30 text-white border-white/10 px-4 py-1">
            <Crown className="h-3.5 w-3.5 mr-2" /> PANHÉON — RENDERS
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
            Galerie sacrée <span className="text-golden">ultra-premium</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Fiches complètes. Images. Lore. Tags. Recherche. Tout est prêt pour évoluer vers le portail 3D.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild className="rounded-xl font-black gap-2 btn-magic border-0 text-white">
              <Link to="/avatar-creator">
                Créer ton Avatar <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
              <Link to="/pricing">Activer l’Abondance (Stripe)</Link>
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
            placeholder="Rechercher: Ω, tore, science, nature…"
            className="pl-10 rounded-xl h-12 bg-card"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {PANTHEON_REALMS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRealm(r)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                realm === r
                  ? "bg-primary text-primary-foreground border-primary/50 shadow-magic"
                  : "bg-card text-muted-foreground border-border hover:bg-accent"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <Link
            key={e.id}
            to={`/pantheon-renders/${e.id}`}
            className="group rounded-2xl overflow-hidden border border-white/10 bg-card hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="aspect-[16/9] bg-black/40 overflow-hidden">
              <img
                src={e.media?.cover}
                alt={e.name}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                loading="lazy"
              />
            </div>
            <div className="p-5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-white/40 font-mono uppercase tracking-widest">{e.kind} · {e.realm}</p>
                  <h3 className="font-display font-black text-lg text-foreground">{e.name}</h3>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full border ${rarityBadge(e.rarity)}`}>
                  {String(e.rarity || "common").toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{e.tagline}</p>
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
          <p className="text-muted-foreground">Aucun résultat. Change le filtre ou élargis la recherche.</p>
        </div>
      )}
    </div>
  );
}

