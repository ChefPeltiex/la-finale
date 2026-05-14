import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { BIBLE_ENTRIES } from "@/data/bibleEncyclopedia";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Sparkles, Box, Network } from "lucide-react";
import { BIBLE_TIMELINE } from "@/data/bibleEncyclopedia";

export default function BibleEntryDetail() {
  const { id } = useParams();
  const entry = useMemo(() => BIBLE_ENTRIES.find((e) => e.id === id) || null, [id]);
  const related = useMemo(() => {
    if (!entry) return [];
    const tags = new Set(entry.tags || []);
    return BIBLE_ENTRIES
      .filter((e) => e.id !== entry.id)
      .map((e) => {
        const common = (e.tags || []).filter((t) => tags.has(t));
        return { e, score: common.length };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.e);
  }, [entry]);

  const timelineHits = useMemo(() => {
    if (!entry) return [];
    return (BIBLE_TIMELINE || []).filter((t) => (t.entryIds || []).includes(entry.id));
  }, [entry]);

  if (!entry) {
    return (
      <div className="pb-20 space-y-6">
        <SEOMeta title="Encyclopédie — Introuvable | Egor69" canonicalUrl={`/encyclopedie-biblique/${id || ""}`} />
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">Entrée introuvable.</p>
          <Button asChild className="mt-4 rounded-xl" variant="outline">
            <Link to="/encyclopedie-biblique">Retour au portail</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title={`${entry.title} — Encyclopédie Biblique | Egor69`}
        description={entry.summary}
        keywords={`bible, encyclopédie, ${entry.tags?.join(", ")}`}
        canonicalUrl={`/encyclopedie-biblique/${entry.id}`}
        schemaData={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.title,
          description: entry.summary,
          keywords: entry.tags,
        }}
      />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/encyclopedie-biblique">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Link>
        </Button>
        <Badge className="bg-black/30 text-white border-white/10">
          <BookOpen className="h-3.5 w-3.5 mr-2" /> {entry.category}
        </Badge>
      </div>

      <div className="rounded-3xl overflow-hidden border border-white/10 bg-card">
        <div className="aspect-[16/8] bg-black/40 relative">
          <img src={entry.media?.hero} alt={entry.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.78))" }} />
          <div className="absolute left-0 right-0 bottom-0 p-7 space-y-2">
            <p className="text-white/60 font-mono text-xs tracking-widest uppercase">{entry.category}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white">{entry.title}</h1>
            <p className="text-white/70 max-w-3xl">{entry.subtitle}</p>
          </div>
        </div>

        <div className="p-7 space-y-7">
          <p className="text-sm text-muted-foreground leading-relaxed">{entry.summary}</p>

          <div className="flex flex-wrap gap-2">
            {(entry.tags || []).map((t) => (
              <span key={t} className="text-[10px] font-mono px-2 py-1 rounded-full bg-white/5 text-white/55 border border-white/10">
                #{t}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">
              {(entry.sections || []).map((s) => (
                <section key={s.h} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <h2 className="font-display text-xl font-black text-foreground">{s.h}</h2>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.p}</p>
                </section>
              ))}

              {timelineHits.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-2">
                  <h2 className="font-display text-xl font-black text-foreground">Repères (Timeline)</h2>
                  <ul className="space-y-2">
                    {timelineHits.map((t) => (
                      <li key={t.id} className="text-sm text-muted-foreground">
                        <span className="text-white/60 font-mono text-xs uppercase tracking-widest">{t.era} · {t.when}</span>
                        <div className="text-foreground font-bold">{t.title}</div>
                        <div className="text-muted-foreground">{t.summary}</div>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3">
                    <Button asChild variant="outline" className="rounded-xl">
                      <Link to="/encyclopedie-biblique/timeline">Ouvrir la timeline →</Link>
                    </Button>
                  </div>
                </section>
              )}

              {related.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-3">
                  <h2 className="font-display text-xl font-black text-foreground">Liens croisés (automatiques)</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {related.map((r) => (
                      <Link key={r.id} to={`/encyclopedie-biblique/${r.id}`} className="rounded-xl border border-white/10 bg-card p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        <p className="text-xs text-white/45 font-mono uppercase tracking-widest">{r.category}</p>
                        <p className="font-black text-foreground">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-4">
              <p className="text-xs font-black tracking-[0.25em] uppercase text-white/60">Virtuel</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Scène</span>
                  <span className="text-white font-black">{entry.virtual?.scene || "—"}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-white/50">Props</span>
                  <span className="text-white/70 text-right">{(entry.virtual?.props || []).join(", ") || "—"}</span>
                </div>
                {entry.geo?.lat && entry.geo?.lng && (
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-white/50">Coord.</span>
                    <span className="text-white/70 text-right">
                      {entry.geo.lat.toFixed(4)}, {entry.geo.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Button asChild className="rounded-xl btn-magic border-0 text-white font-black">
                  <Link to="/pantheon-3d">Voir l’univers 3D</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
                  <Link to={`/encyclopedie-biblique/scene/${entry.id}`}><Box className="h-4 w-4 mr-2" /> Scène 3D</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
                  <Link to="/encyclopedie-biblique/graphe"><Network className="h-4 w-4 mr-2" /> Graphe (Synergie)</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
                  <Link to="/encyclopedie-biblique/carte">Carte des lieux</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
                  <Link to="/pantheon-renders">Galerie Renders</Link>
                </Button>
              </div>
            </aside>
          </div>

          <div className="text-center text-white/40 text-xs">
            <Sparkles className="h-4 w-4 inline mr-2" />
            Étape suivante: cartes interactives, timeline, et scènes 3D liées à chaque entrée.
          </div>
        </div>
      </div>
    </div>
  );
}

