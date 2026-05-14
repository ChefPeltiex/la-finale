import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, X, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VERSE_GRIMOIRE_CARDS, MANA_COLORS, RARITY_STYLES } from "@/data/verseGrimoire";
import { MYTH_GRIMOIRE_CARDS } from "@/data/mythGrimoireCards";
import { WELLNESS_GRIMOIRE_CARDS } from "@/data/wellnessGrimoireCards";
import { DIVINATION_GRIMOIRE_CARDS } from "@/data/divinationGrimoireCards";
import { WORLD_REALMS } from "@/world/realms";

const ALL_GRIMOIRE_CARDS = [
  ...VERSE_GRIMOIRE_CARDS,
  ...MYTH_GRIMOIRE_CARDS,
  ...WELLNESS_GRIMOIRE_CARDS,
  ...DIVINATION_GRIMOIRE_CARDS,
];

function ManaPips({ cost }) {
  return (
    <div className="flex flex-wrap gap-0.5 justify-end">
      {cost.map((c, i) => (
        <span
          key={`${c}-${i}`}
          className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-black/40 text-[7px] font-black ${MANA_COLORS[c] || MANA_COLORS.C}`}
          title={c}
        >
          {c === "C" ? "◇" : ""}
        </span>
      ))}
    </div>
  );
}

function GrimoireCard({ card, realm, active }) {
  const artTint = realm?.color || "#334155";

  return (
    <div
      className={`relative flex flex-col rounded-lg border-2 bg-gradient-to-b from-[#1c1410] via-[#2a1f18] to-[#1a1512] text-left shadow-2xl transition-transform duration-200 ${
        RARITY_STYLES[card.rarity] || RARITY_STYLES.common
      } ${active ? "scale-[1.02] ring-2 ring-emerald-400/80" : "hover:scale-[1.01]"}`}
    >
      {/* Filigree top */}
      <div className="pointer-events-none absolute inset-x-1 top-1 h-1 rounded-full bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />

      <div className="flex items-start justify-between gap-2 border-b border-amber-900/50 bg-black/60 px-2 py-1.5">
        <h3 className="font-serif text-[11px] font-black uppercase leading-tight tracking-wide text-amber-100 drop-shadow-[0_1px_0_rgba(0,0,0,0.9)]">
          {card.name}
        </h3>
        <ManaPips cost={card.cost} />
      </div>

      {/* Art box — couleur du portail */}
      <div
        className="relative mx-1.5 mt-1.5 h-20 overflow-hidden rounded border border-amber-900/40"
        style={{
          background: `linear-gradient(145deg, ${artTint}55 0%, #0f0a08 48%, ${artTint}33 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
        <Sparkles className="absolute bottom-1 right-1 h-5 w-5 text-amber-200/30" />
      </div>

      <div className="mx-1.5 mt-1 rounded border border-amber-800/35 bg-black/55 px-2 py-0.5">
        <p className="font-serif text-[9px] font-semibold italic text-amber-200/90">{card.typeLine}</p>
      </div>

      <div className="mx-1.5 mt-1 flex-1 rounded-sm border border-amber-950/60 bg-[#ebe4d6] px-2 py-1.5 text-[9px] leading-snug text-zinc-900 shadow-inner">
        <p className="font-semibold">{card.rulesText}</p>
        <p className="mt-1.5 font-serif italic text-zinc-700">{card.flavorText}</p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-amber-900/40 bg-black/50 px-2 py-1">
        <span className="text-[8px] font-bold uppercase tracking-widest text-amber-500/80">{card.rarity}</span>
        <span className="rounded border border-black/50 bg-[#ebe4d6] px-1.5 py-0.5 font-mono text-[10px] font-black text-zinc-900">
          ◈ {realm ? "Verse" : "—"}
        </span>
      </div>
    </div>
  );
}

/**
 * Codex du Verse — grimoire en cartes (style TGC) liées aux portails du monde 3D.
 */
export default function VerseGrimoire({ open, onOpenChange, highlightSlug = null }) {
  const [focusId, setFocusId] = useState(null);

  const realmBySlug = useMemo(() => {
    const m = new Map();
    for (const r of WORLD_REALMS) m.set(r.slug, r);
    return m;
  }, []);

  const cards = useMemo(
    () =>
      ALL_GRIMOIRE_CARDS.map((c) => ({
        card: c,
        realm: realmBySlug.get(c.realmSlug) || null,
      })),
    [realmBySlug],
  );

  const focused = cards.find((x) => x.card.id === focusId) || null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[min(100vw-1.5rem,56rem)] overflow-y-auto border-amber-800/40 bg-gradient-to-b from-[#120d0a] via-[#1a1410] to-[#0c0908] p-0 text-amber-50 shadow-[0_0_60px_rgba(0,0,0,0.85)]">
        <div className="sticky top-0 z-10 border-b border-amber-900/40 bg-black/70 px-4 py-3 backdrop-blur-md">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="flex items-center gap-2 font-serif text-xl tracking-tight text-amber-100">
              <BookOpen className="h-5 w-5 text-amber-400" />
              Codex du Verse
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-amber-200/70">
              Grimoire d’exploration : une carte par portail du monde 3D — anneaux bien-être et divinatoire inclus (sortilèges et potions{" "}
              <span className="text-amber-100/90">narratifs seulement</span>, voir les lexiques). Esthétique inspirée des{" "}
              <span className="text-amber-100/90">jeux de cartes à collectionner</span> — contenu pédagogique et engagements Egor69 ; sans affiliation à une
              marque déposée.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ card, realm }) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setFocusId((id) => (id === card.id ? null : card.id))}
              className="text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 rounded-lg"
            >
              <GrimoireCard card={card} realm={realm} active={highlightSlug === card.realmSlug || focusId === card.id} />
            </button>
          ))}
        </div>

        {focused?.realm ? (
          <div className="border-t border-amber-900/40 bg-black/50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/90">Portail lié</p>
            <p className="mt-1 text-sm font-semibold text-white">{focused.realm.label}</p>
            <p className="mt-2 text-xs text-white/65 leading-snug line-clamp-3">{focused.realm.shortHook}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-600 text-white border-0">
                <Link to={focused.realm.path} onClick={() => onOpenChange(false)}>
                  Ouvrir la salle
                </Link>
              </Button>
              <Button type="button" variant="outline" size="sm" className="border-amber-700/50 text-amber-100" onClick={() => setFocusId(null)}>
                Fermer le détail
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end border-t border-amber-900/30 px-4 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-amber-200/80 hover:text-amber-50 hover:bg-white/5 gap-1"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            Refermer le codex
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
