import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  UEAIOUY_DOC_ANCHOR,
  createUeAiouyId,
  getUeAiouyExternalDocsUrl,
  getUeAiouyPixelStreamUrl,
  loadUeAiouyRegistry,
  saveUeAiouyRegistry,
} from "@/lib/ueAiouy";
import { UNREAL_BRIDGE_DOC_RELATIVE } from "@/lib/unrealBridge";
import { GltfLoadErrorBoundary } from "@/components/ueAiouy/GltfLoadErrorBoundary";

const GltfPreview = lazy(() => import("@/components/ueAiouy/GltfPreview"));
import { Cuboid, Download, ExternalLink, Plus, Trash2, Upload } from "lucide-react";

const SOURCE_OPTS = [
  { id: "quixel", label: "Quixel / Megascans" },
  { id: "unreal", label: "Export Unreal (glTF/GLB)" },
  { id: "manual", label: "Studio / Blender / autre DCC" },
  { id: "other", label: "Autre" },
];

function PreviewFallback({ error }) {
  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
      Échec du chargement du modèle : {error?.message || "erreur inconnue"}. Vérifiez l’URL et le CORS.
    </div>
  );
}

export default function UeAiouyHub() {
  const [entries, setEntries] = useState(loadUeAiouyRegistry);
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("quixel");
  const [gltfUrl, setGltfUrl] = useState("");
  const [megascanId, setMegascanId] = useState("");
  const [notes, setNotes] = useState("");
  const [useDraco, setUseDraco] = useState(false);
  const fileImportRef = useRef(null);

  const pixelUrl = useMemo(() => getUeAiouyPixelStreamUrl(), []);
  const docsUrl = useMemo(() => getUeAiouyExternalDocsUrl(), []);

  useEffect(() => {
    const on = () => setEntries(loadUeAiouyRegistry());
    window.addEventListener("igor-ue-aiouy-change", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("igor-ue-aiouy-change", on);
      window.removeEventListener("storage", on);
    };
  }, []);

  const persist = useCallback((next) => {
    setEntries(next);
    saveUeAiouyRegistry(next);
  }, []);

  const addEntry = () => {
    const t = title.trim();
    const url = gltfUrl.trim();
    if (!t || !url) return;
    const row = {
      id: createUeAiouyId(),
      title: t,
      source,
      gltfUrl: url,
      notes: notes.trim() || undefined,
      megascanId: megascanId.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    persist([row, ...entries]);
    setTitle("");
    setGltfUrl("");
    setMegascanId("");
    setNotes("");
  };

  const removeEntry = (id) => persist(entries.filter((e) => e.id !== id));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ version: 1, project: "UEAIOUY", assets: entries }, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ue-aiouy-manifest.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onImportFile = (ev) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const assets = Array.isArray(data?.assets) ? data.assets : Array.isArray(data) ? data : [];
        const merged = [...assets.filter((x) => x?.gltfUrl && x?.title && x?.id), ...entries];
        const dedup = [];
        const seen = new Set();
        for (const e of merged) {
          if (seen.has(e.id)) continue;
          seen.add(e.id);
          dedup.push(e);
        }
        persist(dedup);
      } catch {
        /* ignore */
      }
      ev.target.value = "";
    };
    reader.readAsText(f);
  };

  return (
    <div className="container max-w-4xl pb-24 pt-8 space-y-8">
      <SEOMeta
        title="UEAIOUY — ponts Quixel, Unreal & glTF | Egor69"
        description="Registre d’assets web, pipeline Megascans → glTF, options Pixel Streaming. Pas d’éditeur UE dans le navigateur ; intégration honnête avec Three.js."
        canonicalUrl={`${SITE_ORIGIN}/ue-aiouy`}
      />

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Cuboid className="h-9 w-9 text-emerald-400" />
          <h1 className="text-3xl font-bold tracking-tight">UEAIOUY</h1>
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-300">
            Lanceur ponts UE × web
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Ce hub enregistre les URL <strong>glTF / GLB</strong> utilisables tout de suite dans le Verse Three.js,
          trace la provenance (Quixel, Unreal, DCC), et expose un emplacement pour{" "}
          <strong>Pixel Streaming</strong> si vous configurez l’infra Epic côté serveur (variable d’environnement).
        </p>
        <p className="text-sm text-muted-foreground">
          Documentation hors bundle Vite — voir dans le dépôt : <code className="rounded bg-muted px-1">{UNREAL_BRIDGE_DOC_RELATIVE}</code>{" "}
          (programme UEAIOUY en bas de fichier). Référence : <code className="rounded bg-muted px-1">{UEAIOUY_DOC_ANCHOR}</code>
        </p>
      </header>

      <Tabs defaultValue="registry" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="registry">Registre & prévisualisation</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Quixel → UE → web</TabsTrigger>
          <TabsTrigger value="stream">Pixel Streaming</TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="space-y-6 mt-6">
          <section className="rounded-2xl border border-border bg-card/50 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Ajouter un asset bridgé</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="uea-title">Titre</Label>
                <Input id="uea-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Rocher Megascans — biome forêt" />
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  {SOURCE_OPTS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="uea-url">URL glTF ou GLB (HTTPS)</Label>
                <Input
                  id="uea-url"
                  value={gltfUrl}
                  onChange={(e) => setGltfUrl(e.target.value)}
                  placeholder="https://cdn.example.com/assets/rock.glb"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uea-ms">ID Megascans (optionnel)</Label>
                <Input id="uea-ms" value={megascanId} onChange={(e) => setMegascanId(e.target.value)} placeholder=" Réf. Bridge" />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Switch id="uea-draco" checked={useDraco} onCheckedChange={setUseDraco} />
                <Label htmlFor="uea-draco">Modèle compressé Draco (si export prévu)</Label>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="uea-notes">Notes (optionnel)</Label>
                <Textarea id="uea-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="LOD, licence, chemin UE Content/…" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={addEntry} className="gap-2">
                <Plus className="h-4 w-4" />
                Enregistrer dans le registre
              </Button>
              <Button type="button" variant="outline" className="gap-2" onClick={exportJson}>
                <Download className="h-4 w-4" />
                Exporter manifest JSON
              </Button>
              <Button type="button" variant="outline" className="gap-2" onClick={() => fileImportRef.current?.click()}>
                <Upload className="h-4 w-4" />
                Importer manifest
              </Button>
              <input ref={fileImportRef} type="file" accept="application/json,.json" className="hidden" onChange={onImportFile} />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Prévisualisation (URL courante)</h2>
            <GltfLoadErrorBoundary key={`${gltfUrl.trim()}-${useDraco}`} fallback={(err) => <PreviewFallback error={err} />}>
              <Suspense
                fallback={
                  <div className="flex h-[min(420px,50vh)] items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
                    Chargement du viewer 3D…
                  </div>
                }
              >
                <GltfPreview url={gltfUrl.trim()} useDraco={useDraco} />
              </Suspense>
            </GltfLoadErrorBoundary>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Registre local ({entries.length})</h2>
            <p className="text-sm text-muted-foreground">
              Stocké dans <code className="rounded bg-muted px-1">localStorage</code> — utile pour prototyper avant CDN / PocketBase.
              Pour la prod, servez les fichiers depuis votre CDN avec CORS et référencez les URL ici ou dans le code des scènes.
            </p>
            <ul className="space-y-2">
              {entries.length === 0 && <li className="text-muted-foreground text-sm">Aucune entrée pour l’instant.</li>}
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-muted/20 px-4 py-3"
                >
                  <div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-xs text-muted-foreground break-all">{e.gltfUrl}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">{e.source}</Badge>
                      {e.megascanId && (
                        <Badge variant="outline" className="text-[10px]">
                          MS {e.megascanId}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" type="button" onClick={() => setGltfUrl(e.gltfUrl)} title="charger dans prévisualisation">
                      Voir
                    </Button>
                    <Button size="sm" variant="ghost" type="button" className="text-destructive" onClick={() => removeEntry(e.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4 mt-6 prose prose-invert max-w-none">
          <div className="rounded-2xl border border-border bg-card/40 p-6 not-prose space-y-4 text-sm">
            <h2 className="text-lg font-semibold text-foreground">Quixel Bridge → Unreal → glTF / GLB → Egor69</h2>
            <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Bridge</strong> : connecter le même compte Epic que l’éditeur ; télécharger les packs Megascans
                puis exporter vers le dossier <code>Content/</code> du projet UE ciblé (voir skill <code>igor-unreal-quixel-import</code> dans Cursor).
              </li>
              <li>
                <strong className="text-foreground">Unreal</strong> : assembler la scène, collisions / Nanite selon vos besoins, puis utiliser{" "}
                <strong>export glTF 2.0</strong> (ou pipeline Datasmith→DCC→glTF) pour produire un fichier servi en HTTPS.
              </li>
              <li>
                <strong className="text-foreground">Web</strong> : déposer le <code>.glb</code> sur votre stockage (S3, R2, static Vite{" "}
                <code>public/ue-aiouy/models/</code>, etc.) avec en-têtes <strong>CORS</strong> autorisant l’origine du site.
              </li>
              <li>
                <strong className="text-foreground">Egor69</strong> : coller l’URL dans l’onglet Registre ci-dessus ; réutilisez la même URL dans
                vos pages Three.js (<Link to="/world" className="text-emerald-400 underline">Verse</Link>,{" "}
                <Link to="/pantheon-3d" className="text-emerald-400 underline">Panthéon 3D</Link>).
              </li>
            </ol>
            <p className="text-amber-200/90 border border-amber-500/30 rounded-lg p-3">
              Il n’existe pas de synchronisation automatique Quixel ↔ ce dépôt : tout passe par export fichiers et URL que vous contrôlez. Ne promettez
              pas une intégration Epic « certifiée » sans binaire/serveur correspondants.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="stream" className="space-y-4 mt-6">
          <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Pixel Streaming (Epic)</h2>
            <p className="text-sm text-muted-foreground">
              Hébergez le joueur signalling / TURN conformément à la doc Epic, puis exposez l’URL du lecteur aux utilisateurs autorisés. Définissez{" "}
              <code className="rounded bg-muted px-1">VITE_UEAIOUY_PIXEL_STREAM_PLAYER_URL</code> dans <code>.env</code> pour afficher l’iframe ici.
            </p>
            {pixelUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
                <iframe title="UE Pixel Streaming" src={pixelUrl} className="h-full w-full" allow="fullscreen; autoplay" />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-muted-foreground/40 p-8 text-center text-sm text-muted-foreground">
                Variable <code>VITE_UEAIOUY_PIXEL_STREAM_PLAYER_URL</code> non définie — aucun lecteur embarqué par défaut (comportement voulu).
              </div>
            )}
            {docsUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={docsUrl} target="_blank" rel="noreferrer" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Documentation infra (externe)
                </a>
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
