import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { BIBLE_TIMELINE, BIBLE_ENTRIES } from "@/data/bibleEncyclopedia";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Clock, Search, Sparkles } from "lucide-react";

export default function BibleTimeline() {
  const [q, setQ] = useState("");
  const [era, setEra] = useState("Toutes");

  const eras = useMemo(() => ["Toutes", ...Array.from(new Set(BIBLE_TIMELINE.map((t) => t.era)))], []);

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    return BIBLE_TIMELINE.filter((t) => {
      const matchEra = era === "Toutes" || t.era === era;
      const blob = `${t.title} ${t.when} ${t.summary} ${t.era}`.toLowerCase();
      const matchQ = !query || blob.includes(query);
      return matchEra && matchQ;
    });
  }, [q, era]);

  const byId = useMemo(() => new Map(BIBLE_ENTRIES.map((e) => [e.id, e])), []);

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title="Timeline Biblique — Lignes du temps | Egor69"
        description="Timeline interactive: arcs, périodes, repères et liens directs vers les fiches."
        canonicalUrl="/encyclopedie-biblique/timeline"
        schemaData={{ "@context": "https://schema.org", "@type": "ItemList", name: "Timeline Biblique" }}
      />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/encyclopedie-biblique">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Link>
        </Button>
        <Badge className="bg-black/30 text-white border-white/10">
          <Clock className="h-3.5 w-3.5 mr-2" /> TIMELINE
        </Badge>
      </div>

      <div className="rounded-3xl overflow-hidden p-10 text-center border border-white/10 bg-black/20 relative">
        <div className="absolute inset-0 opacity-35 pointer-events-none aurora" />
        <div className="relative z-10 space-y-4">
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white">Ligne du temps</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Repères structurants + liens directs vers les fiches. Conçu pour devenir exhaustif.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un repère…"
            className="pl-10 rounded-xl h-12 bg-card"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {eras.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEra(e)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                era === e ? "bg-primary text-primary-foreground border-primary/50 shadow-magic" : "bg-card text-muted-foreground border-border hover:bg-accent"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {items.map((t, idx) => (
          <div key={t.id} className="relative rounded-3xl border border-white/10 bg-card overflow-hidden">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
            <div className="p-6 pl-10 space-y-2">
              <div className="absolute left-[19px] top-8 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              <p className="text-xs font-mono text-white/45 uppercase tracking-widest">{t.era} · {t.when}</p>
              <h2 className="font-display text-2xl font-black text-foreground">{t.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.summary}</p>

              <div className="pt-3 flex flex-wrap gap-2">
                {(t.entryIds || []).map((id) => {
                  const e = byId.get(id);
                  if (!e) return null;
                  return (
                    <Button key={id} asChild size="sm" variant="outline" className="rounded-xl">
                      <Link to={`/encyclopedie-biblique/${id}`}>{e.title}</Link>
                    </Button>
                  );
                })}
              </div>
            </div>
            {idx % 2 === 0 && (
              <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "radial-gradient(circle at 30% 20%, rgba(245,158,11,0.10), transparent 55%)" }} />
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16 bg-card rounded-3xl border border-dashed border-border">
            <Sparkles className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Aucun repère.</p>
          </div>
        )}
      </div>
    </div>
  );
}

