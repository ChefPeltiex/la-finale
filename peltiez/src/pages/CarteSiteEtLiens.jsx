import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN } from "@/lib/site";
import { THREE_EXPERIENCE_REALMS } from "@/lib/platformCore";
import { SITE_GROUP_ORDER, SITE_GROUPS, SITE_NODES } from "@/data/siteGraph";
import { GLOSSARY_TERMS } from "@/data/glossaryCentral";
import { GUIDED_SCENARIOS } from "@/data/guidedScenarios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map as MapIcon, BookOpen, Route, Search } from "lucide-react";

export default function CarteSiteEtLiens() {
  const [q, setQ] = useState("");
  const filteredGlossary = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter(
      (g) => g.term.toLowerCase().includes(s) || g.definition.toLowerCase().includes(s)
    );
  }, [q]);

  const nodesByGroup = useMemo(() => {
    const m = new Map();
    for (const gid of SITE_GROUP_ORDER) m.set(gid, []);
    for (const n of SITE_NODES) {
      const arr = m.get(n.groupId) || [];
      arr.push(n);
      m.set(n.groupId, arr);
    }
    return m;
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-28">
      <SEOMeta
        title="Carte du site, parcours & glossaire — Egor69"
        description="Arborescence des espaces, liens latéraux, parcours guidés et glossaire central pour une navigation sans cul-de-sac."
        canonicalUrl={`${SITE_ORIGIN}/carte-site`}
        keywords="carte du site, navigation, glossaire, parcours guidés, Egor69, Verse 3D, Atlas, intégrations"
      />

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
            Cartographie dynamique
          </Badge>
          <Badge variant="outline" className="border-sky-500/35 text-sky-100">
            Données centralisées (siteGraph.js)
          </Badge>
        </div>
        <h1 className="font-display flex flex-wrap items-center gap-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <MapIcon className="h-8 w-8 text-emerald-300" />
          Carte du site & cohérence
        </h1>
        <p className="text-sm leading-relaxed text-white/70">
          Chaque page listée connaît son <strong>groupe</strong> et ses <strong>liens latéraux</strong> pour le panneau « Suite logique » du layout. Le
          versionnage détaillé par page (qui / quand / quoi) reste assuré par <strong>Git</strong> sur le dépôt ; un historique métier granulaire demanderait
          un backend dédié.
        </p>
        <p className="text-xs leading-relaxed text-white/55">
          <strong className="text-white/80">Trois couches d’expérience</strong> (vision / intérieur / matériel) :{" "}
          {THREE_EXPERIENCE_REALMS.map((r, i) => (
            <span key={r.id}>
              {i > 0 ? " · " : null}
              <Link to={r.path} className="text-emerald-300 underline-offset-2 hover:underline">
                {r.label}
              </Link>
            </span>
          ))}
          . Invariants & jalons qualité :{" "}
          <Link to="/manuel" className="text-amber-200/90 underline-offset-2 hover:underline">
            manuel → squelette vivant
          </Link>
          .
        </p>
      </header>

      <Tabs defaultValue="carte" className="w-full">
        <TabsList className="grid w-full max-w-xl grid-cols-3 bg-zinc-900/80 p-1">
          <TabsTrigger value="carte" className="gap-1.5 text-xs sm:text-sm">
            <MapIcon className="h-3.5 w-3.5" /> Carte
          </TabsTrigger>
          <TabsTrigger value="parcours" className="gap-1.5 text-xs sm:text-sm">
            <Route className="h-3.5 w-3.5" /> Parcours
          </TabsTrigger>
          <TabsTrigger value="glossaire" className="gap-1.5 text-xs sm:text-sm">
            <BookOpen className="h-3.5 w-3.5" /> Glossaire
          </TabsTrigger>
        </TabsList>

        <TabsContent value="carte" className="mt-6 space-y-4">
          <Accordion type="multiple" className="w-full space-y-2">
            {SITE_GROUP_ORDER.map((gid) => {
              const meta = SITE_GROUPS[gid];
              const nodes = nodesByGroup.get(gid) || [];
              if (!meta || !nodes.length) return null;
              return (
                <AccordionItem key={gid} value={gid} className="rounded-xl border border-white/10 bg-zinc-950/50 px-3">
                  <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline hover:text-emerald-100">
                    {meta.label}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3 text-xs text-white/50">{meta.description}</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {nodes.map((n) => (
                        <li key={n.id}>
                          <Link
                            to={n.path}
                            className="flex flex-col rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-emerald-100/95 transition hover:border-emerald-500/30 hover:bg-emerald-500/5"
                          >
                            <span className="font-medium">{n.label}</span>
                            <code className="mt-0.5 text-[10px] text-white/40">{n.path}</code>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </TabsContent>

        <TabsContent value="parcours" className="mt-6 space-y-6">
          {GUIDED_SCENARIOS.map((sc) => (
            <Card key={sc.id} className="border-white/10 bg-zinc-950/55">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">{sc.title}</CardTitle>
                {sc.intro ? <CardDescription className="text-white/60">{sc.intro}</CardDescription> : null}
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {sc.steps.map((st, i) => (
                    <li key={`${sc.id}-${i}`} className="flex flex-wrap items-center gap-2 text-sm text-white/80">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-200">
                        {i + 1}
                      </span>
                      {st.to ? (
                        <Link to={st.to} className="font-medium text-emerald-200 underline-offset-2 hover:underline">
                          {st.label}
                        </Link>
                      ) : (
                        <span className="font-medium">{st.label}</span>
                      )}
                      {st.doc ? (
                        <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-white/50">{st.doc}</code>
                      ) : null}
                      {st.hint ? <span className="text-xs text-white/40">({st.hint})</span> : null}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="glossaire" className="mt-6 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filtrer le glossaire…"
              className="border-white/15 bg-black/40 pl-10 text-white placeholder:text-white/35"
            />
          </div>
          <ul className="space-y-3">
            {filteredGlossary.map((g) => (
              <li key={g.term} className="rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3">
                <p className="font-semibold text-emerald-100">{g.term}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{g.definition}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>

      <Card className="border-white/10 bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="text-base text-white">Docs — orchestration & bus</CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Feuilles de route (pas modules ERP livrés dans le bundle).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-xs">
          <code className="rounded bg-white/10 px-2 py-1 text-white/70">docs/ORCHESTRATION-ROADMAP.md</code>
          <code className="rounded bg-white/10 px-2 py-1 text-white/70">docs/BUS-INTEGRATION.md</code>
          <code className="rounded bg-white/10 px-2 py-1 text-white/70">docs/INTEGRATIONS-SECURITE-ENTREPRISE.md</code>
        </CardContent>
      </Card>
    </div>
  );
}
