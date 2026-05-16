import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Search, ExternalLink, Sparkles } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import SymbolicDisclaimer from "@/components/ui/SymbolicDisclaimer";
import { SITE_ORIGIN } from "@/lib/site";
import { NATURE_QUEBEC_DOMAINS, NATURE_QUEBEC_HUB_META } from "@/data/natureQuebecPortail";
import { cn } from "@/lib/utils";

/** Textes identiques au kit Markdown — génération d’images externe uniquement. */
const KIT_IMAGE_PROMPTS = [
  {
    label: "1 — Portail mycélium boréal",
    text: `Illustration symbolique, pas documentaire strict : forêt québécoise à l'aube, brume basse, tronc d'épinette fissuré, réseau filamenteux lumineux en surimpression graphique (lignes fines type schéma), palette vert lichen / bleu glacier, grain cinéma doux, aucun texte dans l'image, pas de champignons identifiables comme comestibles.`,
  },
  {
    label: "2 — Lisière entomologique",
    text: `Macro poétique d'ailes et de pollens en suspension au soleil couchant, Québec été, profondeur de champ courte, couleurs ambrées et vert mousse, ambiance atlas naturaliste sans étiquettes d'espèces ni promesse « bienfaits ».`,
  },
  {
    label: "3 — Socle du bouclier",
    text: `Roche métamorphique et quartz laiteux, lumière rasante, carte géologique fantôme en filigrane, tons gris-vert et ocre, style illustration de musée régional, pas de cristaux « énergétiques » mis en scène comme objets magiques.`,
  },
  {
    label: "4 — Jarre et cheminée (patrimoine oral)",
    text: `Intérieur québécois stylisé, chaleur de cheminée, main qui verse une infusion dans une tasse sans nom de plante lisible, livres fermés, lumière douce, ton mémoire collective — non publicité de remède.`,
  },
];

export default function NatureQuebecHub() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return NATURE_QUEBEC_DOMAINS;
    return NATURE_QUEBEC_DOMAINS.filter((d) => {
      const blob = `${d.titleFr} ${d.portalName} ${d.archetype} ${d.categories.map((c) => c.titleFr).join(" ")}`.toLowerCase();
      return blob.includes(s);
    });
  }, [q]);

  return (
    <div className="pb-24 space-y-10 max-w-6xl mx-auto px-4 pt-8">
      <SEOMeta
        title={`${NATURE_QUEBEC_HUB_META.title} | CirculAI`}
        description={NATURE_QUEBEC_HUB_META.description}
        keywords="nature québec, portail, mycologie, insectes, minéraux, patrimoine oral, atlas, activation, prompts"
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
          Tu passes le seuil boréal : neuf portails t’orientent vers des hubs réels — sous-bois, lisières, socle
          minéral, mémoires de jarre, bricolage doux, cuisine raisonnée, atlas des récits et signes partagés. Ici, la
          carte prime sur l’effet spécial : garde-fous visibles, fiction nommée comme telle.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link
            to="/docs/nature-quebec-kit"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-950/40 px-4 py-2 font-semibold text-emerald-100 hover:bg-emerald-500/15"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Kit d’activation (prompts &amp; specs)
          </Link>
          <a
            href="#kit-createur"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-white/80 hover:bg-white/10"
          >
            Accès rapide — prompts
          </a>
        </div>
      </div>

      <SymbolicDisclaimer variant="natureHeritage" />

      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrer un domaine ou un portail…"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:border-primary/50"
          aria-label="Filtrer les domaines"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((d) => (
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
                <h2 className="text-lg font-bold text-foreground mt-0.5">{d.portalName}</h2>
                <p className="text-xs text-muted-foreground italic mt-1">{d.portalTagline}</p>
              </div>
              {d.hubTo && (
                <Link
                  to={d.hubTo}
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Hub
                  <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
                </Link>
              )}
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
            {d.slug === "mycologie" && (
              <details className="mt-1 rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-3 py-2 text-left">
                <summary className="cursor-pointer text-xs font-semibold text-emerald-200 select-none">
                  Note de design — Portail Mycélium (fiction / spec)
                </summary>
                <div className="mt-2 text-[11px] text-muted-foreground leading-relaxed space-y-2">
                  <p>
                    <strong className="text-foreground/90">Fiction — pas une quête 3D livrée.</strong> Approche d’un
                    nœud « filaments » : VO possible — « Le réseau hume sans te posséder. » Choix{" "}
                    <em>Cartographier</em> / <em>Écouter</em> → jeton narratif « écho sporé » (journal ou cosmétique),
                    pas de loot réel. Sortie de zone : « Les filaments se retirent dans le bois. »
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-emerald-400/90">
                    Voix &amp; interaction : fiche de design — non implémentée comme pipeline quête dans ce dépôt.
                  </p>
                </div>
              </details>
            )}
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">Aucun domaine ne correspond à ce filtre.</p>
      )}

      <section id="kit-createur" className="scroll-mt-24 rounded-2xl border border-emerald-500/25 bg-zinc-950/50 p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" aria-hidden />
            Kit créateur — prompts d’images
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground/90">Génération d’images externe</strong> : ces prompts ne sont pas des
            assets inclus dans le dépôt. Copier-coller dans ton outil tiers. Version complète (Mycélium, Chaman
            symbolique, zone « Jardin des Âmes ») :{" "}
            <Link to="/docs/nature-quebec-kit" className="text-primary font-medium underline-offset-2 hover:underline">
              page Markdown du kit
            </Link>
            .
          </p>
        </div>
        <div className="space-y-4">
          {KIT_IMAGE_PROMPTS.map((p) => (
            <div key={p.label} className="space-y-1.5">
              <p className="text-xs font-bold text-emerald-300/90">{p.label}</p>
              <pre className="text-[11px] leading-relaxed overflow-x-auto rounded-xl border border-border bg-black/50 p-4 text-left text-muted-foreground whitespace-pre-wrap">
                {p.text}
              </pre>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Domaine <strong className="text-foreground/90">Plantes / flore</strong> pour prolonger la zone narrative «
          Jardin des Âmes » :{" "}
          <Link to="/flora-hub" className="text-primary underline-offset-2 hover:underline">
            Hub Flore
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
