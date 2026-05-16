import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronDown, Crown, Leaf, Search, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOMeta from "@/components/SEOMeta";
import SymbolicDisclaimer from "@/components/ui/SymbolicDisclaimer";
import { SITE_ORIGIN, CIRCULAI_BRAND } from "@/lib/site";
import {
  NATURE_QUEBEC_DOMAINS,
  NATURE_QUEBEC_HUB_META,
  natureQuebecPortails,
} from "@/data/natureQuebecPortail";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function NatureQuebecHub() {
  const [q, setQ] = useState("");
  const [openPortalId, setOpenPortalId] = useState(null);
  const [atlasOpen, setAtlasOpen] = useState(false);

  const filteredDomains = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return NATURE_QUEBEC_DOMAINS;
    return NATURE_QUEBEC_DOMAINS.filter((d) => {
      const blob = `${d.titleFr} ${d.portalName} ${d.archetype} ${d.categories.map((c) => c.titleFr).join(" ")}`.toLowerCase();
      return blob.includes(s);
    });
  }, [q]);

  const filteredPortails = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return natureQuebecPortails;
    return natureQuebecPortails.filter((p) => {
      const blob = `${p.title} ${p.archetypeName} ${p.questTitle} ${p.skillBranches.join(" ")}`.toLowerCase();
      return blob.includes(s);
    });
  }, [q]);

  return (
    <div className="pb-24 space-y-10 max-w-6xl mx-auto px-4 pt-8">
      <SEOMeta
        title={`${NATURE_QUEBEC_HUB_META.title} | CirculAI`}
        description={NATURE_QUEBEC_HUB_META.description}
        keywords="nature québec, portail, quête mycélium, arbres de compétences, carapaces, insectes, fiction, atlas"
        canonicalUrl={`${SITE_ORIGIN}${NATURE_QUEBEC_HUB_META.canonicalPath}`}
      />

      <div
        className="rounded-3xl p-8 sm:p-10 text-center space-y-5 border"
        style={{
          background: "linear-gradient(135deg, rgba(6, 28, 22, 0.92), rgba(8, 12, 24, 0.95))",
          borderColor: "rgba(16, 185, 129, 0.28)",
        }}
      >
        <Leaf className="h-12 w-12 text-emerald-400 mx-auto" aria-hidden />
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white">{NATURE_QUEBEC_HUB_META.title}</h1>
        <p className="text-white/75 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Douze portails fiction (archétypes, quêtes-mères, branches de compétences symboliques) et huit domaines
          atlas vers les hubs réels. Tout est cadre de jeu / métaphore : pas de mécanique de quête implémentée ici.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-4 max-w-lg mx-auto pt-2">
          <Button
            asChild
            size="lg"
            className="w-full sm:flex-1 rounded-2xl h-14 font-black border-0 text-white shadow-[0_0_32px_rgba(16,185,129,0.3)]"
            style={{ background: "linear-gradient(135deg, hsl(158,65%,38%), hsl(160,55%,28%))" }}
          >
            <Link to="/pricing" className="inline-flex items-center justify-center gap-2">
              <Crown className="h-5 w-5 shrink-0" aria-hidden />
              S&apos;abonner à {CIRCULAI_BRAND}
              <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
            </Link>
          </Button>
        </div>
        <p className="text-[11px] text-white/40">egor69.ca — même plateforme</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm pt-2">
          <Link
            to="/docs/nature-quebec-portail"
            className="inline-flex items-center gap-2 rounded-xl border border-sky-500/45 bg-sky-950/40 px-4 py-2 font-semibold text-sky-100 hover:bg-sky-500/15"
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            Codex compact (table)
          </Link>
          <Link
            to="/docs/nature-quebec-kit"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-950/40 px-4 py-2 font-semibold text-emerald-100 hover:bg-emerald-500/15"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Kit d’activation (prompts &amp; specs)
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        <SymbolicDisclaimer variant="naturePortail" className="border-emerald-500/25 bg-emerald-950/35 text-white/70" />
        <SymbolicDisclaimer variant="natureHeritage" />
      </div>

      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrer portails ou domaines atlas…"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:border-primary/50"
          aria-label="Filtrer portails et domaines"
        />
      </div>

      <section aria-labelledby="portails-12">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" aria-hidden />
          <h2 id="portails-12" className="text-xl font-black text-foreground">
            Douze portails — détails cosmiques
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          Chaque carte ouvre un panneau « Détails cosmiques » : rôle, pouvoirs (fiction), faiblesses, objet sacré
          narratif, épreuve et trois branches de compétences — lecture seule.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPortails.map((p) => {
            const open = openPortalId === p.id;
            return (
              <article
                key={p.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none" aria-hidden>
                    {p.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="text-[11px] uppercase tracking-wide text-emerald-600 dark:text-emerald-400/90 mt-0.5">
                      {p.archetypeName}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground italic leading-relaxed border-l-2 border-emerald-500/30 pl-3">
                  {p.portalCinematic}
                </p>
                <div className="mt-3 space-y-0.5">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Quête-mère</p>
                  <p className="text-sm font-medium text-foreground">{p.questTitle}</p>
                  <p className="text-xs text-muted-foreground">{p.questHook}</p>
                </div>
                <div className="mt-3">
                  {p.hubPath ? (
                    <Link
                      to={p.hubPath}
                      className="inline-flex rounded-lg border border-primary/35 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
                    >
                      Ouvrir le hub lié
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">Portail autonome (pas de hub dédié)</span>
                  )}
                </div>
                <Collapsible
                  open={open}
                  onOpenChange={(next) => setOpenPortalId(next ? p.id : null)}
                  className="mt-4 border-t border-border pt-3"
                >
                  <CollapsibleTrigger
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-1 py-2 text-left text-sm font-semibold text-primary hover:bg-muted/50"
                    )}
                  >
                    Détails cosmiques
                    <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-foreground/50">Archétype</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">{p.archetypeSlug}</p>
                      <p className="mt-1 text-foreground/90">{p.role}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-foreground/50">
                        Pouvoirs (fiction / symbolique — max 3)
                      </p>
                      <ul className="mt-1 list-disc pl-4 space-y-1">
                        {p.powers.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-foreground/50">Faiblesses</p>
                      <ul className="mt-1 list-disc pl-4 space-y-1">
                        {p.weaknesses.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-foreground/50">
                        Objet sacré (fiction)
                      </p>
                      <p className="mt-1">{p.sacredObject}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-foreground/50">Épreuve</p>
                      <p className="mt-1">{p.trial}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-foreground/50">
                        Arbres de compétences (3 branches)
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {p.skillBranches.map((b) => (
                          <li
                            key={b}
                            className="rounded-full border border-sky-500/25 bg-sky-500/5 px-3 py-1 text-xs text-sky-900 dark:text-sky-100"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </article>
            );
          })}
        </div>
        {filteredPortails.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">Aucun portail ne correspond à ce filtre.</p>
        )}
      </section>

      <Collapsible open={atlasOpen} onOpenChange={setAtlasOpen} className="rounded-2xl border border-border bg-muted/20">
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left font-semibold text-foreground hover:bg-muted/40">
          Huit domaines atlas (tranche précédente)
          <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", atlasOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDomains.map((d) => (
              <article
                key={d.slug}
                className={cn(
                  "rounded-2xl border bg-card p-5 flex flex-col gap-3 shadow-sm",
                  d.requiresDisclaimer && "border-amber-500/25"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{d.titleFr}</p>
                    <h3 className="text-lg font-bold text-foreground mt-0.5">{d.portalName}</h3>
                    <p className="text-xs text-muted-foreground italic mt-1">{d.portalTagline}</p>
                  </div>
                  {d.hubTo ? (
                    <Link to={d.hubTo} className="shrink-0 text-xs font-semibold text-primary hover:underline">
                      Hub →
                    </Link>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  Archétype narratif : <span className="text-foreground/90">{d.archetype}</span>
                </p>
                <ul className="text-xs space-y-1.5 text-muted-foreground border-t border-border pt-3">
                  {d.categories.map((c) => (
                    <li key={c.slug}>
                      <span className="font-medium text-foreground/90">{c.titleFr}</span>
                      {c.examples?.length ? ` — ${c.examples.join(" · ")}` : null}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            {filteredDomains.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full text-center">Aucun domaine ne correspond.</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
