import { useEffect, useMemo, useState } from "react";
import SEOMeta from "@/components/SEOMeta";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SITE_ORIGIN } from "@/lib/site";
import { UNREAL_BRIDGE_DOC_RELATIVE, UNREAL_CHARTER_BODY_FR } from "@/lib/unrealBridge";
import {
  loadUniversePreferences,
  saveUniversePreferences,
  getMusicMoodMeta,
  getHudMeta,
} from "@/lib/universePreferences";
import {
  THEME_PRESETS,
  MUSIC_MOODS,
  HUD_PRESETS,
  UNIVERSE_PROPS,
  ARCHETYPE_COSTUMES,
} from "@/data/universeCatalog";
import {
  getXpBalance,
  spendXp,
  estimateFiatEquivalent,
  getFiathintMultiplier,
  readLedger,
  awardXp,
} from "@/lib/peltXpEconomy";
import { Sparkles, Palette, Music, LayoutGrid, Package, Coins, ScrollText, Radar, Settings2 } from "lucide-react";
import WorldEthosCharter from "@/components/WorldEthosCharter";
import { Link } from "react-router-dom";
import { WORLD_REALMS } from "@/world/realms";

export default function MyUniverse() {
  const [prefs, setPrefs] = useState(loadUniversePreferences);
  const [xp, setXp] = useState(getXpBalance);
  const [fiatRateInput, setFiatRateInput] = useState("50");
  const ledger = useMemo(() => readLedger().slice(0, 12), [xp]);

  useEffect(() => {
    const onXp = () => setXp(getXpBalance());
    window.addEventListener("igor-xp-change", onXp);
    return () => window.removeEventListener("igor-xp-change", onXp);
  }, []);

  const persist = (patch) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    saveUniversePreferences(next);
  };

  const xpPerFiat = Number(fiatRateInput.replace(",", "."));
  const fiatEstimate = estimateFiatEquivalent(xp, Number.isFinite(xpPerFiat) ? xpPerFiat : NaN);

  const buyProp = (prop) => {
    const unlocked = new Set(prefs.unlockedPropIds || []);
    if (unlocked.has(prop.id)) return;
    const res = spendXp(prop.costXp, `unlock_prop:${prop.id}`);
    if (!res.ok) return;
    unlocked.add(prop.id);
    persist({ unlockedPropIds: [...unlocked] });
    setXp(res.balance);
  };

  const toggleEquipProp = (id) => {
    const eq = new Set(prefs.equippedPropIds || []);
    if (eq.has(id)) eq.delete(id);
    else eq.add(id);
    persist({ equippedPropIds: [...eq] });
  };

  const equipCostume = (id) => {
    persist({ equippedCostumeId: prefs.equippedCostumeId === id ? null : id });
  };

  const updateGameplayUniverse = (patch) => {
    persist({ gameplayUniverse: { ...prefs.gameplayUniverse, ...patch } });
  };

  const toggleFocusRealmSlug = (slug) => {
    const current = new Set(prefs.gameplayUniverse?.focusRealmSlugs || []);
    if (current.has(slug)) current.delete(slug);
    else current.add(slug);
    updateGameplayUniverse({ focusRealmSlugs: [...current] });
  };

  const UI_SCALE_OPTIONS = [
    { id: "sm", label: "Compact", hint: "Texte 14 px — densité maximale, lecture rapide." },
    { id: "md", label: "Standard", hint: "Texte 16 px — équilibre de référence." },
    { id: "lg", label: "Confort", hint: "Texte 18 px — accessibilité, lecture longue." },
  ];

  const NAV_MODE_OPTIONS = [
    { id: "full", label: "Complet", hint: "Toutes les entrées de navigation visibles." },
    { id: "core", label: "Essentiel", hint: "≈18 routes principales, sidebar épurée." },
    { id: "minimal", label: "Minimal", hint: "Cinq portes : Accueil, Verse, Marketplace, Mon univers, Profil." },
  ];

  const PLAYSTYLE_OPTIONS = [
    { id: "explorer", label: "Explorateur" },
    { id: "builder", label: "Bâtisseur" },
    { id: "scribe", label: "Scribe" },
    { id: "guardian", label: "Gardien" },
    { id: "mystic", label: "Mystique" },
    { id: "trader", label: "Marchand" },
  ];

  const buyCostume = (c) => {
    const unlocked = new Set(prefs.unlockedPropIds || []);
    const key = `costume:${c.id}`;
    if (unlocked.has(key)) return;
    const res = spendXp(c.costXp, `unlock_costume:${c.id}`);
    if (!res.ok) return;
    unlocked.add(key);
    persist({ unlockedPropIds: [...unlocked] });
    setXp(res.balance);
  };

  const grantDemoXp = () => {
    awardXp(150, "demo:atelier_univers");
    setXp(getXpBalance());
  };

  return (
    <div className="pb-24 max-w-5xl mx-auto px-4 lg:px-8 pt-8 space-y-8">
      <SEOMeta
        title="Mon univers — personnalisation Egor69"
        description="Thèmes, densité d’affichage, ambiances sonores, coffre de props et costumes archetypaux ; progression XP locale avec estimation pédagogique — sans crypto ni promesse financière."
        keywords="personnalisation, thème, UX, XP, progression, Egor69"
        canonicalUrl={`${SITE_ORIGIN}/mon-univers`}
      />

      <div className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-background to-violet-500/10 p-8 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="mb-2 bg-emerald-600/90 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" /> Atelier d’univers
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground tracking-tight">Mon univers</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Tu démarres avec ta demeure numérique (ce navigateur) et ton lieu de travail (les flux marketplace / Verse). Les props et thèmes se débloquent avec des{" "}
              <strong>points XP locaux</strong> — prototype de progression alignée quêtes réelles (annonces, réparation, exploration 3D).
              Aucune blockchain ici : une future monnaie interne devra être encadrée juridiquement avant production.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 px-5 py-4 min-w-[200px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Solde XP</p>
            <p className="text-4xl font-black text-emerald-500">{xp}</p>
            <Button variant="outline" size="sm" className="mt-3 w-full rounded-xl text-xs" onClick={grantDemoXp}>
              +150 XP démo atelier
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary" className="rounded-xl">
            <Link to="/world">
              <Radar className="h-4 w-4 mr-2" /> Verse 3D
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/marketplace">Marketplace</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/profil">Profil & impact</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="themes" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="themes" className="rounded-lg gap-1.5">
            <Palette className="h-4 w-4" /> Thèmes
          </TabsTrigger>
          <TabsTrigger value="audio" className="rounded-lg gap-1.5">
            <Music className="h-4 w-4" /> Audio
          </TabsTrigger>
          <TabsTrigger value="hud" className="rounded-lg gap-1.5">
            <LayoutGrid className="h-4 w-4" /> Affichage
          </TabsTrigger>
          <TabsTrigger value="interface" className="rounded-lg gap-1.5">
            <Settings2 className="h-4 w-4" /> Interface & gameplay
          </TabsTrigger>
          <TabsTrigger value="chest" className="rounded-lg gap-1.5">
            <Package className="h-4 w-4" /> Coffre
          </TabsTrigger>
          <TabsTrigger value="economy" className="rounded-lg gap-1.5">
            <Coins className="h-4 w-4" /> XP & équivalence
          </TabsTrigger>
          <TabsTrigger value="charter" className="rounded-lg gap-1.5">
            <ScrollText className="h-4 w-4" /> Souveraineté
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Six palettes prêtes — la variable <code className="text-xs bg-muted px-1 rounded">--igor-accent</code> pilote halo, boutons et sélection.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {THEME_PRESETS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => persist({ themeId: t.id, density: t.density || prefs.density })}
                className={`text-left rounded-2xl border p-4 transition hover:border-primary/40 ${
                  prefs.themeId === t.id ? "border-emerald-500 bg-emerald-500/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-10 w-10 rounded-full ring-2 ring-white/20" style={{ background: t.accent }} />
                  <div>
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.mood}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Presets d’ambiance : branchement futur vers fichiers audio hébergés ; pour l’instant c’est une préférence UX et un contrat produit.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {MUSIC_MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => persist({ musicMoodId: m.id })}
                className={`text-left rounded-2xl border p-4 transition ${
                  prefs.musicMoodId === m.id ? "border-sky-500 bg-sky-500/5" : "border-border bg-card"
                }`}
              >
                <p className="font-bold">{m.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.hint}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic">Sélection actuelle : {getMusicMoodMeta(prefs.musicMoodId).name}</p>
        </TabsContent>

        <TabsContent value="hud" className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-3">
            {HUD_PRESETS.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => persist({ hudId: h.id })}
                className={`rounded-2xl border p-4 text-left ${
                  prefs.hudId === h.id ? "border-violet-500 bg-violet-500/5" : "border-border bg-card"
                }`}
              >
                <p className="font-bold">{h.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{h.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-4">
            <label className="flex items-center gap-3 text-sm">
              <Switch checked={prefs.reducedParticles} onCheckedChange={(v) => persist({ reducedParticles: v })} />
              Particules réduites (accessibilité / perf)
            </label>
            <label className="flex items-center gap-3 text-sm">
              <Switch checked={prefs.showConcierge} onCheckedChange={(v) => persist({ showConcierge: v })} />
              Bulle concierge
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Intensité ambiance</span>
              <Input
                type="number"
                step={0.05}
                min={0.2}
                max={1.4}
                className="w-24 h-9"
                value={prefs.ambientIntensity}
                onChange={(e) => persist({ ambientIntensity: Number(e.target.value) })}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">HUD actif : {getHudMeta(prefs.hudId).name}</p>
        </TabsContent>

        <TabsContent value="interface" className="space-y-8">
          <div className="space-y-3">
            <h3 className="font-bold text-foreground">Échelle d’interface</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pilote la taille de base du texte sur <code className="text-[10px] bg-muted px-1 rounded">html</code> via{" "}
              <code className="text-[10px] bg-muted px-1 rounded">data-igor-ui-scale</code>. L’ensemble du design system suit en
              <em> rem</em>.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {UI_SCALE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => persist({ uiScale: opt.id })}
                  className={`text-left rounded-2xl border p-4 transition ${
                    prefs.uiScale === opt.id ? "border-emerald-500 bg-emerald-500/5" : "border-border bg-card"
                  }`}
                >
                  <p className="font-bold">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{opt.hint}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-foreground">Densité de navigation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Règle la barre latérale, le menu mobile et le bandeau bas. Le mode minimal force cinq portes essentielles ;
              ce que tu masques reste accessible par URL directe.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {NAV_MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => persist({ navMode: opt.id })}
                  className={`text-left rounded-2xl border p-4 transition ${
                    prefs.navMode === opt.id ? "border-sky-500 bg-sky-500/5" : "border-border bg-card"
                  }`}
                >
                  <p className="font-bold">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{opt.hint}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-foreground">Profil d’univers (gameplay)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Tu façonnes le récit personnel qui s’affiche dans le Verse 3D et alimente les rituels narratifs. Aucun champ
                n’est partagé : tout reste dans <code className="text-[10px] bg-muted px-1 rounded">localStorage</code>.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Nom d’univers</span>
                <Input
                  placeholder="ex. Sanctuaire d’Iridia"
                  value={prefs.gameplayUniverse?.name || ""}
                  onChange={(e) => updateGameplayUniverse({ name: e.target.value })}
                  maxLength={64}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Tagline</span>
                <Input
                  placeholder="ex. Réparer ce qui mérite encore lumière."
                  value={prefs.gameplayUniverse?.tagline || ""}
                  onChange={(e) => updateGameplayUniverse({ tagline: e.target.value })}
                  maxLength={120}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Style de jeu</span>
                <select
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={prefs.gameplayUniverse?.playstyle || "explorer"}
                  onChange={(e) => updateGameplayUniverse({ playstyle: e.target.value })}
                >
                  {PLAYSTYLE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Étiquette de personnalité</span>
                <Input
                  placeholder="ex. lucide, tendre, méthodique"
                  value={prefs.gameplayUniverse?.personalityTag || ""}
                  onChange={(e) => updateGameplayUniverse({ personalityTag: e.target.value })}
                  maxLength={48}
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Notes d’univers (intentions, rituels, exclusions)</span>
              <Textarea
                rows={4}
                placeholder="Ce que cet univers protège, ce qu’il refuse, ce qu’il offre — librement."
                value={prefs.gameplayUniverse?.notes || ""}
                onChange={(e) => updateGameplayUniverse({ notes: e.target.value })}
                maxLength={1200}
              />
            </label>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Salles privilégiées du Verse — cochées en priorité par les portails narratifs.
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {WORLD_REALMS.map((realm) => {
                  const checked = (prefs.gameplayUniverse?.focusRealmSlugs || []).includes(realm.slug);
                  return (
                    <label
                      key={realm.slug}
                      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                        checked ? "border-emerald-500/50 bg-emerald-500/5" : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleFocusRealmSlug(realm.slug)}
                        className="mt-0.5"
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-foreground">{realm.label}</span>
                        <span className="block text-xs text-muted-foreground leading-relaxed mt-0.5">
                          {realm.shortHook}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chest" className="space-y-6">
          <div>
            <h3 className="font-bold mb-2">Outils symboliques</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {UNIVERSE_PROPS.map((p) => {
                const has = (prefs.unlockedPropIds || []).includes(p.id);
                const eq = (prefs.equippedPropIds || []).includes(p.id);
                return (
                  <div key={p.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2">
                    <div className="flex justify-between gap-2">
                      <p className="font-bold">{p.name}</p>
                      <Badge variant="outline">{p.costXp} XP</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.blurb}</p>
                    <div className="flex gap-2 mt-auto pt-2">
                      {!has ? (
                        <Button size="sm" className="rounded-xl" onClick={() => buyProp(p)}>
                          Débloquer
                        </Button>
                      ) : (
                        <>
                          <Badge className="bg-emerald-600">Obtenu</Badge>
                          <Button size="sm" variant={eq ? "default" : "outline"} className="rounded-xl" onClick={() => toggleEquipProp(p.id)}>
                            {eq ? "Équipé" : "Équiper"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">Costumes archetypaux (génériques)</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Inspirations héroïques sans licences externes — personnalise librement dans ton storytelling.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {ARCHETYPE_COSTUMES.map((c) => {
                const key = `costume:${c.id}`;
                const has = (prefs.unlockedPropIds || []).includes(key);
                const on = prefs.equippedCostumeId === c.id;
                return (
                  <div key={c.id} className="rounded-2xl border border-border bg-card p-4 space-y-2">
                    <div className="flex justify-between">
                      <p className="font-bold">{c.name}</p>
                      <Badge variant="outline">{c.costXp} XP</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.blurb}</p>
                    <div className="flex gap-2">
                      {!has ? (
                        <Button size="sm" className="rounded-xl" onClick={() => buyCostume(c)}>
                          Débloquer
                        </Button>
                      ) : (
                        <>
                          <Badge className="bg-violet-600">Obtenu</Badge>
                          <Button size="sm" variant={on ? "default" : "outline"} className="rounded-xl" onClick={() => equipCostume(c.id)}>
                            {on ? "Porté" : "Porter"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Passages secrets :</strong> tape lentement le mot{" "}
            <kbd className="px-1 bg-muted rounded">coeur</kbd>, <kbd className="px-1 bg-muted rounded">archive</kbd>,{" "}
            <kbd className="px-1 bg-muted rounded">grille</kbd> ou <kbd className="px-1 bg-muted rounded">singularite</kbd> hors champ texte — thèmes / props / lore souverain fictif + XP.
          </div>
        </TabsContent>

        <TabsContent value="economy" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Le coefficient <strong>{getFiathintMultiplier()}×</strong> multiplie une équivalence fiat que **tu** définis en entrée : nombre de XP pour{" "}
              <strong>1 unité</strong> de ta devise (ex. 50 XP = 1 € ⇒ estimation illustrative ci-dessous). Ça n’est pas un cours de marché ni une obligation légale.
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">XP pour 1 unité monétaire locale</label>
                <Input className="mt-1 w-40 h-10" value={fiatRateInput} onChange={(e) => setFiatRateInput(e.target.value)} />
              </div>
              <div className="rounded-xl bg-muted/50 px-4 py-3 border border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estimation illustrative</p>
                <p className="text-2xl font-black text-foreground">
                  {fiatEstimate != null && Number.isFinite(fiatEstimate) ? fiatEstimate.toFixed(2) : "—"} <span className="text-sm font-normal">u.</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-bold mb-2">Journal récent</p>
            <ul className="space-y-2 text-xs font-mono text-muted-foreground">
              {ledger.length === 0 ? <li>Aucun mouvement encore.</li> : null}
              {ledger.map((row, i) => (
                <li key={i} className="border border-border rounded-lg px-3 py-2 bg-card">
                  {new Date(row.t).toLocaleString()} · {row.kind} · {row.amount != null ? `${row.amount} ` : ""}
                  {row.reason || ""}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="charter" className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <WorldEthosCharter variant="compact" />
          <p>
            <strong className="text-foreground">Données personnelles :</strong> dans cette version, préférences + XP vivent dans ton navigateur (localStorage). Export / suppression / chiffrement fort sont les prochaines étapes pour une forteresse digne de ce nom — avec DPIA et base légale claire.
          </p>
          <p>
            <strong className="text-foreground">Synchronisation « physique » :</strong> les quêtes réelles (ex. publication annonce, réparation validée) devront pousser des événements serveur → XP consolidé ; le gameplay WebGL reste une couche d’accès, pas la source de vérité monétaire.
          </p>
          <p>
            <strong className="text-foreground">Unreal Engine :</strong> {UNREAL_CHARTER_BODY_FR}{" "}
            <span className="text-muted-foreground">
              Réf. <code className="text-xs bg-muted px-1 rounded">{UNREAL_BRIDGE_DOC_RELATIVE}</code>
            </span>
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
