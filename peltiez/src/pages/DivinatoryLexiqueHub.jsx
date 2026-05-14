import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { DIVINATORY_ARTS_FAMILIES } from "@/data/divinatoryArtsCorpus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Library, Sparkles, Wand2, Telescope } from "lucide-react";
import { SITE_ORIGIN } from "@/lib/site";

export default function DivinatoryLexiqueHub() {
  const location = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const defaultId = DIVINATORY_ARTS_FAMILIES[0]?.id || "tarot";
  const [tab, setTab] = useState(defaultId);

  useEffect(() => {
    const raw = (location.hash || "").replace(/^#/, "").trim();
    if (raw && DIVINATORY_ARTS_FAMILIES.some((f) => f.id === raw)) setTab(raw);
  }, [location.hash]);

  const onTab = (v) => {
    setTab(v);
    navigate({ pathname: "/arts-divinatoires-lexique", hash: v }, { replace: true });
  };

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return DIVINATORY_ARTS_FAMILIES;
    return DIVINATORY_ARTS_FAMILIES.filter((f) => {
      const blob = [
        f.label,
        f.domain,
        f.overview,
        f.evidence,
        f.precautions,
        ...(f.modalities || []),
        ...(f.seeDoctor || []),
        ...(f.grimoireVerse ? Object.values(f.grimoireVerse) : []),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(s);
    });
  }, [q]);

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Lexique arts divinatoires — Egor69",
    description:
      "Tarot, astrologie, Yi Jing, runes, géomancie, cartomancie, oniromancie : cadre historique, psychologie, éthique, légal indicatif. Pas de vérité surnaturelle garantie.",
  };

  return (
    <div className="pb-24 space-y-8 max-w-5xl mx-auto px-4 pt-8">
      <SEOMeta
        title="Lexique arts divinatoires — tarot, astrologie, Yi Jing, runes & al. | Egor69"
        description="Corpus pédagogique : pratiques, limites empiriques, dérives commerciales, cadre légal. Grimoire du Verse (fiction). Liens Verse 3D, ésotérisme, carte du ciel."
        keywords="arts divinatoires, tarot, astrologie natale, astrologie chinoise, Yi Jing, runes, géomancie, cartomancie, oniromancie, divination, éthique, lexique, Verse 3D"
        canonicalUrl={`${SITE_ORIGIN}/arts-divinatoires-lexique`}
        schemaData={seoSchema}
      />

      <header className="rounded-3xl border border-border bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-amber-500/10 p-8 md:p-10 space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-indigo-600 dark:text-indigo-300">
          <Telescope className="h-8 w-8" />
          <Badge variant="secondary" className="uppercase tracking-widest text-[10px]">
            Grimoire plateforme
          </Badge>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-foreground">Lexique des arts divinatoires</h1>
        <p className="text-muted-foreground max-w-3xl leading-relaxed">
          Ce hub regroupe des <strong>synthèses comparatistes</strong> (histoire, psychologie, éthique, marché). Aucune pratique ici ne garantit une
          connaissance du futur ou une vérité surnaturelle : <strong>outil symbolique, loisir ou cadre clinique encadré</strong> selon les cas. Le{" "}
          <strong>Grimoire du Verse</strong> ajoute sortilèges et mise en scène — <strong>fiction ludique</strong>, alignée sur la charte Egor69. Les{" "}
          <strong>huit portails</strong> de l’anneau divinatoire du monde 3D pointent vers ces ancres <code className="text-xs">#famille</code>.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to="/world"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-indigo-400/50 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-violet-500" /> Verse 3D — anneau divinatoire
          </Link>
          <Link
            to="/arts-divinatoires"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-indigo-400/50 transition-colors"
          >
            Arts divinatoires (thème perso)
          </Link>
          <Link
            to="/esotericism"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-indigo-400/50 transition-colors"
          >
            Spires ésotériques
          </Link>
          <Link
            to="/carte-ciel"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-indigo-400/50 transition-colors"
          >
            Carte du ciel
          </Link>
          <Link
            to="/bien-etre-lexique"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-indigo-400/50 transition-colors"
          >
            Lexique bien-être
          </Link>
          <Link
            to="/atlas"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-indigo-400/50 transition-colors"
          >
            <Library className="h-4 w-4 text-violet-500" /> Atlas vivant
          </Link>
        </div>
      </header>

      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recherche dans tout le corpus</label>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="tarot, géomancie, biais de confirmation, mineurs, runes…"
          className="max-w-xl"
        />
        <p className="text-xs text-muted-foreground">
          {q.trim() ? (
            <>
              {matches.length} rubrique{matches.length > 1 ? "s" : ""} — accès rapide :{" "}
              {matches.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="ml-1 underline font-semibold text-foreground"
                  onClick={() => onTab(f.id)}
                >
                  {f.label.split(/[—–]/)[0].trim().slice(0, 28)}
                </button>
              ))}
            </>
          ) : (
            `${DIVINATORY_ARTS_FAMILIES.length} familles indexées.`
          )}
        </p>
      </div>

      <Tabs value={tab} onValueChange={onTab} className="w-full">
        <TabsList className="flex h-auto min-h-10 w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
          {DIVINATORY_ARTS_FAMILIES.map((f) => (
            <TabsTrigger key={f.id} value={f.id} className="text-xs md:text-sm max-w-[11rem] truncate" title={f.label}>
              {f.label.replace(" & ", " ").slice(0, 22)}
            </TabsTrigger>
          ))}
        </TabsList>

        {DIVINATORY_ARTS_FAMILIES.map((f) => (
          <TabsContent key={f.id} value={f.id} className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
            <DivinatoryFamilyBody family={f} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function GrimoireInline({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-amber-100/95">
              {p.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function GrimoireVerseBlock({ g }) {
  const rows = [
    { k: "Sortilège", v: g.sortilege },
    { k: "Enchantement", v: g.enchantement },
    { k: "Potion ou artefact", v: g.potionArtefact },
    { k: "Pouvoir invoqué", v: g.pouvoirMagique },
    { k: "Utilité du rite", v: g.utiliteDuRite },
    { k: "Puissance (échelle du Verse)", v: g.puissance },
    { k: "Mise en scène", v: g.miseEnScene },
  ];
  return (
    <section className="rounded-2xl border border-violet-500/35 bg-gradient-to-br from-violet-950/50 via-indigo-950/35 to-amber-950/25 p-5 md:p-7 space-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex flex-wrap items-center gap-2 text-violet-200">
        <Wand2 className="h-6 w-6 shrink-0 text-amber-400/90" aria-hidden />
        <h2 className="font-display text-lg font-bold tracking-tight text-amber-50">Grimoire du Verse — sortilèges (fiction)</h2>
        <Badge variant="secondary" className="text-[10px] uppercase tracking-widest border-amber-500/30 bg-amber-500/15 text-amber-100">
          Narration seulement
        </Badge>
      </div>
      <p className="text-xs leading-relaxed text-violet-100/75 border-l-2 border-amber-500/50 pl-3">
        Métaphores pour le jeu : <strong>aucun sort ne remplace psychologue, avocat, médecin ou données vérifiées</strong>. Les cartes Codex et les portails
        3D utilisent ce ton comme <strong>mise en scène</strong>, sans promesse divinatoire réelle.
      </p>
      <dl className="grid gap-4 sm:grid-cols-2 text-sm text-violet-50/90">
        {rows.map(({ k, v }) => (
          <div key={k} className="rounded-xl border border-white/10 bg-black/25 p-3.5 space-y-1.5">
            <dt className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90">{k}</dt>
            <dd className="leading-relaxed text-violet-50/95">
              <GrimoireInline text={v} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function DivinatoryFamilyBody({ family }) {
  if (!family) return null;
  return (
    <>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{family.domain}</Badge>
      </div>
      <p className="text-sm md:text-base leading-relaxed text-foreground/90">{family.overview}</p>

      {family.grimoireVerse ? <GrimoireVerseBlock g={family.grimoireVerse} /> : null}

      <section className="space-y-2">
        <h2 className="font-display text-lg font-bold text-foreground">Modalités & repères</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/85">
          {family.modalities.map((line) => (
            <li key={line.slice(0, 64)}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-sky-500/25 bg-sky-500/5 p-4 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-sky-800 dark:text-sky-200">Preuves & littérature</h2>
        <p className="text-sm text-foreground/85 leading-relaxed">{family.evidence}</p>
      </section>

      <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-200">Précautions & marché</h2>
        <p className="text-sm text-foreground/85 leading-relaxed">{family.precautions}</p>
      </section>

      <section className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-violet-800 dark:text-violet-200">Cadre légal (indicatif)</h2>
        <p className="text-sm text-foreground/85 leading-relaxed">{family.legalNote}</p>
      </section>

      <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-red-800 dark:text-red-200">Urgences & limites — passer la main</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/85">
          {family.seeDoctor.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
