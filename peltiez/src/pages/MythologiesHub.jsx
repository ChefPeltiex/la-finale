import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { MYTHOLOGY_FAMILIES } from "@/data/mythologyCorpus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookMarked, Library, Sparkles, Leaf } from "lucide-react";
import { SITE_ORIGIN } from "@/lib/site";

export default function MythologiesHub() {
  const location = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const defaultId = MYTHOLOGY_FAMILIES[0]?.id || "grecque";
  const [tab, setTab] = useState(defaultId);

  useEffect(() => {
    const raw = (location.hash || "").replace(/^#/, "").trim();
    if (raw && MYTHOLOGY_FAMILIES.some((f) => f.id === raw)) setTab(raw);
  }, [location.hash]);

  const onTab = (v) => {
    setTab(v);
    navigate({ pathname: "/mythologies", hash: v }, { replace: true });
  };

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return MYTHOLOGY_FAMILIES;
    return MYTHOLOGY_FAMILIES.filter((f) => {
      const blob = [f.label, f.region, f.period, f.overview, ...(f.themes || []), ...(f.pantheon || [])]
        .join(" ")
        .toLowerCase();
      return blob.includes(s);
    });
  }, [q]);

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mythologies comparées — Egor69",
    description:
      "Corpus pédagogique : grecque, égyptienne, celtique, nordique, mésopotamienne, indienne, japonaise, chinoise, romaine, yoruba, polynésienne, Amériques — sources, prudence méthodologique, éthique.",
  };

  return (
    <div className="pb-24 space-y-8 max-w-5xl mx-auto px-4 pt-8">
      <SEOMeta
        title="Mythologies — Grimoire comparatif (Grèce, Égypte, Celtes, Nord, & al.) | Egor69"
        description="Panorama mythologique contextualisé : panthéons, thèmes, syncrétismes, prudence des sources et respect des traditions vivantes. Liens vers Verse 3D, Atlas, ésotérisme."
        keywords="mythologie grecque, égyptienne, celtique, nordique, mésopotamie, mythologie indienne, shinto, yoruba, polynésie, Amériques, comparatisme, pédagogie"
        canonicalUrl={`${SITE_ORIGIN}/mythologies`}
        schemaData={seoSchema}
      />

      <header className="rounded-3xl border border-border bg-gradient-to-br from-violet-500/10 via-amber-500/5 to-cyan-500/10 p-8 md:p-10 space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-violet-600 dark:text-violet-300">
          <BookMarked className="h-8 w-8" />
          <Badge variant="secondary" className="uppercase tracking-widest text-[10px]">
            Grimoire plateforme
          </Badge>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-foreground">
          Mythologies — atlas comparatif
        </h1>
        <p className="text-muted-foreground max-w-3xl leading-relaxed">
          Ce hub regroupe des <strong>synthèses longues</strong> (panthéons, thèmes, syncrétismes, mises en garde). Ce n’est pas une initiation
          ésotérique : objectif pédagogique, honnêteté sur les lacunes, respect des traditions vivantes et critique des récupérations commerciales.
          Les <strong>douze portails du Verse 3D</strong> autour du continent renvoient ici par ancres <code className="text-xs">#famille</code>.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to="/world"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-violet-400/50 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-emerald-500" /> Verse 3D — anneau mythologique
          </Link>
          <Link
            to="/atlas"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-violet-400/50 transition-colors"
          >
            <Library className="h-4 w-4 text-violet-500" /> Atlas vivant
          </Link>
          <Link
            to="/bien-etre-lexique"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-violet-400/50 transition-colors"
          >
            <Leaf className="h-4 w-4 text-emerald-500" /> Lexique bien-être
          </Link>
          <Link
            to="/arts-divinatoires-lexique"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-violet-400/50 transition-colors"
          >
            Lexique arts divinatoires
          </Link>
          <Link
            to="/esotericism"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-violet-400/50 transition-colors"
          >
            Spires ésotériques
          </Link>
          <Link
            to="/pantheon-3d"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-violet-400/50 transition-colors"
          >
            Panthéon 3D
          </Link>
        </div>
      </header>

      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recherche dans tout le corpus</label>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Zeus, Duat, Ifá, Maui, trickster, syncrétisme…"
          className="max-w-xl"
        />
        <p className="text-xs text-muted-foreground">
          {q.trim() ? (
            <>
              {matches.length} famille{matches.length > 1 ? "s" : ""} correspond{matches.length > 1 ? "ent" : ""} — accès rapide :{" "}
              {matches.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="ml-1 underline font-semibold text-foreground"
                  onClick={() => onTab(f.id)}
                >
                  {f.label.split(" ")[0]}
                </button>
              ))}
            </>
          ) : (
            `${MYTHOLOGY_FAMILIES.length} familles mythologiques indexées.`
          )}
        </p>
      </div>

      <Tabs value={tab} onValueChange={onTab} className="w-full">
        <TabsList className="flex h-auto min-h-10 w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
          {MYTHOLOGY_FAMILIES.map((f) => (
            <TabsTrigger key={f.id} value={f.id} className="text-xs md:text-sm">
              {f.label.replace("Mythologie ", "").replace("Religions et ", "").slice(0, 24)}
            </TabsTrigger>
          ))}
        </TabsList>

        {MYTHOLOGY_FAMILIES.map((f) => (
          <TabsContent key={f.id} value={f.id} className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
            <MythFamilyBody family={f} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function MythFamilyBody({ family }) {
  if (!family) return null;
  return (
    <>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{family.region}</Badge>
        <Badge variant="outline">{family.period}</Badge>
      </div>
      <p className="text-sm md:text-base leading-relaxed text-foreground/90">{family.overview}</p>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-bold text-foreground">Panthéon & figures (aperçu)</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/85">
          {family.pantheon.map((line) => (
            <li key={line.slice(0, 48)}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-bold text-foreground">Thèmes traversants</h2>
        <div className="flex flex-wrap gap-2">
          {family.themes.map((t) => (
            <Badge key={t} variant="secondary" className="font-normal">
              {t}
            </Badge>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-200">Syncrétismes & réceptions</h2>
        <p className="text-sm text-foreground/85 leading-relaxed">{family.syncretism}</p>
      </section>

      <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-red-800 dark:text-red-200">Prudence</h2>
        <p className="text-sm text-foreground/85 leading-relaxed">{family.caution}</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-bold text-foreground">Pour aller plus loin (pistes)</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
          {family.further.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
