import { useMemo, useState } from "react";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN } from "@/lib/site";
import { EGOR69_GENE_TREE } from "@/genome/tree";
import { fadeToArchive, listArchive } from "@/genome/seedCycle";
import { Button } from "@/components/ui/button";

function GeneCard({ gene, onFade }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-mono">{gene.id}</p>
          <h3 className="font-semibold text-foreground truncate">{gene.name}</h3>
          <p className="text-sm text-muted-foreground mt-2">{gene.purpose}</p>
          {gene.heals?.length ? (
            <p className="text-xs text-emerald-600 mt-3">
              Soigne: <span className="text-emerald-700 font-medium">{gene.heals.join(", ")}</span>
            </p>
          ) : null}
        </div>
        <Button variant="outline" className="shrink-0" onClick={() => onFade(gene)}>
          Faner → Archiver
        </Button>
      </div>
    </div>
  );
}

export default function Genome() {
  const [archived, setArchived] = useState([]);
  const genes = useMemo(() => EGOR69_GENE_TREE.children || [], []);

  const refresh = async () => {
    const rows = await listArchive(50);
    setArchived(rows);
  };

  const fade = async (gene) => {
    await fadeToArchive({
      kind: "module",
      id: gene.id,
      name: gene.name,
      reason: "Obsolescence détectée / évolution de la vision — nourrir le prochain Fruit du Dragon.",
      snapshot: gene,
      lineage: gene.lineage || [],
      tags: gene.tags || [],
    });
    await refresh();
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Génome Egor69",
    "description": "Arbre génétique des modules : SOIN, souveraineté, seed cycle, archives nourricières.",
    "url": `${SITE_ORIGIN}/genome`,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 pb-20 space-y-10">
      <SEOMeta
        title="Génome Egor69 — Genèse & archives vivantes"
        description="Cartographie mystique et technique des modules Egor69 : ADN SOIN, cycle des semences, archives comme compost du futur."
        keywords="igor, génome, ADN logiciel, seed cycle, archives, souveraineté"
        canonicalUrl={`${SITE_ORIGIN}/genome`}
        schemaData={schema}
      />
      <div className="pt-10 space-y-3">
        <h1 className="font-display text-4xl font-black text-foreground">Génome Egor69</h1>
        <p className="text-muted-foreground leading-relaxed">
          Ce n’est pas une simple page : c’est la <strong className="text-foreground">Genèse</strong> d’un organisme numérique —
          voûte étoilée au-dessus, racines dans le SOIN. Chaque module porte l’ADN : souveraineté, simplicité, régénération.
        </p>
        <div className="flex gap-3">
          <Button onClick={refresh}>Rafraîchir archives</Button>
          <Button variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(EGOR69_GENE_TREE, null, 2))}>
            Copier l’ADN (JSON)
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Modules vivants</h2>
        <div className="grid grid-cols-1 gap-4">
          {genes.map(g => (
            <GeneCard key={g.id} gene={g} onFade={fade} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Archives (compost fertile)</h2>
        {archived.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune archive pour l’instant. Fais “Faner → Archiver” sur un module.</p>
        ) : (
          <div className="space-y-3">
            {archived.map(a => (
              <div key={a.id} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground font-mono">{a.kind} · {a.ref_id}</p>
                <p className="font-medium text-foreground">{a.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{a.reason}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

