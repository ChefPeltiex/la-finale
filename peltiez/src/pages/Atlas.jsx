import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listCards, upsertUserLore } from "@/content/engine";
import { CARD_KINDS } from "@/content/kinds";
import { sovereignApiAbsolute } from "@/lib/sovereignAtlasApi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, Feather, PawPrint, Leaf, Swords, BookOpen, Plus, Radar, Lock } from "lucide-react";
import { isGrosCalinUnlocked } from "@/lib/grosCalin";
import GrosCalinGate from "@/components/GrosCalinGate";
import { LIVING_CARDS } from "@/data/livingCards";
import { PASS_SOUVERAIN_ANCHOR_ID, hasPassSouverain } from "@/lib/passSouverain";
import { EXPERIENCE_FLAGS } from "@/lib/experienceFlags";

const SECTION_FICHES = "fiches-vivantes";

const KIND_META = {
  [CARD_KINDS.arts]: { label: "Arts", icon: Feather, gradient: "from-pink-500 to-rose-600" },
  [CARD_KINDS.savoirs]: { label: "Savoirs", icon: BookOpen, gradient: "from-indigo-500 to-purple-600" },
  [CARD_KINDS.faune]: { label: "Faune", icon: PawPrint, gradient: "from-amber-500 to-orange-600" },
  [CARD_KINDS.flore]: { label: "Flore", icon: Leaf, gradient: "from-emerald-500 to-green-600" },
  [CARD_KINDS.quetes]: { label: "Quêtes", icon: Swords, gradient: "from-cyan-500 to-blue-600" },
  [CARD_KINDS.croyances]: { label: "Croyances", icon: Sparkles, gradient: "from-violet-500 to-fuchsia-600" },
  [CARD_KINDS.instinct_animal]: { label: "Instinct Animal", icon: PawPrint, gradient: "from-slate-500 to-slate-700" },
};

export default function Atlas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [unlocked, setUnlocked] = useState(() => isGrosCalinUnlocked());
  const [cards, setCards] = useState([]);
  const [kind, setKind] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetScanId, setSheetScanId] = useState(null);
  const [passUnlocked, setPassUnlocked] = useState(() => hasPassSouverain());

  const lessonsReadable = passUnlocked || EXPERIENCE_FLAGS.livingCardsLessonsOpen;

  const [title, setTitle] = useState("");
  const [poem, setPoem] = useState("");
  const [body, setBody] = useState("");
  const [loadError, setLoadError] = useState(null);

  const fichesMode = searchParams.get("section") === SECTION_FICHES;
  const atlasSectionKey = searchParams.get("section");

  useEffect(() => {
    setUnlocked(isGrosCalinUnlocked());
  }, []);

  useEffect(() => {
    const sync = () => setPassUnlocked(hasPassSouverain());
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    sync();
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (atlasSectionKey !== SECTION_FICHES) return;
    requestAnimationFrame(() => {
      document.getElementById("atlas-living-cards-paywall")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [atlasSectionKey]);

  useEffect(() => {
    const h = window.location.hash.replace(/^#/, "");
    if (h === SECTION_FICHES) {
      setSearchParams({ section: SECTION_FICHES }, { replace: true });
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }, [setSearchParams]);

  const setSection = (mode) => {
    if (mode === SECTION_FICHES) {
      setSearchParams({ section: SECTION_FICHES }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const load = async () => {
    setLoadError(null);
    try {
      const rows = await listCards({ kind: kind === "all" ? "all" : kind, limit: 200 });
      setCards(Array.isArray(rows) ? rows : []);
    } catch (e) {
      console.error("[Atlas] listCards", e);
      setLoadError("Impossible de charger les fiches locales (stockage ou quota). Réessaie après avoir vidé un peu le cache Egor69.");
      setCards([]);
    }
  };

  useEffect(() => {
    if (!fichesMode) load();
  }, [kind, fichesMode]);

  const { data: preview, isError: previewError } = useQuery({
    queryKey: ["atlas-fiches-vivantes-preview"],
    queryFn: async () => {
      const r = await fetch(sovereignApiAbsolute("/api/atlas/fiches-vivantes-preview?limit=48"), {
        credentials: "omit",
      });
      if (!r.ok) throw new Error("preview");
      return r.json();
    },
    enabled: fichesMode && unlocked,
    staleTime: 20_000,
    retry: 1,
    throwOnError: false,
  });

  const { data: sheetDetail, isFetching: sheetLoading } = useQuery({
    queryKey: ["atlas-fiche-vivante", sheetScanId],
    queryFn: async () => {
      const r = await fetch(
        sovereignApiAbsolute(`/api/atlas/fiche-vivante/${encodeURIComponent(sheetScanId)}`),
        { credentials: "omit" },
      );
      if (!r.ok) throw new Error("sheet");
      return r.json();
    },
    enabled: sheetOpen && !!sheetScanId && unlocked,
    retry: 1,
    throwOnError: false,
  });

  const grouped = useMemo(() => {
    const map = new Map();
    for (const c of cards) {
      const k = c.kind || "unknown";
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(c);
    }
    return Array.from(map.entries());
  }, [cards]);

  if (!unlocked) {
    return <GrosCalinGate onUnlocked={() => setUnlocked(true)} />;
  }

  const submit = async () => {
    if (!title.trim()) return;
    await upsertUserLore({
      title: title.trim(),
      poem,
      body,
      tags: ["conte", "communauté"],
      heals: ["solitude", "silence"],
      author: "Humain Egor69",
    });
    setTitle("");
    setPoem("");
    setBody("");
    await load();
  };

  const previewItems = preview?.items ?? [];

  return (
    <div className="pb-20 space-y-12 max-w-6xl mx-auto px-4 lg:px-8">
      {loadError ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}
      <div className="pt-10 space-y-4">
        <Badge className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0 font-bold px-4 py-1">
          ATLAS VIVANT — FICHES UNIVERSELLES
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">
          Encyclopédie des croyances et du vivant
        </h1>
        <p className="text-muted-foreground text-lg">
          Des fiches immersives (texte + sensation) pour Arts, Savoirs, Faune, Flore, Quêtes… et les visions humaines.
        </p>

        <div className="flex flex-wrap gap-2 items-center">
          <Button
            size="sm"
            variant={!fichesMode ? "default" : "outline"}
            onClick={() => setSection("universelles")}
          >
            <BookOpen className="h-4 w-4 mr-1" /> Fiches universelles
          </Button>
          <Button
            size="sm"
            variant={fichesMode ? "default" : "outline"}
            onClick={() => setSection(SECTION_FICHES)}
            className="gap-1"
          >
            <Radar className="h-4 w-4" /> Fiches vivantes (radar)
          </Button>
        </div>

        {!fichesMode ? (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={kind === "all" ? "default" : "outline"} onClick={() => setKind("all")}>
              Tous
            </Button>
            {Object.values(CARD_KINDS).map((k) => (
              <Button key={k} size="sm" variant={kind === k ? "default" : "outline"} onClick={() => setKind(k)}>
                {KIND_META[k]?.label || k}
              </Button>
            ))}
            <Button asChild size="sm" variant="outline">
              <Link to="/genome">ADN</Link>
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground max-w-2xl">
            Fiches générées à partir des scans radar (batch souverain). URL directe :{" "}
            <span className="font-mono text-xs">/atlas?section=fiches-vivantes</span> ou{" "}
            <span className="font-mono text-xs">#fiches-vivantes</span>.
          </p>
        )}
      </div>

      {fichesMode ? (
        <>
          <section
            id="atlas-living-cards-paywall"
            className="space-y-6 scroll-mt-24"
            aria-labelledby="living-cards-heading"
          >
            <div className="space-y-2">
              <Badge variant="secondary" className="font-mono text-[10px]">
                Fiches Vivantes — aperçu
              </Badge>
              <h2 id="living-cards-heading" className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Stratégie souveraine
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Cinq fiches signalétiques : accroche et sensation toujours visibles.
                {lessonsReadable ? (
                  <>
                    {" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Leçons activées</span> sur cette
                    instance (expérience / Pass).
                  </>
                ) : (
                  <>
                    {" "}
                    La leçon reste réservée au <span className="text-foreground/90">Pass Souverain</span> jusqu’à
                    déblocage sur cet appareil.
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {LIVING_CARDS.map((card) => (
                <article
                  key={card.id}
                  className={cn(
                    "group relative flex flex-col rounded-3xl border overflow-hidden",
                    "bg-gradient-to-br from-card/80 via-card/50 to-background/90",
                    "border-amber-500/15 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.45)]",
                    "backdrop-blur-xl supports-[backdrop-filter]:bg-card/40",
                  )}
                >
                  <div className="p-5 sm:p-6 space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] border-amber-500/35 text-amber-200/95 bg-amber-500/10"
                      >
                        {card.tierLabel}
                      </Badge>
                      <span className="text-[11px] font-mono text-muted-foreground">{card.numero}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground leading-snug">{card.title}</h3>
                    <p className="text-sm text-foreground/95 leading-relaxed">{card.hook}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground/80">Sensation · </span>
                      {card.sensation}
                    </p>
                  </div>

                  <div className="relative border-t border-white/10 min-h-[132px] flex flex-col">
                    <div className="p-5 sm:p-6 pt-4 flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                        Leçon
                      </p>
                      <p
                        className={cn(
                          "text-sm leading-relaxed text-foreground/90",
                          !lessonsReadable && "blur-[6px] opacity-[0.42] select-none",
                        )}
                        aria-hidden={!lessonsReadable}
                      >
                        {card.lesson}
                      </p>
                      {!lessonsReadable ? (
                        <p className="sr-only">
                          Leçon masquée. Débloquez avec le Pass Souverain pour lire le contenu complet.
                        </p>
                      ) : null}
                    </div>

                    {!lessonsReadable ? (
                      <div
                        className={cn(
                          "absolute inset-0 flex flex-col items-center justify-center gap-3 px-4",
                          "bg-background/55 backdrop-blur-md",
                        )}
                      >
                        <Lock
                          className="h-9 w-9 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]"
                          aria-hidden
                        />
                        <Button
                          asChild
                          size="sm"
                          className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold shadow-lg shadow-amber-900/30 border border-amber-400/40"
                        >
                          <Link to={`/pricing#${PASS_SOUVERAIN_ANCHOR_ID}`}>
                            Débloquer ce Secret avec le Pass Souverain
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="px-5 pb-4 -mt-2">
                        <Badge className="bg-emerald-600/90 text-white border-0 text-[10px]">
                          {passUnlocked ? "Pass actif — leçon visible" : "Fiches vivantes activées — leçon visible"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-semibold text-foreground text-lg flex items-center gap-2">
              <Radar className="h-5 w-5 text-primary" /> Fiches vivantes
            </h2>
            {typeof preview?.count === "number" ? (
              <Badge variant="secondary">{preview.count} fiche(s) indexée(s)</Badge>
            ) : null}
          </div>
          {previewError ? (
            <p className="text-sm text-destructive">
              Aperçu indisponible — vérifie que l’API souveraine tourne ou lance une conversion batch.
            </p>
          ) : previewItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-muted/30 p-8 text-center text-muted-foreground text-sm">
              Aucune fiche vivante en stock local. En dev, exécute{" "}
              <code className="text-xs bg-muted px-1 rounded">POST /api/atlas/convert-scans-to-live-sheets</code> sur
              le serveur Egor69 pour matérialiser les fiches à partir des scans synthétiques.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {previewItems.map((item) => (
                <button
                  key={item.id || item.scan_id}
                  type="button"
                  onClick={() => {
                    setSheetScanId(item.scan_id);
                    setSheetOpen(true);
                  }}
                  className="text-left rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-violet-600" />
                  <div className="p-5 space-y-2">
                    <p className="text-xs text-muted-foreground font-mono">scan · {item.scan_id}</p>
                    <p className="font-semibold text-foreground">{item.titre}</p>
                    {item.formule_math_titre ? (
                      <Badge variant="outline" className="text-[10px]">
                        {item.formule_math_titre}
                      </Badge>
                    ) : null}
                    {item.excerpt ? (
                      <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
        </>
      ) : (
        <>
          <section className="rounded-3xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="font-semibold text-foreground text-lg">Matrice de partage</h2>
                <p className="text-sm text-muted-foreground">
                  Téléverse ta vision: une croyance, une quête, une leçon animale, une idée qui soigne.
                </p>
              </div>
              <Button className="gap-2" onClick={submit}>
                <Plus className="h-4 w-4" /> Publier
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre (ex: 'La Bonté Divine du quotidien')"
              />
              <Input
                value={poem}
                onChange={(e) => setPoem(e.target.value)}
                placeholder="Texte poétique (optionnel)"
              />
              <Input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Description / récit (optionnel)"
              />
            </div>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Raconte (plus long)…" />
          </section>

          <section className="space-y-6">
            {grouped.map(([k, items]) => {
              const meta = KIND_META[k] || { label: k, icon: Sparkles, gradient: "from-slate-500 to-slate-700" };
              const Icon = meta.icon;
              return (
                <div key={k} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${meta.gradient}`} />
                    <h3 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" /> {meta.label}
                    </h3>
                    <Badge variant="secondary">{items.length}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((c) => (
                      <Link
                        key={c.id}
                        to={`/card/${encodeURIComponent(c.kind)}/${encodeURIComponent(c.id)}`}
                        className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        <div className={`h-2 bg-gradient-to-r ${meta.gradient}`} />
                        <div className="p-5 space-y-2">
                          <p className="text-xs text-muted-foreground font-mono">
                            {c.author} · {c.source}
                          </p>
                          <p className="font-semibold text-foreground">{c.title}</p>
                          {c.summary ? (
                            <p className="text-sm text-muted-foreground line-clamp-2">{c.summary}</p>
                          ) : null}
                          <div className="flex flex-wrap gap-1 pt-2">
                            {(c.tags || []).slice(0, 4).map((t) => (
                              <Badge key={t} variant="outline" className="text-[10px]">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}

      <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{sheetDetail?.titre || "Fiche vivante"}</DialogTitle>
            <DialogDescription>
              {sheetDetail?.scan_id ? `Scan radar · ${sheetDetail.scan_id}` : "Chargement…"}
            </DialogDescription>
          </DialogHeader>
          {sheetLoading && !sheetDetail ? (
            <p className="text-sm text-muted-foreground">Chargement de la fiche…</p>
          ) : sheetDetail ? (
            <div className="space-y-3 text-sm">
              {sheetDetail.formule_math_titre ? (
                <Badge variant="secondary">
                  {sheetDetail.formule_math_titre} ({sheetDetail.formule_math_symbole})
                </Badge>
              ) : null}
              <div>
                <p className="font-medium text-foreground mb-1">Sensation</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{sheetDetail.sensation}</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Leçon</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{sheetDetail.lecon}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-destructive">Fiche introuvable.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
